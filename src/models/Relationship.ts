export type RelationshipType = "link" | "verifies" | "verified-by" | "supersedes" | "superseded-by";

export interface Relationship {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: RelationshipType;
}
