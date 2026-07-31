export interface EngineeringMetricSnapshot {
  readonly date: string;
  readonly overallScore: number;
  readonly healthScore: number;
  readonly requirementQualityScore: number;
  readonly verificationCoverageScore: number;
  readonly traceabilityScore: number;
}
