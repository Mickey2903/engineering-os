import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isRisk } from "../../models/EngineeringEntity";
import type { Risk } from "../../models/Risk";
import { BaseRepository } from "./BaseRepository";

export class RiskRepository extends BaseRepository<Risk> {
  public constructor(database: EngineeringDatabase) {
    super(database, isRisk);
  }

  public findByLevel(level: Risk["level"]): readonly Risk[] {
    return this.findWhere((risk) => risk.level === level);
  }

  public findByState(riskState: Risk["riskState"]): readonly Risk[] {
    return this.findWhere((risk) => risk.riskState === riskState);
  }

  public findByOwner(owner: string): readonly Risk[] {
    return this.findWhere((risk) => risk.owner === owner);
  }

  public findByMinimumProbability(minimumProbability: number): readonly Risk[] {
    return this.findWhere(
      (risk) => risk.probability !== undefined && risk.probability >= minimumProbability,
    );
  }

  public findByMinimumImpact(minimumImpact: number): readonly Risk[] {
    return this.findWhere((risk) => risk.impact !== undefined && risk.impact >= minimumImpact);
  }

  public findByTag(tag: string): readonly Risk[] {
    return this.findWhere((risk) => risk.tags.includes(tag));
  }
}
