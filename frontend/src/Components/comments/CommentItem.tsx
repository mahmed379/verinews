import { useState } from "react";

import type { Comment } from "../../types";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  canEdit: boolean;
  canDelete: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (body: string) => void;
  onDelete: () => void;
}

export function CommentItem({
  comment,
  canEdit,
  canDelete,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="font-medium text-ink">
            {comment.author}
          </p>

          <p className="text-xs text-slate-500">
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="text-sm text-primary hover:underline"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={onDelete}
                className="text-sm text-danger hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <CommentForm
          initialValue={comment.body}
          submitLabel="Save Changes"
          isSubmitting={isUpdating}
          onSubmit={(body) => {
            onUpdate(body);
            setEditing(false);
          }}
        />
      ) : (
        <p className="whitespace-pre-line text-slate-700">
          {comment.body}
        </p>
      )}
    </div>
  );
}