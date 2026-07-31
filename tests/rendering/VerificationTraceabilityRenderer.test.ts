import { describe, expect, it } from "vitest";

import { VerificationTraceabilityRenderer } from "../../src/rendering/VerificationTraceabilityRenderer";

describe("VerificationTraceabilityRenderer", () => {
  it("renders verification traceability matrix", () => {
    const renderer =
      new VerificationTraceabilityRenderer();

    const markdown =
      renderer.render([
        {
          requirementId: "REQ-001",
          componentIds: [
            "CPU-001",
          ],
          verificationIds: [
            "TEST-001",
          ],
          status: "verified",
        },
      ]);

    expect(markdown)
      .toContain("# Verification Traceability Matrix");

    expect(markdown)
      .toContain("REQ-001");

    expect(markdown)
      .toContain("CPU-001");

    expect(markdown)
      .toContain("TEST-001");

    expect(markdown)
      .toContain("✅ Verified");
  });
});
