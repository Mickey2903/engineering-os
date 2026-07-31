import type { EngineeringDatabaseReader } from "../database/EngineeringDatabaseReader";
import type { Requirement } from "../models/Requirement";
import { isRequirement } from "../models/EngineeringEntity";
import type { RequirementIssue } from "../models/RequirementIssue";
import type {
  RequirementQualityEntry,
  RequirementQualityReport,
} from "../models/RequirementQualityReport";

export class RequirementQualityService {
  public constructor(private readonly database: EngineeringDatabaseReader) {}

  public analyze(): RequirementQualityReport {
    const requirements = this.database
      .findByType("requirement")
      .filter(isRequirement);

    const entries = requirements.map((requirement) =>
      this.analyzeRequirement(requirement),
    );

    const averageScore =
      entries.length === 0
        ? 0
        : Math.round(
            entries.reduce((sum, entry) => sum + entry.score, 0) /
              entries.length,
          );

    return {
      requirementCount: requirements.length,
      averageScore,
      entries,
    };
  }

  private analyzeRequirement(requirement: Requirement): RequirementQualityEntry {
    const issues: RequirementIssue[] = [];
    let score = 100;

    if (!requirement.description) {
      score -= 10;
      issues.push(this.issue(requirement, "missing-description", "Missing description."));
    }

    if (!requirement.rationale) {
      score -= 10;
      issues.push(this.issue(requirement, "missing-rationale", "Missing rationale."));
    }

    if (requirement.acceptanceCriteria.length === 0) {
      score -= 25;
      issues.push(
        this.issue(
          requirement,
          "missing-acceptance-criteria",
          "Missing acceptance criteria.",
        ),
      );
    }

    if (!requirement.verificationMethod) {
      score -= 20;
      issues.push(
        this.issue(
          requirement,
          "missing-verification-method",
          "Missing verification method.",
        ),
      );
    }

    const hasComponentLink = requirement.links.some((id) =>
      this.database.findById(id)?.type === "component",
    );

    if (!hasComponentLink) {
      score -= 20;
      issues.push(
        this.issue(
          requirement,
          "missing-component-link",
          "Missing component link.",
        ),
      );
    }

    return {
      requirementId: requirement.id,
      title: requirement.title,
      score: Math.max(0, score),
      issues,
    };
  }

  private issue(
    requirement: Requirement,
    type: RequirementIssue["type"],
    message: string,
  ): RequirementIssue {
    return {
      requirementId: requirement.id,
      title: requirement.title,
      type,
      message,
    };
  }
}
