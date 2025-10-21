import { router } from "../trpc";
import { authRouter } from "./auth";
import { surveyRouter } from "./survey";

export const appRouter = router({
  auth: authRouter,
  survey: surveyRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
