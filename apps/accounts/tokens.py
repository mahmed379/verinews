from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    """
    Generates secure tokens for email verification.
    """

    def _make_hash_value(self, user, timestamp):
        return (
            f"{user.pk}"
            f"{timestamp}"
            f"{user.is_active}"
        )


email_verification_token = EmailVerificationTokenGenerator()