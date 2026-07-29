import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useDebouncedValue } from "../../hooks/useDebouncedValue";


const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending Review" },
  { value: "verified", label: "Verified" },
  { value: "disputed", label: "Disputed" },
  { value: "false", label: "Marked False" },
];


const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "politics", label: "Politics" },
  { value: "technology", label: "Technology" },
  { value: "health", label: "Health" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

const selectClass = `
  rounded-xl
  border
  border-white/20
  bg-white/5
  px-3
  py-2
  text-white
  backdrop-blur-xl
  outline-none
  focus:border-blue-400/50
`;

export function ArticleFilterBar() {

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("q") ?? ""
  );

  const debouncedSearch = useDebouncedValue(
    searchInput,
    400
  );


  useEffect(() => {

    setSearchParams((prev) => {

      const next = new URLSearchParams(prev);

      if (debouncedSearch) {
        next.set("q", debouncedSearch);
      } else {
        next.delete("q");
      }

      next.delete("page");

      return next;
    });

  }, [debouncedSearch, setSearchParams]);



  function updateParam(
    key: string,
    value: string
  ) {

    setSearchParams((prev) => {

      const next = new URLSearchParams(prev);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      next.delete("page");

      return next;

    });
  }


  return (

    <div
      className="
        glass-card
        p-4
        mb-6
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:flex-wrap
      "
    >

      <input
        value={searchInput}
        onChange={(e) =>
          setSearchInput(e.target.value)
        }
        placeholder="Search title or description..."
        className="
          flex-1
          min-w-[200px]
          rounded-xl
          border
          border-white/20
          bg-white/5
          px-3
          py-2
          text-white
          placeholder:text-slate-400
          outline-none
          backdrop-blur-xl
          focus:border-blue-400/50
        "
      />


      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) =>
          updateParam("status", e.target.value)
        }
        className={selectClass}
      >

        {STATUS_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-900 text-white"
          >
            {option.label}
          </option>
        ))}

      </select>



      <select
        value={searchParams.get("category") ?? ""}
        onChange={(e) =>
          updateParam("category", e.target.value)
        }
        className={selectClass}
      >

        {CATEGORY_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-900 text-white"
          >
            {option.label}
          </option>
        ))}

      </select>



      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) =>
          updateParam("sort", e.target.value)
        }
        className={selectClass}
      >
        <option
          value="newest"
          className="bg-slate-900 text-white"
        >
          Newest first
        </option>

        <option
          value="oldest"
          className="bg-slate-900 text-white"
        >
          Oldest first
        </option>

        <option
          value="top_rated"
          className="bg-slate-900 text-white"
        >
          Highest rated
        </option>
      </select>

    </div>

  );
}
