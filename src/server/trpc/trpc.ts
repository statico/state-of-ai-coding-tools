import { initTRPC } from "@trpc/server";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create({
  errorFormatter: ({ error, type, path, input, ctx, shape }) => {
    console.error("TRPC error:", { error, type, path, input, ctx });
    return {
      ...shape,
      message: error.message,
      code: error.code,
    };
  },
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
