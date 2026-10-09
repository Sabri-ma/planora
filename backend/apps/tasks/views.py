from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from apps.events.permissions import (
    EventContentPermission,
    can_manage_event_content,
)

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [EventContentPermission]

    def get_queryset(self):
        queryset = Task.objects.filter(
            event__memberships__user=self.request.user
        ).distinct()

        event_id = self.request.query_params.get("event")
        status = self.request.query_params.get("status")
        priority = self.request.query_params.get("priority")
        assigned_to = self.request.query_params.get("assigned_to")

        if event_id:
            queryset = queryset.filter(event_id=event_id)

        if status:
            queryset = queryset.filter(status=status)

        if priority:
            queryset = queryset.filter(priority=priority)

        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        event = serializer.validated_data["event"]

        if not can_manage_event_content(self.request.user, event):
            raise PermissionDenied(
                "You do not have permission to create tasks for this event."
            )

        # created_by is already handled inside TaskSerializer.create()
        serializer.save()


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [EventContentPermission]

    def get_queryset(self):
        return Task.objects.filter(
            event__memberships__user=self.request.user
        ).distinct()