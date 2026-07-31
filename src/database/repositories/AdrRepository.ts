import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isAdr } from "../../models/EngineeringEntity";
import type { Adr } from "../../models/Adr";
import { BaseRepository } from "./BaseRepository";

export class AdrRepository extends BaseRepository<Adr> {
  public constructor(database: EngineeringDatabase) {
    super(database, isAdr);
  }

  public findByDecisionStatus(decisionStatus: Adr["decisionStatus"]): readonly Adr[] {
    return this.findWhere((adr) => adr.decisionStatus === decisionStatus);
  }

  public findBySupersedesId(supersedesId: string): readonly Adr[] {
    return this.findWhere((adr) => adr.supersedesId === supersedesId);
  }

  public findWithDecision(): readonly Adr[] {
    return this.findWhere((adr) => adr.decision !== undefined && adr.decision.trim().length > 0);
  }

  public findWithContext(): readonly Adr[] {
    return this.findWhere((adr) => adr.context !== undefined && adr.context.trim().length > 0);
  }

  public findByTag(tag: string): readonly Adr[] {
    return this.findWhere((adr) => adr.tags.includes(tag));
  }
}
