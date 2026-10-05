from django.db import models

from apps.events.models import Event


class Guest(models.Model):
    class RSVPStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        DECLINED = "declined", "Declined"

    class GuestGroup(models.TextChoices):
        FAMILY = "family", "Family"
        FRIENDS = "friends", "Friends"
        WORK = "work", "Work"
        VIP = "vip", "VIP"
        OTHER = "other", "Other"

    class Side(models.TextChoices):
        PARTNER_ONE = "partner_one", "Partner one"
        PARTNER_TWO = "partner_two", "Partner two"
        BOTH = "both", "Both"
        NONE = "none", "None"

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="guests",
    )

    first_name = models.CharField(
        max_length=100,
    )

    last_name = models.CharField(
        max_length=100,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    group = models.CharField(
        max_length=20,
        choices=GuestGroup.choices,
        default=GuestGroup.OTHER,
    )

    side = models.CharField(
        max_length=20,
        choices=Side.choices,
        default=Side.NONE,
    )

    plus_one_allowed = models.BooleanField(
        default=False,
    )

    plus_one_name = models.CharField(
        max_length=200,
        blank=True,
    )

    rsvp_status = models.CharField(
        max_length=20,
        choices=RSVPStatus.choices,
        default=RSVPStatus.PENDING,
    )

    meal_preference = models.CharField(
        max_length=100,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    table = models.CharField(
        max_length=100,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}".strip()

        return full_name