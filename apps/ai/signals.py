from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.news.models import NewsArticle

from .services import run_analysis, run_summarization


@receiver(post_save, sender=NewsArticle)
def analyze_on_creation(sender, instance, created, **kwargs):
    """
    Automatically generate credibility signals when a new article
    is submitted. Existing articles are not re-analyzed on every save.
    """
    if created:
        run_analysis(instance)
        run_summarization(instance)