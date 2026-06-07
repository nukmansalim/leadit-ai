"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { CreateSearchJobCard } from "./searchJobForm";
import { JobProgressPanel } from "./jobProgressPanel";
import { LeadsTable } from "./leadsTable";
import { fetchLeads, type LeadFilters } from "@/lib/dashboard/queries";
import type { DashboardLead, DashboardSearchJob } from "@/lib/dashboard/types";

type DashboardShellProps = {
  initialJobs: DashboardSearchJob[];
  initialLeads: DashboardLead[];
};

const defaultFilters: LeadFilters = {
  sort: "newest",
};

export function DashboardShell({
  initialJobs,
  initialLeads,
}: DashboardShellProps) {
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const queryKey = useMemo(() => ["leads", filters], [filters]);

  const leadsQuery = useQuery({
    queryKey,
    queryFn: () => fetchLeads(filters),
    initialData: {
      success: true,
      jobs: initialJobs,
      leads: initialLeads,
    },
  });

  const jobs = leadsQuery.data.jobs;
  const leads = leadsQuery.data.leads;

  const handleCreated = useCallback((jobId: string) => {
    setActiveJobId(jobId);
    setFilters((current) => ({ ...current, jobId }));
  }, []);

  const handleSelectJob = useCallback((jobId: string) => {
    setActiveJobId(jobId);
    setFilters((current) => ({ ...current, jobId }));
  }, []);

  const handleCompleted = useCallback(() => {
    void leadsQuery.refetch();
  }, [leadsQuery]);

  const handleRefresh = useCallback(() => {
    void leadsQuery.refetch();
  }, [leadsQuery]);

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border bg-background p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Leadit AI Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              Lead search, scoring, outreach, and export in one workflow.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Create search jobs, monitor worker progress, filter leads by
              opportunity, and export sales-ready CSV files.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <CreateSearchJobCard
            onCreated={handleCreated}
          />

          <JobProgressPanel
            jobs={jobs}
            activeJobId={activeJobId}
            onSelectJob={handleSelectJob}
            onCompleted={handleCompleted}
          />
        </section>

        <LeadsTable
          leads={leads}
          jobs={jobs}
          filters={filters}
          isLoading={leadsQuery.isFetching}
          onFiltersChange={setFilters}
          onRefresh={handleRefresh}
        />
      </div>
    </main>
  );
}
