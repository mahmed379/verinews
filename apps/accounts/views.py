from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

from apps.api.throttles import (
    RegisterThrottle,
    LoginThrottle,
    PasswordResetThrottle,
)

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
)

from .tokens import email_verification_token

from .models import User

from .forms import CustomUserCreationForm

from api.permissions import IsSuperUser

from rest_framework import generics, permissions

from rest_framework.response import Response

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django.contrib.auth import login
from rest_framework.authtoken.models import Token

from .serializers import LoginSerializer

from drf_spectacular.utils import extend_schema

def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("home")

    else:
        form = CustomUserCreationForm()

    return render(
        request,
        "accounts/register.html",
        {"form": form}
    )

def user_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)
            return redirect("home")

    return render(request, "accounts/login.html")

def user_logout(request):
    logout(request)
    return redirect("home")

@login_required



def dashboard(request):
    return redirect("dashboard:dashboard")


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegisterThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Registration successful. Please check your email to verify your account.",
                "user": UserSerializer(user).data,
            },
            status=201,
        )

@extend_schema(
    request=LoginSerializer,
    responses={200: None},
    description="Authenticate a user and return an API token."
)
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "user": UserSerializer(user).data,
            },
            status=200,
        )


@extend_schema(
    request=None,
    responses={200: None},
    description="Verify a user's email address."
)
class VerifyEmailAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uid, token):

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

        except (
            User.DoesNotExist,
            ValueError,
            TypeError,
            OverflowError,
        ):
            return Response(
                {
                    "detail": "Invalid verification link."
                },
                status=400,
            )

        if not email_verification_token.check_token(user, token):
            return Response(
                {
                    "detail": "Verification link is invalid or has expired."
                },
                status=400,
            )

        user.is_active = True
        user.is_verified = True
        user.save(update_fields=["is_active", "is_verified"])

        return Response(
            {
                "message": "Email verified successfully."
            },
            status=200,
        )

class MeAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

@extend_schema(
    request=None,
    responses={200: None},
    description="Logs out the current authenticated user."
)
class LogoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.auth.delete()
        return Response(status=204)

@extend_schema(
    request=PasswordResetSerializer,
    responses={200: None},
    description="Request a password reset email."
)
class PasswordResetAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetThrottle]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": (
                    "If an account with that email exists, "
                    "a password reset link has been sent."
                )
            },
            status=200,
        )


@extend_schema(
    request=PasswordResetConfirmSerializer,
    responses={200: None},
    description="Reset password using a valid reset token."
)
class PasswordResetConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Password has been reset successfully."
            },
            status=200,
        )

@extend_schema(
    description="Superuser only. List all registered users. Read-only — role changes are managed via Django admin."
)
class UserListAPIView(generics.ListAPIView):
    """
    GET /api/users/
    Superuser only.
    Read-only by design.
    """
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]