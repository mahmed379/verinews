export type ArticleStatus =
  | "pending"
  | "verified"
  | "disputed"
  | "false";

export interface NewsArticle {
  id: string;
  title: string;
  source_url: string;
  description: string;
  category: string;
  status: ArticleStatus;
  submitted_by: string;
  created_at: string;
  average_rating: number | null;
  vote_count: number;
}
export type ReportStatus =
  | "open"
  | "resolved"
  | "dismissed";

export interface Report {
  id: number;
  article: number;
  reason: string;
  status: ReportStatus;
  reported_by: string;
  created_at: string;
}