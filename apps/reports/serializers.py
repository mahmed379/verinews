from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reported_by = serializers.StringRelatedField(read_only=True)
    article_title = serializers.CharField(
    source="article.title",
    read_only=True,
)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Report

        fields = [
            "id",
            "article",
            "article_title",
            "reason",
            "details",
            "status",
            "reported_by",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "reported_by",
            "created_at",
        ]