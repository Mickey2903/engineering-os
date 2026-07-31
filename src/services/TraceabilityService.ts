import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { Relationship } from "../models/Relationship";
import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";
import { GraphAlgorithms } from "./graph/GraphAlgorithms";
import { RelationshipService } from "./RelationshipService";

export class TraceabilityService {
  private readonly relationships;

  public constructor(private readonly database: EngineeringDatabase) {
    this.relationships = new RelationshipService(database).buildGraph();
  }

  public findReachableEntities(entityId: string): readonly EngineeringEntity[] {
    const algorithms = new GraphAlgorithms(this.relationships);

    return algorithms
      .findReachable(entityId)
      .map((reachableId) => this.database.findById(reachableId))
      .filter((entity): entity is EngineeringEntity => entity !== undefined);
  }

  public findShortestPathEntities(
    sourceId: string,
    targetId: string,
  ): readonly EngineeringEntity[] {
    const algorithms = new GraphAlgorithms(this.relationships);

    return algorithms
      .shortestPath(sourceId, targetId)
      .map((entityId) => this.database.findById(entityId))
      .filter((entity): entity is EngineeringEntity => entity !== undefined);
  }

  public findDirectLinks(entityId: string): readonly EngineeringEntity[] {
    return this.relationships
      .outgoing(entityId)
      .filter((relationship) => relationship.type === "link")
      .map((relationship) => this.database.findById(relationship.targetId))
      .filter((entity): entity is EngineeringEntity => entity !== undefined);
  }

  public findBacklinks(entityId: string): readonly EngineeringEntity[] {
    return this.relationships
      .incoming(entityId)
      .filter((relationship) => relationship.type === "link")
      .map((relationship) => this.database.findById(relationship.sourceId))
      .filter((entity): entity is EngineeringEntity => entity !== undefined);
  }

  public findBrokenLinkIds(entityId: string): readonly string[] {
    return this.relationships
      .outgoing(entityId)
      .filter((relationship) => relationship.type === "link")
      .map((relationship) => relationship.targetId)
      .filter((targetId) => this.database.findById(targetId) === undefined);
  }

  public createSnapshot(): TraceabilitySnapshot {
    return {
      requirementCount: this.database.findByType("requirement").length,
      tracedRequirementCount: this.database
        .findByType("requirement")
        .filter((requirement) => this.findReachableEntities(requirement.id).length > 0).length,
      missingComponentCount: 0,
      missingVerificationCount: 0,
    };
  }

  public hasDirectLink(sourceId: string, targetId: string): boolean {
    return this.relationships
      .outgoing(sourceId)
      .some(
        (relationship: Relationship) =>
          relationship.type === "link" && relationship.targetId === targetId,
      );
  }
}
