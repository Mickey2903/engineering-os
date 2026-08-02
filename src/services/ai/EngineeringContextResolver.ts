import type { EngineeringDatabase } from "../../database/EngineeringDatabase";


export interface ResolvedEngineeringContext {

  objectId?: string;

  confidence:
    "high" | "medium" | "none";

}


export class EngineeringContextResolver {

  public constructor(
    private readonly database:
      EngineeringDatabase,
  ) {}


  public resolve(
    question: string,
    activeObjectId?: string,
  ): ResolvedEngineeringContext {


    // 1. Actief geopend object heeft hoogste prioriteit
    if (activeObjectId) {

      return {
        objectId:
          activeObjectId,

        confidence:
          "high",
      };

    }


    // 2. Zoek object IDs in vraag
    const objects =
      this.database.all();


    const match =
      objects.find(
        (object) =>
          question.includes(
            object.id,
          ),
      );


    if (match) {

      return {
        objectId:
          match.id,

        confidence:
          "medium",
      };

    }


    // 3. Geen context gevonden

    return {
      confidence:
        "none",
    };

  }

}
