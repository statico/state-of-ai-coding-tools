import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export interface SectionInfo {
  currentSection: any | null;
  prevSection: any | null;
  nextSection: any | null;
  currentSectionIndex: number;
  isIntro: boolean;
  isOutro: boolean;
  isSurvey: boolean;
}

export function useSectionNavigation(): SectionInfo {
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: sections } = useQuery(trpc.survey.getSections.queryOptions());

  const isIntro = pathname === "/intro";
  const isOutro = pathname === "/outro";
  const isSurvey = pathname.startsWith("/survey/");

  const getCurrentSectionInfo = (): SectionInfo => {
    if (!sections || !Array.isArray(sections)) {
      return {
        currentSection: null,
        prevSection: null,
        nextSection: null,
        currentSectionIndex: -1,
        isIntro,
        isOutro,
        isSurvey,
      };
    }

    if (isIntro) {
      return {
        currentSection: null,
        prevSection: null,
        nextSection: sections[0] || null,
        currentSectionIndex: -1,
        isIntro,
        isOutro,
        isSurvey,
      };
    }

    if (isOutro) {
      const lastSection = sections[sections.length - 1];
      return {
        currentSection: null,
        prevSection: lastSection || null,
        nextSection: null,
        currentSectionIndex: sections.length,
        isIntro,
        isOutro,
        isSurvey,
      };
    }

    if (isSurvey) {
      const currentSectionSlug = pathname.replace("/survey/", "");
      const currentSectionIndex = sections.findIndex(
        (s: any) => s.slug === currentSectionSlug,
      );

      if (currentSectionIndex >= 0) {
        const currentSection = sections[currentSectionIndex];
        const prevSection =
          currentSectionIndex > 0 ? sections[currentSectionIndex - 1] : null;
        const nextSection =
          currentSectionIndex < sections.length - 1
            ? sections[currentSectionIndex + 1]
            : null;
        return {
          currentSection,
          prevSection,
          nextSection,
          currentSectionIndex,
          isIntro,
          isOutro,
          isSurvey,
        };
      }
    }

    return {
      currentSection: null,
      prevSection: null,
      nextSection: null,
      currentSectionIndex: -1,
      isIntro,
      isOutro,
      isSurvey,
    };
  };

  return getCurrentSectionInfo();
}
