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

          {comment.moderation_flag && (
            <div className="mt-3 text-sm text-danger">
              <p className="font-medium">
                Reasons:
              </p>

              <ul className="list-disc ml-5">
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