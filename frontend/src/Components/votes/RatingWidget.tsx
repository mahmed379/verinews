import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  useCastVote,
  useMyVote,
} from "../../hooks/useVotes";
import useAuth from "../../hooks/useAuth";

interface RatingWidgetProps {
  articleId: number;
}

export function RatingWidget({
  articleId,
}: RatingWidgetProps) {

  const { user } = useAuth();

  const { data: myVote } =
    useMyVote(articleId);

  const [selected, setSelected] =
    useState<number | null>(null);

  const {
    mutate,
    isPending,
  } = useCastVote(articleId);

  useEffect(() => {
    if (myVote) {
      setSelected(myVote.rating);
    }
  }, [myVote]);

  if (!user) {
    return (
      <p className="text-sm text-slate-500">
        <Link
          to="/login"
          className="text-primary hover:underline"
        >
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
          className={`h-10 w-10 rounded-xl border font-semibold transition ${
            selected === value
              ? "border-blue-500 bg-blue-600 text-white shadow-lg"
              : `
                border-white/15
                bg-white/5
                text-slate-200
                hover:border-blue-400/40
                hover:bg-white/10
              `
          }`}
        >
          {value}
        </button>

      ))}

      <span className="ml-3 text-sm text-slate-400">
        {isPending
          ? "Saving..."
          : myVote
          ? "Update your rating"
          : "Rate 1–5"}
      </span>

    </div>
  );
}