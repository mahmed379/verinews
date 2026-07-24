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

    <div className="solid-card p-4 mb-6 flex flex-wrap gap-3">

      <input
        value={searchInput}
        onChange={(e) =>
          setSearchInput(e.target.value)
        }
        placeholder="Search title or description..."
        className="flex-1 min-w-[200px] border border-slate-300 rounded-lg px-3 py-2"
      />


      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) =>
          updateParam("status", e.target.value)
        }
        className="border border-slate-300 rounded-lg px-3 py-2"
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



      <select
        value={searchParams.get("category") ?? ""}
        onChange={(e) =>
          updateParam("category", e.target.value)
        }
        className="border border-slate-300 rounded-lg px-3 py-2"
      >

        {CATEGORY_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
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
        className="border border-slate-300 rounded-lg px-3 py-2"
      >

        <option value="newest">
          Newest first
        </option>

        <option value="oldest">
          Oldest first
        </option>

        <option value="top_rated">
          Highest rated
        </option>

      </select>

    </div>

  );
}
