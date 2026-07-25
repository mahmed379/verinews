from rest_framework import serializers

from .models import AIAnalysis, ArticleSummary

from .models import (
    CommentModerationFlag,
    ReportModerationFlag,
)

class AIAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysis
        fields = [
            "score",
            "risk_level",
            "factors",
            "suggested_steps",
            "analyzer_version",
            "created_at",
        ]

class ArticleSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleSummary
        fields = [
            "summary",
            "key_points",
            "claims",
            "summarizer_version",
            "created_at",
        ]


class CommentModerationFlagSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentModerationFlag
        fields = [
            "is_flagged",
            "score",
            "reasons",
            "flagger_version",
        ]



class ReportModerationFlagSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReportModerationFlag
        fields = [
            "is_flagged",
            "score",
            "reasons",
            "flagger_version",
        ]