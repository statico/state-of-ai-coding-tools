export const CHART_COLORS = {
  // Main palette using Tailwind colors
  palette: [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
    '#84cc16', // lime-500
    '#06b6d4', // cyan-500
    '#a855f7', // purple-500
    '#0ea5e9', // sky-500
    '#22c55e', // green-500
    '#eab308', // yellow-500
    '#64748b', // slate-500
    '#e11d48', // rose-500
    '#0891b2', // cyan-600
    '#7c3aed', // violet-600
    '#dc2626', // red-600
  ],

  // Experience-specific colors
  experience: {
    neverHeard: '#94a3b8', // slate-400
    wantToTry: '#10b981', // emerald-500
    notInterested: '#f59e0b', // amber-500
    wouldUseAgain: '#3b82f6', // blue-500
    wouldNotUse: '#ef4444', // red-500
  },

  // Single values
  primary: '#3b82f6', // blue-500
  rating: '#3b82f6', // blue-500
  text: '#8b5cf6', // violet-500
  responses: '#f97316', // orange-500
}

// Generate color for indexed items
export const getColor = (index: number): string => {
  return CHART_COLORS.palette[index % CHART_COLORS.palette.length]
}
