import type { EngineeringObject } from "./EngineeringObject";
export type RiskLevel = "critical" | "high" | "medium" | "low" | "unknown";
export type RiskState = "open" | "mitigating" | "accepted" | "closed" | "unknown";
export interface Risk extends EngineeringObject {
  readonly type: "risk";
  readonly probability?: number;
  readonly impact?: number;
  readonly level: RiskLevel;
  readonly riskState: RiskState;
  readonly mitigation?: string;
  readonly owner?: string;
}
