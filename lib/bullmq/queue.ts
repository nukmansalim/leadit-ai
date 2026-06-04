import { Queue, type JobsOptions } from "bullmq";
import { createRedisConnection } from "@/lib/bullmq/connection";
import type {
  LeadSearchJobData,
  LeadSearchJobResult,
} from "@/lib/bullmq/types";

export const LEAD_SEARCH_QUEUE_NAME = "lead-search";

const connection = createRedisConnection();

const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5_000,
  },
  removeOnComplete: {
    age: 60 * 60 * 24,
    count: 500,
  },
  removeOnFail: {
    age: 60 * 60 * 24 * 7,
    count: 1_000,
  },
};

export const leadSearchQueue = new Queue<
  LeadSearchJobData,
  LeadSearchJobResult
>(LEAD_SEARCH_QUEUE_NAME, {
  connection: connection as any,
  defaultJobOptions,
});

export async function addLeadSearchJob(
  data: LeadSearchJobData,
): Promise<string> {
  const job = await leadSearchQueue.add("lead-search", data);

  if (!job.id) {
    throw new Error("Failed to create lead search job");
  }

  return job.id;
}
