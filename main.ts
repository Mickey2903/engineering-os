import { Notice, Plugin, TFile } from "obsidian";
import { GenerateTraceabilityReportCommand } from "./src/commands/GenerateTraceabilityReportCommand";
import { GenerateEngineeringReportsCommand } from "./src/commands/GenerateEngineeringReportsCommand";
import { EngineeringReportService } from "./src/services/EngineeringReportService";
import { DashboardService } from "./src/services/DashboardService";
import { DashboardStatisticsService } from "./src/services/DashboardStatisticsService";
import { DashboardRenderer } from "./src/rendering/DashboardRenderer";
import { RunHealthCheckCommand } from "./src/commands/RunHealthCheckCommand";
import { EngineeringCore } from "./src/core/EngineeringCore";
import { ConsoleLogger } from "./src/core/Logger";
import { ObsidianReportWriter } from "./src/obsidian/ObsidianReportWriter";
import { renderHealthReport } from "./src/rendering/HealthReportRenderer";
import { TraceabilityRenderer } from "./src/rendering/TraceabilityRenderer";
import { EngineeringIntelligenceRenderer } from "./src/rendering/EngineeringIntelligenceRenderer";
import { EngineeringTrendRenderer } from "./src/rendering/EngineeringTrendRenderer";
import { ImpactAnalysisRenderer } from "./src/rendering/ImpactAnalysisRenderer";
import { VerificationTraceabilityRenderer } from "./src/rendering/VerificationTraceabilityRenderer";
import { RequirementQualityRenderer } from "./src/rendering/RequirementQualityRenderer";
import { VerificationCoverageRenderer } from "./src/rendering/VerificationCoverageRenderer";
import { RequirementQualityService } from "./src/services/RequirementQualityService";
import { VerificationCoverageService } from "./src/services/VerificationCoverageService";
import { EngineeringServices } from "./src/services/EngineeringServices";
import { ImpactAnalysisService } from "./src/services/ImpactAnalysisService";
import { VerificationTraceabilityService } from "./src/services/VerificationTraceabilityService";
import { ObsidianMetricsStorage } from "./src/obsidian/ObsidianMetricsStorage";
import { EngineeringIntelligenceService } from "./src/services/EngineeringIntelligenceService";
import { EngineeringMetricsHistoryService } from "./src/services/EngineeringMetricsHistoryService";
import { EngineeringTrendService } from "./src/services/EngineeringTrendService";
import { EngineeringMetricsPersistenceService } from "./src/services/EngineeringMetricsPersistenceService";
import { EngineeringMetricsSnapshotService } from "./src/services/EngineeringMetricsSnapshotService";
import { EngineeringMetricsStorageService } from "./src/services/EngineeringMetricsStorageService";
import { GenerateProjectDashboardsCommand } from "./src/commands/GenerateProjectDashboardsCommand";
import { EngineeringProjectRepository } from "./src/repositories/EngineeringProjectRepository";
import { EngineeringProjectDashboardService } from "./src/services/EngineeringProjectDashboardService";
import { EngineeringProjectDashboardRenderer } from "./src/rendering/EngineeringProjectDashboardRenderer";
import { EngineeringIntelligenceEngine } from "./src/intelligence/EngineeringIntelligenceEngine";
import { RequirementQualityRule } from "./src/intelligence/rules/RequirementQualityRule";
import { TraceabilityRule } from "./src/intelligence/rules/TraceabilityRule";
import { VerificationCoverageRule } from "./src/intelligence/rules/VerificationCoverageRule";
import { ComponentHealthRule } from "./src/intelligence/rules/ComponentHealthRule";
import { RiskHealthRule } from "./src/intelligence/rules/RiskHealthRule";
import { ArchitectureHealthRule } from "./src/intelligence/rules/ArchitectureHealthRule";
import { InitializeEngineeringWorkspaceCommand } from "./src/commands/InitializeEngineeringWorkspaceCommand";
import { TemplateDeploymentService } from "./src/services/TemplateDeploymentService";
import { ObsidianTemplateRepository } from "./src/services/ObsidianTemplateRepository";
import { WorkspaceMigrationRunner } from "./src/services/WorkspaceMigrationRunner";
import { WorkspaceMigrationService } from "./src/services/WorkspaceMigrationService";
import { WorkspaceVersionService } from "./src/services/WorkspaceVersionService";

import { Migration001InitialWorkspace } from "./src/migrations/Migration001InitialWorkspace";

export default class PlcEngineeringToolsPlugin extends Plugin {
  private core: EngineeringCore | undefined;

