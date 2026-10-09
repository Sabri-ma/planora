from django.contrib import admin

from .models import Event, EventMembership


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
        "event_type",
        "start_date",
        "location",
        "status",
    )

    search_fields = (
        "name",
        "owner__username",
        "location",
    )

    list_filter = (
        "event_type",
        "status",
    )


@admin.register(EventMembership)
class EventMembershipAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "event",
        "user",
        "role",
        "invited_by",
        "joined_at",
    )

    search_fields = (
        "event__name",
        "user__username",
        "user__email",
    )

    list_filter = (
        "role",
    )