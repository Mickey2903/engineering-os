import type { EngineeringDatabase } from "./EngineeringDatabase";
import {
  AdrRepository,
  ComponentRepository,
  RequirementRepository,
  RiskRepository,
  VerificationRepository,
} from "./repositories";

export class EngineeringWorkspace {
  public readonly requirements: RequirementRepository;
  public readonly components: ComponentRepository;
  public readonly verifications: VerificationRepository;
  public readonly risks: RiskRepository;
  public readonly adrs: AdrRepository;

  public constructor(private readonly database: EngineeringDatabase) {
    this.requirements = new RequirementRepository(database);
    this.components = new ComponentRepository(database);
    this.verifications = new VerificationRepository(database);
    this.risks = new RiskRepository(database);
    this.adrs = new AdrRepository(database);
  }

  public getDatabase(): EngineeringDatabase {
    return this.database;
  }

  public clear(): void {
    this.database.clear();
  }

  public count(): number {
    return this.database.count();
  }
}
