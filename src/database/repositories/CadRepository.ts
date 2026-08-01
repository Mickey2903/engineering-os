import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isCad } from "../../models/EngineeringEntity";
import type { EngineeringCad } from "../../models/EngineeringCad";
import { BaseRepository } from "./BaseRepository";

export class CadRepository extends BaseRepository<EngineeringCad> {

  public constructor(
    database: EngineeringDatabase,
  ) {
    super(database, isCad);
  }

  public findByTool(
    tool: EngineeringCad["tool"],
  ): readonly EngineeringCad[] {
    return this.findWhere(
      (cad) => cad.tool === tool,
    );
  }

  public findByProject(
    projectId: string,
  ): readonly EngineeringCad[] {
    return this.findWhere(
      (cad) => cad.projectId === projectId,
    );
  }
}
