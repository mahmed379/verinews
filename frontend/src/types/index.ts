export interface AIFactor {
  label: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
  points: number;
}

export interface AIAnalysis {
  score: number;
  risk_level: "low" | "medium" | "high";
  factors: AIFactor[];
  suggested_steps: string[];
  analyzer_version: string;
  created_at: string;
}

export type ArticleStatus =
  | "pending"
  | "verified"
  | "disputed"
  | "false";

export interface NewsArticle {
  id: number;
  title: string;
  source_url: string;
  description: string;
  category: string;
  status: ArticleStatus;
  submitted_by: string;
  created_at: string;
  average_rating: number | null;
  vote_count: number;
  ai_analysis: AIAnalysis | null;
  ai_summary: ArticleSummary | null;
}
export type ReportStatus =
  | "open"
  | "resolved"
  | "dismissed";

export interface Report {
  id: number;
  article: number;
  article_title: string;
  reason: string;
  status: ReportStatus;
  reported_by: string;
  created_at: string;
}

export interface ArticleSummary {
  summary: string;
  key_points: string[];
  claims: string[];
  summarizer_version: string;
  created_at: string;
}

