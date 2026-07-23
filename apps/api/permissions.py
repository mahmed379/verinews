from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allow anyone to read.
    Only the owner can edit/delete their own object.
    """

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        owner = (
            getattr(obj, "author", None)
            or getattr(obj, "user", None)
            or getattr(obj, "reported_by", None)
        )

        return owner == request.user


class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Used for moderation actions like article review.
    """

    def has_permission(self, request, view):

        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_authenticated and request.user.is_staff


class IsSuperUser(permissions.BasePermission):
    """
    Dangerous actions like deleting articles.
    Matches Milestone 10 admin rule.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_superuser
        )