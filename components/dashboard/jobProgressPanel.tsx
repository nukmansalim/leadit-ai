"use client";

import { fetchSearchJob } from "@/lib/dashboard/queries";
import type { DashboardSearchJob } from "@/lib/dashboard/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type JobProgressPanelProps = {
  jobs: DashboardSearchJob[];
  activeJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onCompleted: () => void;
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  processing: "default",
  completed: "outline",
  failed: "destructive",
};

export function JobProgressPanel({
  jobs,
  activeJobId,
  onSelectJob,
  onCompleted,
}: JobProgressPanelProps) {
  const completedJobIdsRef = useRef<Set<string>>(new Set());
  const activeJobFromList = jobs.find((job) => job.id === activeJobId) ?? null;

  const jobQuery = useQuery({
    queryKey: ["search-job", activeJobId],
    queryFn: () => fetchSearchJob(activeJobId as string),
    enabled:
      Boolean(activeJobId) &&
      !["completed", "failed"].includes(activeJobFromList?.status ?? ""),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2500;
    },
  });

  const activeJob = jobQuery.data ?? activeJobFromList;

  useEffect(() => {
    if (!jobQuery.data || !activeJobId) return;

    if (["completed", "failed"].includes(jobQuery.data.status)) {
      if (!completedJobIdsRef.current.has(activeJobId)) {
        completedJobIdsRef.current.add(activeJobId);
        onCompleted();
      }
    }
  }, [jobQuery.data, activeJobId, onCompleted]);

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live job progress</CardTitle>
        {jobQuery.isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No jobs yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {jobs.slice(0, 6).map((job) => {
              const isSelected = activeJob?.id === job.id;
              const progress = isSelected ? activeJob.progress : job.progress;

              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => onSelectJob(job.id)}
                  className="rounded-2xl border p-4 text-left transition hover:bg-muted/50 data-[selected=true]:border-primary"
                  data-selected={isSelected}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={statusVariant[job.status] ?? "secondary"}>
                      {job.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4">
                    <Progress value={progress} />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Progress</p>
                      <p className="font-medium">{progress}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Businesses</p>
                      <p className="font-medium">{job.total_businesses}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Leads</p>
                      <p className="font-medium">{job.leads_generated}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {activeJob?.error_message ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Job failed</AlertTitle>
            <AlertDescription>{activeJob.error_message}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
