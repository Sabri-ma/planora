from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from .models import Event, EventMembership
from .permissions import can_manage_event_content
from .serializers import EventSerializer


class EventListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = EventSerializer

    def get_queryset(self):
        return (
            Event.objects.filter(
                memberships__user=self.request.user
            )
            .distinct()
            .order_by("-created_at")
        )


class EventDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = EventSerializer

    def get_queryset(self):
        return (
            Event.objects.filter(
                memberships__user=self.request.user
            )
            .distinct()
        )

    def perform_update(self, serializer):
        event = self.get_object()

        if not can_manage_event_content(
            self.request.user,
            event,
        ):
            raise PermissionDenied(
                "You do not have permission to edit this event."
            )

        serializer.save()

    def perform_destroy(self, instance):
        membership = EventMembership.objects.filter(
            event=instance,
            user=self.request.user,
        ).first()

        if (
            membership is None
            or membership.role
            != EventMembership.Role.OWNER
        ):
            raise PermissionDenied(
                "Only the event owner can delete this event."
            )

        instance.delete()