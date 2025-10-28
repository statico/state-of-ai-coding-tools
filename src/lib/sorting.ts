export interface ExperienceOption {
  optionSlug: string;
  label: string;
  description?: string;
  order: number;
  awareness: Array<{
    level: number;
    label: string;
    count: number;
    percentage: number;
  }>;
  sentiment: Array<{
    level: number;
    label: string;
    count: number;
    percentage: number;
  }>;
  combined: Array<{
    awareness: number;
    sentiment: number;
    count: number;
  }>;
}

export type GroupByOption = "awareness" | "sentiment";
export type SortDirection = "asc" | "desc";

export interface SortingConfig {
  groupBy: GroupByOption;
  sortBy: string; // The level to sort by (e.g., "3" for awareness level 3)
  sortDirection: SortDirection;
}

/**
 * Sort experience options based on awareness levels
 * Uses multi-level sorting: primary by selected level, then by remaining levels in order
 */
export function sortByAwareness(
  options: ExperienceOption[],
  sortBy: string,
  sortDirection: SortDirection,
): ExperienceOption[] {
  const sortValue = parseInt(sortBy);

  // Define the order of awareness levels for secondary sorting
  const awarenessOrder = [3, 2, 1, 0]; // Using it, Used it, Heard of it, Not heard of it

  return [...options].sort((a, b) => {
    // Primary sort: by the selected awareness level percentage (rounded to integers)
    const aPrimaryValue = Math.round(
      a.awareness.find((aw) => aw.level === sortValue)?.percentage || 0,
    );
    const bPrimaryValue = Math.round(
      b.awareness.find((aw) => aw.level === sortValue)?.percentage || 0,
    );

    if (aPrimaryValue !== bPrimaryValue) {
      return sortDirection === "asc"
        ? aPrimaryValue - bPrimaryValue
        : bPrimaryValue - aPrimaryValue;
    }

    // Secondary sort: by remaining awareness levels in order (using rounded percentages)
    for (const level of awarenessOrder) {
      if (level === sortValue) continue; // Skip the primary sort level

      const aValue = Math.round(
        a.awareness.find((aw) => aw.level === level)?.percentage || 0,
      );
      const bValue = Math.round(
        b.awareness.find((aw) => aw.level === level)?.percentage || 0,
      );

      if (aValue !== bValue) {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    }

    return 0; // All values are equal
  });
}

/**
 * Sort experience options based on sentiment levels
 * Uses multi-level sorting: primary by selected sentiment, then by remaining sentiments in order
 */
export function sortBySentiment(
  options: ExperienceOption[],
  sortBy: string,
  sortDirection: SortDirection,
): ExperienceOption[] {
  const sortValue = parseInt(sortBy);

  // Define the order of sentiment levels for secondary sorting
  const sentimentOrder = [1, 0, -1]; // Positive, Neutral, Negative

  return [...options].sort((a, b) => {
    // Calculate total responses for each option to get percentages
    const aTotalResponses = a.awareness.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const bTotalResponses = b.awareness.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    // Primary sort: by the selected sentiment level percentage (across all awareness levels)
    const aPrimaryCount = a.combined
      .filter((item) => item.sentiment === sortValue)
      .reduce((sum, item) => sum + item.count, 0);
    const bPrimaryCount = b.combined
      .filter((item) => item.sentiment === sortValue)
      .reduce((sum, item) => sum + item.count, 0);

    const aPrimaryValue = Math.round(
      aTotalResponses > 0 ? (aPrimaryCount / aTotalResponses) * 100 : 0,
    );
    const bPrimaryValue = Math.round(
      bTotalResponses > 0 ? (bPrimaryCount / bTotalResponses) * 100 : 0,
    );

    if (aPrimaryValue !== bPrimaryValue) {
      return sortDirection === "asc"
        ? aPrimaryValue - bPrimaryValue
        : bPrimaryValue - aPrimaryValue;
    }

    // Secondary sort: by remaining sentiment levels in order (using rounded percentages)
    for (const sentiment of sentimentOrder) {
      if (sentiment === sortValue) continue; // Skip the primary sort level

      const aCount = a.combined
        .filter((item) => item.sentiment === sentiment)
        .reduce((sum, item) => sum + item.count, 0);
      const bCount = b.combined
        .filter((item) => item.sentiment === sentiment)
        .reduce((sum, item) => sum + item.count, 0);

      const aValue = Math.round(
        aTotalResponses > 0 ? (aCount / aTotalResponses) * 100 : 0,
      );
      const bValue = Math.round(
        bTotalResponses > 0 ? (bCount / bTotalResponses) * 100 : 0,
      );

      if (aValue !== bValue) {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    }

    return 0; // All values are equal
  });
}

/**
 * Main sorting function that delegates to the appropriate sorting method
 */
export function sortExperienceOptions(
  options: ExperienceOption[],
  config: SortingConfig,
): ExperienceOption[] {
  if (config.groupBy === "awareness") {
    return sortByAwareness(options, config.sortBy, config.sortDirection);
  } else {
    return sortBySentiment(options, config.sortBy, config.sortDirection);
  }
}
