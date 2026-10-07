from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Invitation
from .serializers import (
    InvitationSerializer,
    PublicInvitationSerializer,
    RSVPResponseSerializer,
)


class InvitationListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = InvitationSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        queryset = (
            Invitation.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related(
                "event",
                "guest",
            )
            .distinct()
            .order_by("-created_at")
        )

        event_id = self.request.query_params.get(
            "event"
        )

        status_value = self.request.query_params.get(
            "status"
        )

        if event_id:
            queryset = queryset.filter(
                event_id=event_id
            )

        if status_value:
            queryset = queryset.filter(
                status=status_value
            )

        return queryset


class InvitationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = InvitationSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return (
            Invitation.objects.filter(
                event__memberships__user=self.request.user
            )
            .select_related(
                "event",
                "guest",
            )
            .distinct()
        )


class PublicInvitationView(APIView):
    permission_classes = [
        permissions.AllowAny
    ]

    def get(self, request, token):
        invitation = (
            Invitation.objects
            .select_related(
                "event",
                "guest",
            )
            .filter(token=token)
            .first()
        )

        if invitation is None:
            return Response(
                {
                    "detail": (
                        "Invitation not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            invitation.status
            == Invitation.Status.SENT
        ):
            invitation.status = (
                Invitation.Status.OPENED
            )

            invitation.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

        serializer = PublicInvitationSerializer(
            invitation
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PublicRSVPView(APIView):
    permission_classes = [
        permissions.AllowAny
    ]

    def post(self, request, token):
        invitation = (
            Invitation.objects
            .select_related(
                "event",
                "guest",
            )
            .filter(token=token)
            .first()
        )

        if invitation is None:
            return Response(
                {
                    "detail": (
                        "Invitation not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = RSVPResponseSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        guest = invitation.guest

        guest.rsvp_status = (
            serializer.validated_data[
                "rsvp_status"
            ]
        )

        if "plus_one_name" in (
            serializer.validated_data
        ):
            guest.plus_one_name = (
                serializer.validated_data[
                    "plus_one_name"
                ]
            )

        if "meal_preference" in (
            serializer.validated_data
        ):
            guest.meal_preference = (
                serializer.validated_data[
                    "meal_preference"
                ]
            )

        guest.save()

        invitation.status = (
            Invitation.Status.RESPONDED
        )

        invitation.responded_at = (
            timezone.now()
        )

        invitation.save(
            update_fields=[
                "status",
                "responded_at",
                "updated_at",
            ]
        )

        return Response(
            {
                "detail": (
                    "RSVP response saved."
                ),
                "rsvp_status": (
                    guest.rsvp_status
                ),
            },
            status=status.HTTP_200_OK,
        )