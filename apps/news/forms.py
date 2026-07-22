from django import forms

from .models import NewsArticle, CredibilityReview, Vote

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

class StatusChangeForm(forms.Form):
    new_status = forms.ChoiceField(
        choices=NewsArticle.Status.choices
    )

    reason = forms.CharField(
        widget=forms.Textarea(attrs={"rows": 3})
    )

    def __init__(self, *args, current_status=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_status = current_status

    def clean_new_status(self):
        new_status = self.cleaned_data["new_status"]

        if new_status == self.current_status:
            raise forms.ValidationError(
                "Choose a different status than the current one."
            )

        return new_status

class VoteForm(forms.ModelForm):
    class Meta:
        model = Vote
        fields = ["rating"]
        widgets = {
            "rating": forms.RadioSelect(
                choices=[(i, i) for i in range(1, 6)]
            ),
        }