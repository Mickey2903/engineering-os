import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import { HealthService } from "./HealthService";
import { ImpactAnalysisService } from "./ImpactAnalysisService";
import { TraceabilityService } from "./TraceabilityService";

export class EngineeringServices {
  public readonly traceability: TraceabilityService;
  public readonly health: HealthService;
  public readonly impactAnalysis: ImpactAnalysisService;

  public constructor(database: EngineeringDatabase) {
    this.traceability = new TraceabilityService(database);
    this.health = new HealthService(database);
    this.impactAnalysis = new ImpactAnalysisService(database);
  }
}
