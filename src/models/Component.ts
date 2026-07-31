import type { EngineeringObject } from "./EngineeringObject";
export type ComponentLifecycle =
  "concept" | "prototype" | "active" | "not-recommended" | "end-of-life" | "obsolete" | "unknown";
export interface Component extends EngineeringObject {
  readonly type: "component";
  readonly manufacturer?: string;
  readonly partNumber?: string;
  readonly datasheet?: string;
  readonly lifecycle: ComponentLifecycle;
}
