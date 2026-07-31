import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import { HealthService } from "./HealthService";
import { ImpactAnalysisService } from "./ImpactAnalysisService";
import { TraceabilityService } from "./TraceabilityService";
import { EngineeringRelationshipService } from "./EngineeringRelationshipService";

export class EngineeringServices {
  public readonly traceability: TraceabilityService;
  public readonly health: HealthService;
  public readonly impactAnalysis: ImpactAnalysisService;
  public readonly relationships: EngineeringRelationshipService;

  public constructor(database: EngineeringDatabase) {
    this.traceability = new TraceabilityService(database);
    this.health = new HealthService(database);

    this.relationships =
      new EngineeringRelationshipService();

    this.impactAnalysis =
      new ImpactAnalysisService(
        this.relationships,
      );
  }
}
