from django.db import migrations
from django.contrib.auth.hashers import make_password


def fix_admin_login(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    try:
        user = User.objects.get(
            email="mohammadahmed41235@gmail.com"
        )

        # Print username in Render logs
        print("================================")
        print("ADMIN USERNAME:", user.username)
        print("ADMIN EMAIL:", user.email)
        print("================================")

        # Reset password
        user.password = make_password("admin@123")

        # Ensure admin access
        user.is_staff = True
        user.is_superuser = True

        user.save()

        print("Password reset successfully")

    except User.DoesNotExist:
        print("USER WITH THIS EMAIL NOT FOUND")


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_create_admin_access"),
    ]

    operations = [
        migrations.RunPython(fix_admin_login),
    ]