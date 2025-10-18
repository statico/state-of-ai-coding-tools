"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Todo App</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div data-testid="theme-toggle">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
