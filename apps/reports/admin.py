from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "article",
        "reason",
        "status",
        "reported_by",
        "created_at",
    )

    list_filter = (
        "status",
        "reason",
    )

    search_fields = (
        "details",
        "article__title",
    )

    actions = [
        "mark_resolved",
        "mark_dismissed",
    ]

    @admin.action(description="Mark selected reports as Resolved")
    def mark_resolved(self, request, queryset):
        updated = queryset.update(
            status=Report.Status.RESOLVED
        )
        self.message_user(
            request,
            f"{updated} report(s) marked resolved."
        )

    @admin.action(description="Mark selected reports as Dismissed")
    def mark_dismissed(self, request, queryset):
        updated = queryset.update(
            status=Report.Status.DISMISSED
        )
        self.message_user(
            request,
            f"{updated} report(s) dismissed."
        )