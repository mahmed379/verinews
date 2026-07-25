from rest_framework import serializers

from .models import AIAnalysis


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