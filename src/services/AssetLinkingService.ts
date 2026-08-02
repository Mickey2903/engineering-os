import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import {
  isComponent,
  isFile,
} from "../models/EngineeringEntity";
import type { Relationship } from "../models/Relationship";


export class AssetLinkingService {

  public constructor(
    private readonly database: EngineeringDatabase,
  ) {}


  public findAssetLinks(): readonly Relationship[] {

    const relationships: Relationship[] = [];


    const entities =
      this.database.all();


    const components =
      entities.filter(isComponent);


    const files =
      entities.filter(isFile);


    for (const component of components) {

      if (!component.datasheet) {
        continue;
      }


      const file =
  files.find(
    (candidate) =>
      candidate.title === component.datasheet
      ||
      (
        component.datasheet !== undefined
        &&
        candidate.path.endsWith(component.datasheet)
      ),
  );


      if (!file) {
        continue;
      }


      relationships.push({
        sourceId: component.id,
        targetId: file.id,
        type: "documented-by",
      });

    }


    return relationships;
  }
}

