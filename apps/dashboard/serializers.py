from rest_framework import serializers


class DashboardStatsSerializer(serializers.Serializer):
    users = serializers.IntegerField()

    articles = serializers.IntegerField()

    verified_articles = serializers.IntegerField()
    pending_articles = serializers.IntegerField()
    disputed_articles = serializers.IntegerField()
    false_articles = serializers.IntegerField()

    comments = serializers.IntegerField()

    reports = serializers.IntegerField()