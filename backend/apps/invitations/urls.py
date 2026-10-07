from django.urls import path

from .views import (
    InvitationDetailView,
    InvitationListCreateView,
    PublicInvitationView,
    PublicRSVPView,
)


urlpatterns = [
    path(
        "",
        InvitationListCreateView.as_view(),
        name="invitation-list-create",
    ),
    path(
        "<int:pk>/",
        InvitationDetailView.as_view(),
        name="invitation-detail",
    ),
    path(
        "public/<uuid:token>/",
        PublicInvitationView.as_view(),
        name="public-invitation",
    ),
    path(
        "public/<uuid:token>/rsvp/",
        PublicRSVPView.as_view(),
        name="public-rsvp",
    ),
]