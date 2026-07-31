from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "moderator",
        "action",
        "content_type",
        "object_id",
        "created_at",
    )

    list_filter = (
        "action",
        "content_type",
        "created_at",
    )

    search_fields = (
        "moderator__username",
        "reason",
    )

    readonly_fields = (
        "moderator",
        "action",
        "content_type",
        "object_id",
        "reason",
        "metadata",
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False