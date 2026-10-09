from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from apps.events.permissions import (
    EventContentPermission,
    can_manage_event_content,
)
from .models import SeatAssignment, SeatingTable
from .serializers import (
    SeatAssignmentSerializer,
    SeatingTableSerializer,
)


class SeatingTableListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = SeatingTableSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        queryset = (
            SeatingTable.objects.filter(
                event__memberships__user=self.request.user
            )
            .prefetch_related(
                "assignments__guest"
            )
            .distinct()
            .order_by("name")
        )

        event_id = self.request.query_params.get(
            "event"
        )

        if event_id:
            queryset = queryset.filter(
                event_id=event_id
            )

        return queryset

    def perform_create(self, serializer):
        event = serializer.validated_data["event"]

        if not can_manage_event_content(
            self.request.user,
            event,
        ):
            raise PermissionDenied(
                "You do not have permission to create seating tables for this event."
            )

        serializer.save()


class SeatingTableDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = SeatingTableSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        return (
            SeatingTable.objects.filter(
                event__memberships__user=self.request.user
            )
            .prefetch_related(
                "assignments__guest"
            )
            .distinct()
        )


class SeatAssignmentListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = SeatAssignmentSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        queryset = (
            SeatAssignment.objects.filter(
                table__event__memberships__user=self.request.user
            )
            .select_related(
                "table",
                "guest",
            )
            .distinct()
            .order_by(
                "table__name",
                "seat_number",
            )
        )

        event_id = self.request.query_params.get(
            "event"
        )

        table_id = self.request.query_params.get(
            "table"
        )

        if event_id:
            queryset = queryset.filter(
                table__event_id=event_id
            )

        if table_id:
            queryset = queryset.filter(
                table_id=table_id
            )

        return queryset

    def perform_create(self, serializer):
        table = serializer.validated_data["table"]

        if not can_manage_event_content(
            self.request.user,
            table.event,
        ):
            raise PermissionDenied(
                "You do not have permission to assign guests for this event."
            )

        serializer.save()


class SeatAssignmentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = SeatAssignmentSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        return (
            SeatAssignment.objects.filter(
                table__event__memberships__user=self.request.user
            )
            .select_related(
                "table",
                "guest",
            )
            .distinct()
        )