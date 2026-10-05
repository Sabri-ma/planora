from rest_framework import serializers

from apps.events.models import EventMembership
from .models import BudgetItem


class BudgetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetItem
        fields = [
            "id",
            "event",
            "category",
            "name",
            "estimated_amount",
            "actual_amount",
            "amount_paid",
            "payment_status",
            "due_date",
            "vendor_name",
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

    def validate(self, attrs):
        estimated_amount = attrs.get(
            "estimated_amount",
            getattr(self.instance, "estimated_amount", 0),
        )

        actual_amount = attrs.get(
            "actual_amount",
            getattr(self.instance, "actual_amount", 0),
        )

        amount_paid = attrs.get(
            "amount_paid",
            getattr(self.instance, "amount_paid", 0),
        )

        if estimated_amount < 0:
            raise serializers.ValidationError(
                {
                    "estimated_amount": "Estimated amount cannot be negative."
                }
            )

        if actual_amount < 0:
            raise serializers.ValidationError(
                {
                    "actual_amount": "Actual amount cannot be negative."
                }
            )

        if amount_paid < 0:
            raise serializers.ValidationError(
                {
                    "amount_paid": "Amount paid cannot be negative."
                }
            )

        return attrs