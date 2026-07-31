from django.contrib.contenttypes.models import ContentType

from .models import AuditLog


def log_action(
    *,
    moderator,
    action,
    target,
    reason="",
    metadata=None,
):
    """
    Create a moderation audit log entry.
    """

    if metadata is None:
        metadata = {}

    content_type = ContentType.objects.get_for_model(
        target
    )

    return AuditLog.objects.create(
        moderator=moderator,
        action=action,
        content_type=content_type,
        object_id=target.pk,
        reason=reason,
        metadata=metadata,
    )