import { getOrCreateSession } from "@/lib/models/sessions";
import { Env, getEnv } from "@/server/env";
import { initTRPC, TRPCError } from "@trpc/server";
import { parse } from "cookie";

export interface Context {
  sessionId?: string;
  isAuthenticated: boolean;
  setAuthCookie?: boolean;
}

export const createContext = async (opts: { req?: Request }): Promise<Context> => {
  let sessionId: string | undefined;
  let isAuthenticated = false;

  if (opts.req) {
    // Read cookies using the cookie parser
    const cookieHeader = opts.req.headers.get("cookie");
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const sessionCookie = cookies.sessionId;
    const surveyAuthCookie = cookies.surveyAuth;

    sessionId = await getOrCreateSession(sessionCookie);

    // Validate survey password
    if (surveyAuthCookie) {
      try {
        const expectedPassword = getEnv(Env.SURVEY_PASSWORD);
        isAuthenticated = surveyAuthCookie === expectedPassword;
      } catch {
        // SURVEY_PASSWORD not set, authentication fails
        isAuthenticated = false;
      }
    }
  } else {
    sessionId = await getOrCreateSession();
  }

  return {
    sessionId,
    isAuthenticated,
    setAuthCookie: false,
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

export const userProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Survey password required",
    });
  }
  return next();
});

// Helper to set auth cookie flag in context
export const setAuthCookieFlag = (ctx: Context) => {
  ctx.setAuthCookie = true;
};
