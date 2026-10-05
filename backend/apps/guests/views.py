from rest_framework import generics, permissions

from .models import Guest
from .serializers import GuestSerializer


class GuestListCreateView(generics.ListCreateAPIView):
    serializer_class = GuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Guest.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
            .order_by("first_name", "last_name")
        )

        event_id = self.request.query_params.get("event")
        rsvp_status = self.request.query_params.get("rsvp_status")
        group = self.request.query_params.get("group")

        if event_id:
            queryset = queryset.filter(event_id=event_id)

        if rsvp_status:
            queryset = queryset.filter(rsvp_status=rsvp_status)

        if group:
            queryset = queryset.filter(group=group)

        return queryset


class GuestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GuestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Guest.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
        )