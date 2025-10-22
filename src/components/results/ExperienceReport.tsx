"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ExperienceReportProps {
  data: {
    awareness: Array<{
      level: number;
      label: string;
      count: number;
      percentage: number;
    }>;
    sentiment: Array<{
      level: number;
      label: string;
      count: number;
      percentage: number;
    }>;
    combined: Array<{
      awareness: number;
      sentiment: number;
      count: number;
    }>;
  };
  totalResponses: number;
  skippedResponses: number;
}

export function ExperienceReport({
  data,
  totalResponses,
  skippedResponses,
}: ExperienceReportProps) {
  const awarenessChartData = data.awareness.map((item) => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
  }));

  const sentimentChartData = data.sentiment.map((item) => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
  }));

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
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalResponses > 0
                ? Math.round(
                    ((totalResponses - skippedResponses) / totalResponses) *
                      100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Awareness Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={awarenessChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [value, "Count"]} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={sentimentChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [value, "Count"]} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Awareness Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.awareness.map((item, index) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-sm">
                      {item.count} responses
                    </span>
                    <span className="text-sm font-medium">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.sentiment.map((item, index) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-sm">
                      {item.count} responses
                    </span>
                    <span className="text-sm font-medium">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combined Analysis */}
      {data.combined.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Combined Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.combined.map((item, index) => {
                const awarenessLabel =
                  data.awareness.find((a) => a.level === item.awareness)
                    ?.label || `Level ${item.awareness}`;
                const sentimentLabel =
                  data.sentiment.find((s) => s.level === item.sentiment)
                    ?.label || `Level ${item.sentiment}`;

                return (
                  <div
                    key={index}
                    className="bg-muted flex items-center justify-between rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.count}</Badge>
                      <span className="text-sm">
                        {awarenessLabel} + {sentimentLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
