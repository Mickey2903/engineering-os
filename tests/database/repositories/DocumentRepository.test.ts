import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { DocumentRepository } from "../../../src/database/repositories/DocumentRepository";


describe("DocumentRepository", () => {

  it("finds documents by category", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new DocumentRepository(database);


    database.upsert({
      id: "DOC-001",
      type: "document",
      title: "User Manual",
      status: "active",
      tags: [],

      sourcePath:
        "Documentation/manual.pdf",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      projectId:
        "PLC100",

      category:
        "manual",
    });


    const result =
      repository.findByCategory(
        "manual",
      );


    expect(result)
      .toHaveLength(1);

  });


  it("finds documents by project", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new DocumentRepository(database);


    database.upsert({
      id: "DOC-002",
      type: "document",
      title: "Datasheet",
      status: "active",
      tags: [],

      sourcePath:
        "Documentation/datasheet.pdf",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      projectId:
        "PLC100",

      category:
        "datasheet",
    });


    expect(
      repository.findByProject("PLC100"),
    ).toHaveLength(1);

  });

});
