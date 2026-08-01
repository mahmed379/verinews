from django.db import migrations


def activate_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    user = User.objects.get(
        email="mohammadahmed41235@gmail.com"
    )

    user.is_active = True
    user.is_staff = True
    user.is_superuser = True
    user.save()

    print("Admin activated")


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0007_fix_admin_login"),
    ]

    operations = [
        migrations.RunPython(activate_admin),
    ]