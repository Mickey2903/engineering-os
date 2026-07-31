import type { EngineeringDatabaseReader } from "../database/EngineeringDatabaseReader";
import type { EngineeringEntity } from "../models/EngineeringEntity";

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
}

export class HealthService {
  public constructor(private readonly database: EngineeringDatabaseReader) {}

  public findOrphanEntities(): readonly EngineeringEntity[] {
    const entities = this.database.all();

    const linkedIds = new Set(entities.flatMap((entity) => entity.links));

    return entities.filter((entity) => entity.links.length === 0 && !linkedIds.has(entity.id));
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
      brokenLinks: this.findBrokenLinks(),
      orphanEntities: this.findOrphanEntities(),
      entitiesWithoutIncomingLinks: this.findEntitiesWithoutIncomingLinks(),
      entitiesWithoutOutgoingLinks: this.findEntitiesWithoutOutgoingLinks(),
      duplicateRelationships: this.findDuplicateRelationships(),
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
