import { router } from "../trpc";

export const appRouter = router({
  // Survey routes will be added here
});

// Export type definition of API
export type AppRouter = typeof appRouter;
