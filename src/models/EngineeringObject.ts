export type EngineeringObjectType =
  | "requirement"
  | "component"
  | "verification"
  | "adr"
  | "risk"
  | "architecture"
  | "interface"
  | "test-case"
    | "manufacturing-item"
  | "document"
  | "cad"
  | "software"
  | "file"
  | "unknown";

export type EngineeringStatus =
  | "draft"
  | "proposed"
  | "approved"
  | "active"
  | "verified"
  | "rejected"
  | "deprecated"
  | "obsolete"
  | "closed"
  | "unknown";

export interface EngineeringObject {
  readonly id: string;
  readonly type: EngineeringObjectType;
  readonly title: string;
  readonly status: EngineeringStatus;
  readonly tags: readonly string[];
  readonly sourcePath: string;
  readonly links: readonly string[];
  readonly createdTime?: number;
  readonly modifiedTime: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}
