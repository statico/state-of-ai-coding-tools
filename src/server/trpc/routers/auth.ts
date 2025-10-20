import { Env, getEnv } from "@/server/env";
import { z } from "zod";
import { publicProcedure, router, setAuthCookieFlag } from "../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        password: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      try {
        const expectedPassword = getEnv(Env.SURVEY_PASSWORD);
        const isValid = input.password === expectedPassword;

        if (isValid) {
          setAuthCookieFlag(ctx);
        }

        return {
          success: isValid,
          message: isValid ? "Login successful" : "Invalid password",
        };
      } catch {
        return {
          success: false,
          message: "Survey password not configured",
        };
      }
    }),

  check: publicProcedure.query(({ ctx }) => {
    return {
      isAuthenticated: ctx.isAuthenticated,
      hasSession: !!ctx.sessionId,
    };
  }),
});
