export type EngineeringTrendDirection =
  | "improving"
  | "declining"
  | "stable";

export interface EngineeringTrendReport {
  readonly currentScore: number;
  readonly previousScore: number;
  readonly scoreChange: number;
  readonly direction: EngineeringTrendDirection;
  readonly strongestMetric: string;
}
