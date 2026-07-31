import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isVerification } from "../../models/EngineeringEntity";
import type { Verification } from "../../models/Verification";
import { BaseRepository } from "./BaseRepository";

export class VerificationRepository extends BaseRepository<Verification> {
  public constructor(database: EngineeringDatabase) {
    super(database, isVerification);
  }

  public findByMethod(method: Verification["method"]): readonly Verification[] {
    return this.findWhere((verification) => verification.method === method);
  }

  public findByRequirement(requirementId: string): readonly Verification[] {
    return this.findWhere((verification) => verification.requirementIds.includes(requirementId));
  }

  public findByResult(result: Verification["result"]): readonly Verification[] {
    return this.findWhere((verification) => verification.result === result);
  }

  public findByTag(tag: string): readonly Verification[] {
    return this.findWhere((verification) => verification.tags.includes(tag));
  }
}
