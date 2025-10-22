"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="container mx-auto flex h-12 items-center justify-between px-2 sm:h-16 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-4">
          <button
            onClick={handleHomeClick}
            className="hover:text-primary mr-2 text-sm font-bold transition-colors sm:text-xl"
          >
            <span className="hidden sm:inline">AI Coding Tools Survey</span>
            <span className="leading-none sm:hidden">
              AI Survey
              <br />
              Tools Survey
            </span>
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHomeClick}
              className={`text-xs sm:text-sm ${
                pathname === "/" || pathname === "/intro" ? "bg-muted" : ""
              }`}
            >
              Home
            </Button>
            {isAuthenticated &&
            firstSection &&
            typeof firstSection === "object" &&
            "slug" in firstSection ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSurveyClick}
                className={`text-xs sm:text-sm ${
                  pathname.startsWith("/survey") ? "bg-muted" : ""
                }`}
              >
                Survey
              </Button>
            ) : null}
            <Link href="/results">
              <Button
                variant={pathname === "/results" ? "default" : "ghost"}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Results
              </Button>
            </Link>
          </div>
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
