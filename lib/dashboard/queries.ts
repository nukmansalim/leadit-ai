import type {
  CreateSearchJobResponse,
  DashboardSearchJob,
  LeadsResponse,
} from "./types";

export type LeadFilters = {
  q?: string;
  jobId?: string;
  score?: string;
  website?: string;
  contact?: string;
  sort?: string;
};

export function toSearchParams(filters: LeadFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return params;
}

export async function fetchLeads(filters: LeadFilters): Promise<LeadsResponse> {
  const params = toSearchParams(filters);
  const response = await fetch(`/api/leads?${params.toString()}`, {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Failed to load leads.");
  }

  return payload;
}

export async function fetchSearchJob(jobId: string): Promise<DashboardSearchJob> {
  const response = await fetch(`/api/search/${jobId}`, {
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? payload.error ?? "Failed to load job.");
  }

  return payload;
}

export async function createSearchJob(input: {
  location: string;
  solutionFocus: string;
  websiteStatus?: boolean;
  digitalWeaknesses?: string[];
}): Promise<CreateSearchJobResponse> {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Failed to create search job.");
  }

  return payload;
}

export function getExportUrl(filters: LeadFilters) {
  const params = toSearchParams(filters);
  return `/api/leads/export?${params.toString()}`;
}
