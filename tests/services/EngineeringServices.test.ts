import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { EngineeringServices } from "../../src/services/EngineeringServices";

describe("EngineeringServices", () => {
  it("creates all engineering services", () => {
    const database = new EngineeringDatabase();

    const services = new EngineeringServices(database);

    expect(services.traceability).toBeDefined();
    expect(services.health).toBeDefined();
    expect(services.impactAnalysis).toBeDefined();
  });
});
