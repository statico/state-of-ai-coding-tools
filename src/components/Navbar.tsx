"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <nav className="bg-background border-b select-none">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-6 sm:h-16">
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            onClick={handleHomeClick}
            className="hover:text-primary mr-4 text-sm font-bold transition-colors sm:text-xl"
          >
            <div className="hidden sm:inline">AI Coding Tools Survey</div>
            <div className="leading-4 sm:hidden">
              AI Coding
              <br />
              Tools Survey
            </div>
          </button>
          {isAuthenticated && (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHomeClick}
                className={cn(
                  "text-xs sm:text-sm",
                  pathname === "/" || (pathname === "/intro" && "bg-muted"),
                )}
              >
                Home
              </Button>
              {firstSection &&
              typeof firstSection === "object" &&
              "slug" in firstSection ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSurveyClick}
                  className={cn(
                    "text-xs sm:text-sm",
                    pathname.startsWith("/survey") && "bg-muted",
                  )}
                >
                  Survey
                </Button>
              ) : null}
              <Link href="/results">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs sm:text-sm",
                    pathname.startsWith("/results") && "bg-muted",
                  )}
                >
                  Results
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4">
          <div data-testid="theme-toggle">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            title="View on GitHub"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <a
              href="https://github.com/statico/state-of-ai-coding-tools"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]"
              />
              <span className="sr-only">View on GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
