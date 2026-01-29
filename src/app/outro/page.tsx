"use client";

import { SurveyHeader } from "@/components/SurveyHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlarmCheckIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function OutroPage() {
  const router = useRouter();
  const trpc = useTRPC();

  // Check authentication status
  const { data: authData } = useQuery(trpc.auth.check.queryOptions());
  const isAuthenticated =
    authData && typeof authData === "object" && "isAuthenticated" in authData
      ? authData.isAuthenticated
      : false;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authData && !isAuthenticated) {
      router.push("/");
    }
  }, [authData, isAuthenticated, router]);

  const handleViewResults = () => {
    router.push("/results");
  };

  const handleStartOver = () => {
    router.push("/survey/demographics");
  };

  // Show loading while checking authentication
  if (!authData) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <SurveyHeader />
      <div className="pt-8 pb-20 md:pt-20">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold">Thank You!</h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-2xl">
              Your responses have been saved and will contribute to the community's understanding of
              AI coding tools.
            </p>
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
            <Button size="lg" onClick={handleStartOver} variant="outline">
              <ArrowLeft className="size-4" />
              Change My Responses
            </Button>
            <Button size="lg" onClick={handleViewResults}>
              View Results
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Be sure to come back next week!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This survey operates on a weekly cycle, resetting every Monday at 12:00 AM UTC. This
                allows us to track changes in the AI coding landscape over time.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Current Week</h3>
                  <p className="text-muted-foreground text-base">
                    Your responses are counted towards the current week's results. You can return
                    anytime to update your responses.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Next Week</h3>
                  <p className="text-muted-foreground text-base">
                    The survey will reset on Monday, and you can provide fresh responses based on
                    your current tool usage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
