"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: firstSection } = useQuery(
    trpc.survey.getFirstSection.queryOptions(),
  );

  const handleStartSurvey = () => {
    if (
      firstSection &&
      typeof firstSection === "object" &&
      "slug" in firstSection
    ) {
      router.push(`/survey/${firstSection.slug}`);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">About This Survey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This survey is designed to capture your preferences, adoption
              rates, and experiences with various AI coding assistants, IDEs,
              and LLMs. Your responses help provide insights through real-time
              results visualization and trend analysis over time.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">What We Track</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• AI tool adoption over time</li>
                  <li>• Developer sentiment and satisfaction</li>
                  <li>• Tool popularity and trends</li>
                  <li>• Community insights and feedback</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Survey Features</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Weekly cadence (resets every Monday)</li>
                  <li>• Anonymous responses</li>
                  <li>• Auto-save functionality</li>
                  <li>• Pre-filled from previous weeks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy & Data Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>This survey is for a private community</strong> of
              engineering leaders and technology-focused professionals. The data
              collected is not shared publicly and is used solely for community
              insights.
            </p>
            <p>
              <strong>Follow the community's code of conduct</strong> in regards
              to responses and sharing information. Keep responses professional,
              and use the Chatham House Rule when sharing information outside of
              the community.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleStartSurvey}
            className="px-8"
            disabled={!firstSection}
          >
            Let's Go! <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
