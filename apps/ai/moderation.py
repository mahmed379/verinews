import re
from dataclasses import dataclass, field


URL_PATTERN = re.compile(r"https?://|www\.", re.IGNORECASE)

REPEATED_CHAR_PATTERN = re.compile(r"(.)\1{4,}")


SPAM_KEYWORDS = [
    "buy now",
    "click here",
    "free money",
    "make money fast",
    "work from home",
    "subscribe now",
    "limited time offer",
    "act now",
    "winner",
    "you have won",
]


@dataclass
class ModerationResult:
    is_flagged: bool
    score: int
    reasons: list[str] = field(default_factory=list)
    version: str = "moderation-heuristic-v1"


class CommentSpamAnalyzer:

    version = "moderation-heuristic-v1"

    def analyze(self, comment):

        body = comment.body

        score = 0
        reasons = []

        url_count = len(URL_PATTERN.findall(body))

        if url_count > 0:
            score += 25 * min(url_count, 2)
            reasons.append(
                f"Contains {url_count} link(s)."
            )

        if len(body.strip()) < 15 and url_count > 0:
            score += 20
            reasons.append(
                "Very short comment consisting mostly of a link."
            )

        if REPEATED_CHAR_PATTERN.search(body):
            score += 15
            reasons.append(
                "Contains an unusually repeated character sequence."
            )


        lowered = body.lower()

        matched = [
            keyword
            for keyword in SPAM_KEYWORDS
            if keyword in lowered
        ]

        if matched:
            score += 20 * len(matched)

            reasons.append(
                f"Contains common spam phrasing: {', '.join(matched)}."
            )


        letters = [
            c for c in body
            if c.isalpha()
        ]

        if letters:
            uppercase_ratio = (
                sum(1 for c in letters if c.isupper())
                / len(letters)
            )

            if uppercase_ratio > 0.7 and len(letters) > 15:
                score += 10
                reasons.append(
                    "Comment is written almost entirely in capital letters."
                )


        score = min(score, 100)


        return ModerationResult(
            is_flagged=score >= 40,
            score=score,
            reasons=reasons or [
                "No spam indicators detected."
            ],
            version=self.version,
        )



class ReportSuspicionAnalyzer:

    version = "moderation-heuristic-v1"


    def analyze(self, report):

        score = 0
        reasons = []

        details = report.details.strip()


        if not details:
            score += 15
            reasons.append(
                "No additional details were provided."
            )


        recent_open_count = (
            report.__class__.objects
            .filter(
                reported_by=report.reported_by,
                status="open"
            )
            .exclude(pk=report.pk)
            .count()
        )


        if recent_open_count >= 3:
            score += 30

            reasons.append(
                f"Reporter currently has {recent_open_count} other open reports."
            )


        if details and len(details) < 10:
            score += 10

            reasons.append(
                "Details provided are extremely brief."
            )


        score = min(score,100)


        return ModerationResult(
            is_flagged=score >= 30,
            score=score,
            reasons=reasons or [
                "No suspicion indicators detected."
            ],
            version=self.version,
        )