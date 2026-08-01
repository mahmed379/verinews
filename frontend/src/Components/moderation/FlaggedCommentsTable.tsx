import type { Comment } from "../../types";
import {
  useFlaggedComments,
  useDeleteCommentAsStaff,
} from "../../hooks/useModeration";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";

export function FlaggedCommentsTable() {
  const { data, isLoading } = useFlaggedComments();
  const deleteMutation = useDeleteCommentAsStaff();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || data.results.length === 0) {
    return (
      <EmptyState
        title="No flagged comments"
        description="No comments are currently marked for moderation."
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-slate-400">
        AI detected comments requiring moderator attention.
      </p>

      <div className="space-y-4">
      {data.results.map((comment: Comment) => (
        <div
          key={comment.id}
          className="
          glass-card
          p-6
          transition-all
          duration-200
          hover:-translate-y-1
          hover:border-white/20
          "
        >
          <p className="text-sm text-slate-400">
            👤 {comment.author.display_name}
          </p>

          <p className="mt-4 whitespace-pre-line text-slate-200 leading-7">
            {comment.body}
          </p>

          {comment.moderation_flag?.is_flagged && (
            <div className="
                mt-5
                rounded-2xl
                border
                border-yellow-400/20
                bg-yellow-500/10
                p-4"
              >
              <p className="font-semibold text-yellow-200">
                ⚠ AI Moderation Flag
              </p>

              <ul className="mt-3 space-y-2 text-sm text-yellow-100">
                {comment.moderation_flag.reasons.map(
                  (reason: string, index: number) => (
                    <li
                      key={index}
                      className="rounded-lg bg-yellow-500/10 px-3 py-2"
                    >
                      {reason}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <button
            onClick={() => deleteMutation.mutate(comment.id)}
            disabled={deleteMutation.isPending}
            className="
            mt-5
            rounded-xl
            border
            border-red-400/20
            bg-red-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-red-300
            transition-all
            duration-200
            hover:bg-red-500/20
            disabled:opacity-50
            "
          >
            Delete Comment
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}