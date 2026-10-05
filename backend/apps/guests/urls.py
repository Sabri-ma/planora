from django.urls import path

from .views import GuestDetailView, GuestListCreateView


urlpatterns = [
    path("", GuestListCreateView.as_view(), name="guest-list-create"),
    path("<int:pk>/", GuestDetailView.as_view(), name="guest-detail"),
]