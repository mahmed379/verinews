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
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Write a comment..."
        className="
          w-full
          rounded-xl
          border
          border-white/15
          bg-white/5
          p-3
          text-white
          placeholder:text-slate-400
          backdrop-blur-xl
          transition
          focus:border-blue-400/40
          focus:bg-white/10
          focus:outline-none
        "
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}