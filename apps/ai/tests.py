from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.news.models import NewsArticle

from .models import AIAnalysis, ArticleSummary
from .summarizer import ExtractiveSummarizer

User = get_user_model()


class ExtractiveSummarizerTests(TestCase):
    def setUp(self):
        self.summarizer = ExtractiveSummarizer()

    def _build_article(self, description: str):
        return NewsArticle(
            title="Test",
            source_url="https://example.com",
            description=description,
        )

    def test_short_description_returned_as_is(self):
        article = self._build_article(
            "One short sentence. Two short sentence."
        )

        result = self.summarizer.summarize(
            article,
            max_summary_sentences=3,
        )

        self.assertEqual(
            result.summary,
            article.description.strip(),
        )

    def test_long_description_is_compressed(self):
        description = " ".join(
            [
                f"This is filler sentence number {i} about local weather patterns."
                for i in range(10)
            ]
        )

        article = self._build_article(description)

        result = self.summarizer.summarize(
            article,
            max_summary_sentences=3,
        )

        self.assertLess(
            len(result.summary),
            len(description),
        )

    def test_claims_extracted_from_numeric_sentences(self):
        article = self._build_article(
            "The event was nice. Attendance grew 40% this year. Everyone celebrated."
        )

        result = self.summarizer.summarize(article)

        self.assertTrue(
            any("40%" in claim for claim in result.claims)
        )

    def test_claims_empty_when_no_numeric_content(self):
        article = self._build_article(
            "The event was nice. Everyone celebrated. People went home."
        )

        result = self.summarizer.summarize(article)

        self.assertEqual(result.claims, [])


class SummarizationSignalTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password123",
        )

    def test_summary_created_automatically_on_article_creation(self):
        article = NewsArticle.objects.create(
            title="Signal Test",
            source_url="https://example.com/test",
            description=(
                "The council met on Monday. "
                "Attendance increased by 25%. "
                "The budget was approved. "
                "Construction begins next month."
            ),
            submitted_by=self.user,
        )

        self.assertTrue(
            ArticleSummary.objects.filter(article=article).exists()
        )

    def test_both_analysis_and_summary_created_together(self):
        article = NewsArticle.objects.create(
            title="AI Test",
            source_url="https://example.com/test2",
            description=(
                "The council met on Monday. "
                "Attendance increased by 25%. "
                "The budget was approved."
            ),
            submitted_by=self.user,
        )

        self.assertTrue(
            AIAnalysis.objects.filter(article=article).exists()
        )

        self.assertTrue(
            ArticleSummary.objects.filter(article=article).exists()
        )