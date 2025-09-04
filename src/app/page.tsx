'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">State of AI Coding Tools</h1>
        <p className="text-xl text-gray-600 mb-8">
          A survey system for gauging interest and usage of AI coding tools
        </p>
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Survey Access</h2>
            <p className="text-gray-600 mb-4">
              Enter the weekly password to participate in the survey
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enter Survey
            </Link>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">View Results</h2>
            <p className="text-gray-600 mb-4">
              Explore the results and trends from previous surveys
            </p>
            <Link
              href="/results"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}