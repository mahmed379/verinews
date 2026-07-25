from django.conf import settings
from django.utils.module_loading import import_string

from .analyzers import HeuristicAnalyzer
from .models import AIAnalysis

# Allows swapping analyzers through Django settings.
ANALYZER_CLASS = getattr(settings, "AI_ANALYZER_CLASS", None)


def get_analyzer():
    if ANALYZER_CLASS:
        return import_string(ANALYZER_CLASS)()

    return HeuristicAnalyzer()


def run_analysis(article) -> AIAnalysis:
    analyzer = get_analyzer()
    result = analyzer.analyze(article)

    analysis, _ = AIAnalysis.objects.update_or_create(
        article=article,
        defaults={
            "score": result.score,
            "risk_level": result.risk_level,
            "factors": [vars(factor) for factor in result.factors],
            "suggested_steps": result.suggested_steps,
            "analyzer_version": result.analyzer_version,
        },
    )

    return analysis