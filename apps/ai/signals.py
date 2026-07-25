from django.apps import apps
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.news.models import NewsArticle

from .services import (
    run_analysis,
    run_summarization,
    run_comment_moderation,
    run_report_moderation,
)

@receiver(post_save)
def moderate_comment_on_creation(sender, instance, created, **kwargs):

    Comment = apps.get_model("comments", "Comment")

    if sender == Comment and created:
        run_comment_moderation(instance)



@receiver(post_save)
def moderate_report_on_creation(sender, instance, created, **kwargs):

    Report = apps.get_model("reports", "Report")

    if sender == Report and created:
        run_report_moderation(instance)

@receiver(post_save, sender=NewsArticle)
def analyze_on_creation(sender, instance, created, **kwargs):
    if created:
        run_analysis(instance)
        run_summarization(instance)
