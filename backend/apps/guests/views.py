from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from apps.events.permissions import (
    EventContentPermission,
    can_manage_event_content,
)
from .models import Guest
from .serializers import GuestSerializer


class GuestListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = GuestSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        queryset = (
            Guest.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
            .order_by(
                "first_name",
                "last_name",
            )
        )

        event_id = self.request.query_params.get(
            "event"
        )

        rsvp_status = (
            self.request.query_params.get(
                "rsvp_status"
            )
        )

        group = self.request.query_params.get(
            "group"
        )

        if event_id:
            queryset = queryset.filter(
                event_id=event_id
            )

        if rsvp_status:
            queryset = queryset.filter(
                rsvp_status=rsvp_status
            )

        if group:
            queryset = queryset.filter(
                group=group
            )

        return queryset

    def perform_create(self, serializer):
        event = serializer.validated_data["event"]

        if not can_manage_event_content(
            self.request.user,
            event,
        ):
            raise PermissionDenied(
                "You do not have permission to create guests for this event."
            )

        serializer.save()


class GuestDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = GuestSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        return (
            Guest.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
        )