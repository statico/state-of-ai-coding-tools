import { Env, getEnv } from "@/server/env";
import { appRouter } from "@/server/trpc/routers";
import { createContext } from "@/server/trpc/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { serialize } from "cookie";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
    responseMeta({ ctx }) {
      const cookies: string[] = [];

      if (!ctx) {
        return {
          headers: {
            "Set-Cookie": cookies,
          },
        };
      }

      // Always set sessionId cookie
      if (ctx.sessionId) {
        cookies.push(
          serialize("sessionId", ctx.sessionId, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
          }),
        );
      }

      // Set surveyAuth cookie if login was successful
      if (ctx.setAuthCookie) {
        try {
          const surveyPassword = getEnv(Env.SURVEY_PASSWORD);
          cookies.push(
            serialize("surveyAuth", surveyPassword, {
              path: "/",
              httpOnly: true,
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 365, // 1 year
            }),
          );
        } catch {
          // SURVEY_PASSWORD not set, don't set cookie
        }
      }

      return {
        headers: {
          "Set-Cookie": cookies,
        },
      };
    },
  });

export { handler as GET, handler as POST };
