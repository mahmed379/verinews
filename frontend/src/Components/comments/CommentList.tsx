import type { Comment } from "../../types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  currentUsername?: string;
  isStaff?: boolean;
  updatingId?: number;
  deletingId?: number;
  onUpdate: (id: number, body: string) => void;
  onDelete: (id: number) => void;
}

export function CommentList({
  comments,
  currentUsername,
  isStaff = false,
  updatingId,
  deletingId,
  onUpdate,
  onDelete,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-lg font-semibold text-white">
          No comments yet
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Start the discussion by posting the first comment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canEdit={comment.author.username === currentUsername}
          canDelete={
            isStaff || comment.author.username === currentUsername
          }
          isUpdating={updatingId === comment.id}
          isDeleting={deletingId === comment.id}
          onUpdate={(body) => onUpdate(comment.id, body)}
          onDelete={() => onDelete(comment.id)}
        />
      ))}
    </div>
  );
}