import type { ImpactAnalysisReport } from "../models/ImpactAnalysisReport";
import type { EngineeringRelationshipService } from "./EngineeringRelationshipService";
import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { EngineeringEntity } from "../models/EngineeringEntity";

export class ImpactAnalysisService {
  public constructor(
    private readonly relationships: EngineeringRelationshipService,
    private readonly database: EngineeringDatabase,
  ) {}

  public analyze(
    objectId: string,
  ): ImpactAnalysisReport {

    const affectedIds =
      this.relationships.findImpact(objectId);

    const affectedObjects =
      affectedIds
        .map((id) => this.database.findById(id))
        .filter(
          (object): object is EngineeringEntity =>
            object !== undefined,
        );

    return {
      rootObjectId: objectId,

      affectedObjects:
        affectedIds,

      affectedComponents:
        affectedObjects
          .filter(
            (object) =>
              object.type === "component",
          )
          .map(
            (object) =>
              object.id,
          ),

      affectedRequirements:
        affectedObjects
          .filter(
            (object) =>
              object.type === "requirement",
          )
          .map(
            (object) =>
              object.id,
          ),

      affectedTests:
        affectedObjects
          .filter(
            (object) =>
              object.type === "verification",
          )
          .map(
            (object) =>
              object.id,
          ),
    };
  }
}
