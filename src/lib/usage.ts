import { RateLimiterPrisma } from "rate-limiter-flexible";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 5;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
const GENERATION_COST = 1;

export async function getUsageTracker() {
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "pro" });

  const usageTracer = new RateLimiterPrisma({
    storeClient: db,
    tableName: "Usage",
    points: hasPremiumAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });

  return usageTracer;
}

export async function consumeCredits() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);

  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);

  return result;
}
