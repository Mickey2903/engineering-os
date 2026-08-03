import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { EngineeringKnowledgeGraphService } from "../../src/services/knowledge/EngineeringKnowledgeGraphService";
import { EngineeringContextService } from "../../src/services/knowledge/EngineeringContextService";
import { RelationshipService } from "../../src/services/RelationshipService";


describe("EngineeringContextService", () => {

  it("generates context for an engineering object", () => {

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

      links: [
        "FILE-001",
      ],

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
        "cad",
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


    const knowledgeGraph =
      new EngineeringKnowledgeGraphService(
        database,
      );


    const snapshot =
      knowledgeGraph.createSnapshot();


    const contextService =
      new EngineeringContextService(
  snapshot,
  database,
);


    const context =
      contextService.generateContext(
        "CMP-001",
      );


    expect(context.root?.id)
      .toBe("CMP-001");


    expect(context.related)
      .toHaveLength(1);


    expect(context.related[0]?.id)
      .toBe("FILE-001");

  });


  it("returns empty related objects when no relations exist", () => {

    const database =
      new EngineeringDatabase();


    database.upsert({
      id: "REQ-001",
      type: "requirement",
      title: "Supply voltage",

      status:
        "active",

      tags: [],

      sourcePath:
        "Requirements/REQ-001.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},
    });


    const knowledgeGraph =
      new EngineeringKnowledgeGraphService(
        database,
      );


    const snapshot =
      knowledgeGraph.createSnapshot();


    const contextService =
      new EngineeringContextService(
  snapshot,
  database,
);


    const context =
      contextService.generateContext(
        "REQ-001",
      );


    expect(context.root?.id)
      .toBe("REQ-001");


    expect(context.related)
      .toHaveLength(0);

  });

});
