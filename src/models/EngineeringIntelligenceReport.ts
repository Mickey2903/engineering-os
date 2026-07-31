import type { EngineeringInsight } from "../intelligence/EngineeringInsight";

export interface EngineeringImprovementArea {
  readonly category: string;
  readonly message: string;
  readonly severity: "low" | "medium" | "high";
}

export interface EngineeringIntelligenceReport {
  readonly overallScore: number;

  readonly healthScore: number;
  readonly requirementQualityScore: number;
  readonly verificationCoverageScore: number;
  readonly traceabilityScore: number;

  readonly improvementAreas:
    readonly EngineeringImprovementArea[];

  readonly insights:
    readonly EngineeringInsight[];
}
