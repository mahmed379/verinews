from django.db import migrations


def make_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    user = User.objects.get(
        email="mohammadahmed41235@gmail.com"
    )

    user.is_staff = True
    user.is_superuser = True
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_user_email"),
    ]

    operations = [
        migrations.RunPython(make_admin),
    ]