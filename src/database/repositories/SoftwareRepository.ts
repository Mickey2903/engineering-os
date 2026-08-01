import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isSoftware } from "../../models/EngineeringEntity";
import type { EngineeringSoftware } from "../../models/EngineeringSoftware";
import { BaseRepository } from "./BaseRepository";

export class SoftwareRepository extends BaseRepository<EngineeringSoftware> {

  public constructor(
    database: EngineeringDatabase,
  ) {
    super(database, isSoftware);
  }

  public findByLanguage(
    language: string,
  ): readonly EngineeringSoftware[] {
    return this.findWhere(
      (software) => software.language === language,
    );
  }
}
