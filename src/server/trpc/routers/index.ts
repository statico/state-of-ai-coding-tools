import { router } from "../trpc";
import { authRouter } from "./auth";
import { resultsRouter } from "./results";
import { surveyRouter } from "./survey";

export const appRouter = router({
  auth: authRouter,
  survey: surveyRouter,
  results: resultsRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
