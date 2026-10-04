from django.urls import path

from .views import TaskDetailView, TaskListCreateView


urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task-list-create"),
    path("<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
]