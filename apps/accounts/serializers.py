from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

User = get_user_model()


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
        ]
        read_only_fields = [
            "id",
            "is_staff",
            "date_joined",
        ]


class RegisterSerializer(serializers.ModelSerializer):

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

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )