import { router, userProcedure } from "../trpc";

export const appRouter = router({
  // Test procedure to demonstrate userProcedure with automatic session management
  getSession: userProcedure.query(({ ctx }) => {
    return {
      sessionId: ctx.sessionId,
    };
  }),

  // Survey routes will be added here
});

// Export type definition of API
export type AppRouter = typeof appRouter;
