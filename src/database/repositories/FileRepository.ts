import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isFile } from "../../models/EngineeringEntity";
import type { EngineeringFile } from "../../models/EngineeringFile";
import { BaseRepository } from "./BaseRepository";

export class FileRepository extends BaseRepository<EngineeringFile> {

  public constructor(
    database: EngineeringDatabase,
  ) {
    super(database, isFile);
  }

  public findByExtension(
    extension: string,
  ): readonly EngineeringFile[] {
    return this.findWhere(
      (file) => file.extension === extension,
    );
  }

  public findLinkedTo(
    objectId: string,
  ): readonly EngineeringFile[] {
    return this.findWhere(
      (file) => file.linkedObjectId === objectId,
    );
  }
}
