from django.urls import path

from .views import (
    BudgetItemDetailView,
    BudgetItemListCreateView,
)


urlpatterns = [
    path(
        "",
        BudgetItemListCreateView.as_view(),
        name="budget-item-list-create",
    ),
    path(
        "<int:pk>/",
        BudgetItemDetailView.as_view(),
        name="budget-item-detail",
    ),
]