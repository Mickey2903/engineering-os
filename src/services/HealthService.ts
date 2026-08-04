import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type {
  EngineeringHealthIssue,
} from "../models/EngineeringHealthIssue";
import { RelationshipGraph } from "./relationships/RelationshipGraph";
import { RelationshipService } from "./RelationshipService";
export interface BrokenLink {
  readonly entityId: string;
  readonly brokenLinkId: string;
}

export interface DuplicateRelationship {
  readonly sourceId: string;
  readonly targetId: string;
}

export interface HealthReport {

  readonly brokenLinks: readonly BrokenLink[];

  readonly orphanEntities: readonly EngineeringEntity[];

  readonly entitiesWithoutIncomingLinks: readonly EngineeringEntity[];

  readonly entitiesWithoutOutgoingLinks: readonly EngineeringEntity[];

  readonly duplicateRelationships: readonly DuplicateRelationship[];

readonly engineeringIssues?:
  readonly EngineeringHealthIssue[];
readonly requirementsWithoutImplementation?:
  readonly EngineeringEntity[];

readonly componentsWithoutVerification?:
  readonly EngineeringEntity[];

}
export class HealthService {

  private readonly graph: RelationshipGraph;


public constructor(
  private readonly database: EngineeringDatabase,

  graph?: RelationshipGraph,
) {

  this.graph =
    graph
    ??
    new RelationshipService(
      database,
    )
    .buildGraph();

}


public findRequirementsWithoutImplementation():
readonly EngineeringEntity[] {

  return this.database
    .findByType("requirement")
    .filter(
      (requirement) => {

        return this.graph
          .outgoing(
            requirement.id,
          )
          .every(
            (relationship) =>
              relationship.type !== "implements",
          );

      },
    );

}

  public findComponentsWithoutVerification():
readonly EngineeringEntity[] {

  return this.database
    .findByType("component")
    .filter(
      (component) => {

        return this.graph
          .outgoing(
            component.id,
          )
          .every(
            (relationship) =>
              relationship.type !== "verifies",
          );

      },
    );

}
public findOrphanEntities(): readonly EngineeringEntity[] {
    const entities = this.database.all();

    const linkedIds = new Set(entities.flatMap((entity) => entity.links));

    return entities.filter((entity) => entity.links.length === 0 && !linkedIds.has(entity.id));
  }
public findEngineeringIssues():
readonly EngineeringHealthIssue[] {


  const issues:
    EngineeringHealthIssue[] = [];


  for (
    const entity of this.database.all()
  ) {


    // Requirement zonder implementatie
    if (
      entity.type === "requirement"
      &&
      entity.links.length === 0
    ) {

      issues.push({

        entity,

        type:
          "missing-implementation",

        severity:
          "high",

        message:
          "Requirement has no implementing component.",

      });

    }



    // Component zonder verificatie
    if (
      entity.type === "component"
      &&
      entity.links.length === 0
    ) {

      issues.push({

        entity,

        type:
          "missing-verification",

        severity:
          "medium",

        message:
          "Component has no verification relation.",

      });

    }


  }


  return issues;

}
  public findEntitiesWithoutIncomingLinks(): readonly EngineeringEntity[] {
    const entities = this.database.all();
    const linkedIds = new Set(entities.flatMap((entity) => entity.links));

    return entities.filter((entity) => !linkedIds.has(entity.id));
  }

  public findEntitiesWithoutOutgoingLinks(): readonly EngineeringEntity[] {
    return this.database.all().filter((entity) => entity.links.length === 0);
  }

  public findDuplicateRelationships(): readonly DuplicateRelationship[] {
    return this.database.all().flatMap((entity) => {
      const seenTargetIds = new Set<string>();
      const duplicateTargetIds = new Set<string>();

      for (const targetId of entity.links) {
        if (seenTargetIds.has(targetId)) {
          duplicateTargetIds.add(targetId);
        } else {
          seenTargetIds.add(targetId);
        }
      }

      return [...duplicateTargetIds].map((targetId) => ({
        sourceId: entity.id,
        targetId,
      }));
    });
  }

 public healthReport(): HealthReport {
  return {

    engineeringIssues:
      this.findEngineeringIssues(),

    brokenLinks:
      this.findBrokenLinks(),

    orphanEntities:
      this.findOrphanEntities(),

    entitiesWithoutIncomingLinks:
      this.findEntitiesWithoutIncomingLinks(),

    entitiesWithoutOutgoingLinks:
      this.findEntitiesWithoutOutgoingLinks(),

    duplicateRelationships:
      this.findDuplicateRelationships(),

    requirementsWithoutImplementation:
      this.findRequirementsWithoutImplementation(),

    componentsWithoutVerification:
      this.findComponentsWithoutVerification(),

  };
}

  public findBrokenLinks(): readonly BrokenLink[] {
    return this.database.all().flatMap((entity) =>
      entity.links
        .filter((linkedId) => this.database.findById(linkedId) === undefined)
        .map((brokenLinkId) => ({
          entityId: entity.id,
          brokenLinkId,
        })),
    );
  }
}
