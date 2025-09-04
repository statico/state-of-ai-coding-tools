import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, BarChart3, Home } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription className="text-base">
              Your responses have been submitted successfully. Thank you for
              participating in the State of AI Coding Tools survey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/results" className="block">
              <Button className="w-full" size="lg">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
