"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">AI Coding Tools Weekly Survey</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Track the evolving landscape of AI-powered coding tools through
            weekly community feedback. Share your experiences and help the
            development community make informed decisions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">About This Survey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This survey captures developer preferences, adoption rates, and
              experiences across various AI coding assistants, IDEs, and LLMs.
              Your responses help provide insights through real-time results
              visualization and trend analysis over time.
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
                  <li>• Real-time results</li>
                  <li>• Historical trend analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The survey interface is currently under development. Once
              complete, you'll be able to:
            </p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>• Access the survey with a simple password</li>
              <li>• Complete questions about your AI coding tool usage</li>
              <li>• View aggregated results and trends</li>
              <li>• Track changes in the AI coding landscape over time</li>
            </ul>
            <div className="pt-4">
              <Button size="lg" disabled>
                Survey Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
