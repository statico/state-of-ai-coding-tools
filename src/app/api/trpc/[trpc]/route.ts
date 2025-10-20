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
      return {
        headers: {
          "Set-Cookie": serialize("sessionId", ctx.sessionId || "", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
          }),
        },
      };
    },
  });

export { handler as GET, handler as POST };
