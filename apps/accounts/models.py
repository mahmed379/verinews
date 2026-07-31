from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model for VeriNews.
    """

    email = models.EmailField(
        unique=True,
        blank=False,
    )

    is_verified = models.BooleanField(
        default=False
    )