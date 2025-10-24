"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [password, setPassword] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const trpc = useTRPC();

  // Poll auth.check when we're waiting for authentication
  const { data: authData, error: authError } = useQuery({
    ...trpc.auth.check.queryOptions(),
    enabled: isPolling,
    refetchInterval: 1000, // Poll every second
    refetchIntervalInBackground: false,
    retry: false, // Don't retry on error
  });

  // Check if we're authenticated and redirect
  useEffect(() => {
    if (authData?.isAuthenticated) {
      router.push("/intro");
    }
  }, [authData, router]);

  // Handle auth error by stopping polling
  useEffect(() => {
    if (authError && isPolling) {
      // Use setTimeout to defer the setState call
      const timeoutId = setTimeout(() => {
        setIsPolling(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [authError, isPolling]);

  // Stop polling after a timeout to prevent infinite polling
  useEffect(() => {
    if (isPolling) {
      const timeout = setTimeout(() => {
        setIsPolling(false);
        setError("Authentication timeout. Please try again.");
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isPolling]);

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: (data) => {
        if (data.success) {
          // Start polling for authentication status
          setIsPolling(true);
        } else {
          setError(data.message);
        }
      },
      onError: () => {
        setError("An error occurred. Please try again.");
      },
    }),
  );

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPolling(false); // Reset polling state
    loginMutation.mutate({ password });
  };

  if (isPolling && !authError) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Verifying authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">AI Coding Tools Weekly Survey</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-balance">
            Track the evolving landscape of AI-powered coding tools through
            weekly community feedback.
          </p>
        </div>

        <Card className="mx-auto max-w-lg">
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    className="flex-1"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <Button type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Verifying..." : "Access Survey"}
                  </Button>
                </div>
                {(error || authError) && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error ||
                        "Failed to verify authentication. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
