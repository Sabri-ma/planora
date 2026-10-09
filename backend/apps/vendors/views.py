from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from apps.events.permissions import (
    EventContentPermission,
    can_manage_event_content,
)
from .models import Vendor
from .serializers import VendorSerializer


class VendorListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = VendorSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        queryset = (
            Vendor.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
            .order_by("name")
        )

        event_id = self.request.query_params.get(
            "event"
        )

        category = self.request.query_params.get(
            "category"
        )

        status = self.request.query_params.get(
            "status"
        )

        if event_id:
            queryset = queryset.filter(
                event_id=event_id
            )

        if category:
            queryset = queryset.filter(
                category=category
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        return queryset

    def perform_create(self, serializer):
        event = serializer.validated_data["event"]

        if not can_manage_event_content(
            self.request.user,
            event,
        ):
            raise PermissionDenied(
                "You do not have permission to create vendors for this event."
            )

        serializer.save()


class VendorDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = VendorSerializer
    permission_classes = [
        EventContentPermission
    ]

    def get_queryset(self):
        return (
            Vendor.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
        )