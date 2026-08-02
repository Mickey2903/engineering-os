import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { SoftwareRepository } from "../../../src/database/repositories/SoftwareRepository";


describe("SoftwareRepository", () => {

  it("finds software by language", () => {

    const database =
      new EngineeringDatabase();

    const repository =
      new SoftwareRepository(database);


    database.upsert({
      id: "SW-001",
      type: "software",
      title: "Firmware",
      status: "active",
      tags: [],

      sourcePath:
        "Software/main.cpp",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      language:
        "C++",
    });


    const result =
      repository.findByLanguage(
        "C++",
      );


    expect(result)
      .toHaveLength(1);

    expect(result[0]?.id)
      .toBe("SW-001");

  });

});
