from django.apps import AppConfig


class ModerationAuditConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.moderation_audit"
    label = "moderation_audit"
    verbose_name = "Moderator Audit Logging"