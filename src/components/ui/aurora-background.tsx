"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center md:pt-4",
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(100deg,oklch(0.447 0.255 264.2)_10%,oklch(0.6 0.15 260)_15%,oklch(0.7 0.12 260)_20%,oklch(0.8 0.08 260)_25%,oklch(0.5 0.2 260)_30%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,oklch(0.141 0.005 285.823)_0%,oklch(0.141 0.005 285.823)_7%,transparent_10%,transparent_12%,oklch(0.141 0.005 285.823)_16%)",
              "--light-gradient":
                "repeating-linear-gradient(100deg,oklch(1 0 0)_0%,oklch(1 0 0)_7%,transparent_10%,transparent_12%,oklch(1 0 0)_16%)",

              "--indigo-500": "oklch(0.447 0.255 264.2)",
              "--indigo-400": "oklch(0.6 0.15 260)",
              "--indigo-300": "oklch(0.7 0.12 260)",
              "--indigo-200": "oklch(0.8 0.08 260)",
              "--indigo-600": "oklch(0.5 0.2 260)",
              "--background": "oklch(1 0 0)",
              "--background-dark": "oklch(0.141 0.005 285.823)",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            //   I'm sorry but this is what peak developer performance looks like // trigger warning
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--light-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--indigo-500)_10%,var(--indigo-400)_15%,var(--indigo-300)_20%,var(--indigo-200)_25%,var(--indigo-600)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--background-dark)_0%,var(--background-dark)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--background-dark)_16%)] [--light-gradient:repeating-linear-gradient(100deg,var(--background)_0%,var(--background)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--background)_16%)] after:absolute after:inset-0 after:[background-image:var(--light-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
