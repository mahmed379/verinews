import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useSubmitArticle } from "../../hooks/useArticles";


export function ArticleSubmitForm() {

  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");

  const { mutate, isPending } = useSubmitArticle();

  const navigate = useNavigate();


  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    mutate(
      {
        title,
        source_url: sourceUrl,
        description,
        category,
      },
      {
        onSuccess: (article) => {
          navigate(`/articles/${article.id}`);
        },
      }
    );
  }


  const inputClass = `
    w-full
    rounded-xl
    border
    border-white/20
    bg-white/10
    px-4
    py-3
    text-white
    placeholder:text-slate-400
    backdrop-blur
    focus:outline-none
    focus:ring-2
    focus:ring-primary/40
  `;


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <div>
        <label className="block mb-2 font-medium text-white">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
          placeholder="Enter article title"
        />
      </div>


      <div>
        <label className="block mb-2 font-medium text-white">
          Source URL
        </label>

        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          required
          className={inputClass}
          placeholder="https://example.com/news"
        />
      </div>


      <div>
        <label className="block mb-2 font-medium text-white">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="politics">Politics</option>
          <option value="technology">Technology</option>
          <option value="health">Health</option>
          <option value="business">Business</option>
          <option value="other">Other</option>
        </select>
      </div>


      <div>
        <label className="block mb-2 font-medium text-white">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className={inputClass}
          placeholder="Briefly describe the news..."
        />
      </div>


      <button
        type="submit"
        disabled={isPending}
        className="
          w-full
          rounded-xl
          bg-primary
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:opacity-90
          disabled:opacity-50
        "
      >
        {isPending ? "Submitting..." : "Submit Article"}
      </button>

    </form>
  );
}