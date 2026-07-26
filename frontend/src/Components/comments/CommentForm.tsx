import { useState } from "react";

interface CommentFormProps {
  initialValue?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (body: string) => void;
}

export function CommentForm({
  initialValue = "",
  submitLabel = "Post Comment",
  isSubmitting = false,
  onSubmit,
}: CommentFormProps) {
  const [body, setBody] = useState(initialValue);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = body.trim();

    if (!trimmed) return;

    onSubmit(trimmed);

    if (!initialValue) {
      setBody("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Write a comment..."
        className="w-full rounded-lg border border-slate-300 p-3 focus:border-primary focus:outline-none"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-primary px-4 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}