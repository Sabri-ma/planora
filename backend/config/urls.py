from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/v1/auth/",
        include("apps.accounts.urls"),
    ),

    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    path(
    "api/v1/events/",
    include("apps.events.urls"),
    ),

    path(
    "api/v1/tasks/",
    include("apps.tasks.urls"),
    ),

    path(
    "api/v1/guests/",
    include("apps.guests.urls"),
    ),
]