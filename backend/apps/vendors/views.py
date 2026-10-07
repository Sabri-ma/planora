from rest_framework import generics, permissions

from .models import Vendor
from .serializers import VendorSerializer


class VendorListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = VendorSerializer
    permission_classes = [
        permissions.IsAuthenticated
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


class VendorDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = VendorSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return (
            Vendor.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
        )