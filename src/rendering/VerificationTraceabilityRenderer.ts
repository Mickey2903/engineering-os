import type { VerificationTraceabilityEntry } from "../models/VerificationTraceabilityEntry";

export class VerificationTraceabilityRenderer {
  public render(
    entries: readonly VerificationTraceabilityEntry[],
  ): string {
    const lines: string[] = [];

    lines.push("# Verification Traceability Matrix");
    lines.push("");

    lines.push(
      "| Requirement | Components | Verification | Status |",
    );

    lines.push(
      "|---|---|---|---|",
    );

    for (const entry of entries) {
      const components =
        entry.componentIds.length > 0
          ? entry.componentIds.join(", ")
          : "-";

      const verifications =
        entry.verificationIds.length > 0
          ? entry.verificationIds.join(", ")
          : "-";

      const status =
        entry.status === "verified"
          ? "✅ Verified"
          : entry.status === "partial"
            ? "⚠ Partial"
            : "❌ Missing";

      lines.push(
        `| ${entry.requirementId} | ${components} | ${verifications} | ${status} |`,
      );
    }

    return lines.join("\n");
  }
}
