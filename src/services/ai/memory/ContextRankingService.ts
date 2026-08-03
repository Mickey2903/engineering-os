import type { EngineeringDatabase } from "../../../database/EngineeringDatabase";


export interface RankedEngineeringObject {

  objectId: string;

  objectTitle: string;

  objectType: string;

  score: number;

  reason: string;

}



export class ContextRankingService {


  public constructor(
    private readonly database: EngineeringDatabase,
  ) {}



  public rank(
    question: string,
  ): RankedEngineeringObject[] {


    const objects =
      this.database.all();


    const normalizedQuestion =
      question.toLowerCase();


    const ranked =
      objects.map(
        (object) => {


          let score = 0;

          const reasons:
            string[] = [];



          // ID match
          if (
            normalizedQuestion.includes(
              object.id.toLowerCase(),
            )
          ) {

            score += 100;

            reasons.push(
              "ID match",
            );

          }



          const normalizedTitle =
            object.title.toLowerCase();

const tags =
  object.tags
    ?.map(
      (tag) =>
        tag.toLowerCase(),
    )
    ?? [];

          // Exact title match
          if (
            normalizedQuestion.includes(
              normalizedTitle,
            )
          ) {

            score += 80;

            reasons.push(
              "title match",
            );

          }

const matchedTags =
  tags.filter(
    (tag) =>
      normalizedQuestion.includes(
        tag,
      ),
  );


if (
  matchedTags.length > 0
) {

  score +=
    matchedTags.length * 25;


  reasons.push(
    `matched tags: ${matchedTags.join(", ")}`,
  );

}

          // Word matching
          const words =
            normalizedTitle
              .split(/\s+/)
              .filter(
                (word) =>
                  word.length > 2,
              );



          const matchedWords =
            words.filter(
              (word) =>
                normalizedQuestion.includes(
                  word,
                ),
            );



          if (
            matchedWords.length > 0
          ) {

            score +=
              matchedWords.length * 20;


            reasons.push(
              `matched words: ${matchedWords.join(", ")}`,
            );

          }



          return {

            objectId:
              object.id,

            objectTitle:
              object.title,

            objectType:
              object.type,

            score,

            reason:
              reasons.join("; "),

          };

        },
      );



    return ranked
      .filter(
        (object) =>
          object.score > 0,
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )
      .slice(
        0,
        5,
      );

  }

}
