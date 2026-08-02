import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { EngineeringKnowledgeGraphService } from "../../src/services/knowledge/EngineeringKnowledgeGraphService";


describe("EngineeringKnowledgeGraphService", () => {

  it("creates knowledge graph snapshot", () => {

    const database =
      new EngineeringDatabase();


    database.upsert({
      id: "CMP-001",
      type: "component",
      title: "CPU Module",

      status:
        "active",

      tags: [
        "hardware",
      ],

      sourcePath:
        "Components/CMP-001.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      lifecycle:
        "prototype",
    });


    database.upsert({
      id: "FILE-001",
      type: "file",
      title: "CPU Board",

      status:
        "active",

      tags: [
        "kicad",
      ],

      sourcePath:
        "Hardware/CPU_Board.kicad_pcb",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      path:
        "Hardware/CPU_Board.kicad_pcb",

      extension:
        "kicad_pcb",

      fileType:
        "cad",
    });


    const service =
      new EngineeringKnowledgeGraphService(
        database,
      );


    const snapshot =
      service.createSnapshot();


    expect(snapshot.objects)
      .toHaveLength(2);


    expect(snapshot.relationships)
      .toHaveLength(0);


    expect(snapshot.graph)
      .toBeDefined();


  });

});
