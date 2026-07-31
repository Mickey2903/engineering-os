import type { EngineeringProjectDashboard } from "../models/EngineeringProjectDashboard";
import type { EngineeringDatabaseReader } from "../database/EngineeringDatabaseReader";
import type { EngineeringProjectRepository } from "../repositories/EngineeringProjectRepository";

import { ProjectDatabaseView } from "../database/ProjectDatabaseView";

import { RequirementQualityService } from "./RequirementQualityService";
import { VerificationCoverageService } from "./VerificationCoverageService";
import { TraceabilityService } from "./TraceabilityService";
import { HealthService } from "./HealthService";

export class EngineeringProjectDashboardService {
  public constructor(
    private readonly database: EngineeringDatabaseReader,
    private readonly projects: EngineeringProjectRepository,
  ) {}

  public generate(
    projectId: string,
  ): EngineeringProjectDashboard {
    const project =
      this.projects.findById(projectId);

    if (!project) {
      throw new Error(
        `Project "${projectId}" not found.`,
      );
    }

    const projectDatabase =
      new ProjectDatabaseView(
        this.database,
        projectId,
      );

    const entities =
      projectDatabase.all();

    const requirementQuality =
      new RequirementQualityService(
        projectDatabase,
      ).analyze();

    const verificationCoverage =
      new VerificationCoverageService(
        projectDatabase,
      ).analyze();

    const traceability =
      new TraceabilityService(
        projectDatabase,
      ).createSnapshot();

    const health =
      new HealthService(
        projectDatabase,
      ).healthReport();

    return {
      projectId,
      projectName: project.name,

      requirementCount:
        entities.filter(
          (entity) =>
            entity.type === "requirement",
        ).length,

      componentCount:
        entities.filter(
          (entity) =>
            entity.type === "component",
        ).length,

      verificationCount:
        entities.filter(
          (entity) =>
            entity.type === "verification",
        ).length,

      riskCount:
        entities.filter(
          (entity) =>
            entity.type === "risk",
        ).length,

      adrCount:
        entities.filter(
          (entity) =>
            entity.type === "adr",
        ).length,

      requirementQualityScore:
        requirementQuality.averageScore,

      verificationCoverageScore:
        verificationCoverage.coveragePercentage,

      traceabilityScore:
        traceability.requirementCount === 0
          ? 0
          : Math.round(
              (traceability.tracedRequirementCount /
                traceability.requirementCount) *
                100,
            ),

      healthScore:
        Math.max(
          0,
          100 -
            health.brokenLinks.length -
            health.duplicateRelationships.length,
        ),
    };
  }
}
