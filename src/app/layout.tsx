import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'State of AI Coding Tools',
  description: 'A survey system for gauging interest and usage of AI coding tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}