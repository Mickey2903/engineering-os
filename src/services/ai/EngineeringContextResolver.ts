import type { EngineeringDatabase } from "../../database/EngineeringDatabase";
import { ContextRankingService } from "./memory/ContextRankingService";

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
  private readonly rankingService: ContextRankingService,
  private readonly database: EngineeringDatabase,
) {}

 public resolve(
  question: string,
  activeObjectId?: string,
): ResolvedEngineeringContext {


  const ranked =
    this.rankingService.rank(
      question,
    );


  console.log(
    "Context matches:",
    ranked.map(
      (object) => ({
        id: object.objectId,
        title: object.objectTitle,
        score: object.score,
        reason: object.reason,
      }),
    ),
  );

if (ranked.length > 0) {

  const topMatch =
    ranked[0];


  return {

    objects:
      ranked.map(
        (object) => ({
          objectId:
            object.objectId,

          objectTitle:
            object.objectTitle,

          objectType:
            object.objectType,

          confidence:
            object.score >= 80
              ? "high"
              : "medium",
        }),
      ),


    confidence:
      topMatch !== undefined &&
      topMatch.score >= 80
        ? "high"
        : "medium",

  };

}



  if (activeObjectId) {

    const activeObject =
      this.database.all()
        .find(
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
