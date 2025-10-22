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
}

export function CommentSection({
  initialComment = "",
  onCommentChange,
  disabled = false,
}: CommentSectionProps) {
  const [comment, setComment] = useState(initialComment);
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className="mt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={disabled}
        className="text-muted-foreground hover:text-foreground h-8 px-2"
      >
        <MessageCircle className="mr-1 h-4 w-4" />
        {isExpanded ? "Hide comment" : "Add comment"}
      </Button>

      {isExpanded && (
        <div className="mt-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment about this question..."
            disabled={disabled}
            className="min-h-[80px] resize-none"
          />
        </div>
      )}
    </div>
  );
}
