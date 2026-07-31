export type EngineeringLinkType =
  | "satisfies"
  | "implements"
  | "verifies"
  | "depends-on"
  | "affects"
  | "derived-from";

export interface EngineeringLink {
  readonly id: string;

  readonly sourceId: string;
  readonly targetId: string;

  readonly type: EngineeringLinkType;

  readonly description?: string;

  readonly createdAt: string;
}
