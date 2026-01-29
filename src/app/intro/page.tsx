"use client";

import { SurveyHeader } from "@/components/SurveyHeader";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IntroPage() {
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

  const { data: firstSection } = useQuery(trpc.survey.getFirstSection.queryOptions());

  const handleStartSurvey = () => {
    if (firstSection && typeof firstSection === "object" && "slug" in firstSection) {
      router.push(`/survey/${firstSection.slug}`);
    }
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

      <div className="mx-auto max-w-lg space-y-8 pt-8 pb-20 md:pt-20">
        <h1 className="text-center text-5xl font-bold">Welcome!</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-2xl text-balance">
          Welcome to the AI Coding Tools Weekly Survey! Come back every week to share your thoughts
          and see how the community's opinions evolve over time.
        </p>

        <Alert>
          <TriangleAlertIcon className="mt-1 size-4" />
          <AlertTitle className="text-lg">Notice</AlertTitle>
          <AlertDescription className="text-base">
            This survey is intended to be used only by members of the private community in which it
            was shared. This is an unofficial open-source project, so we're not naming the
            community, but the rules of the community still apply.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center text-center">
          <Button
            size="lg"
            onClick={handleStartSurvey}
            className="w-full px-8! md:w-auto"
            disabled={!firstSection}
          >
            Let's Go! <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
