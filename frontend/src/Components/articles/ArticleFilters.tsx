import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { GlassSelect } from "../ui/GlassSelect";


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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "top_rated", label: "Highest rated" },
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

    <div
      className="
        glass-card
        relative
        z-20
        overflow-visible
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


      <GlassSelect
        value={searchParams.get("status") ?? ""}
        onChange={(value) => updateParam("status", value)}
        options={STATUS_OPTIONS}
        aria-label="Filter by status"
        className="sm:w-48"
      />



      <GlassSelect
        value={searchParams.get("category") ?? ""}
        onChange={(value) => updateParam("category", value)}
        options={CATEGORY_OPTIONS}
        aria-label="Filter by category"
        className="sm:w-48"
      />



      <GlassSelect
        value={searchParams.get("sort") ?? "newest"}
        onChange={(value) => updateParam("sort", value)}
        options={SORT_OPTIONS}
        aria-label="Sort by"
        className="sm:w-48"
      />

    </div>

  );
}
