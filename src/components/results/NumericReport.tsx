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

interface NumericReportProps {
  data: {
    summary: {
      mean: number;
      median: number;
      min: number;
      max: number;
      count: number;
    };
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  totalResponses: number;
  skippedResponses: number;
}

export function NumericReport({
  data,
  totalResponses,
  skippedResponses,
}: NumericReportProps) {
  const distributionChartData = data.distribution.map((item) => ({
    name: item.range,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
              Valid Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.count}</div>
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

      {/* Statistical Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {data.summary.mean.toFixed(1)}
              </div>
              <div className="text-muted-foreground text-sm">Mean</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {data.summary.median.toFixed(1)}
              </div>
              <div className="text-muted-foreground text-sm">Median</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.summary.min}</div>
              <div className="text-muted-foreground text-sm">Minimum</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.summary.max}</div>
              <div className="text-muted-foreground text-sm">Maximum</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={distributionChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="range"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, "Count"]} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.distribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="font-medium">{item.range}</span>
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
  );
}
