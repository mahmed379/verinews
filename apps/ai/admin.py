from django.contrib import admin

from .models import AIAnalysis


@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = (
        "article",
        "score",
        "risk_level",
        "analyzer_version",
        "created_at",
    )

    list_filter = (
        "risk_level",
        "analyzer_version",
    )

    search_fields = (
        "article__title",
    )

    ordering = (
        "-created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False