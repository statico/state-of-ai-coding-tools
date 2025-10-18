import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "@/server/models/todos";
import { publicProcedure, router } from "@/server/trpc/trpc";
import { z } from "zod";

export const todosRouter = router({
  getAll: publicProcedure.query(async () => {
    return await getAllTodos();
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1).max(500) }))
    .mutation(async ({ input }) => {
      return await createTodo(input);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        text: z.string().min(1).max(500).optional(),
        completed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await updateTodo(input.id, input);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteTodo(input.id);
    }),
});
