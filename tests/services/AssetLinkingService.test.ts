import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { AssetLinkingService } from "../../src/services/AssetLinkingService";


describe("AssetLinkingService", () => {

  it("creates documented-by relationship from component datasheet", () => {

    const database =
      new EngineeringDatabase();


    database.upsert({
      id: "CMP-001",
      type: "component",
      title: "STM32 CPU Module",
      status: "active",

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
        "active",

      datasheet:
        "STM32H743.pdf",
    });


    database.upsert({
      id: "FILE-001",
      type: "file",
      title:
        "STM32H743.pdf",

      status:
        "active",

      tags: [
        "datasheet",
      ],

      sourcePath:
        "Documentation/STM32H743.pdf",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      path:
        "Documentation/STM32H743.pdf",

      extension:
        "pdf",

      fileType:
        "document",
    });


    const service =
      new AssetLinkingService(
        database,
      );


    const relationships =
      service.findAssetLinks();


    expect(relationships)
      .toHaveLength(1);


    expect(relationships[0]?.sourceId)
      .toBe("CMP-001");


    expect(relationships[0]?.targetId)
      .toBe("FILE-001");


    expect(relationships[0]?.type)
      .toBe("documented-by");

  });


  it("does not create relationship when datasheet is missing", () => {

    const database =
      new EngineeringDatabase();


    database.upsert({
      id: "CMP-002",
      type: "component",
      title: "Controller",
      status: "active",

      tags: [],

      sourcePath:
        "Components/CMP-002.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      lifecycle:
        "prototype",
    });


    const service =
      new AssetLinkingService(
        database,
      );


    expect(
      service.findAssetLinks(),
    )
    .toHaveLength(0);

  });

});
