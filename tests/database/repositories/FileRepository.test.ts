import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { FileRepository } from "../../../src/database/repositories/FileRepository";
import type { EngineeringFile } from "../../../src/models/EngineeringFile";


describe("FileRepository", () => {

  it("finds files by extension", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new FileRepository(database);


    const file: EngineeringFile = {
      id: "FILE-001",
      type: "file",
      title: "CPU Board",
      status: "active",
      tags: [
        "hardware",
        "kicad",
      ],
      sourcePath:
        "Projects/PLC100/Hardware/CPU_Board.kicad_sch",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      path:
        "Projects/PLC100/Hardware/CPU_Board.kicad_sch",

      extension:
        "kicad_sch",

      fileType:
        "cad",
    };


    database.upsert(file);


    const result =
      repository.findByExtension(
        "kicad_sch",
      );


    expect(result)
      .toHaveLength(1);

    expect(result[0]?.id)
      .toBe("FILE-001");
  });


  it("finds files linked to an object", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new FileRepository(database);


    database.upsert({
      id: "FILE-002",
      type: "file",
      title: "Datasheet",
      status: "active",
      tags: [],
      sourcePath:
        "Documentation/datasheet.pdf",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      path:
        "Documentation/datasheet.pdf",

      extension:
        "pdf",

      fileType:
        "document",

      linkedObjectId:
        "CMP-001",
    });


    const result =
      repository.findLinkedTo(
        "CMP-001",
      );


    expect(result)
      .toHaveLength(1);

    expect(result[0]?.id)
      .toBe("FILE-002");
  });

});
