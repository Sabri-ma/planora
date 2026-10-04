from rest_framework import serializers

from apps.events.models import EventMembership
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.username")

    class Meta:
        model = Task
        fields = [
            "id",
            "event",
            "title",
            "description",
            "category",
            "status",
            "priority",
            "due_date",
            "assigned_to",
            "created_by",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def validate_event(self, event):
        request = self.context["request"]

        is_member = EventMembership.objects.filter(
            event=event,
            user=request.user,
        ).exists()

        if not is_member:
            raise serializers.ValidationError(
                "You are not a member of this event."
            )

        return event

    def create(self, validated_data):
        request = self.context["request"]

        return Task.objects.create(
            created_by=request.user,
            **validated_data,
        )