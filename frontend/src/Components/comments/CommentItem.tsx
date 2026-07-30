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
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-white/20
        hover:bg-white/10
      "
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {comment.author}
          </p>

          <p className="mt-1 text-xs text-slate-400">
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
                  rounded-xl
                  border
                  border-blue-400/20
                  bg-blue-500/10
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-blue-300
                  transition-all
                  duration-200
                  hover:bg-blue-500/20
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
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-500/10
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-red-300
                  transition-all
                  duration-200
                  hover:bg-red-500/20
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
        <p className="whitespace-pre-line text-[15px] leading-7 text-slate-300">
          {comment.body}
        </p>
      )}
    </div>
  );
}