from django.db import models

from apps.events.models import Event


class BudgetItem(models.Model):
    class Category(models.TextChoices):
        VENUE = "venue", "Venue"
        CATERING = "catering", "Catering"
        PHOTOGRAPHY = "photography", "Photography"
        DECORATION = "decoration", "Decoration"
        MUSIC = "music", "Music"
        CLOTHING = "clothing", "Clothing"
        TRANSPORT = "transport", "Transport"
        ACCOMMODATION = "accommodation", "Accommodation"
        OTHER = "other", "Other"

    class PaymentStatus(models.TextChoices):
        UNPAID = "unpaid", "Unpaid"
        PARTIAL = "partial", "Partial"
        PAID = "paid", "Paid"

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="budget_items",
    )

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        default=Category.OTHER,
    )

    name = models.CharField(
        max_length=200,
    )

    estimated_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    actual_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    amount_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.UNPAID,
    )

    due_date = models.DateField(
        null=True,
        blank=True,
    )

    vendor_name = models.CharField(
        max_length=200,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name