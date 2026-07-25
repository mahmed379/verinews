"""
Extractive article summarization.

This summarizer selects existing sentences from an article rather than
generating new text. It uses a simple word-frequency heuristic to
identify representative sentences, making the results deterministic,
explainable, and free of external AI dependencies.
"""

import re
from collections import Counter
from dataclasses import dataclass, field


STOPWORDS = {
    "the", "a", "an", "and", "or", "but",
    "is", "are", "was", "were", "be", "been", "being",
    "to", "of", "in", "on", "at", "for", "with",
    "by", "from", "as", "that", "this", "these",
    "those", "it", "its", "he", "she", "they",
    "them", "his", "her", "their",
    "have", "has", "had",
    "will", "would", "could", "should",
    "not", "no",
    "do", "does", "did",
}

CLAIM_PATTERN = re.compile(r"\d|%|\"|'")


@dataclass
class SummaryResult:
    summary: str
    key_points: list[str] = field(default_factory=list)
    claims: list[str] = field(default_factory=list)
    summarizer_version: str = "extractive-v1"


def _split_sentences(text: str) -> list[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s.strip() for s in sentences if s.strip()]


def _word_frequencies(sentences: list[str]) -> Counter:
    freq = Counter()

    for sentence in sentences:
        words = re.findall(r"[a-zA-Z']+", sentence.lower())

        for word in words:
            if word not in STOPWORDS and len(word) > 2:
                freq[word] += 1

    return freq


def _score_sentence(sentence: str, freq: Counter) -> float:
    words = re.findall(r"[a-zA-Z']+", sentence.lower())

    significant = [
        w
        for w in words
        if w not in STOPWORDS and len(w) > 2
    ]

    if not significant:
        return 0.0

    return sum(freq[w] for w in significant) / len(significant)


class ExtractiveSummarizer:
    version = "extractive-v1"

    def summarize(
        self,
        article,
        max_summary_sentences: int = 3,
        max_key_points: int = 3,
    ) -> SummaryResult:

        sentences = _split_sentences(article.description)

        if len(sentences) <= max_summary_sentences:
            return SummaryResult(
                summary=article.description.strip(),
                key_points=sentences,
                claims=self._extract_claims(sentences),
                summarizer_version=self.version,
            )

        freq = _word_frequencies(sentences)

        scores = [
            _score_sentence(sentence, freq)
            for sentence in sentences
        ]

        top_summary = sorted(
            sorted(
                range(len(sentences)),
                key=lambda i: scores[i],
                reverse=True,
            )[:max_summary_sentences]
        )

        summary_sentences = [
            sentences[i]
            for i in top_summary
        ]

        top_key_points = sorted(
            range(len(sentences)),
            key=lambda i: scores[i],
            reverse=True,
        )[:max_key_points]

        key_points = [
            sentences[i]
            for i in sorted(top_key_points)
        ]

        return SummaryResult(
            summary=" ".join(summary_sentences),
            key_points=key_points,
            claims=self._extract_claims(sentences),
            summarizer_version=self.version,
        )

    def _extract_claims(
        self,
        sentences: list[str],
        max_claims: int = 5,
    ) -> list[str]:

        claims = [
            sentence
            for sentence in sentences
            if CLAIM_PATTERN.search(sentence)
        ]

        return claims[:max_claims]