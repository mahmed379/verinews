from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .forms import RegisterForm
from django.shortcuts import redirect


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)

    if form.is_valid():
        user = form.save()
        login(request, user)
        return redirect("home")

    else:
        form = RegisterForm()

    return render(request, "accounts/register.html", {"form": form})


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