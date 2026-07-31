import { ModerationFlagCard } from "../Components/ai/ModerationFlagCard";

import { Link, useParams } from "react-router-dom";

import { useArticle } from "../hooks/useArticles";
import { StatusBadge } from "../Components/ui/StatusBadge";
import { GlassCard } from "../Components/ui/GlassCard";
import { CredibilitySignalsCard } from "../Components/ai/CredibilitySignalsCard";
import { ArticleSummaryCard } from "../Components/ai/ArticleSummaryCard";

import { RatingWidget } from "../Components/votes/RatingWidget";

import { CommentForm } from "../Components/comments/CommentForm";
import { CommentList } from "../Components/comments/CommentList";

import { useState } from "react";
import { ReportModal } from "../Components/reports/ReportModal";
import { useCreateReport } from "../hooks/useReports";



import useAuth from "../hooks/useAuth";

import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "../hooks/useComments";

export default function ArticleDetailPage() {

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [reportOpen, setReportOpen] = useState(false);

  const {
    data: article,
    isLoading,
    isError,
  } = useArticle(id);

  const articleId = article?.id ?? 0;
  const averageRating = article?.average_rating ?? 0;
  const filledStars = Math.floor(averageRating);
  const stars =
    "★".repeat(filledStars) +
    "☆".repeat(5 - filledStars);

  const { data: comments = [] } = useComments(articleId);

  const createCommentMutation =
    useCreateComment(articleId);

  const updateCommentMutation =
    useUpdateComment(articleId);

  const deleteCommentMutation =
    useDeleteComment(articleId);
  const createReportMutation =
    useCreateReport();

  if (isLoading) {
    return (
      <div className="glass-card max-w-xl mx-auto mt-10 p-6 text-center">
        Loading...
      </div>
    );
  }



  if (isError || !article) {

    return (
      <div className="glass-card max-w-xl mx-auto mt-10 p-6 text-center">
        Article not found.
      </div>
    );
  }
  function handleCreateComment(body: string) {
  createCommentMutation.mutate(body);
}

  function handleUpdateComment(
    commentId: number,
    body: string
  ) {
    updateCommentMutation.mutate({
      id: commentId,
      body,
    });
  }

  function handleDeleteComment(commentId: number) {
    if (
      window.confirm(
        "Are you sure you want to delete this comment?"
      )
    ) {
      deleteCommentMutation.mutate(commentId);
    }
  }

  function handleReport(
    reason: string,
    details: string
  ) {
    createReportMutation.mutate(
      {
        article: articleId,
        reason,
        details,
      },
      {
        onSuccess: () => {
          setReportOpen(false);
        },
      }
    );
  }

  return (
    <>
    <div className="max-w-5xl mx-auto px-4 py-10">


      <GlassCard className="mb-6 p-6">

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Article
        </p>

        <div className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:justify-between
          sm:items-start
        ">

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            {article.title}
          </h1>

          <StatusBadge status={article.status} />

        </div>


        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
            
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {article.category}
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Submitted by {article.submitted_by?.display_name}
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {new Date(article.created_at).toLocaleDateString()}
          </span>

        </div>

      </GlassCard>

      <GlassCard className="p-6">

        <p className="text-slate-200 whitespace-pre-line">
          {article.description}
        </p>


        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-6
            inline-flex
            items-center
            rounded-2xl
            border
            border-blue-400/30
            bg-blue-500/10
            px-5
            py-3
            text-sm
            font-semibold
            text-blue-300
            transition
            hover:bg-blue-500/20 hover:-translate-y-0.5
          "
        >
          View Original Source →
        </a>


      </GlassCard>

      {user && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setReportOpen(true)}
           className="
            rounded-xl
            border
            border-red-400/30
            bg-red-500/10
            px-4
            py-2
            text-red-600
            hover:bg-red-500/20
            transition
            "
          >
            Report Article
          </button>
        </div>
      )}

      <div className="mt-8 space-y-8">
        <ArticleSummaryCard summary={article.ai_summary} />

        <ModerationFlagCard
          flag={article.moderation_flag}
        />

        <CredibilitySignalsCard
          analysis={article.ai_analysis}
        />
      </div>

      <GlassCard className="mt-6 p-6">

        <h2 className="text-xl font-bold text-white text-center">
          Credibility Score
        </h2>


        {
          article.vote_count > 0 ? (

            <div className="mt-5 flex flex-col items-center text-center">

              <div className="mb-3 text-3xl tracking-wide text-yellow-400">
                {stars}
              </div>

              <p className="text-5xl font-bold text-secondary">
                {article.average_rating?.toFixed(1)}
                <span className="text-2xl text-slate-400"> / 5</span>
              </p>

              <p className="mt-3 text-lg font-medium text-slate-300">
                {Math.round(((article.average_rating ?? 0) / 5) * 100)}% Credibility
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {article.vote_count} Community Votes
              </p>

            </div>

          ) : (

            <p className="mt-6 text-center text-slate-400">
              No community ratings yet.
              <br />
              Be the first to rate this article.
            </p>

          )
        }


      </GlassCard>

    

      <GlassCard className="mt-6 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          Comments
        </h2>

        {user ? (
          <CommentForm
            isSubmitting={createCommentMutation.isPending}
            onSubmit={handleCreateComment}
          />
        ) : (
          <p className="mb-4 text-slate-500">
            Log in to leave a comment.
          </p>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <CommentList
            comments={comments}
            currentUsername={user?.username}
            isStaff={user?.is_staff}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
          />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="mb-2 text-2xl font-bold text-white">
          Share Your Rating
        </h2>

        <p className="mb-5 text-sm text-slate-400">
          Your rating helps other readers judge the credibility of this article.
        </p>

        <RatingWidget articleId={article.id} />
      </GlassCard>

      <div className="mt-6">

        <Link
          to="/articles"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/20
            bg-white/5
            px-5
            py-2
            font-medium
            text-blue-300
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-white/10
            hover:text-white
          "
        >
          ← Back to feed
        </Link>

      </div>

    </div>

    <ReportModal
      open={reportOpen}
      isSubmitting={createReportMutation.isPending}
      onClose={() => setReportOpen(false)}
      onSubmit={handleReport}
    />
    </>

  );
}