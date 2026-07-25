from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    moderation_flag = serializers.SerializerMethodField()

    class Meta:
        model = Comment

        fields = [
            "id",
            "article",
            "author",
            "body",
            "moderation_flag",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "author",
            "moderation_flag",
            "created_at",
            "updated_at",
        ]

    def get_moderation_flag(self, obj):

        request = self.context.get("request")

        if (
            not request
            or not request.user.is_authenticated
            or not request.user.is_staff
        ):
            return None

        flag = getattr(obj, "moderation_flag", None)

        if flag:
            from apps.ai.serializers import CommentModerationFlagSerializer

            return CommentModerationFlagSerializer(flag).data

        return None