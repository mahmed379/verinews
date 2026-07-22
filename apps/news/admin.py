from django.contrib import admin

from .models import NewsArticle


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "status",
        "submitted_by",
        "created_at",
    )

    list_filter = (
        "category",
        "status",
    )

    search_fields = (
        "title",
        "description",
    )