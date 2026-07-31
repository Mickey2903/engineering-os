import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import { isAdr, isVerification } from "../models/EngineeringEntity";
import type { Relationship } from "../models/Relationship";
import { RelationshipGraph } from "./relationships/RelationshipGraph";

export class RelationshipService {
  public constructor(private readonly database: EngineeringDatabase) {}

  public buildGraph(): RelationshipGraph {
    const relationships: Relationship[] = [];

    for (const entity of this.database.all()) {
      for (const targetId of entity.links) {
        relationships.push({
          sourceId: entity.id,
          targetId,
          type: "link",
        });
      }

      if (isVerification(entity)) {
        for (const requirementId of entity.requirementIds) {
          relationships.push({
            sourceId: entity.id,
            targetId: requirementId,
            type: "verifies",
          });

          relationships.push({
            sourceId: requirementId,
            targetId: entity.id,
            type: "verified-by",
          });
        }
      }

      if (isAdr(entity) && entity.supersedesId !== undefined) {
        relationships.push({
          sourceId: entity.id,
          targetId: entity.supersedesId,
          type: "supersedes",
        });

        relationships.push({
          sourceId: entity.supersedesId,
          targetId: entity.id,
          type: "superseded-by",
        });
      }
    }

    return new RelationshipGraph(relationships);
  }
}
