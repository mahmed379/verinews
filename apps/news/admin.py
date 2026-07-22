from django.contrib import admin
from .models import NewsArticle, CredibilityReview, Vote

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "status",
        "submitted_by",
        "created_at",
    )
    list_filter = ("category", "status")
    search_fields = ("title", "description")


@admin.register(CredibilityReview)
class CredibilityReviewAdmin(admin.ModelAdmin):
    list_display = (
        "article",
        "previous_status",
        "new_status",
        "reviewed_by",
        "created_at",
    )

    list_filter = ("new_status",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("article", "user", "rating", "updated_at")
    list_filter = ("rating",)