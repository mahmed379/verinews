import { useState, type FormEvent } from "react";
import { useReviewArticle } from "../../hooks/useModeration";
import type { ArticleStatus, NewsArticle } from "../../types";

const STATUS_OPTIONS: {
  value: ArticleStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending Review",
  },
  {
    value: "verified",
    label: "Verified",
  },
  {
    value: "disputed",
    label: "Disputed",
  },
  {
    value: "false",
    label: "Marked False",
  },
];


interface Props {
  article: NewsArticle;
  onDone?: () => void;
}


export function ArticleReviewForm({
  article,
  onDone,
}: Props) {

  const [newStatus, setNewStatus] =
    useState<ArticleStatus>(article.status);

  const [reason, setReason] =
    useState("");

  const { mutate, isPending } =
    useReviewArticle();


  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (newStatus === article.status) {
      return;
    }

    mutate(
      {
        id: article.id,
        payload: {
          new_status: newStatus,
          reason,
        },
      },
      {
        onSuccess: () => {
          onDone?.();
        },
      }
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="solid-card p-4 space-y-3"
    >

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          New status
        </label>

        <select
          value={newStatus}
          onChange={(e) =>
            setNewStatus(
              e.target.value as ArticleStatus
            )
          }
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>


      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Reason (shown publicly)
        </label>

        <textarea
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          required
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>


      {newStatus === article.status && (
        <p className="text-sm text-warning">
          Choose a different status than the current one.
        </p>
      )}


      <button
        type="submit"
        disabled={
          isPending ||
          newStatus === article.status
        }
        className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {isPending
          ? "Saving..."
          : "Save Review"}
      </button>

    </form>
  );
}