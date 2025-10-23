import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportsPageContent } from "./ReportsPageContent";

export default function ReportsPage() {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl">Results by Week</h1>
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <ReportsPageContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
