from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User

# Register our custom User model using Django's built-in admin interface.
admin.site.register(User, UserAdmin)
