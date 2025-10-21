"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Github } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: authData } = useQuery(trpc.auth.check.queryOptions());
  const { data: firstSection } = useQuery(
    trpc.survey.getFirstSection.queryOptions(),
  );

  const isAuthenticated =
    authData && typeof authData === "object" && "isAuthenticated" in authData
      ? authData.isAuthenticated
      : false;

  const handleHomeClick = () => {
    if (isAuthenticated) {
      router.push("/intro");
    } else {
      router.push("/");
    }
  };

  const handleSurveyClick = () => {
    if (
      firstSection &&
      typeof firstSection === "object" &&
      "slug" in firstSection
    ) {
      router.push(`/survey/${firstSection.slug}`);
    }
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleHomeClick}
            className="hover:text-primary text-xl font-bold transition-colors"
          >
            AI Coding Tools Survey
          </button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handleHomeClick}
              className={
                pathname === "/" || pathname === "/intro" ? "bg-muted" : ""
              }
            >
              Home
            </Button>
            {isAuthenticated &&
            firstSection &&
            typeof firstSection === "object" &&
            "slug" in firstSection ? (
              <Button
                variant="ghost"
                onClick={handleSurveyClick}
                className={pathname.startsWith("/survey") ? "bg-muted" : ""}
              >
                Survey
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div data-testid="theme-toggle">
            <ThemeToggle />
          </div>
          <Button variant="ghost" size="icon" asChild title="View on GitHub">
            <a
              href="https://github.com/statico/state-of-ai-coding-tools"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">View on GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
