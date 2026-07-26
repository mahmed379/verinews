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
  moderation_flag: ModerationFlag | null;
}
export type ReportStatus =
  | "open"
  | "resolved"
  | "dismissed";



export interface ModerationFlag {
  is_flagged: boolean;
  score: number;
  reasons: string[];
  flagger_version: string;
}

export interface Report {
  id: number;
  article: number;
  article_title: string;
  reason: string;
  details: string;
  status: ReportStatus;
  reported_by: string;
  moderation_flag: ModerationFlag | null;
  created_at: string;
}

export interface ArticleSummary {
  summary: string;
  key_points: string[];
  claims: string[];
  summarizer_version: string;
  created_at: string;
}

export interface CommentModerationFlag {
  is_flagged: boolean;
  reasons: string[];
}

export interface Comment {
  id: number;
  article: number;
  author: string;
  body: string;
  moderation_flag: CommentModerationFlag | null;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: number;
  article: number;
  rating: 1 | 2 | 3 | 4 | 5;
  voter: string;
  created_at: string;
}