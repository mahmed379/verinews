from rest_framework import serializers

from .models import CredibilityReview, NewsArticle, Vote


class NewsArticleSerializer(serializers.ModelSerializer):

    submitted_by = serializers.StringRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = NewsArticle
        fields = [
            "id",
            "title",
            "source_url",
            "description",
            "category",
            "status",
            "submitted_by",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class CredibilityReviewSerializer(serializers.ModelSerializer):

    reviewed_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CredibilityReview
        fields = [
            "id",
            "article",
            "previous_status",
            "new_status",
            "reason",
            "reviewed_by",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "article",
            "previous_status",
            "reviewed_by",
            "created_at",
        ]


class StatusChangeSerializer(serializers.Serializer):

    new_status = serializers.ChoiceField(
        choices=NewsArticle.Status.choices
    )

    reason = serializers.CharField()

    def validate(self, data):
        if data["new_status"] == self.context["current_status"]:
            raise serializers.ValidationError(
                "New status must be different from current status."
            )

        return data


class VoteSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Vote

        fields = [
            "id",
            "article",
            "user",
            "rating",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]