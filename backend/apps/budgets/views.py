from rest_framework import generics, permissions

from .models import BudgetItem
from .serializers import BudgetItemSerializer


class BudgetItemListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = BudgetItemSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        queryset = (
            BudgetItem.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
            .order_by("due_date", "-created_at")
        )

        event_id = self.request.query_params.get(
            "event"
        )

        category = self.request.query_params.get(
            "category"
        )

        payment_status = (
            self.request.query_params.get(
                "payment_status"
            )
        )

        if event_id:
            queryset = queryset.filter(
                event_id=event_id
            )

        if category:
            queryset = queryset.filter(
                category=category
            )

        if payment_status:
            queryset = queryset.filter(
                payment_status=payment_status
            )

        return queryset


class BudgetItemDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = BudgetItemSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return (
            BudgetItem.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related("event")
            .distinct()
        )