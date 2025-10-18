import "./globals.css";

import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProviderWrapper } from "@/lib/trpc/Provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo list application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="apple-touch-icon-precomposed" href="/favicon.png" />
      </head>
      <body className={`bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProviderWrapper>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </TRPCProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
