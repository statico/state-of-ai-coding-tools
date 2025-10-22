"use client";

import { SurveyHeader } from "@/components/survey-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function OutroPage() {
  const router = useRouter();

  const handleViewResults = () => {
    // TODO: Implement results viewing
    alert("Results viewing will be implemented in a future update");
  };

  const handleStartOver = () => {
    router.push("/survey/demographics");
  };

  return (
    <div className="contaner mx-auto max-w-4xl px-4 py-20">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Your responses have been saved and will contribute to the
            community's understanding of AI coding tools.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={handleViewResults}>
            View Results (Coming Soon)
          </Button>
          <Button size="lg" onClick={handleStartOver} variant="outline">
            Change My Responses
          </Button>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Come back next week!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This survey operates on a weekly cycle, resetting every Monday at
              12:00 AM UTC. This allows us to track changes in the AI coding
              landscape over time.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Current Week</h3>
                <p className="text-muted-foreground text-sm">
                  Your responses are counted towards the current week's results.
                  You can return anytime to update your responses.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Next Week</h3>
                <p className="text-muted-foreground text-sm">
                  The survey will reset on Monday, and you can provide fresh
                  responses based on your current tool usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
