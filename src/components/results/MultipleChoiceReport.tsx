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

interface MultipleChoiceReportProps {
  data: {
    options: Array<{
      optionSlug: string;
      label: string;
      count: number;
      percentage: number;
    }>;
    writeIns: Array<{
      response: string;
      count: number;
    }>;
  };
  totalResponses: number;
  skippedResponses: number;
}

export function MultipleChoiceReport({
  data,
  totalResponses,
  skippedResponses,
}: MultipleChoiceReportProps) {
  const chartData = data.options.map((option) => ({
    name: option.label,
    value: option.count,
    percentage: option.percentage,
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
            <CardTitle className="text-sm font-medium">
              Total Selections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.options.reduce((sum, option) => sum + option.count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Selection Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={120}
              />
              <Tooltip formatter={(value: number) => [value, "Count"]} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.options.map((option, index) => (
              <div
                key={option.optionSlug}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="font-medium">{option.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">
                    {option.count} selections
                  </span>
                  <span className="text-sm font-medium">
                    {option.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Write-in Responses */}
      {data.writeIns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Write-in Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.writeIns.map((writeIn, index) => (
                <div
                  key={index}
                  className="bg-muted flex items-center justify-between rounded-lg p-3"
                >
                  <span className="text-sm">{writeIn.response}</span>
                  <Badge variant="outline">{writeIn.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
