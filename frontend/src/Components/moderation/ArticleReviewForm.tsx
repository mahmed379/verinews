import { useState, type FormEvent } from "react";
import { useReviewArticle } from "../../hooks/useModeration";
import type { ArticleStatus, NewsArticle } from "../../types";
import { GlassSelect } from "../ui/GlassSelect";

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
      className="
      glass-card
      space-y-5
      p-6
      "
    >

      <div>
        <label className="mb-2 block text-sm font-semibold text-white">
          New status
        </label>

        <GlassSelect<ArticleStatus>
          value={newStatus}
          onChange={setNewStatus}
          options={STATUS_OPTIONS}
          aria-label="New status"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-semibold text-white">
          Reason (shown publicly)
        </label>

        <textarea
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          required
          rows={3}
          className="
          w-full
          rounded-xl
          border
          border-white/15
          bg-white/5
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-400
          "
        />
      </div>


      {newStatus === article.status && (
        <p className="
          rounded-xl
          border
          border-yellow-400/20
          bg-yellow-500/10
          p-3
          text-sm
          text-yellow-200" 
        >
          Choose a different status than the current one.
        </p>
      )}


      <button
        type="submit"
        disabled={
          isPending ||
          newStatus === article.status
        }
        className="
        rounded-xl
        bg-secondary
        px-5
        py-3
        font-semibold
        text-white
        transition-all
        duration-200
        hover:opacity-90
        disabled:cursor-not-allowed
        disabled:opacity-50
        "
      >
        {isPending
          ? "Saving..."
          : "Save Review"}
      </button>

    </form>
  );
}