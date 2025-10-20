import { getOrCreateSession } from "@/lib/models/sessions";
import { initTRPC } from "@trpc/server";
import { parse } from "cookie";

export interface Context {
  sessionId?: string;
}

export const createContext = async (opts: {
  req?: Request;
}): Promise<Context> => {
  let sessionId: string | undefined;

  if (opts.req) {
    // Read sessionId from cookie using the cookie parser
    const cookieHeader = opts.req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const sessionCookie = cookies.sessionId;

    sessionId = await getOrCreateSession(sessionCookie);
  } else {
    sessionId = await getOrCreateSession();
  }

  return {
    sessionId,
  };
};

const t = initTRPC.context<Context>().create({
  errorFormatter: ({ error, type, path, input, ctx, shape }) => {
    console.error("TRPC error:", { error, type, path, input, ctx });
    return {
      ...shape,
      message: error.message,
      code: error.code,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const userProcedure = t.procedure;
