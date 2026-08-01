import type { ImpactAnalysisReport } from "../models/ImpactAnalysisReport";
import type { EngineeringRelationshipService } from "./EngineeringRelationshipService";
import type { EngineeringDatabase } from "../database/EngineeringDatabase";


export class ImpactAnalysisService {

  public constructor(
    private readonly relationships: EngineeringRelationshipService,
    private readonly database: EngineeringDatabase,
  ) {}


  public analyze(
    objectId: string,
  ): ImpactAnalysisReport {

    const affected =
      this.relationships.findImpact(
        objectId,
      );


    return {

      rootObjectId: objectId,

      affectedObjects:
        affected,


      affectedComponents:
        affected.filter(
          (id) =>
            this.database.findById(id)?.type === "component",
        ),


      affectedRequirements:
        affected.filter(
          (id) =>
            this.database.findById(id)?.type === "requirement",
        ),


      affectedTests:
        affected.filter(
          (id) =>
            this.database.findById(id)?.type === "test-case",
        ),

    };

  }

}
