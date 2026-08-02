import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { CadRepository } from "../../../src/database/repositories/CadRepository";
import type { EngineeringCad } from "../../../src/models/EngineeringCad";


describe("CadRepository", () => {

  it("finds CAD files by tool", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new CadRepository(database);


    const cad: EngineeringCad = {
      id: "CAD-001",
      type: "cad",
      title: "CPU Board",
      status: "active",
      tags: [
        "hardware",
      ],
      sourcePath:
        "Hardware/CPU_Board.kicad_pcb",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      projectId:
  "PLC100",

filePaths: [
  "Hardware/CPU_Board.kicad_pcb",
],

tool:
  "kicad",
    };


    database.upsert(cad);


    const result =
      repository.findByTool(
  "kicad",
);


    expect(result)
      .toHaveLength(1);

    expect(result[0]?.id)
      .toBe("CAD-001");
  });


  it("finds CAD files by project", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new CadRepository(database);


    database.upsert({
      id: "CAD-002",
      type: "cad",
      title: "Mechanical model",
      status: "active",
      tags: [],
      sourcePath:
        "Mechanical/frame.step",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      projectId:
  "PLC100",

filePaths: [
  "Mechanical/frame.step",
],

tool:
  "other",
    });


    expect(
      repository.findByProject("PLC100"),
    ).toHaveLength(1);

  });

});
