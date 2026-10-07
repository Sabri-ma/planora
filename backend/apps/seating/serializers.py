from rest_framework import serializers

from apps.events.models import EventMembership
from .models import SeatAssignment, SeatingTable


class SeatAssignmentSerializer(serializers.ModelSerializer):
    guest_name = serializers.SerializerMethodField()

    class Meta:
        model = SeatAssignment
        fields = [
            "id",
            "table",
            "guest",
            "guest_name",
            "seat_number",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "guest_name",
            "created_at",
            "updated_at",
        ]

    def get_guest_name(self, obj):
        return str(obj.guest)

    def validate(self, attrs):
        table = attrs.get(
            "table",
            getattr(self.instance, "table", None),
        )

        guest = attrs.get(
            "guest",
            getattr(self.instance, "guest", None),
        )

        if table and guest:
            if guest.event_id != table.event_id:
                raise serializers.ValidationError(
                    {
                        "guest": (
                            "This guest does not belong "
                            "to the same event as the table."
                        )
                    }
                )

        return attrs


class SeatingTableSerializer(serializers.ModelSerializer):
    assignments = SeatAssignmentSerializer(
        many=True,
        read_only=True,
    )

    occupied_seats = serializers.SerializerMethodField()

    class Meta:
        model = SeatingTable
        fields = [
            "id",
            "event",
            "name",
            "capacity",
            "notes",
            "occupied_seats",
            "assignments",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "occupied_seats",
            "assignments",
            "created_at",
            "updated_at",
        ]

    def get_occupied_seats(self, obj):
        return obj.assignments.count()

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

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Capacity must be at least 1."
            )

        return value