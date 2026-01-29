import {
  sortByAwareness,
  sortBySentiment,
  sortExperienceOptions,
  type ExperienceOption,
  type SortingConfig,
} from "@/lib/sorting";
import { describe, expect, it } from "vitest";

// Helper function to create test data
function createTestOption(
  optionSlug: string,
  label: string,
  awarenessData: Array<{ level: number; count: number }>,
  sentimentData: Array<{ sentiment: number; count: number }>,
): ExperienceOption {
  const totalResponses = awarenessData.reduce((sum, item) => sum + item.count, 0);

  const awareness = awarenessData.map((item) => ({
    level: item.level,
    label: `Level ${item.level}`,
    count: item.count,
    percentage: totalResponses > 0 ? (item.count / totalResponses) * 100 : 0,
  }));

  const sentiment = sentimentData.map((item) => ({
    level: item.sentiment,
    label: `Sentiment ${item.sentiment}`,
    count: item.count,
    percentage: totalResponses > 0 ? (item.count / totalResponses) * 100 : 0,
  }));

  // Create combined data for sentiment sorting
  // For testing, we'll create realistic combined data
  const combined = [];
  if (sentimentData.length > 0) {
    // Distribute sentiment counts across awareness levels
    for (const aw of awarenessData) {
      for (const sent of sentimentData) {
        // Distribute sentiment proportionally across awareness levels
        const proportion = aw.count / totalResponses;
        const sentimentCount = Math.round(sent.count * proportion);
        if (sentimentCount > 0) {
          combined.push({
            awareness: aw.level,
            sentiment: sent.sentiment,
            count: sentimentCount,
          });
        }
      }
    }
  }

  return {
    optionSlug,
    label,
    order: 0,
    awareness,
    sentiment,
    combined,
  };
}

