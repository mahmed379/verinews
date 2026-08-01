
from django.db import migrations


def make_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    try:
        user = User.objects.get(
            email="mohammadahmed41235@gmail.com"
        )

        user.is_staff = True
        user.is_superuser = True
        user.save()

    except User.DoesNotExist:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0005_remove_user_is_verified"),
    ]

    operations = [
        migrations.RunPython(make_admin),
    ]