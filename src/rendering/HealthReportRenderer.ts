import type { EngineeringEntity } from "../models/EngineeringEntity";
import type {
  BrokenLink,
  DuplicateRelationship,
  HealthReport,
} from "../services/HealthService";


export function renderHealthReport(
  report: HealthReport,
): string {

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
    `- Requirements without implementation: ${String(report.requirementsWithoutImplementation?.length ?? 0)}`,
    `- Components without verification: ${String(report.componentsWithoutVerification?.length ?? 0)}`,
    `- Engineering issues: ${String(report.engineeringIssues?.length ?? 0)}`,

    "",
    "---",
    "",


    "## Broken links",
    "",
    renderBrokenLinks(
      report.brokenLinks,
    ),

    "",

    "## Orphan entities",
    "",
    renderEntities(
      report.orphanEntities,
      "No orphan entities found.",
    ),

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
    renderDuplicateRelationships(
      report.duplicateRelationships,
    ),

    "",

    "## Engineering Quality",
    "",

    "### Requirements without implementation",
    "",
    renderEntities(
      report.requirementsWithoutImplementation ?? [],
      "All requirements have an implementation.",
    ),

    "",

    "### Components without verification",
    "",
    renderEntities(
      report.componentsWithoutVerification ?? [],
      "All components have verification relations.",
    ),

    "",

    "### Engineering issues",
    "",
    renderEngineeringIssues(
      report.engineeringIssues ?? [],
    ),

    "",

  ].join("\n");

}


function renderBrokenLinks(
  brokenLinks: readonly BrokenLink[],
): string {

  if (
    brokenLinks.length === 0
  ) {
    return "No broken links found.";
  }


  return brokenLinks
    .map(
      ({ entityId, brokenLinkId }) =>
        `- \`${entityId}\` links to missing entity \`${brokenLinkId}\``,
    )
    .join("\n");

}



function renderEntities(
  entities: readonly EngineeringEntity[],
  emptyMessage: string,
): string {

  if (
    entities.length === 0
  ) {
    return emptyMessage;
  }


  return entities
    .map(
      (entity) =>
        `- \`${entity.id}\` — ${entity.title}`,
    )
    .join("\n");

}



function renderDuplicateRelationships(
  relationships: readonly DuplicateRelationship[],
): string {

  if (
    relationships.length === 0
  ) {
    return "No duplicate relationships found.";
  }


  return relationships
    .map(
      ({ sourceId, targetId }) =>
        `- \`${sourceId}\` links multiple times to \`${targetId}\``,
    )
    .join("\n");

}


function renderEngineeringIssues(
  issues: readonly {
    entity: EngineeringEntity;
    type: string;
    severity: string;
    message: string;
  }[],
): string {

  if (
    issues.length === 0
  ) {
    return "No engineering issues found.";
  }


  return issues
    .map(
      (issue) =>
        [
          `### ${issue.entity.id} — ${issue.entity.title}`,
          "",
          `- Type: ${issue.type}`,
          `- Severity: ${issue.severity}`,
          `- Message: ${issue.message}`,
        ].join("\n"),
    )
    .join("\n\n");

}
