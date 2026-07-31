import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import { TraceabilityService } from "./TraceabilityService";

export class ImpactAnalysisService {
  private readonly traceability: TraceabilityService;

  public constructor(database: EngineeringDatabase) {
    this.traceability = new TraceabilityService(database);
  }

  public findImpactedEntities(entityId: string): readonly EngineeringEntity[] {
    return this.traceability.findReachableEntities(entityId);
  }
}
