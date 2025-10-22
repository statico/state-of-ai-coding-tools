"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentSectionProps {
  initialComment?: string;
  onCommentChange: (comment: string) => void;
  disabled?: boolean;
  hasResponse?: boolean;
}

export function CommentSection({
  initialComment = "",
  onCommentChange,
  disabled = false,
  hasResponse = false,
}: CommentSectionProps) {
  const [comment, setComment] = useState(initialComment);
  const [isExpanded, setIsExpanded] = useState(!!initialComment);
  const [debouncedComment] = useDebounce(comment, 500);
  const lastEmittedComment = useRef(debouncedComment);

  useEffect(() => {
    if (debouncedComment !== lastEmittedComment.current) {
      lastEmittedComment.current = debouncedComment;
      onCommentChange(debouncedComment);
    }
  }, [debouncedComment, onCommentChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const placeholder = hasResponse
    ? "Tell us more about your answer"
    : "You didn't pick any response. Tell us why.";

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={disabled}
        title={
          isExpanded
            ? "Hide the comment section"
            : "Add a comment to this question"
        }
        className="text-muted-foreground hover:text-foreground -ml-2 h-8 px-2"
      >
        <MessageCircle className="size-5" />
        {isExpanded && "Leave a Comment (optional)"}
      </Button>

      {isExpanded && (
        <div className="mt-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[80px] resize-none"
          />
        </div>
      )}
    </div>
  );
}
