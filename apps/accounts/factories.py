import factory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("username",)

    username = factory.Sequence(lambda n: f"user{n}")

    email = factory.LazyAttribute(
        lambda obj: f"{obj.username}@example.com"
    )

    password = factory.PostGenerationMethodCall(
        "set_password",
        "a-strong-test-password-1",
    )


class StaffUserFactory(UserFactory):
    is_staff = True


class SuperUserFactory(UserFactory):
    is_staff = True
    is_superuser = True