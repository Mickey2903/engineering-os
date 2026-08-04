import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import { HealthService } from "./HealthService";
import { ImpactAnalysisService } from "./ImpactAnalysisService";
import { TraceabilityService } from "./TraceabilityService";
import { RelationshipService } from "./RelationshipService";


export class EngineeringServices {

  public readonly traceability:
    TraceabilityService;

  public readonly health:
    HealthService;

  public readonly impactAnalysis:
    ImpactAnalysisService;


  public constructor(
    database: EngineeringDatabase,
  ) {

    const graph =
      new RelationshipService(
        database,
      )
      .buildGraph();


    this.traceability =
      new TraceabilityService(
        database,
      );


    this.health =
      new HealthService(
        database,
        graph,
      );


    this.impactAnalysis =
      new ImpactAnalysisService(
        database,
      );

  }

}
