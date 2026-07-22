from django import forms

from .models import NewsArticle


class NewsSubmissionForm(forms.ModelForm):
    class Meta:
        model = NewsArticle
        fields = [
            "title",
            "source_url",
            "description",
            "category",
        ]

        widgets = {
            "description": forms.Textarea(attrs={"rows": 5}),
        }