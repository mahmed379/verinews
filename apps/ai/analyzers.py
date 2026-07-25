"""
Heuristic credibility analysis.

This is NOT a trained machine learning model — there is no labeled
dataset to train one honestly. It is a fixed set of explicit,
inspectable rules. Every score comes with the exact reasoning behind
it, and every user-facing label calls this "Automated Credibility
Signals," never "AI verdict."
"""

import re
from dataclasses import dataclass, field
from urllib.parse import urlparse


REPUTABLE_DOMAINS = {
    "bbc.com",
    "reuters.com",
    "apnews.com",
    "npr.org",
    "theguardian.com",
    "nytimes.com",
    "washingtonpost.com",
    "wsj.com",
    "aljazeera.com",
}

SUSPICIOUS_TLDS = {
    ".xyz",
    ".click",
    ".top",
    ".info",
    ".biz",
}

SENSATIONAL_PHRASES = [
    "you won't believe",
    "shocking truth",
    "doctors hate",
    "miracle cure",
    "secret they don't want you to know",
    "what happens next will",
]


@dataclass
class Factor:
    label: str
    impact: str  # positive | negative | neutral
    detail: str
    points: int


@dataclass
class AnalysisResult:
    score: int
    risk_level: str
    factors: list[Factor] = field(default_factory=list)
    suggested_steps: list[str] = field(default_factory=list)
    analyzer_version: str = "heuristic-v1"


class BaseAnalyzer:
    """
    Base interface for all analyzers.

    Future ML or LLM analyzers should subclass this class and
    implement analyze().
    """

    version = "base"

    def analyze(self, article) -> AnalysisResult:
        raise NotImplementedError


class HeuristicAnalyzer(BaseAnalyzer):
    version = "heuristic-v1"

    def analyze(self, article) -> AnalysisResult:
        factors = []
        score = 50

        score += self._score_source(article.source_url, factors)
        score += self._score_writing_pattern(article.title, factors)
        score += self._score_content_length(article.description, factors)

        score = max(0, min(score, 100))

        risk_level = self._risk_level(score)

        return AnalysisResult(
            score=score,
            risk_level=risk_level,
            factors=factors,
            suggested_steps=self._suggested_steps(risk_level),
            analyzer_version=self.version,
        )

    def _score_source(self, source_url: str, factors: list[Factor]) -> int:
        domain = urlparse(source_url).netloc.lower().removeprefix("www.")
        delta = 0

        if domain in REPUTABLE_DOMAINS:
            delta += 15
            factors.append(
                Factor(
                    "Source reputation",
                    "positive",
                    f"{domain} is a widely recognized news source.",
                    15,
                )
            )
        elif any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            delta -= 15
            factors.append(
                Factor(
                    "Source reputation",
                    "negative",
                    f"The domain '{domain}' uses a TLD commonly associated with low-accountability sites.",
                    -15,
                )
            )
        else:
            factors.append(
                Factor(
                    "Source reputation",
                    "neutral",
                    f"{domain} is not in our known-source list. This is not a negative signal by itself.",
                    0,
                )
            )

        if source_url.startswith("https://"):
            delta += 2
            factors.append(
                Factor(
                    "Secure connection",
                    "positive",
                    "Source uses HTTPS.",
                    2,
                )
            )

        return delta

    def _score_writing_pattern(self, title: str, factors: list[Factor]) -> int:
        delta = 0

        letters = [c for c in title if c.isalpha()]
        caps_ratio = (
            sum(1 for c in letters if c.isupper()) / len(letters)
            if letters
            else 0
        )

        if caps_ratio > 0.5 and len(letters) > 10:
            delta -= 10
            factors.append(
                Factor(
                    "Title formatting",
                    "negative",
                    "Title is largely in capital letters, a common sensationalism indicator.",
                    -10,
                )
            )

        if re.search(r"[!?]{2,}", title):
            delta -= 5
            factors.append(
                Factor(
                    "Punctuation",
                    "negative",
                    "Title uses repeated exclamation or question marks.",
                    -5,
                )
            )

        lowered = title.lower()

        matched_phrase = next(
            (phrase for phrase in SENSATIONAL_PHRASES if phrase in lowered),
            None,
        )

        if matched_phrase:
            delta -= 10
            factors.append(
                Factor(
                    "Sensational language",
                    "negative",
                    "Title contains a phrase commonly used in clickbait headlines.",
                    -10,
                )
            )

        if delta == 0:
            factors.append(
                Factor(
                    "Title formatting",
                    "neutral",
                    "No sensational writing patterns detected in the title.",
                    0,
                )
            )

        return delta

    def _score_content_length(
        self,
        description: str,
        factors: list[Factor],
    ) -> int:
        length = len(description.strip())

        if length < 50:
            factors.append(
                Factor(
                    "Content depth",
                    "negative",
                    "Description is very short, making independent verification harder.",
                    -8,
                )
            )
            return -8

        factors.append(
            Factor(
                "Content depth",
                "positive",
                "Description provides enough detail to support a review.",
                3,
            )
        )

        return 3

    def _risk_level(self, score: int) -> str:
        if score >= 70:
            return "low"

        if score >= 40:
            return "medium"

        return "high"

    def _suggested_steps(self, risk_level: str) -> list[str]:
        steps = [
            "Cross-reference this claim with at least one other independent outlet.",
            "Check whether the original source has published a correction or update.",
        ]

        if risk_level == "high":
            steps.append(
                "Treat this article as unverified until a moderator reviews it."
            )

        return steps