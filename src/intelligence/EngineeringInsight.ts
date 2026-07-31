export type InsightSeverity =
  | "info"
  | "warning"
  | "critical";

export interface EngineeringInsight {
  readonly id: string;
  readonly severity: InsightSeverity;
  readonly title: string;
  readonly description: string;
  readonly objectId?: string;
  readonly recommendation?: string;
}
