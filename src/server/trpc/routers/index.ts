import { router } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
  // Auth routes
  auth: authRouter,

  // Survey routes will be added here
});

// Export type definition of API
export type AppRouter = typeof appRouter;
