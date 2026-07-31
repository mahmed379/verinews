from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from django.conf import settings
from django.core.mail import send_mail

from .tokens import email_verification_token

from rest_framework import serializers

User = get_user_model()

class UserSummarySerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "display_name",
        ]

    def get_display_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()

        if full_name:
            return full_name

        return obj.username

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "date_joined",
            "is_superuser",
        ]
        read_only_fields = [
            "id",
            "is_staff",
            "is_superuser",
            "date_joined",
        ]


class RegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password2 = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password2",
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )

        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, data):

        if data["password"] != data["password2"]:
            raise serializers.ValidationError(
                {
                    "password2": "Passwords do not match."
                }
            )

        return data

    def create(self, validated_data):

        validated_data.pop("password2")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )

        user.is_verified = False
        user.is_active = False
        user.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_verification_token.make_token(user)

        verification_url = (
            f"{settings.FRONTEND_URL}/verify-email"
            f"?uid={uid}&token={token}"
        )

        send_mail(
            subject="Verify your VeriNews account",
            message=(
                f"Hello {user.username},\n\n"
                "Thank you for registering with VeriNews.\n\n"
                "Please click the link below to verify your email:\n\n"
                f"{verification_url}\n\n"
                "If you did not create this account, ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        print("EMAIL SENT TO:", user.email)
        print("VERIFY URL:", verification_url)

        return user
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(
            username=username,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Please verify your email before logging in."
            )

        attrs["user"] = user
        return attrs

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        email = self.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Do not reveal whether the email exists.
            return

        token_generator = PasswordResetTokenGenerator()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        reset_url = (
            f"{settings.FRONTEND_URL}/reset-password"
            f"?uid={uid}&token={token}"
        )
    

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate_password(self, value):
        validate_password(value)
        return value

    def save(self):
        uid = self.validated_data["uid"]
        token = self.validated_data["token"]
        password = self.validated_data["password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError(
                {"uid": "Invalid reset link."}
            )

        token_generator = PasswordResetTokenGenerator()

        if not token_generator.check_token(user, token):
            raise serializers.ValidationError(
                {"token": "Invalid or expired reset token."}
            )

        user.set_password(password)
        user.save()

        return user