"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface FreeformReportProps {
  data: {
    responses: Array<{
      response: string;
      count: number;
    }>;
    totalCount: number;
  };
  totalResponses: number;
  skippedResponses: number;
}

export function FreeformReport({
  data,
  totalResponses,
  skippedResponses,
}: FreeformReportProps) {
  const [showAll, setShowAll] = useState(false);
  const displayResponses = showAll
    ? data.responses
    : data.responses.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Skipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skippedResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.responses.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Freeform Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Freeform Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {data.responses.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No freeform responses for this question.
            </div>
          ) : (
            <div className="space-y-4">
              {displayResponses.map((item, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{item.response}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {item.count} {item.count === 1 ? "time" : "times"}
                    </Badge>
                  </div>
                </div>
              ))}

              {data.responses.length > 10 && (
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-primary text-sm hover:underline"
                  >
                    {showAll
                      ? "Show less"
                      : `Show all ${data.responses.length} responses`}
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
