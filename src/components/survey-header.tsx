"use client";

import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export function SurveyHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: sections } = useQuery(trpc.survey.getSections.queryOptions());

  // Determine current page type
  const isIntro = pathname === "/intro";
  const isOutro = pathname === "/outro";
  const isSurvey = pathname.startsWith("/survey/");

  // Calculate completion percentage
  const calculateProgress = () => {
    if (!sections || !Array.isArray(sections)) return 0;

    const totalSections = sections.length;

    if (isIntro) {
      return 0;
    }

    if (isOutro) {
      return 100;
    }

    if (isSurvey) {
      const currentSectionSlug = pathname.replace("/survey/", "");
      const currentSectionIndex = sections.findIndex(
        (s: any) => s.slug === currentSectionSlug,
      );
      if (currentSectionIndex >= 0) {
        // Progress is based on how many sections we've completed
        // We're currently on a section, so progress is (currentIndex + 1) / totalSections
        return Math.round((currentSectionIndex / totalSections) * 100);
      }
    }

    return 0;
  };

  const progressPercentage = calculateProgress();

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

  return (
    <div>
      <div className="container mx-auto space-y-4">
        {/* Mobile/Small width progress bar */}
        <div className="block pb-2 md:hidden">
          <div className="space-y-2">
            <div className="text-muted-foreground flex justify-between text-base">
              <span>Survey Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center justify-center md:flex">
          <div className="relative mt-20 flex items-center gap-8">
            {navItems.map((item, index) => (
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
                    {index + 1}
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
            ))}
            <div className="bg-muted-foreground/30 absolute bottom-4 h-px w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
