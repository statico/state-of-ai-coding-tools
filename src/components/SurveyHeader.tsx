"use client";

import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSectionNavigation } from "@/hooks/use-section-navigation";

export function SurveyHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: sections } = useQuery(trpc.survey.getSections.queryOptions());
  const { data: completionData } = useQuery(
    trpc.survey.getCompletionPercentage.queryOptions(),
  );
  const { prevSection, nextSection, isIntro, isOutro, isSurvey } =
    useSectionNavigation();

  // Get completion percentage from the API
  const progressPercentage = completionData?.overallPercentage ?? 0;

  // Create navigation items
  const navItems = [
    {
      id: "intro",
      label: "Intro",
      path: "/intro",
      isActive: isIntro,
    },
    ...(sections && Array.isArray(sections)
      ? sections.map((section: any) => ({
          id: section.slug,
          label: section.title,
          path: `/survey/${section.slug}`,
          isActive: isSurvey && pathname === `/survey/${section.slug}`,
        }))
      : []),
    {
      id: "outro",
      label: "Outro",
      path: "/outro",
      isActive: isOutro,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handlePrevious = () => {
    if (prevSection) {
      router.push(`/survey/${prevSection.slug}`);
    } else if (isOutro) {
      const lastSection =
        sections && Array.isArray(sections)
          ? sections[sections.length - 1]
          : null;
      if (lastSection) {
        router.push(`/survey/${lastSection.slug}`);
      } else {
        router.push("/intro");
      }
    } else {
      router.push("/intro");
    }
  };

  const handleNext = () => {
    if (nextSection) {
      router.push(`/survey/${nextSection.slug}`);
    } else if (isIntro) {
      const firstSection =
        sections && Array.isArray(sections) ? sections[0] : null;
      if (firstSection) {
        router.push(`/survey/${firstSection.slug}`);
      } else {
        router.push("/outro");
      }
    } else {
      router.push("/outro");
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile/Small width progress bar */}
      <div className="block pb-2 md:hidden">
        <div className="space-y-4">
          <div className="text-muted-foreground flex justify-between text-base">
            <span>Survey Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {/* Mobile navigation links */}
          <div className="flex items-center justify-between gap-2">
            {/* Previous link */}
            {!isIntro && (
              <button
                onClick={handlePrevious}
                className="text-muted-foreground hover:text-foreground flex max-w-[40%] min-w-0 items-center gap-1 text-sm transition-colors"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {prevSection ? prevSection.title : "Intro"}
                </span>
              </button>
            )}

            {/* Spacer when no previous link */}
            {isIntro && <div className="max-w-[40%]" />}

            {/* Next link */}
            {!isOutro && (
              <button
                onClick={handleNext}
                className="text-muted-foreground hover:text-foreground flex max-w-[40%] min-w-0 items-center gap-1 text-sm transition-colors"
              >
                <span className="truncate">
                  {nextSection ? nextSection.title : "Complete"}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            )}

            {/* Spacer when no next link */}
            {isOutro && <div className="max-w-[40%]" />}
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden items-center justify-center md:flex">
        <div className="relative mt-20 flex items-center gap-8">
          {navItems.map((item, index) => {
            // Get section completion percentage for survey sections
            let sectionPercentage = 0;
            if (isSurvey && item.id !== "intro" && item.id !== "outro") {
              const sectionData = completionData?.sectionCompletion?.find(
                (s: any) => s.sectionSlug === item.id,
              );
              sectionPercentage = sectionData?.percentage ?? 0;
            }

            return (
              <div
                key={item.id}
                className="group relative flex flex-col items-center"
              >
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "z-10 h-8 w-8 rounded-full border transition-all duration-200 group-hover:scale-110",
                    item.isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background group-hover:border-muted-foreground/60",
                  )}
                >
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium">
                    {isSurvey && item.id !== "intro" && item.id !== "outro" ? (
                      <span className="text-xs">{sectionPercentage}%</span>
                    ) : (
                      index + 1
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "group-hover:text-primary-foreground absolute -top-4 left-7 cursor-pointer text-sm font-medium whitespace-nowrap transition-colors",
                    item.isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground",
                  )}
                  style={{
                    transform: "rotate(-45deg)",
                    transformOrigin: "top left",
                  }}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
          <div className="bg-muted-foreground/30 absolute bottom-4 h-px w-full" />
        </div>
      </div>
    </div>
  );
}
