import type { VerificationTraceabilityEntry } from "../models/VerificationTraceabilityEntry";
import type { EngineeringRelationshipService } from "./EngineeringRelationshipService";

export class VerificationTraceabilityService {
  public constructor(
    private readonly relationships: EngineeringRelationshipService,
  ) {}

  public analyze(
    requirementIds: readonly string[],
  ): readonly VerificationTraceabilityEntry[] {
    return requirementIds.map((requirementId) => {
      const components =
        this.relationships
          .getOutgoingLinks(requirementId)
          .filter((link) =>
            link.type === "implements",
          )
          .map((link) => link.targetId);

      const verifications =
        components.flatMap((componentId) =>
          this.relationships
            .getOutgoingLinks(componentId)
            .filter((link) =>
              link.type === "verifies",
            )
            .map((link) => link.targetId),
        );

      return {
        requirementId,
        componentIds: components,
        verificationIds: verifications,
        status:
          verifications.length > 0
            ? "verified"
            : components.length > 0
              ? "partial"
              : "missing",
      };
    });
  }
}
