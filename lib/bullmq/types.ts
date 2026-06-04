export interface LeadSearchJobData {
  jobId: string;
  userId: string;
  location: string;
  solutionFocus: string;
  ratingLimit?: string;
  websiteStatus?: boolean;
}

export interface LeadSearchJobResult {
  success: boolean;
  jobId: string;
  totalBusinesses: number;
  totalLeads: number;
  message?: string;
}

export interface LeadSearchProgressPayload {
  progress: number;
}
