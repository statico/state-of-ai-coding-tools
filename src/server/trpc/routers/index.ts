import { router } from "../trpc";
import { todosRouter } from "./todos";

export const appRouter = router({
  todos: todosRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
