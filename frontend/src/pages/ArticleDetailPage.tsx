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

    <div className="max-w-4xl mx-auto px-4 py-8">


      <GlassCard className="mb-6 p-6">

        <div className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:justify-between
          sm:items-start
        ">

          <h1 className="text-3xl font-bold text-white">
            {article.title}
          </h1>

          <StatusBadge status={article.status} />

        </div>


        <p className="text-sm text-slate-500 mt-3">

          {article.category} · submitted by{" "}
          {article.submitted_by}

          {" on "}

          {new Date(
            article.created_at
          ).toLocaleDateString()}

        </p>

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
            rounded-xl
            border
            border-blue-400/30
            bg-blue-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-blue-300
            transition
            hover:bg-blue-500/20
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

      <div className="mt-8 space-y-6">
        <ArticleSummaryCard summary={article.ai_summary} />

        <ModerationFlagCard
          flag={article.moderation_flag}
        />

        <CredibilitySignalsCard
          analysis={article.ai_analysis}
        />
      </div>

      <GlassCard className="mt-6 p-6">

        <h2 className="font-semibold text-white mb-1">
          Credibility Score
        </h2>


        {
          article.vote_count > 0 ? (

            <p className="text-2xl font-bold text-secondary">

              {article.average_rating?.toFixed(1)}
              {" / 5 "}


              <span className="text-sm font-normal text-slate-500">

                (
                {
                  Math.round(
                    ((article.average_rating ?? 0) / 5) * 100
                  )
                }%
                )
                {" · "}
                {article.vote_count} votes

              </span>

            </p>

          ) : (

            <p className="text-slate-500">
              No votes yet.
            </p>

          )
        }


      </GlassCard>



      <GlassCard className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
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

        <div className="mt-6">
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
        <h2 className="font-semibold text-white mb-2">
          Rate This Article
        </h2>

        <RatingWidget articleId={article.id} />
      </GlassCard>

      <div className="mt-6">

        <Link
          to="/articles"
          className="
            inline-flex
            items-center
            text-blue-300
            transition
            hover:text-white
          "
        >
          ← Back to feed
        </Link>

      </div>

      <ReportModal
        open={reportOpen}
        isSubmitting={createReportMutation.isPending}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReport}
      />
    </div>

  );
}