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

    version = "moderation-heuristic-v2"

    def analyze(self, comment):

        body = comment.body

        score = 0
        reasons = []

        url_count = len(URL_PATTERN.findall(body))

        if url_count > 0:
            score += 18 * min(url_count, 2)
            reasons.append(
                f"Contains {url_count} link(s)."
            )

        if len(body.strip()) < 15 and url_count > 0:
            score += 15
            reasons.append(
                "Very short comment consisting mostly of a link."
            )

        if REPEATED_CHAR_PATTERN.search(body):
            score += 12
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
            # Diminishing returns: each additional matched keyword adds
            # less than the last, so a comment with several borderline
            # phrases doesn't jump straight to a 100 "certain spam" score.
            score += sum(18 - min(i * 4, 12) for i in range(len(matched)))

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

    version = "moderation-heuristic-v2"


    def analyze(self, report):

        score = 0
        reasons = []

        details = report.details.strip()


        if not details:
            score += 15
            reasons.append(
                "No additional details were provided."
            )

        # Dismissed reports are a moderator-confirmed signal that this
        # reporter's past claims didn't hold up — a much stronger and
        # fairer signal than raw open-report count, which previously
        # penalized prolific but accurate reporters just as much as
        # bad-faith ones.
        dismissed_count = (
            report.__class__.objects
            .filter(
                reported_by=report.reported_by,
                status="dismissed",
            )
            .exclude(pk=report.pk)
            .count()
        )

        if dismissed_count >= 2:
            score += min(15 * dismissed_count, 45)
            reasons.append(
                f"Reporter has {dismissed_count} previously dismissed report(s)."
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

        # A high open-report count alone is a weak signal (it could just
        # mean an active, accurate reporter awaiting moderator review),
        # so it contributes far less than a confirmed-dismissed history.
        if recent_open_count >= 5:
            score += 10

            reasons.append(
                f"Reporter currently has {recent_open_count} other open reports awaiting review."
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