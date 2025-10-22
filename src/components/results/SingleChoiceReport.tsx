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
  Pie,
  PieChart,
  Cell,
} from "recharts";

interface SingleChoiceReportProps {
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

export function SingleChoiceReport({
  data,
  totalResponses,
  skippedResponses,
}: SingleChoiceReportProps) {
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
            <CardTitle>Distribution by Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
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
            <CardTitle>Distribution by Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }: any) =>
                    `${name}: ${(percentage || 0).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#8b5cf6",
                          "#06b6d4",
                          "#10b981",
                          "#f59e0b",
                          "#ef4444",
                          "#6366f1",
                          "#ec4899",
                          "#84cc16",
                        ][index % 8]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Percentage"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
                    {option.count} responses
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
