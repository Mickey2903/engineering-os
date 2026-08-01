import type { WorkspaceStatusReport } from "../models/WorkspaceStatusReport";


export class WorkspaceStatusRenderer {

  public render(
    report: WorkspaceStatusReport,
  ): string {

    return [
      "# Workspace Status",
      "",
      "## Workspace",
      "",
      `Version: ${String(report.workspaceVersion)}`,
      "",
      "## Engineering Objects",
      "",
      "| Type | Count |",
      "| --- | ---: |",
      `| Requirements | ${String(report.requirements)} |`,
      `| Components | ${String(report.components)} |`,
      `| Risks | ${String(report.risks)} |`,
      "",
      "## Index",
      "",
      `Indexed objects: ${String(report.indexedObjects)}`,
      "",
      "## Verification",
      "",
      `Coverage: ${String(report.verificationCoverage)}%`,
      "",
    ].join("\n");

  }

}
