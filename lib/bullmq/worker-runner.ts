import dotenv from "dotenv";
import path from "path";

// Load .env first, then override with .env.local if present
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

async function main() {
  const { createLeadSearchWorker } = await import(
    "@/lib/bullmq/workers/lead-search.worker"
  );
  const worker = await createLeadSearchWorker();

  worker.on("ready", () => {
    console.log("Lead search worker is ready");
  });

  worker.on("active", (job) => {
    console.log(`Processing lead search job: ${job.id}`);
  });

  worker.on("completed", (job, result) => {
    console.log(`Lead search job completed: ${job.id}`, result);
  });

  worker.on("failed", (job, error) => {
    console.error(`Lead search job failed: ${job?.id ?? "unknown"}`, error);
  });

  async function shutdown(): Promise<void> {
    console.log("Closing lead search worker...");

    await worker.close();

    process.exit(0);
  }

  process.on("SIGINT", () => {
    void shutdown();
  });

  process.on("SIGTERM", () => {
    void shutdown();
  });
}

main().catch((err) => {
  console.error("Worker failed to start:", err);
  process.exit(1);
});
