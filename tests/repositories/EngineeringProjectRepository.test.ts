import { describe, expect, it } from "vitest";

import { EngineeringProjectRepository } from "../../src/repositories/EngineeringProjectRepository";

describe("EngineeringProjectRepository", () => {
  it("stores multiple engineering projects", () => {
    const repository =
      new EngineeringProjectRepository();

    repository.add({
      id: "PLC-001",
      name: "Modular PLC",
      description: "Industrial controller",
      type: "embedded",
      status: "development",
      createdAt: "2026-07-31",
      updatedAt: "2026-07-31",
    });

    repository.add({
      id: "ROB-001",
      name: "Mars Rover",
      description: "Robotics platform",
      type: "robotics",
      status: "testing",
      createdAt: "2026-07-31",
      updatedAt: "2026-07-31",
    });

    expect(repository.count())
      .toBe(2);

    expect(repository.findById("PLC-001")?.type)
      .toBe("embedded");
  });
});
