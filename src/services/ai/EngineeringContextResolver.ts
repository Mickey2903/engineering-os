import type { EngineeringDatabase } from "../../database/EngineeringDatabase";


export interface ResolvedEngineeringObject {

  objectId: string;

  objectTitle: string;

  objectType: string;

  confidence:
    "high" | "medium" | "low";

}


export interface ResolvedEngineeringContext {

  objects: ResolvedEngineeringObject[];

  confidence:
    "high" | "medium" | "low" | "none";

}


export class EngineeringContextResolver {

  public constructor(
    private readonly database: EngineeringDatabase,
  ) {}


  public resolve(
    question: string,
    activeObjectId?: string,
  ): ResolvedEngineeringContext {

    const objects =
      this.database.all();


    const normalizedQuestion =
      question.toLowerCase();


const matches =
  objects.filter(
    (object) => {

      const idMatch =
        normalizedQuestion.includes(
          object.id.toLowerCase(),
        );


      if (idMatch) {
        return true;
      }


      const normalizedTitle =
        object.title.toLowerCase();


      if (
        normalizedQuestion.includes(
          normalizedTitle,
        )
      ) {
        return true;
      }


      const titleWords =
        normalizedTitle
          .split(/\s+/)
          .filter(
            (word) =>
              word.length > 2,
          );


      const matchedWords =
        titleWords.filter(
          (word) =>
            normalizedQuestion.includes(
              word,
            ),
        );


      return matchedWords.length >= 2;

    },
  );


console.log(
  "Context matches:",
  matches.map(
    (object) => ({
      id: object.id,
      title: object.title,
    }),
  ),
);

   if (matches.length > 0) {

      return {
  objects:
    matches.map(
      (object) => ({
        objectId:
          object.id,

        objectTitle:
          object.title,

        objectType:
          object.type,

        confidence:
          "medium",
      }),
    ),

  confidence:
    "medium",
};

    }


    if (activeObjectId) {

      const activeObject =
        objects.find(
          (object) =>
            object.id === activeObjectId,
        );


      if (activeObject !== undefined) {

        return {

          objects: [
            {
              objectId:
                activeObject.id,

              objectTitle:
                activeObject.title,

              objectType:
                activeObject.type,

              confidence:
                "high",
            },
          ],

          confidence:
            "high",

        };

      }

    }


    return {

      objects: [],

      confidence:
        "none",

    };

  }

}
