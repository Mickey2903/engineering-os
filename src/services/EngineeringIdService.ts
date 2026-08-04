import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { EngineeringObjectType } from "../models/EngineeringObject";


const prefixMap: Record<EngineeringObjectType, string> = {

  requirement:
    "REQ",

  component:
    "CMP",

  verification:
    "TEST",

  risk:
    "RISK",

  adr:
    "ADR",

  architecture:
    "ARCH",

  interface:
    "INT",

  document:
    "DOC",

  "test-case":
    "TEST",

  "manufacturing-item":
    "MFG",

  software:
    "SW",

  cad:
    "CAD",

  file:
    "FILE",

  unknown:
    "OBJ",

};

export class EngineeringIdService {


  public constructor(
    private readonly database:
      EngineeringDatabase,
  ) {}



  public generate(
    type: EngineeringObjectType,
  ): string {


    const prefix =
      prefixMap[type]
      ?? "OBJ";


    const existingIds =
      this.database
        .all()
        .map(
          entity => entity.id,
        );


    let counter = 1;


    while (
      existingIds.includes(
        `${prefix}-${counter.toString().padStart(3, "0")}`,
      )
    ) {

      counter++;

    }


    return `${prefix}-${counter
      .toString()
      .padStart(3, "0")}`;

  }

}
