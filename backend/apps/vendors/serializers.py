from rest_framework import serializers

from apps.events.models import EventMembership
from .models import Vendor


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            "id",
            "event",
            "name",
            "category",
            "contact_name",
            "email",
            "phone",
            "website",
            "location",
            "status",
            "quoted_price",
            "notes",
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

    def validate_quoted_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Quoted price cannot be negative."
            )

        return value