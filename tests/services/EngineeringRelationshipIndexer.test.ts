import { describe, expect, it } from "vitest";

import { EngineeringRelationshipIndexer } from "../../src/services/EngineeringRelationshipIndexer";
import { EngineeringRelationshipService } from "../../src/services/EngineeringRelationshipService";

describe("EngineeringRelationshipIndexer", () => {
  it("creates links from object metadata", () => {
    const relationshipService =
      new EngineeringRelationshipService();

    const indexer =
      new EngineeringRelationshipIndexer(
        relationshipService,
      );

    indexer.indexObject({
      id: "CPU-001",
      type: "component",
      title: "CPU Controller Module",
      lifecycle: "active",
      status: "approved",
      tags: [],
      sourcePath: "Engineering/Components/CPU-001.md",
      links: [],
      modifiedTime: 0,
      metadata: {
        implements: [
          "REQ-001",
        ],
      },
    });

    const links =
      relationshipService.getLinks();

    expect(links).toHaveLength(1);
    expect(links[0]?.sourceId).toBe("CPU-001");
    expect(links[0]?.targetId).toBe("REQ-001");
    expect(links[0]?.type).toBe("implements");
  });
});
