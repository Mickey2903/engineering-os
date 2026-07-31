import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { DashboardService } from "../../src/services/DashboardService";
import { DashboardStatisticsService } from "../../src/services/DashboardStatisticsService";
import { RequirementQualityService } from "../../src/services/RequirementQualityService";
import { VerificationCoverageService } from "../../src/services/VerificationCoverageService";
import { TraceabilityService } from "../../src/services/TraceabilityService";
import { EngineeringIntelligenceService } from "../../src/services/EngineeringIntelligenceService";

import { EngineeringIntelligenceEngine } from "../../src/intelligence/EngineeringIntelligenceEngine";
describe("EngineeringIntelligenceService", () => {
  it("returns zero scores for empty database", () => {
    const database = new EngineeringDatabase();

    const service = new EngineeringIntelligenceService(
      new DashboardService({
        getRequirements: () => database.findByType("requirement"),
        getComponents: () => database.findByType("component"),
        getVerifications: () => database.findByType("verification"),
        getRisks: () => database.findByType("risk"),
        getAdrs: () => database.findByType("adr"),
      }),
      new DashboardStatisticsService(),
      new RequirementQualityService(database),
      new VerificationCoverageService(database),
      new TraceabilityService(database),
      new EngineeringIntelligenceEngine([]),
database,
    );

    const report = service.analyze();

    expect(report.overallScore).toBe(0);
    expect(report.healthScore).toBe(100);
  });
  it("calculates maturity score with engineering data", () => {
    const database = new EngineeringDatabase();

    database.upsert({
      id: "REQ-001",
      type: "requirement",
      title: "Emergency stop",
      status: "approved",
      tags: [],
      sourcePath: "Requirements/REQ-001.md",
      links: [],
      modifiedTime: 1,
      metadata: {},
      domain: "safety",
      priority: "high",
      acceptanceCriteria: [
        "System stops immediately",
      ],
    });

    const service = new EngineeringIntelligenceService(
      new DashboardService({
        getRequirements: () => database.findByType("requirement"),
        getComponents: () => database.findByType("component"),
        getVerifications: () => database.findByType("verification"),
        getRisks: () => database.findByType("risk"),
        getAdrs: () => database.findByType("adr"),
      }),
      new DashboardStatisticsService(),
      new RequirementQualityService(database),
      new VerificationCoverageService(database),
      new TraceabilityService(database),
      new EngineeringIntelligenceEngine([]),
database,
    );

    const report = service.analyze();

    expect(report.requirementQualityScore).toBeGreaterThan(0);
    expect(report.overallScore).toBeGreaterThan(0);
  });
  it("detects improvement areas", () => {
    const database = new EngineeringDatabase();

    database.upsert({
      id: "REQ-001",
      type: "requirement",
      title: "Test requirement",
      status: "draft",
      tags: [],
      sourcePath: "Requirements/REQ-001.md",
      links: [],
      modifiedTime: 1,
      metadata: {},
      domain: "system",
      priority: "medium",
      acceptanceCriteria: [],
    });

    const service = new EngineeringIntelligenceService(
      new DashboardService({
        getRequirements: () => database.findByType("requirement"),
        getComponents: () => database.findByType("component"),
        getVerifications: () => database.findByType("verification"),
        getRisks: () => database.findByType("risk"),
        getAdrs: () => database.findByType("adr"),
      }),
      new DashboardStatisticsService(),
      new RequirementQualityService(database),
      new VerificationCoverageService(database),
      new TraceabilityService(database),
      new EngineeringIntelligenceEngine([]),
database,
    );

    const report = service.analyze();

    expect(report.improvementAreas.length).toBeGreaterThan(0);

    expect(
      report.improvementAreas.some(
        (area) => area.category === "verification",
      ),
    ).toBe(true);
  });
});
