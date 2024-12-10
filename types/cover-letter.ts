// @/types/cover-letter.ts
export interface GeneratedResponse {
    id: string;
    content: string;
    matching_score: number;
    metadata?: {
      company_name?: string;
      job_title?: string;
      generated_at: string;
    };
  }