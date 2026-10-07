from django.urls import path

from .views import EventDetailView, EventListCreateView
from .member_views import (
    EventMemberDetailView,
    EventMemberListCreateView,
)

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("<int:event_id>/members/",EventMemberListCreateView.as_view(),name="event-member-list-create",),
    path("<int:event_id>/members/<int:membership_id>/",EventMemberDetailView.as_view(),name="event-member-detail",),
]
