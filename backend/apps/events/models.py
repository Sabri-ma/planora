from django.conf import settings
from django.db import models


class Event(models.Model):
    class EventType(models.TextChoices):
        WEDDING = "wedding", "Wedding"
        BIRTHDAY = "birthday", "Birthday"
        ENGAGEMENT = "engagement", "Engagement"
        PRIVATE_PARTY = "private_party", "Private party"
        CORPORATE = "corporate", "Corporate event"
        CONFERENCE = "conference", "Conference"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PLANNING = "planning", "Planning"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_events",
    )

    name = models.CharField(max_length=200)

    slug = models.SlugField(
        max_length=220,
        unique=True,
    )

    event_type = models.CharField(
        max_length=30,
        choices=EventType.choices,
        default=EventType.WEDDING,
    )

    description = models.TextField(
        blank=True,
    )

    start_date = models.DateField()

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    currency = models.CharField(
        max_length=10,
        default="MAD",
    )

    budget_target = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    guest_target = models.PositiveIntegerField(
        default=0,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNING,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name


class EventMembership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        ADMIN = "admin", "Admin"
        EDITOR = "editor", "Editor"
        VIEWER = "viewer", "Viewer"

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="event_memberships",
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VIEWER,
    )

    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="event_invitations_sent",
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["event", "user"],
                name="unique_event_membership",
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.event} - {self.role}"