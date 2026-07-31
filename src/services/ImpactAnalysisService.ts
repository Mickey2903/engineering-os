import type { ImpactAnalysisReport } from "../models/ImpactAnalysisReport";
import type { EngineeringRelationshipService } from "./EngineeringRelationshipService";

export class ImpactAnalysisService {
  public constructor(
    private readonly relationships: EngineeringRelationshipService,
  ) {}

  public analyze(
    objectId: string,
  ): ImpactAnalysisReport {
    const affected =
      this.relationships.findImpact(objectId);

    return {
      rootObjectId: objectId,

      affectedObjects: affected,

      affectedComponents:
        affected.filter((id) =>
          id.includes("COMP"),
        ),

      affectedRequirements:
        affected.filter((id) =>
          id.includes("REQ"),
        ),

      affectedTests:
        affected.filter((id) =>
          id.includes("TEST"),
        ),
    };
  }
}
