from rest_framework import generics, permissions

from .models import Event
from .serializers import EventSerializer


class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Event.objects.filter(
                memberships__user=self.request.user
            )
            .distinct()
            .order_by("-created_at")
        )


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(
            memberships__user=self.request.user
        ).distinct()