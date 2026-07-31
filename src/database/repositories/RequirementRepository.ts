import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isRequirement } from "../../models/EngineeringEntity";
import type { Requirement } from "../../models/Requirement";
import { BaseRepository } from "./BaseRepository";

export class RequirementRepository extends BaseRepository<Requirement> {
  public constructor(database: EngineeringDatabase) {
    super(database, isRequirement);
  }

  public findByDomain(domain: Requirement["domain"]): readonly Requirement[] {
    return this.findWhere((requirement) => requirement.domain === domain);
  }

  public findByPriority(priority: Requirement["priority"]): readonly Requirement[] {
    return this.findWhere((requirement) => requirement.priority === priority);
  }

  public findByStatus(status: Requirement["status"]): readonly Requirement[] {
    return this.findWhere((requirement) => requirement.status === status);
  }

  public findByTag(tag: string): readonly Requirement[] {
    return this.findWhere((requirement) => requirement.tags.includes(tag));
  }
}
