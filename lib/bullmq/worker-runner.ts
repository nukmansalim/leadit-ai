import { leadSearchWorker } from "@/app/workers/leadSearchWorkers";

console.log("🚀 [Worker] Lead Search Worker is starting...");
process.on("SIGTERM", async () => {
    console.log("Stopping worker...");
    await leadSearchWorker.close();
    process.exit(0);
});

console.log("✅ [Worker] Listening for jobs in Redis...");