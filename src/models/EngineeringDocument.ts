export type EngineeringDocumentType =
  "requirement" | "verification" | "component" | "adr" | "risk" | "architecture" | "unknown";

export interface EngineeringDocument {
  readonly id: string;
  readonly title: string;
  readonly type: EngineeringDocumentType;
  readonly status?: string;
  readonly sourcePath: string;
  readonly links: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly modifiedTime: number;
}
