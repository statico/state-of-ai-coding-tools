import type { Metadata } from 'next'
import { SURVEY_TITLE, SURVEY_DESCRIPTION } from '@/lib/constants'
import { AuthProvider } from '@/lib/auth-context'
import { Navigation } from '@/components/Navigation'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: SURVEY_TITLE,
  description: SURVEY_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navigation />
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
