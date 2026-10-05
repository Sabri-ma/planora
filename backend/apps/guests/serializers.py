from rest_framework import serializers

from apps.events.models import EventMembership
from .models import Guest


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = [
            "id",
            "event",
            "first_name",
            "last_name",
            "email",
            "phone",
            "group",
            "side",
            "plus_one_allowed",
            "plus_one_name",
            "rsvp_status",
            "meal_preference",
            "notes",
            "table",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

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