  public override onload(): void {
    const logger = new ConsoleLogger("PLC Engineering Tools");
    this.core = new EngineeringCore(this.app, logger);

    this.app.workspace.onLayoutReady(async () => {

  await this.runWorkspaceMigrations();

  this.core?.initialize();

});

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.core?.updateFile(file);
      }),
    );

    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof TFile) {
          this.core?.removeFile(file.path);
        }
      }),
    );

    this.addCommand({
      id: "show-engineering-index-status",
      name: "Show engineering index status",
      callback: () => {
        const count = this.core?.database.count() ?? 0;

        new Notice(`Engineering index contains ${String(count)} Markdown documents.`);
      },
    });

    this.addCommand({
      id: "run-engineering-health-check",
      name: "Run engineering health check",
      callback: async () => {
        await this.runHealthCheck(logger);
      },
    });

    this.addCommand({
      id: "generate-traceability-report",
      name: "Generate traceability report",
      callback: async () => {
        await this.generateTraceabilityReport(logger);
      },
    });
    
    this.addCommand({
	  id: "generate-project-dashboards",
	  name: "Generate project dashboards",
	  callback: async () => {
	    await this.generateProjectDashboards(logger);
	  },
	});

    this.addCommand({
      id: "generate-engineering-reports",
      name: "Generate engineering reports",
      callback: async () => {
        await this.generateEngineeringReports(logger);
      },
    });

    this.addRibbonIcon("activity", "Engineering Health Check", async () => {
      await this.runHealthCheck(logger);
    });
this.addCommand({
  id: "initialize-engineering-workspace",
  name: "Initialize engineering workspace",
  callback: async () => {
    await this.initializeEngineeringWorkspace();
  },
});
    logger.info("Plugin loaded.");
  }

  private async generateEngineeringReports(logger: ConsoleLogger): Promise<void> {
    if (!this.core) {
      new Notice("Engineering core is not available.");
      return;
    }

    try {
      const database = this.core.database;

      const services = new EngineeringServices(database);
      const intelligenceService =
	  new EngineeringIntelligenceService(
	    new DashboardService({
	      getRequirements: () => database.findByType("requirement"),
	      getComponents: () => database.findByType("component"),
	      getVerifications: () => database.findByType("verification"),
	      getRisks: () => database.findByType("risk"),
	      getAdrs: () => database.findByType("adr"),
	    }),
	    new DashboardStatisticsService(),
  new RequirementQualityService(database),
  new VerificationCoverageService(database),
  services.traceability,

  new EngineeringIntelligenceEngine([
    new RequirementQualityRule(),
    new TraceabilityRule(),
    new VerificationCoverageRule(),
    new ComponentHealthRule(),
     new RiskHealthRule(),
     new ArchitectureHealthRule(),
  ]),

  database,
);

      const reportService = new EngineeringReportService(
        new DashboardService({
          getRequirements: () => database.findByType("requirement"),
          getComponents: () => database.findByType("component"),
          getVerifications: () => database.findByType("verification"),
          getRisks: () => database.findByType("risk"),
          getAdrs: () => database.findByType("adr"),
        }),
        new DashboardStatisticsService(),
        services.traceability,
        services.health,
        new RequirementQualityService(database),
        new VerificationCoverageService(database),
        new EngineeringIntelligenceService(
          new DashboardService({
            getRequirements: () => database.findByType("requirement"),
            getComponents: () => database.findByType("component"),
            getVerifications: () => database.findByType("verification"),
            getRisks: () => database.findByType("risk"),
            getAdrs: () => database.findByType("adr"),
          }),
          new DashboardStatisticsService(),
  new RequirementQualityService(database),
  new VerificationCoverageService(database),
  services.traceability,

  new EngineeringIntelligenceEngine([
    new RequirementQualityRule(),
    new TraceabilityRule(),
    new VerificationCoverageRule(),
    new ComponentHealthRule(),
     new RiskHealthRule(),
     new ArchitectureHealthRule(),
  ]),

  database,

        ),
        new EngineeringMetricsHistoryService(),
        new EngineeringTrendService(),
	new ImpactAnalysisService(
	  services.relationships,
	),
	new VerificationTraceabilityService(
	  services.relationships,
	),
	new DashboardRenderer(),
        new TraceabilityRenderer(),
        new RequirementQualityRenderer(),
        new VerificationCoverageRenderer(),
        new EngineeringIntelligenceRenderer(),
        new EngineeringTrendRenderer(),
	new ImpactAnalysisRenderer(),
        new VerificationTraceabilityRenderer(),
      );

      const writer = new ObsidianReportWriter(this.app.vault);

const command = new GenerateEngineeringReportsCommand(
  reportService,
  writer,
  new EngineeringMetricsPersistenceService(
    new EngineeringMetricsSnapshotService(
      intelligenceService,
    ),
    new EngineeringMetricsHistoryService(),
    new EngineeringMetricsStorageService(
      new ObsidianMetricsStorage(this.app.vault),
    ),
  ),
);

await command.execute();

      new Notice("Engineering reports generated.");
    } catch (error: unknown) {
      logger.error("Failed to generate engineering reports.", error);
      new Notice("Failed to generate engineering reports.");
    }
  }

  private async runHealthCheck(logger: ConsoleLogger): Promise<void> {
    if (!this.core) {
      new Notice("Engineering core is not available.");
      return;
    }

    try {
      const services = new EngineeringServices(this.core.database);
      const writer = new ObsidianReportWriter(this.app.vault);

      const command = new RunHealthCheckCommand(
        services,
        {
          render: renderHealthReport,
        },
        writer,
      );

      await command.execute();

      new Notice("Engineering health report generated at Engineering/Reports/Health Report.md.");
    } catch (error: unknown) {
      logger.error("Failed to generate engineering health report.", error);

      new Notice("Failed to generate the engineering health report.");
    }
  }

