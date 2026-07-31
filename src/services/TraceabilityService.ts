import type { EngineeringDatabaseReader } from "../database/EngineeringDatabaseReader";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { Relationship } from "../models/Relationship";
import type { Requirement } from "../models/Requirement";
import type { TraceabilitySnapshot } from "../models/TraceabilitySnapshot";
import { GraphAlgorithms } from "./graph/GraphAlgorithms";
import { RelationshipService } from "./RelationshipService";

export class TraceabilityService {
  private readonly relationships;

  public constructor(private readonly database: EngineeringDatabaseReader) {
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
    const missingComponents = this.findRequirementsWithoutComponents();

    return {
      requirementCount: this.countRequirements(),
      tracedRequirementCount: this.countTracedRequirements(),
      missingComponentCount: missingComponents.length,
      missingVerificationCount: this.countMissingVerifications(),
      missingComponents,
    };
  }

  private requirements(): readonly Requirement[] {
    return this.database
      .findByType("requirement")
      .filter((entity): entity is Requirement => entity.type === "requirement");
  }

  private countRequirements(): number {
    return this.requirements().length;
  }

  private countTracedRequirements(): number {
    return this.requirements().filter(
      (requirement) => this.findReachableEntities(requirement.id).length > 0,
    ).length;
  }

  private findRequirementsWithoutComponents() {
    return this.requirements().filter(
      (requirement) =>
        !this.findReachableEntities(requirement.id).some((entity) => entity.type === "component"),
    );
  }

  private countMissingVerifications(): number {
    return this.requirements().filter(
      (requirement) =>
        !this.findReachableEntities(requirement.id).some(
          (entity) => entity.type === "verification",
        ),
    ).length;
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
