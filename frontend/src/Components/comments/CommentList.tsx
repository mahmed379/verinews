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
      <p className="text-slate-500">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canEdit={comment.author === currentUsername}
          canDelete={
            isStaff || comment.author === currentUsername
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