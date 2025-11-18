"use client";

import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportsPageContent } from "./ReportsPageContent";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl">Results by Month</h1>
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <ReportsPageContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
