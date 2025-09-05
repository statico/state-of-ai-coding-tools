// Survey Constants
export const SURVEY_TITLE = 'AI Coding Tools Weekly Survey'
export const SURVEY_DESCRIPTION =
  'Share your experience with AI-powered coding tools and development practices'

// Week Utilities (Monday UTC start)
/**
 * Get the start of the survey week (Monday 00:00:00.000 UTC)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  const day = d.getUTCDay()
  // If Sunday (0), go back 6 days to Monday
  // Otherwise, go back to Monday (1)
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  return d
}

/**
 * Get the end of the survey week (Sunday 23:59:59.999 UTC)
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date)
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  weekEnd.setUTCHours(23, 59, 59, 999)
  return weekEnd
}

/**
 * Check if a date is in the current survey week
 */
export function isInCurrentWeek(date: Date): boolean {
  const now = new Date()
  const weekStart = getWeekStart(now)
  const weekEnd = getWeekEnd(now)
  return date >= weekStart && date <= weekEnd
}

/**
 * Get a formatted week range string for display
 */
export function getWeekRangeString(date: Date = new Date()): string {
  const start = getWeekStart(date)
  const end = getWeekEnd(date)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
}
