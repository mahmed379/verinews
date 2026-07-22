from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom user model for VeriNews.

    Right now it behaves exactly like Django's default User model.
    We define it now so we can easily add fields later
    (bio, reputation, profile picture, etc.).
    """
    pass