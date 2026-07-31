import { isRequirement } from "../models/EngineeringEntity";
import type { EngineeringDatabase } from "../database/EngineeringDatabase";
import type { VerificationCoverageReport } from "../models/VerificationCoverageReport";

export class VerificationCoverageService {
  public constructor(private readonly database: EngineeringDatabase) {}

  public analyze(): VerificationCoverageReport {
    const requirements = this.database
      .findByType("requirement")
      .filter(isRequirement);

    const missingVerifications = requirements
      .filter((requirement) => !this.hasVerification(requirement.id))
      .map((requirement) => ({
        requirementId: requirement.id,
        title: requirement.title,
      }));

    const verifiedRequirementCount =
      requirements.length - missingVerifications.length;

    const coveragePercentage =
      requirements.length === 0
        ? 0
        : Math.round((verifiedRequirementCount / requirements.length) * 100);

    return {
      requirementCount: requirements.length,
      verifiedRequirementCount,
      missingVerificationCount: missingVerifications.length,
      coveragePercentage,
      missingVerifications,
    };
  }

  private hasVerification(requirementId: string): boolean {
    return this.database
      .findByType("verification")
      .some((verification) =>
        verification.metadata.requirementIds instanceof Array
          ? verification.metadata.requirementIds.includes(requirementId)
          : false,
      );
  }
}
