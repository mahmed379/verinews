from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class ActionType(models.TextChoices):
    APPROVE = "approve", "Approved"
    REJECT = "reject", "Rejected"
    DELETE = "delete", "Deleted"
    RESTORE = "restore", "Restored"
    EDIT = "edit", "Edited"
    FLAG = "flag", "Flagged"
    UNFLAG = "unflag", "Unflagged"
    OTHER = "other", "Other"


class AuditLog(models.Model):
    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="moderation_actions",
    )

    action = models.CharField(
        max_length=20,
        choices=ActionType.choices,
    )

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="+",
    )

    object_id = models.PositiveIntegerField()

    target = GenericForeignKey(
        "content_type",
        "object_id",
    )

    reason = models.TextField(
        blank=True,
    )

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["content_type", "object_id"]
            ),
            models.Index(
                fields=["moderator", "created_at"]
            ),
            models.Index(
                fields=["action", "created_at"]
            ),
        ]
        verbose_name = "Audit Log Entry"
        verbose_name_plural = "Audit Log Entries"

    def __str__(self):
        return (
            f"{self.get_action_display()} "
            f"on {self.content_type.model} "
            f"#{self.object_id}"
        )