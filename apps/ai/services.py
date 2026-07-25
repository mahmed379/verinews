from django.conf import settings
from django.utils.module_loading import import_string

from .analyzers import HeuristicAnalyzer
from .models import AIAnalysis

from .models import ArticleSummary
from .summarizer import ExtractiveSummarizer

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

def run_summarization(article) -> ArticleSummary:
    """
    Generate or update an extractive summary for an article.
    """

    summarizer = ExtractiveSummarizer()
    result = summarizer.summarize(article)

    summary, _ = ArticleSummary.objects.update_or_create(
        article=article,
        defaults={
            "summary": result.summary,
            "key_points": result.key_points,
            "claims": result.claims,
            "summarizer_version": result.summarizer_version,
        },
    )

    return summary

from .models import (
    CommentModerationFlag,
    ReportModerationFlag,
)

from .moderation import (
    CommentSpamAnalyzer,
    ReportSuspicionAnalyzer,
)


def run_comment_moderation(comment):

    result = CommentSpamAnalyzer().analyze(comment)

    flag, _ = CommentModerationFlag.objects.update_or_create(
        comment=comment,
        defaults={
            "is_flagged": result.is_flagged,
            "score": result.score,
            "reasons": result.reasons,
            "flagger_version": result.version,
        },
    )

    return flag



def run_report_moderation(report):

    result = ReportSuspicionAnalyzer().analyze(report)

    flag, _ = ReportModerationFlag.objects.update_or_create(
        report=report,
        defaults={
            "is_flagged": result.is_flagged,
            "score": result.score,
            "reasons": result.reasons,
            "flagger_version": result.version,
        },
    )

    return flag