private async initializeEngineeringWorkspace(): Promise<void> {
  const templateDeployment =
    new TemplateDeploymentService(
      {
  exists: async (
    path: string,
  ): Promise<boolean> => {
    return (
      this.app.vault.getAbstractFileByPath(path)
      !== null
    );
  },

  write: async (
    path: string,
    content: string,
  ): Promise<void> => {
    const existing =
      this.app.vault.getAbstractFileByPath(path);

    if (existing) {
      return;
    }

    await this.app.vault.create(
      path,
      content,
    );
  },
},
      new ObsidianTemplateRepository(
  this.app.vault.adapter,
  `${this.manifest.dir}/templates`,
),
    );


  const command =
    new InitializeEngineeringWorkspaceCommand(
      {
        createFolder: async (
          path: string,
        ): Promise<void> => {
          const existing =
            this.app.vault.getAbstractFileByPath(path);

          if (!existing) {
            await this.app.vault.createFolder(path);
          }
        },
      },
      templateDeployment,
    );


  try {
    const result =
  await command.execute();

new Notice(
  [
      "Engineering workspace initialized.",
      `Folders created: ${String(result.createdFolders.length)}`,
      `Templates created: ${String(result.createdTemplates.length)}`,
      `Templates skipped: ${String(result.skippedTemplates.length)}`,
    ].join("\n"),
  );

  } catch (error: unknown) {
    new Notice(
      "Failed to initialize engineering workspace.",
    );

    console.error(
      "Initialize workspace failed:",
      error,
    );
  }
}
private async generateProjectDashboards(
  logger: ConsoleLogger,
): Promise<void> {
new Notice("Starting project dashboard generation");
  try {
    const database =
      this.core?.database;

    if (!database) {
      throw new Error(
        "Engineering database is not initialized.",
      );
    }

    const projects =
  this.core?.projects;

if (!projects) {
  throw new Error(
    "Project repository is not initialized.",
  );
}

    const dashboardService =
      new EngineeringProjectDashboardService(
        database,
        projects,
      );

    const renderer =
      new EngineeringProjectDashboardRenderer();

    const writer =
      new ObsidianReportWriter(
        this.app.vault,
      );

    const command =
      new GenerateProjectDashboardsCommand(
        projects,
        dashboardService,
        renderer,
        writer,
      );

    await command.execute();

    new Notice(
      "Project dashboards generated.",
    );
  } catch (error: unknown) {
    logger.error(
      "Failed to generate project dashboards.",
      error,
    );

    new Notice(
      "Failed to generate project dashboards.",
    );
  }
}

  private async generateTraceabilityReport(
  logger: ConsoleLogger,
): Promise<void> {
  if (!this.core) {
    new Notice("Engineering core is not available.");
    return;
  }

  try {
    const services =
      new EngineeringServices(
        this.core.database,
      );

    const renderer =
      new TraceabilityRenderer();

    const writer =
      new ObsidianReportWriter(
        this.app.vault,
      );

    const command =
      new GenerateTraceabilityReportCommand(
        services,
        renderer,
        writer,
      );

    await command.execute();

    new Notice(
      "Traceability report generated at Engineering/Reports/Traceability Report.md.",
    );

  } catch (error: unknown) {
    logger.error(
      "Failed to generate traceability report.",
      error,
    );

    new Notice(
      "Failed to generate the traceability report.",
    );
  }
} 
private async runWorkspaceMigrations(): Promise<void> {

  const versionService =
    new WorkspaceVersionService(

      async (
        path: string,
      ): Promise<string> => {

        return await this.app.vault.adapter.read(
          path,
        );

      },


      async (
        path: string,
        content: string,
      ): Promise<void> => {

        await this.app.vault.adapter.write(
          path,
          content,
        );

      },

    );


  const migrationService =
    new WorkspaceMigrationService([
      new Migration001InitialWorkspace(
        async (
          path: string,
        ): Promise<void> => {

          const existing =
            this.app.vault.getAbstractFileByPath(
              path,
            );

          if (!existing) {
            await this.app.vault.createFolder(
              path,
            );
          }

        },
      ),
    ]);


  const runner =
    new WorkspaceMigrationRunner(
      versionService,
      migrationService,
      1,
    );


  await runner.run();

}
public override onunload(): void {
    this.core?.shutdown();
    this.core = undefined;
  }
}
