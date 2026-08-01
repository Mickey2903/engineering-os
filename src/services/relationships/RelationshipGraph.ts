import type { Relationship } from "../../models/Relationship";

export class RelationshipGraph {
  private readonly relationships: readonly Relationship[];

  private readonly outgoingMap = new Map<string, readonly Relationship[]>();

  private readonly incomingMap = new Map<string, readonly Relationship[]>();

  private readonly nodeIds = new Set<string>();

  public constructor(relationships: readonly Relationship[]) {
    this.relationships = relationships;

    const outgoing = new Map<string, Relationship[]>();
    const incoming = new Map<string, Relationship[]>();

    for (const relationship of relationships) {
      this.nodeIds.add(relationship.sourceId);
      this.nodeIds.add(relationship.targetId);

      const outgoingRelationships = outgoing.get(relationship.sourceId) ?? [];

      outgoingRelationships.push(relationship);
      outgoing.set(relationship.sourceId, outgoingRelationships);

      const incomingRelationships = incoming.get(relationship.targetId) ?? [];

      incomingRelationships.push(relationship);
      incoming.set(relationship.targetId, incomingRelationships);
    }

    for (const [id, values] of outgoing) {
      this.outgoingMap.set(id, values);
    }

    for (const [id, values] of incoming) {
      this.incomingMap.set(id, values);
    }
  }

  public all(): readonly Relationship[] {
    return this.relationships;
  }

  public outgoing(id: string): readonly Relationship[] {
    return this.outgoingMap.get(id) ?? [];
  }

  public incoming(id: string): readonly Relationship[] {
    return this.incomingMap.get(id) ?? [];
  }

  public hasNode(id: string): boolean {
    return this.nodeIds.has(id);
  }

  public neighbors(id: string): readonly string[] {
    return this.outgoing(id).map((relationship) => relationship.targetId);
  }
  public dependencies(id: string): readonly string[] {
  return this.outgoing(id)
    .map(
      (relationship) =>
        relationship.targetId,
    );
}


public dependents(id: string): readonly string[] {
  return this.incoming(id)
    .map(
      (relationship) =>
        relationship.sourceId,
    );
}

  public hasRelationship(sourceId: string, targetId: string): boolean {
    return this.outgoing(sourceId).some((relationship) => relationship.targetId === targetId);
  }
}
