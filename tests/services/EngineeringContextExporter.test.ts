import { describe, expect, it } from "vitest";

import type { EngineeringContext } from "../../src/models/EngineeringContext";
import { EngineeringContextExporter } from "../../src/services/knowledge/EngineeringContextExporter";


describe("EngineeringContextExporter", () => {

  it("exports engineering context", () => {

    const context: EngineeringContext = {

      root: {
        id: "CMP-001",
        type: "component",
        title: "CPU Module",
        status: "active",
        tags: [],
        sourcePath: "Components/CMP-001.md",
        links: [],
        modifiedTime: Date.now(),
        metadata: {},
        lifecycle: "prototype",
      },

      related: [
  {
    entity: {
      id: "FILE-001",
      type: "file",
      title: "CPU Board",
      status: "active",
      tags: [],
      sourcePath: "Hardware/CPU_Board.kicad_pcb",
      links: [],
      modifiedTime: Date.now(),
      metadata: {},
      path: "Hardware/CPU_Board.kicad_pcb",
      extension: "kicad_pcb",
      fileType: "cad",
    },

    relationship: {
      sourceId: "CMP-001",
      targetId: "FILE-001",
      type: "link",
    },
  },
],

    };


    const exporter =
      new EngineeringContextExporter();


    const result =
      exporter.export(context);


    expect(result.rootId)
      .toBe("CMP-001");


    expect(result.rootType)
      .toBe("component");


    expect(result.objects)
      .toHaveLength(2);


    expect(result.objects[0]?.id)
      .toBe("CMP-001");


    expect(result.objects[1]?.id)
      .toBe("FILE-001");
      
      expect(result.objects[0])
  .toMatchObject({
    id: "CMP-001",
    title: "CPU Module",
    sourcePath: "Components/CMP-001.md",
    tags: [],
  });

  });


  it("does not export undefined root fields", () => {

    const context: EngineeringContext = {

      root: undefined,

      related: [],

    };


    const exporter =
      new EngineeringContextExporter();


    const result =
      exporter.export(context);


    expect(result.rootId)
      .toBeUndefined();


    expect(result.rootType)
      .toBeUndefined();


    expect(result.objects)
      .toHaveLength(0);

  });

});
