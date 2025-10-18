import { AppRouter } from "@/server/trpc/routers";
import { TRPCClientError } from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCContext, useSubscription } from "@trpc/tanstack-react-query";

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export { useSubscription };

/**
 * Type guard to check if an error is a tRPC client error
 */
export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

/**
 * Extract a user-friendly error message from a tRPC error
 */
export function getTRPCErrorMessage(error: unknown): string {
  // First, check if it's a proper TRPCClientError instance
  if (isTRPCClientError(error)) {
    // If error.data is undefined but we have meta.responseJSON, extract from there
    if (!error.data && (error.meta as any)?.responseJSON?.[0]?.error) {
      const nestedError = (error.meta as any).responseJSON[0].error;

      // Handle specific tRPC error codes with user-friendly messages
      const errorCode = nestedError.code;

      switch (errorCode) {
        case "UNAUTHORIZED":
          return "Please sign in to continue";
        case "FORBIDDEN":
          return "You don't have permission to perform this action";
        case "NOT_FOUND":
          return "The requested resource was not found";
        case "BAD_REQUEST":
          return nestedError.message || "Invalid request data";
        case "CONFLICT":
          return nestedError.message || "This resource already exists";
        case "INTERNAL_SERVER_ERROR":
          return "Something went wrong. Please try again later";
        case "TIMEOUT":
          return "Request timed out. Please try again";
        case "TOO_MANY_REQUESTS":
          return "Too many requests. Please wait a moment and try again";
        default:
          return nestedError.message || "An unexpected error occurred";
      }
    }

    // Handle specific tRPC error codes with user-friendly messages
    const errorCode = error.data?.code;

    switch (errorCode) {
      case "UNAUTHORIZED":
        return "Please sign in to continue";
      case "FORBIDDEN":
        return "You don't have permission to perform this action";
      case "NOT_FOUND":
        return "The requested resource was not found";
      case "BAD_REQUEST":
        return error.message || "Invalid request data";
      case "CONFLICT":
        return error.message || "This resource already exists";
      case "INTERNAL_SERVER_ERROR":
        return "Something went wrong. Please try again later";
      case "TIMEOUT":
        return "Request timed out. Please try again";
      case "TOO_MANY_REQUESTS":
        return "Too many requests. Please wait a moment and try again";
      default:
        return error.message || "An unexpected error occurred";
    }
  }

  // Handle serialized TRPCClientError objects (like the one you showed)
  if (
    error &&
    typeof error === "object" &&
    "name" in error &&
    (error as any).name === "TRPCClientError"
  ) {
    const err = error as any;
    // Try to get the message from the nested structure
    if (err.meta?.responseJSON?.[0]?.error?.message) {
      return err.meta.responseJSON[0].error.message;
    }
    // Fallback to direct message property
    if (err.message) {
      return err.message;
    }
  }

  // Handle the case where error has the nested structure from your example
  if (error && typeof error === "object" && "meta" in error) {
    const meta = (error as any).meta;
    if (meta?.responseJSON?.[0]?.error?.message) {
      return meta.responseJSON[0].error.message;
    }
  }

  // Fallback for non-tRPC errors
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
