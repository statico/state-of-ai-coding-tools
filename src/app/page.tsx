"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const trpc = useTRPC();

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: (data) => {
        if (data.success) {
          setIsAuthenticated(true);
          // Redirect to intro page after a brief delay
          setTimeout(() => {
            router.push("/intro");
          }, 1000);
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
    loginMutation.mutate({ password });
  };

  if (isAuthenticated) {
    return (
      <AuroraBackground>
        <div className="container mx-auto max-w-4xl px-4 py-20">
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Redirecting you to the survey...
              </p>
            </div>
          </div>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">
              AI Coding Tools Weekly Survey
            </h1>
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
                      {loginMutation.isPending
                        ? "Verifying..."
                        : "Access Survey"}
                    </Button>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuroraBackground>
  );
}
