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

  return (
    <div
      className="hover:bg-muted/50 cursor-pointer rounded-md p-3"
      onClick={disabled ? undefined : handleToggle}
    >
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled}
        title={isExpanded ? "Hide the comment section" : "Add a comment to this question"}
        className="text-muted-foreground hover:text-foreground -ml-2 h-8 px-2"
      >
        <MessageCircle className="size-5" />
        Other / Comment
      </Button>

      {isExpanded && (
        <div className="mt-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Something else..."
            disabled={disabled}
            className="min-h-[80px] resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
