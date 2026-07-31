import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { BrokenLink, DuplicateRelationship, HealthReport } from "../services/HealthService";

export function renderHealthReport(report: HealthReport): string {
  return [
    "# Engineering Health Report",
    "",
    "## Summary",
    "",
    `- Broken links: ${String(report.brokenLinks.length)}`,
    `- Orphan entities: ${String(report.orphanEntities.length)}`,
    `- Entities without incoming links: ${String(report.entitiesWithoutIncomingLinks.length)}`,
    `- Entities without outgoing links: ${String(report.entitiesWithoutOutgoingLinks.length)}`,
    `- Duplicate relationships: ${String(report.duplicateRelationships.length)}`,
    "",
    "---",
    "",
    "## Broken links",
    "",
    renderBrokenLinks(report.brokenLinks),
    "",
    "## Orphan entities",
    "",
    renderEntities(report.orphanEntities, "No orphan entities found."),
    "",
    "## Entities without incoming links",
    "",
    renderEntities(
      report.entitiesWithoutIncomingLinks,
      "Every entity has at least one incoming link.",
    ),
    "",
    "## Entities without outgoing links",
    "",
    renderEntities(
      report.entitiesWithoutOutgoingLinks,
      "Every entity has at least one outgoing link.",
    ),
    "",
    "## Duplicate relationships",
    "",
    renderDuplicateRelationships(report.duplicateRelationships),
    "",
  ].join("\n");
}

function renderBrokenLinks(brokenLinks: readonly BrokenLink[]): string {
  if (brokenLinks.length === 0) {
    return "No broken links found.";
  }

  return brokenLinks
    .map(
      ({ entityId, brokenLinkId }) =>
        `- \`${entityId}\` links to missing entity \`${brokenLinkId}\``,
    )
    .join("\n");
}

function renderEntities(entities: readonly EngineeringEntity[], emptyMessage: string): string {
  if (entities.length === 0) {
    return emptyMessage;
  }

  return entities.map((entity) => `- \`${entity.id}\` — ${entity.title}`).join("\n");
}

function renderDuplicateRelationships(relationships: readonly DuplicateRelationship[]): string {
  if (relationships.length === 0) {
    return "No duplicate relationships found.";
  }

  return relationships
    .map(({ sourceId, targetId }) => `- \`${sourceId}\` links multiple times to \`${targetId}\``)
    .join("\n");
}
