from django.db import models

from apps.events.models import Event


class Vendor(models.Model):
    class Category(models.TextChoices):
        VENUE = "venue", "Venue"
        CATERING = "catering", "Catering"
        PHOTOGRAPHY = "photography", "Photography"
        VIDEOGRAPHY = "videography", "Videography"
        DECORATION = "decoration", "Decoration"
        MUSIC = "music", "Music"
        DJ = "dj", "DJ"
        TRANSPORT = "transport", "Transport"
        ACCOMMODATION = "accommodation", "Accommodation"
        BEAUTY = "beauty", "Beauty"
        CLOTHING = "clothing", "Clothing"
        CAKE = "cake", "Cake"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PROSPECT = "prospect", "Prospect"
        CONTACTED = "contacted", "Contacted"
        NEGOTIATING = "negotiating", "Negotiating"
        BOOKED = "booked", "Booked"
        REJECTED = "rejected", "Rejected"

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="vendors",
    )

    name = models.CharField(
        max_length=200,
    )

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        default=Category.OTHER,
    )

    contact_name = models.CharField(
        max_length=200,
        blank=True,
    )

    email = models.EmailField(
        blank=True,
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
    )

    website = models.URLField(
        blank=True,
    )

    location = models.CharField(
        max_length=200,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PROSPECT,
    )

    quoted_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
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