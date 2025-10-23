"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircleMore } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ReportHeaderProps {
  questionTitle: string;
  questionType: string;
  questionDescription?: string | null;
  multipleMax?: number | null;
  randomize?: boolean;
  comments?: Array<{
    comment: string;
    sessionId: string;
  }>;
  icon: ReactNode;
  questionId?: string;
}

export function ReportHeader({
  questionTitle,
  questionType,
  questionDescription,
  multipleMax,
  randomize,
  comments = [],
  icon,
  questionId,
}: ReportHeaderProps) {
  // Generate a URL-friendly ID from the question title if no questionId is provided
  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const anchorId = questionId || generateId(questionTitle);

  const scrollToElement = (element: HTMLElement, offset = 80) => {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const handleHeaderClick = () => {
    const url = new URL(window.location.href);
    url.hash = anchorId;
    window.history.pushState(null, "", url.toString());

    // Smooth scroll to the element with offset
    const element = document.getElementById(anchorId);
    if (element) {
      scrollToElement(element);
    }
  };

  // Handle initial page load with hash
  useEffect(() => {
    const handleHashNavigation = () => {
      if (window.location.hash === `#${anchorId}`) {
        // Small delay to ensure the element is rendered
        setTimeout(() => {
          const element = document.getElementById(anchorId);
          if (element) {
            scrollToElement(element);
          }
        }, 100);
      }
    };

    // Handle initial load
    handleHashNavigation();

    // Handle hash changes
    window.addEventListener("hashchange", handleHashNavigation);

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, [anchorId]);

  const getQuestionTypeName = (type: string) => {
    switch (type) {
      case "single":
        return "Single Choice";
      case "multiple":
        return "Multiple Choice";
      case "experience":
        return "Experience";
      case "numeric":
        return "Numeric";
      case "freeform":
        return "Freeform";
      case "single-freeform":
        return "Single Choice with Freeform";
      case "multiple-freeform":
        return "Multiple Choice with Freeform";
      default:
        return type;
    }
  };

  const tooltipContent = (
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-semibold">Title:</span> {questionTitle}
      </div>
      <div>
        <span className="font-semibold">Type:</span>{" "}
        {getQuestionTypeName(questionType)}
      </div>
      {questionDescription && (
        <div>
          <span className="font-semibold">Description:</span>{" "}
          {questionDescription}
        </div>
      )}
      {multipleMax && (
        <div>
          <span className="font-semibold">Max selections:</span> {multipleMax}
        </div>
      )}
      {randomize && (
        <div>
          <span className="font-semibold">Randomize options:</span> Yes
        </div>
      )}
    </div>
  );

  return (
    <CardHeader className="pb-4" id={anchorId}>
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
                onClick={handleHeaderClick}
              >
                <div className="shrink-0">{icon}</div>
                <CardTitle className="text-lg leading-6">
                  {questionTitle}
                </CardTitle>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {comments.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 ml-4 flex items-center gap-2 rounded-lg border border-dashed px-3 py-1.5 text-sm whitespace-nowrap">
                <MessageCircleMore className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {comments.length} comments
                </span>
                <span className="sm:hidden">{comments.length}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Comments for "{questionTitle}"</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-96">
                <div className="space-y-3 pr-4">
                  {comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 rounded-lg border p-3"
                    >
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </CardHeader>
  );
}
