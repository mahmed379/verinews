from django.contrib import admin

from .models import CredibilityReview, NewsArticle, Vote


class CredibilityReviewInline(admin.TabularInline):
    model = CredibilityReview
    extra = 0
    fields = (
        "previous_status",
        "new_status",
        "reason",
        "reviewed_by",
        "created_at",
    )
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False

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
    inlines = [CredibilityReviewInline]

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return ()

        return (
            "title",
            "description",
            "category",
            "submitted_by",
            "created_at",
            "source_url",
        )
    def save_model(self, request, obj, form, change):
        if change:
            old_obj = NewsArticle.objects.get(pk=obj.pk)

            if old_obj.status != obj.status:
                CredibilityReview.objects.create(
                    article=obj,
                    previous_status=old_obj.status,
                    new_status=obj.status,
                    reviewed_by=request.user,
                    reason="Status changed by moderator.",
                )

        super().save_model(request, obj, form, change)
        
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
    
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

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = (
        "article",
        "user",
        "rating",
        "updated_at",
    )
    list_filter = ("rating",)