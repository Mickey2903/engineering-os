import type { DashboardSnapshot } from "../models/DashboardSnapshot";
import type { DashboardStatistics } from "../models/DashboardStatistics";

interface DashboardScoreWeights {
  readonly brokenLinkPenalty: number;
  readonly orphanRequirementPenalty: number;
  readonly duplicateRelationshipPenalty: number;
}

const DEFAULT_WEIGHTS: DashboardScoreWeights = {
  brokenLinkPenalty: 5,
  orphanRequirementPenalty: 3,
  duplicateRelationshipPenalty: 2,
};

export class DashboardStatisticsService {
  public calculate(snapshot: DashboardSnapshot): DashboardStatistics {
    const healthScore = Math.max(
      0,
      100 -
        snapshot.brokenLinks * DEFAULT_WEIGHTS.brokenLinkPenalty -
        snapshot.orphanRequirements * DEFAULT_WEIGHTS.orphanRequirementPenalty,
    );

    return {
      healthScore,
    };
  }
}