describe("Experience Sorting", () => {
  describe("sortByAwareness", () => {
    it("should sort by primary awareness level when values differ", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 }, // 20% using it
            { level: 2, count: 30 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 30 }, // 30% using it
            { level: 2, count: 20 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "3", "desc");

      expect(sorted[0].label).toBe("Option 2"); // Higher "using it" percentage
      expect(sorted[1].label).toBe("Option 1");
    });

    it("should use secondary sorting when primary values are equal", () => {
      const options = [
        createTestOption(
          "goose",
          "Goose",
          [
            { level: 3, count: 27 }, // Exactly 27% using it (27/100)
            { level: 2, count: 20 }, // 20% used it (20/100)
            { level: 1, count: 21 }, // 21% heard of it (21/100)
            { level: 0, count: 32 }, // 32% not heard (32/100)
          ],
          [],
        ),
        createTestOption(
          "warp",
          "Warp",
          [
            { level: 3, count: 27 }, // Exactly 27% using it (27/100)
            { level: 2, count: 29 }, // 29% used it (29/100)
            { level: 1, count: 30 }, // 30% heard of it (30/100)
            { level: 0, count: 14 }, // 14% not heard (14/100)
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "3", "desc");

      // Both have exactly 27% for "using it", so should sort by "used it" next
      // Warp has 29% vs Goose's 20%, so Warp should be first
      expect(sorted[0].label).toBe("Warp");
      expect(sorted[1].label).toBe("Goose");
    });

    it("should sort Claude Code above Goose when both have 27% using it but Claude Code has higher used it", () => {
      const options = [
        createTestOption(
          "goose",
          "Goose",
          [
            { level: 3, count: 27 }, // 27% using it
            { level: 2, count: 20 }, // 20% used it
            { level: 1, count: 21 }, // 21% heard of it
            { level: 0, count: 32 }, // 32% not heard
          ],
          [],
        ),
        createTestOption(
          "claude-code",
          "Claude Code",
          [
            { level: 3, count: 27 }, // 27% using it
            { level: 2, count: 29 }, // 29% used it
            { level: 1, count: 30 }, // 30% heard of it
            { level: 0, count: 14 }, // 14% not heard
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "3", "desc");

      // Both have exactly 27% for "using it", so should sort by "used it" next
      // Claude Code has 29% vs Goose's 20%, so Claude Code should be first
      expect(sorted[0].label).toBe("Claude Code");
      expect(sorted[1].label).toBe("Goose");
    });

    it("should use tertiary sorting when primary and secondary are equal", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 }, // 20% using it
            { level: 2, count: 30 }, // 30% used it
            { level: 1, count: 25 }, // 25% heard of it
            { level: 0, count: 25 }, // 25% not heard
          ],
          [],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 20 }, // 20% using it
            { level: 2, count: 30 }, // 30% used it
            { level: 1, count: 30 }, // 30% heard of it (higher)
            { level: 0, count: 20 }, // 20% not heard
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "3", "desc");

      // Both have same "using it" and "used it", so sort by "heard of it"
      expect(sorted[0].label).toBe("Option 2"); // Higher "heard of it"
      expect(sorted[1].label).toBe("Option 1");
    });

    it("should handle ascending sort direction", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 30 }, // 30% using it
            { level: 2, count: 20 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 20 }, // 20% using it
            { level: 2, count: 30 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "3", "asc");

      expect(sorted[0].label).toBe("Option 2"); // Lower "using it" percentage first
      expect(sorted[1].label).toBe("Option 1");
    });

    it("should handle sorting by different awareness levels", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 },
            { level: 2, count: 30 }, // 30% used it
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 25 },
            { level: 2, count: 20 }, // 20% used it
            { level: 1, count: 30 },
            { level: 0, count: 25 },
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "2", "desc"); // Sort by "used it"

      expect(sorted[0].label).toBe("Option 1"); // Higher "used it" percentage
      expect(sorted[1].label).toBe("Option 2");
    });
  });

  describe("sortBySentiment", () => {
    it("should sort by primary sentiment level when values differ", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 },
            { level: 2, count: 30 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [
            { sentiment: 1, count: 15 }, // 15% positive
            { sentiment: 0, count: 20 },
            { sentiment: -1, count: 45 },
          ],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 25 },
            { level: 2, count: 25 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [
            { sentiment: 1, count: 30 }, // 30% positive
            { sentiment: 0, count: 20 },
            { sentiment: -1, count: 30 },
          ],
        ),
      ];

      const sorted = sortBySentiment(options, "1", "desc"); // Sort by positive sentiment

      expect(sorted[0].label).toBe("Option 2"); // Higher positive sentiment
      expect(sorted[1].label).toBe("Option 1");
    });

    it("should use secondary sorting when primary sentiment values are equal", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 },
            { level: 2, count: 30 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [
            { sentiment: 1, count: 20 }, // 20% positive
            { sentiment: 0, count: 30 }, // 30% neutral
            { sentiment: -1, count: 30 },
          ],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 25 },
            { level: 2, count: 25 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [
            { sentiment: 1, count: 20 }, // 20% positive (same)
            { sentiment: 0, count: 40 }, // 40% neutral (higher)
            { sentiment: -1, count: 20 },
          ],
        ),
      ];

      const sorted = sortBySentiment(options, "1", "desc"); // Sort by positive sentiment

      // Both have same positive sentiment, so sort by neutral next
      expect(sorted[0].label).toBe("Option 2"); // Higher neutral sentiment
      expect(sorted[1].label).toBe("Option 1");
    });
  });

  describe("sortExperienceOptions", () => {
    it("should delegate to awareness sorting when groupBy is awareness", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 },
            { level: 2, count: 30 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 30 },
            { level: 2, count: 20 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [],
        ),
      ];

      const config: SortingConfig = {
        groupBy: "awareness",
        sortBy: "3",
        sortDirection: "desc",
      };

      const sorted = sortExperienceOptions(options, config);

      expect(sorted[0].label).toBe("Option 2"); // Higher "using it" percentage
      expect(sorted[1].label).toBe("Option 1");
    });

    it("should delegate to sentiment sorting when groupBy is sentiment", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 },
            { level: 2, count: 30 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [
            { sentiment: 1, count: 15 },
            { sentiment: 0, count: 20 },
            { sentiment: -1, count: 45 },
          ],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 25 },
            { level: 2, count: 25 },
            { level: 1, count: 25 },
            { level: 0, count: 25 },
          ],
          [
            { sentiment: 1, count: 30 },
            { sentiment: 0, count: 20 },
            { sentiment: -1, count: 30 },
          ],
        ),
      ];

      const config: SortingConfig = {
        groupBy: "sentiment",
        sortBy: "1",
        sortDirection: "desc",
      };

      const sorted = sortExperienceOptions(options, config);

      expect(sorted[0].label).toBe("Option 2"); // Higher positive sentiment
      expect(sorted[1].label).toBe("Option 1");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty options array", () => {
      const sorted = sortByAwareness([], "3", "desc");
      expect(sorted).toEqual([]);
    });

    it("should handle options with zero total responses", () => {
      const options = [
        createTestOption("option1", "Option 1", [], []),
        createTestOption("option2", "Option 2", [], []),
      ];

      const sorted = sortByAwareness(options, "3", "desc");

      // Should maintain original order when all values are 0
      expect(sorted[0].label).toBe("Option 1");
      expect(sorted[1].label).toBe("Option 2");
    });

    it("should handle missing awareness levels", () => {
      const options = [
        createTestOption(
          "option1",
          "Option 1",
          [
            { level: 3, count: 20 },
            // Missing other levels
          ],
          [],
        ),
        createTestOption(
          "option2",
          "Option 2",
          [
            { level: 3, count: 30 },
            { level: 2, count: 20 },
          ],
          [],
        ),
      ];

      const sorted = sortByAwareness(options, "3", "desc");

      expect(sorted[0].label).toBe("Option 1"); // Higher "using it" percentage (100% vs 60%)
      expect(sorted[1].label).toBe("Option 2");
    });
  });
});
