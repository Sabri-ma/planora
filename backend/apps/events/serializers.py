from django.utils.text import slugify
from rest_framework import serializers

from .models import Event, EventMembership


class EventSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Event
        fields = [
            "id",
            "owner",
            "name",
            "slug",
            "event_type",
            "description",
            "start_date",
            "location",
            "currency",
            "budget_target",
            "guest_target",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "owner",
            "slug",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        request = self.context["request"]

        base_slug = slugify(validated_data["name"])
        slug = base_slug
        counter = 1

        while Event.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        event = Event.objects.create(
            owner=request.user,
            slug=slug,
            **validated_data,
        )

        EventMembership.objects.create(
            event=event,
            user=request.user,
            role=EventMembership.Role.OWNER,
        )

        return event