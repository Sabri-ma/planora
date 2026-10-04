from rest_framework import generics, permissions

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Task.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related(
                "event",
                "assigned_to",
                "created_by",
            )
            .distinct()
            .order_by("due_date", "-created_at")
        )

        event_id = self.request.query_params.get("event")

        if event_id:
            queryset = queryset.filter(event_id=event_id)

        return queryset


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Task.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related(
                "event",
                "assigned_to",
                "created_by",
            )
            .distinct()
        )