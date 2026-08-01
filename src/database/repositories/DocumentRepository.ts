import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isDocument } from "../../models/EngineeringEntity";
import type { EngineeringDocument } from "../../models/EngineeringDocument";
import { BaseRepository } from "./BaseRepository";

export class DocumentRepository extends BaseRepository<EngineeringDocument> {

  public constructor(
    database: EngineeringDatabase,
  ) {
    super(database, isDocument);
  }

  public findByCategory(
    category: EngineeringDocument["category"],
  ): readonly EngineeringDocument[] {
    return this.findWhere(
      (document) =>
        document.category === category,
    );
  }

  public findByProject(
    projectId: string,
  ): readonly EngineeringDocument[] {
    return this.findWhere(
      (document) =>
        document.projectId === projectId,
    );
  }
}
