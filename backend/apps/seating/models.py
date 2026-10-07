from django.db import models

from apps.events.models import Event
from apps.guests.models import Guest


class SeatingTable(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="seating_tables",
    )

    name = models.CharField(
        max_length=100,
    )

    capacity = models.PositiveIntegerField(
        default=8,
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


class SeatAssignment(models.Model):
    table = models.ForeignKey(
        SeatingTable,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    guest = models.OneToOneField(
        Guest,
        on_delete=models.CASCADE,
        related_name="seat_assignment",
    )

    seat_number = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "table",
                    "seat_number",
                ],
                name="unique_table_seat_number",
            )
        ]

    def __str__(self):
        return f"{self.guest} - {self.table}"