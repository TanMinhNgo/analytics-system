const { Queue, Worker, QueueScheduler } = require("bullmq");

const { env } = require("../config/env");
const { logger } = require("../config/logger");
const { etlEvents } = require("./etl-events");

let queue;
let worker;
let scheduler;

const steps = ["SELECT", "EXTRACT", "TRANSFORM", "INTEGRATE", "LOAD"];

async function initQueues() {
  if (queue) {
    return queue;
  }

  queue = new Queue("etl", { connection: { url: env.REDIS_URL } });
  scheduler = new QueueScheduler("etl", { connection: { url: env.REDIS_URL } });

  worker = new Worker(
    "etl",
    async (job) => {
      const results = [];
      for (const step of steps) {
        etlEvents.emit("progress", {
          jobId: job.id,
          step,
          status: "running",
          at: new Date().toISOString(),
        });
        await new Promise((resolve) => setTimeout(resolve, 600));
        results.push(step);
        etlEvents.emit("progress", {
          jobId: job.id,
          step,
          status: "completed",
          at: new Date().toISOString(),
        });
      }

      return {
        jobId: job.id,
        steps: results,
        rowsProcessed: Math.floor(Math.random() * 200_000) + 10_000,
      };
    },
    { connection: { url: env.REDIS_URL } }
  );

  worker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "ETL job completed");
  });

  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, err }, "ETL job failed");
  });

  await scheduler.waitUntilReady();
  await worker.waitUntilReady();

  return queue;
}

async function addEtlJob(payload) {
  if (!queue) {
    await initQueues();
  }

  return queue.add("etl-run", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  });
}

async function getJob(jobId) {
  if (!queue) {
    await initQueues();
  }

  return queue.getJob(jobId);
}

module.exports = {
  initQueues,
  addEtlJob,
  getJob,
  steps,
};
