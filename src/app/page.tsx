'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion, BarChart3, Loader2, ArrowRight } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/survey')
      }
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI Coding Tools Weekly Survey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help shape the future of AI coding tools by sharing your experiences and preferences in our weekly survey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileQuestion className="h-10 w-10 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>Take the Survey</CardTitle>
              <CardDescription>
                Share your insights on AI coding tools in our comprehensive survey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                • Takes approximately 10-15 minutes<br />
                • Covers tool usage, preferences, and experiences<br />
                • Completely anonymous responses<br />
                • Password required for access
              </p>
              <Link href="/auth">
                <Button className="w-full" size="lg">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Enter Survey
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="h-10 w-10 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>View Results</CardTitle>
              <CardDescription>
                Explore aggregated insights and trends from survey responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                • Real-time data visualization<br />
                • Tool adoption trends<br />
                • Community preferences<br />
                • Publicly accessible results
              </p>
              <Link href="/results">
                <Button variant="outline" className="w-full" size="lg">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Results
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}