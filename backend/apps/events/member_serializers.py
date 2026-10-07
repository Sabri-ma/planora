from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Event, EventMembership


User = get_user_model()


class EventMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.CharField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = EventMembership
        fields = [
            "id",
            "event",
            "user",
            "username",
            "email",
            "role",
            "invited_by",
            "joined_at",
        ]

        read_only_fields = [
            "id",
            "event",
            "user",
            "username",
            "email",
            "invited_by",
            "joined_at",
        ]


class AddEventMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()

    role = serializers.ChoiceField(
        choices=[
            EventMembership.Role.ADMIN,
            EventMembership.Role.EDITOR,
            EventMembership.Role.VIEWER,
        ],
        default=EventMembership.Role.VIEWER,
    )

    def validate_email(self, value):
        try:
            user = User.objects.get(
                email__iexact=value
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "No Planora user exists with this email."
            )

        self.context["target_user"] = user

        return value

    def validate(self, attrs):
        request = self.context["request"]
        event = self.context["event"]

        membership = EventMembership.objects.filter(
            event=event,
            user=request.user,
        ).first()

        if membership is None:
            raise serializers.ValidationError(
                "You are not a member of this event."
            )

        if membership.role not in [
            EventMembership.Role.OWNER,
            EventMembership.Role.ADMIN,
        ]:
            raise serializers.ValidationError(
                "You do not have permission to add members."
            )

        target_user = self.context[
            "target_user"
        ]

        if EventMembership.objects.filter(
            event=event,
            user=target_user,
        ).exists():
            raise serializers.ValidationError(
                "This user is already a member of the event."
            )

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        event = self.context["event"]
        target_user = self.context[
            "target_user"
        ]

        return EventMembership.objects.create(
            event=event,
            user=target_user,
            role=validated_data["role"],
            invited_by=request.user,
        )


class UpdateEventMemberRoleSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = EventMembership
        fields = [
            "role",
        ]

    def validate_role(self, value):
        if value == EventMembership.Role.OWNER:
            raise serializers.ValidationError(
                "Ownership cannot be assigned here."
            )

        return value