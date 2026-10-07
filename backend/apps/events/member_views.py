from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .member_serializers import (
    AddEventMemberSerializer,
    EventMemberSerializer,
    UpdateEventMemberRoleSerializer,
)
from .models import Event, EventMembership


class EventMemberListCreateView(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_event(self, event_id):
        return get_object_or_404(
            Event,
            id=event_id,
            memberships__user=self.request.user,
        )

    def get(self, request, event_id):
        event = self.get_event(event_id)

        memberships = (
            EventMembership.objects.filter(
                event=event
            )
            .select_related(
                "user",
                "invited_by",
            )
            .order_by(
                "role",
                "joined_at",
            )
        )

        serializer = EventMemberSerializer(
            memberships,
            many=True,
        )

        return Response(
            serializer.data
        )

    def post(self, request, event_id):
        event = self.get_event(event_id)

        serializer = AddEventMemberSerializer(
            data=request.data,
            context={
                "request": request,
                "event": event,
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        membership = serializer.save()

        response_serializer = (
            EventMemberSerializer(
                membership
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class EventMemberDetailView(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_membership(
        self,
        request,
        event_id,
        membership_id,
    ):
        requester_membership = (
            EventMembership.objects.filter(
                event_id=event_id,
                user=request.user,
            ).first()
        )

        if requester_membership is None:
            return None, None

        membership = (
            EventMembership.objects
            .select_related("user")
            .filter(
                id=membership_id,
                event_id=event_id,
            )
            .first()
        )

        return (
            requester_membership,
            membership,
        )

    def patch(
        self,
        request,
        event_id,
        membership_id,
    ):
        requester_membership, membership = (
            self.get_membership(
                request,
                event_id,
                membership_id,
            )
        )

        if (
            requester_membership is None
            or membership is None
        ):
            return Response(
                {
                    "detail": "Member not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if requester_membership.role not in [
            EventMembership.Role.OWNER,
            EventMembership.Role.ADMIN,
        ]:
            return Response(
                {
                    "detail": (
                        "You do not have permission "
                        "to change member roles."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if membership.role == (
            EventMembership.Role.OWNER
        ):
            return Response(
                {
                    "detail": (
                        "The owner role cannot "
                        "be changed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = (
            UpdateEventMemberRoleSerializer(
                membership,
                data=request.data,
                partial=True,
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            EventMemberSerializer(
                membership
            ).data
        )

    def delete(
        self,
        request,
        event_id,
        membership_id,
    ):
        requester_membership, membership = (
            self.get_membership(
                request,
                event_id,
                membership_id,
            )
        )

        if (
            requester_membership is None
            or membership is None
        ):
            return Response(
                {
                    "detail": "Member not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if requester_membership.role not in [
            EventMembership.Role.OWNER,
            EventMembership.Role.ADMIN,
        ]:
            return Response(
                {
                    "detail": (
                        "You do not have permission "
                        "to remove members."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if membership.role == (
            EventMembership.Role.OWNER
        ):
            return Response(
                {
                    "detail": (
                        "The event owner cannot "
                        "be removed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        membership.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )