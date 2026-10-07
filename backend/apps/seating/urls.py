from django.urls import path

from .views import (
    SeatAssignmentDetailView,
    SeatAssignmentListCreateView,
    SeatingTableDetailView,
    SeatingTableListCreateView,
)


urlpatterns = [
    path(
        "tables/",
        SeatingTableListCreateView.as_view(),
        name="seating-table-list-create",
    ),
    path(
        "tables/<int:pk>/",
        SeatingTableDetailView.as_view(),
        name="seating-table-detail",
    ),
    path(
        "assignments/",
        SeatAssignmentListCreateView.as_view(),
        name="seat-assignment-list-create",
    ),
    path(
        "assignments/<int:pk>/",
        SeatAssignmentDetailView.as_view(),
        name="seat-assignment-detail",
    ),
]