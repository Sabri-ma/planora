from rest_framework import generics, permissions

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
        permissions.IsAuthenticated
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


class SeatingTableDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = SeatingTableSerializer
    permission_classes = [
        permissions.IsAuthenticated
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
        permissions.IsAuthenticated
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


class SeatAssignmentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = SeatAssignmentSerializer
    permission_classes = [
        permissions.IsAuthenticated
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