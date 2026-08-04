export const relationshipTypes = [
  "link",

  "implements",
  "implemented-by",

  "verifies",
  "verified-by",

  "uses",
  "used-by",

  "contains",
  "contained-by",

  "supersedes",
  "superseded-by",

  "documented-by",
  "derived-from",
  "derived-into",

] as const;


export type RelationshipType =
  typeof relationshipTypes[number];


export interface Relationship {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: RelationshipType;
}
