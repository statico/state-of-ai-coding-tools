export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">State of AI Coding Tools</h1>
        <p className="text-xl text-gray-600 mb-8">
          A survey system for gauging interest and usage of AI coding tools
        </p>
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Survey Access</h2>
            <p className="text-gray-600">
              Enter the weekly password to participate in the survey
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">View Results</h2>
            <p className="text-gray-600">
              Explore the results and trends from previous surveys
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}