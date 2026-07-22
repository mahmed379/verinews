from django.urls import path

from . import views


app_name = "comments"


urlpatterns = [
    path(
        "article/<int:article_pk>/add/",
        views.add_comment,
        name="add_comment",
    ),

    path(
        "<int:pk>/edit/",
        views.CommentUpdateView.as_view(),
        name="comment_edit",
    ),

    path(
        "<int:pk>/delete/",
        views.CommentDeleteView.as_view(),
        name="comment_delete",
    ),
]