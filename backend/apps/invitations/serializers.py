from django.utils import timezone
from rest_framework import serializers

from apps.events.models import EventMembership
from apps.guests.models import Guest
from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    guest_name = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = [
            "id",
            "event",
            "guest",
            "guest_name",
            "token",
            "status",
            "message",
            "sent_at",
            "responded_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "guest_name",
            "token",
            "responded_at",
            "created_at",
            "updated_at",
        ]

    def get_guest_name(self, obj):
        return str(obj.guest)

    def validate_event(self, event):
        request = self.context["request"]

        if not EventMembership.objects.filter(
            event=event,
            user=request.user,
        ).exists():
            raise serializers.ValidationError(
                "You are not a member of this event."
            )

        return event

    def validate(self, attrs):
        event = attrs.get(
            "event",
            getattr(self.instance, "event", None),
        )

        guest = attrs.get(
            "guest",
            getattr(self.instance, "guest", None),
        )

        if event and guest and guest.event_id != event.id:
            raise serializers.ValidationError(
                {
                    "guest": (
                        "This guest does not belong to "
                        "the selected event."
                    )
                }
            )

        return attrs

    def update(self, instance, validated_data):
        previous_status = instance.status

        instance = super().update(
            instance,
            validated_data,
        )

        if (
            previous_status != Invitation.Status.SENT
            and instance.status == Invitation.Status.SENT
            and instance.sent_at is None
        ):
            instance.sent_at = timezone.now()
            instance.save(
                update_fields=[
                    "sent_at",
                    "updated_at",
                ]
            )

        return instance


class PublicInvitationSerializer(
    serializers.ModelSerializer
):
    event_name = serializers.CharField(
        source="event.name",
        read_only=True,
    )

    event_date = serializers.DateField(
        source="event.start_date",
        read_only=True,
    )

    event_location = serializers.CharField(
        source="event.location",
        read_only=True,
    )

    guest_name = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = [
            "event_name",
            "event_date",
            "event_location",
            "guest_name",
            "message",
            "status",
        ]

    def get_guest_name(self, obj):
        return str(obj.guest)


class RSVPResponseSerializer(serializers.Serializer):
    rsvp_status = serializers.ChoiceField(
        choices=[
            Guest.RSVPStatus.CONFIRMED,
            Guest.RSVPStatus.DECLINED,
        ]
    )

    plus_one_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=200,
    )

    meal_preference = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=100,
    )