import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { VerificationCoverageService } from "../../src/services/VerificationCoverageService";

function requirement(id: string) {
  return {
    id,
    type: "requirement" as const,
    title: id,
    status: "approved" as const,
    tags: [],
    sourcePath: `Requirements/${id}.md`,
    links: [],
    modifiedTime: 1,
    metadata: {},
    domain: "system" as const,
    priority: "medium" as const,
    acceptanceCriteria: ["OK"],
  };
}

function verification(id: string, requirementIds: string[]) {
  return {
    id,
    type: "verification" as const,
    title: id,
    status: "verified" as const,
    tags: [],
    sourcePath: `Verification/${id}.md`,
    links: [],
    modifiedTime: 1,
    metadata: {
      requirementIds,
    },
  };
}

describe("VerificationCoverageService", () => {
  it("returns empty coverage report", () => {
    const service = new VerificationCoverageService(
      new EngineeringDatabase(),
    );

    expect(service.analyze()).toEqual({
      requirementCount: 0,
      verifiedRequirementCount: 0,
      missingVerificationCount: 0,
      coveragePercentage: 0,
      missingVerifications: [],
    });
  });

  it("counts verified requirements", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001"));
    database.upsert(requirement("REQ-002"));
    database.upsert(verification("VER-001", ["REQ-001"]));

    const service = new VerificationCoverageService(database);

    const report = service.analyze();

    expect(report.requirementCount).toBe(2);
    expect(report.verifiedRequirementCount).toBe(1);
    expect(report.missingVerificationCount).toBe(1);
    expect(report.coveragePercentage).toBe(50);
  });

  it("lists missing verifications", () => {
    const database = new EngineeringDatabase();

    database.upsert(requirement("REQ-001"));

    const service = new VerificationCoverageService(database);

    const report = service.analyze();

    expect(report.missingVerifications[0]?.requirementId).toBe("REQ-001");
  });
});
