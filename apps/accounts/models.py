from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model for VeriNews.

    Users must have a unique email address.
    """

    email = models.EmailField(
        unique=True,
        blank=False,
    )