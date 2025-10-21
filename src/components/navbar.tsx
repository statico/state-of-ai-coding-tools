"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">AI Coding Tools Survey</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div data-testid="theme-toggle">
            <ThemeToggle />
          </div>
          <Button variant="ghost" size="icon" asChild title="View on GitHub">
            <a
              href="https://github.com/statico/state-of-ai-coding-tools"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">View on GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
