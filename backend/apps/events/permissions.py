from rest_framework import permissions

from .models import EventMembership


READ_ONLY_METHODS = (
    "GET",
    "HEAD",
    "OPTIONS",
)


def get_event_membership(user, event):
    return EventMembership.objects.filter(
        event=event,
        user=user,
    ).first()


def can_manage_event_content(user, event):
    membership = get_event_membership(
        user,
        event,
    )

    if membership is None:
        return False

    return membership.role in [
        EventMembership.Role.OWNER,
        EventMembership.Role.ADMIN,
        EventMembership.Role.EDITOR,
    ]


def can_manage_event_members(user, event):
    membership = get_event_membership(
        user,
        event,
    )

    if membership is None:
        return False

    return membership.role in [
        EventMembership.Role.OWNER,
        EventMembership.Role.ADMIN,
    ]


def get_object_event(obj):
    """
    Return the Event associated with an object.

    Most Planora objects have:
        obj.event

    SeatAssignment is different:
        obj.table.event
    """

    event = getattr(
        obj,
        "event",
        None,
    )

    if event is not None:
        return event

    table = getattr(
        obj,
        "table",
        None,
    )

    if table is not None:
        return getattr(
            table,
            "event",
            None,
        )

    return None


class EventContentPermission(
    permissions.BasePermission
):
    """
    Owner/Admin/Editor:
        read + write

    Viewer:
        read only

    Non-member:
        no access
    """

    def has_permission(
        self,
        request,
        view,
    ):
        return (
            request.user
            and request.user.is_authenticated
        )

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        event = get_object_event(obj)

        if event is None:
            return False

        membership = get_event_membership(
            request.user,
            event,
        )

        if membership is None:
            return False

        if request.method in READ_ONLY_METHODS:
            return True

        return membership.role in [
            EventMembership.Role.OWNER,
            EventMembership.Role.ADMIN,
            EventMembership.Role.EDITOR,
        ]