from django.db import migrations


def create_moderator_group(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Permission = apps.get_model("auth", "Permission")

    moderator_group, created = Group.objects.get_or_create(
        name="Moderator"
    )

    permission_codenames = [
        # News articles
        ("news", "view_newsarticle"),
        ("news", "change_newsarticle"),

        # Credibility reviews
        ("news", "view_credibilityreview"),

        # Reports
        ("reports", "view_report"),
        ("reports", "change_report"),

        # Comments
        ("comments", "view_comment"),
        ("comments", "delete_comment"),
    ]

    for app_label, codename in permission_codenames:
        try:
            permission = Permission.objects.get(
                content_type__app_label=app_label,
                codename=codename,
            )
            moderator_group.permissions.add(permission)
        except Permission.DoesNotExist:
            # Skip if the permission doesn't exist yet.
            pass


def remove_moderator_group(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Group.objects.filter(name="Moderator").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
        ("news", "0001_initial"),
        ("reports", "0001_initial"),
        ("comments", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(
            create_moderator_group,
            remove_moderator_group,
        ),
    ]