from django.contrib import admin

from .models import AIAnalysis, ArticleSummary

from .models import (
    CommentModerationFlag,
    ReportModerationFlag,
)

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

@admin.register(ArticleSummary)
class ArticleSummaryAdmin(admin.ModelAdmin):
    list_display = (
        "article",
        "summarizer_version",
        "created_at",
    )

    search_fields = (
        "article__title",
    )

    readonly_fields = (
        "article",
        "summary",
        "key_points",
        "claims",
        "summarizer_version",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

@admin.register(CommentModerationFlag)
class CommentModerationFlagAdmin(admin.ModelAdmin):

    list_display = (
        "comment",
        "is_flagged",
        "score",
        "created_at",
    )

    list_filter = (
        "is_flagged",
    )


    def has_add_permission(self, request):
        return False


    def has_change_permission(self, request, obj=None):
        return False



@admin.register(ReportModerationFlag)
class ReportModerationFlagAdmin(admin.ModelAdmin):

    list_display = (
        "report",
        "is_flagged",
        "score",
        "created_at",
    )

    list_filter = (
        "is_flagged",
    )


    def has_add_permission(self, request):
        return False


    def has_change_permission(self, request, obj=None):
        return False