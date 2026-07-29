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
    <div
      className="
        rounded-xl
        border
        border-white/15
        bg-slate-800/30
        p-4
        backdrop-blur-xl
      "
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">
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
                className="
                  rounded-lg
                  px-3
                  py-1
                  text-sm
                  text-blue-300
                  transition
                  hover:bg-blue-500/10
                  hover:text-blue-200
                "
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={onDelete}
                className="
                  rounded-lg
                  px-3
                  py-1
                  text-sm
                  text-red-300
                  transition
                  hover:bg-red-500/10
                  hover:text-red-200
                "
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
        <p className="whitespace-pre-line leading-relaxed text-slate-300">
          {comment.body}
        </p>
      )}
    </div>
  );
}