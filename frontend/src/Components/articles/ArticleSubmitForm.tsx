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


  return (
    <form
      onSubmit={handleSubmit}
      className="solid-card p-6 space-y-4"
    >

      <div>
        <label className="block mb-1">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>


      <div>
        <label className="block mb-1">
          Source URL
        </label>

        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
          placeholder="https://example.com/news"
        />
      </div>


      <div>
        <label className="block mb-1">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="politics">Politics</option>
          <option value="technology">Technology</option>
          <option value="health">Health</option>
          <option value="business">Business</option>
          <option value="other">Other</option>
        </select>
      </div>


      <div>
        <label className="block mb-1">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>


      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-white px-6 py-2 rounded-lg"
      >
        {isPending ? "Submitting..." : "Submit Article"}
      </button>

    </form>
  );
}   