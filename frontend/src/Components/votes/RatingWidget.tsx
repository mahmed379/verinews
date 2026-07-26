import { Link } from "react-router-dom";
import { useState } from "react";

import { useCastVote } from "../../hooks/useVotes";
import useAuth from "../../hooks/useAuth";

interface RatingWidgetProps {
  articleId: number;
}

export function RatingWidget({ articleId }: RatingWidgetProps) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<number | null>(null);

  const { mutate, isPending } = useCastVote(articleId);

  if (!user) {
    return (
      <p className="text-sm text-slate-500">
        <Link to="/login" className="text-primary hover:underline">
          Log in
        </Link>{" "}
        to rate this article.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={isPending}
          onClick={() => {
            setSelected(value);
            mutate(value as 1 | 2 | 3 | 4 | 5);
          }}
          className={`h-10 w-10 rounded-lg border font-medium transition ${
            selected === value
              ? "bg-primary border-primary text-white"
              : "border-slate-300 bg-white hover:border-primary"
          }`}
        >
          {value}
        </button>
      ))}

      <span className="ml-2 text-sm text-slate-500">
        {isPending ? "Saving..." : "Rate 1–5"}
      </span>
    </div>
  );
}