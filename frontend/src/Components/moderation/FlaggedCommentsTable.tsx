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
    <div className="space-y-4">
      {data.results.map((comment: Comment) => (
        <div
          key={comment.id}
          className="solid-card p-4"
        >
          <p className="text-sm text-slate-500">
            By {comment.author}
          </p>

          <p className="mt-2 text-ink">
            {comment.body}
          </p>

          {comment.moderation_flag?.is_flagged && (
            <div className="mt-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3">
              <p className="font-semibold text-yellow-800">
                ⚠ AI Moderation Flag
              </p>

              <ul className="mt-2 ml-5 list-disc text-sm text-yellow-700">
                {comment.moderation_flag.reasons.map(
                  (reason: string, index: number) => (
                    <li key={index}>
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
            className="mt-3 text-sm text-danger hover:underline"
          >
            Delete Comment
          </button>
        </div>
      ))}
    </div>
  );
}