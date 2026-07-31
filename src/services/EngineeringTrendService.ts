import type { EngineeringMetricSnapshot } from "../models/EngineeringMetricSnapshot";
import type { EngineeringTrendReport } from "../models/EngineeringTrendReport";

export class EngineeringTrendService {
  public analyze(
    history: readonly EngineeringMetricSnapshot[],
  ): EngineeringTrendReport {
    if (history.length === 0) {
      return {
        currentScore: 0,
        previousScore: 0,
        scoreChange: 0,
        direction: "stable",
        strongestMetric: "none",
      };
    }

    const current = history.at(-1);

    if (!current) {
      return {
        currentScore: 0,
        previousScore: 0,
        scoreChange: 0,
        direction: "stable",
        strongestMetric: "none",
      };
    }

    const previous =
      history.length > 1
        ? history.at(-2) ?? current
        : current;

    const scoreChange =
      current.overallScore - previous.overallScore;

    return {
      currentScore: current.overallScore,
      previousScore: previous.overallScore,
      scoreChange,
      direction:
        scoreChange > 0
          ? "improving"
          : scoreChange < 0
            ? "declining"
            : "stable",
      strongestMetric: this.findStrongestMetric(
        current,
        previous,
      ),
    };
  }

  private findStrongestMetric(
    current: EngineeringMetricSnapshot,
    previous: EngineeringMetricSnapshot,
  ): string {
    const metrics = [
      {
        name: "Health",
        change: current.healthScore - previous.healthScore,
      },
      {
        name: "Requirement Quality",
        change:
          current.requirementQualityScore -
          previous.requirementQualityScore,
      },
      {
        name: "Verification Coverage",
        change:
          current.verificationCoverageScore -
          previous.verificationCoverageScore,
      },
      {
        name: "Traceability",
        change:
          current.traceabilityScore -
          previous.traceabilityScore,
      },
    ];

    const strongestMetric = metrics.sort(
      (a, b) => b.change - a.change,
    )[0];

    return strongestMetric?.name ?? "none";
  }
}
