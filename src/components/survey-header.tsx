"use client";

import { useTRPC } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

export function SurveyHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: sections } = useQuery(trpc.survey.getSections.queryOptions());

  // Determine current page type
  const isIntro = pathname === "/intro";
  const isOutro = pathname === "/outro";
  const isSurvey = pathname.startsWith("/survey/");

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
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div className="relative mt-20 flex items-center gap-8">
            {navItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center"
              >
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "z-10 h-8 w-8 rounded-full border-2 transition-all duration-200 group-hover:scale-110",
                    item.isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background group-hover:border-muted-foreground/60",
                  )}
                >
                  <div className="flex h-full w-full items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                </button>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "group-hover:text-primary-foreground absolute -top-4 left-7 cursor-pointer text-xs font-medium whitespace-nowrap transition-colors",
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
