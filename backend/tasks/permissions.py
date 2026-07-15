from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """Only the task's owner can view/edit/delete it."""

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id
