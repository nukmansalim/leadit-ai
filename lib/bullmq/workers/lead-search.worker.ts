import { Worker } from "bullmq";
import { createRedisConnection } from "@/lib/bullmq/connection";
import { LEAD_SEARCH_QUEUE_NAME } from "@/lib/bullmq/queue";
import type {
  LeadSearchJobData,
  LeadSearchJobResult,
} from "@/lib/bullmq/types";
import { runLeadSearch } from "@/lib/services/lead-search.service";

export function createLeadSearchWorker(): Worker<
  LeadSearchJobData,
  LeadSearchJobResult
> {
  const connection = createRedisConnection();

  return new Worker<LeadSearchJobData, LeadSearchJobResult>(
    LEAD_SEARCH_QUEUE_NAME,
    async (job) => {
      await job.updateProgress(10);

      const result = await runLeadSearch(job.data, {
        onProgress: async (progress) => {
          await job.updateProgress(progress);
        },
      });

      await job.updateProgress(100);

      return result;
    },
    {
      connection: connection as any,
      concurrency: 3,
      limiter: {
        max: 10,
        duration: 60_000,
      },
    },
  );
}
