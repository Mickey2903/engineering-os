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
import { EngineeringServices } from "./src/services/EngineeringServices";
import { AskEngineeringAICommand } from "./src/commands/AskEngineeringAICommand";
import { TextInputModal } from "./src/ui/TextInputModal";
import { AIStorageService } from "./src/services/ai/storage/AIStorageService";
import {
  EngineeringAIChatView,
  ENGINEERING_AI_VIEW_TYPE,
} from "./src/views/EngineeringAIChatView";
import {
  DEFAULT_ENGINEERING_OS_SETTINGS,
  type EngineeringOSSettings,
} from "./src/settings/EngineeringOSSettings";

import { EngineeringOSSettingTab } from "./src/settings/EngineeringOSSettingTab";

export default class PlcEngineeringToolsPlugin extends Plugin {

  private core: EngineeringCore | undefined;

  public settings:
    EngineeringOSSettings =
      DEFAULT_ENGINEERING_OS_SETTINGS;

  public override async onload(): Promise<void> {

  await this.loadSettings();

  this.addSettingTab(
    new EngineeringOSSettingTab(
      this.app,
      this,
    ),
  );


  const logger = new ConsoleLogger("Engineering OS");
    this.core =
  new EngineeringCore(
    this.app,
    logger,
    this.settings,
  )

    this.app.workspace.onLayoutReady(() => {
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
    this.registerView(
  ENGINEERING_AI_VIEW_TYPE,
  (leaf) => {

    if (!this.core) {
      throw new Error(
        "Engineering core is not initialized.",
      );
    }


    return new EngineeringAIChatView(
  leaf,
  this.app,
  this.core.createEngineeringAssistant(),
  this.core.contextResolver,
  new AIStorageService(this),
);

  },
);

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
      id: "generate-engineering-reports",
      name: "Generate engineering reports",
      callback: async () => {
        await this.generateEngineeringReports(logger);
      },
    });

    this.addRibbonIcon("activity", "Engineering Health Check", async () => {
      await this.runHealthCheck(logger);
    });

    logger.info("Plugin loaded.");
    
    this.addCommand({
  id: "open-engineering-ai",
  name: "Open Engineering AI",
  callback: async () => {

    const leaf =
      this.app.workspace.getRightLeaf(
        false,
      );

    await leaf?.setViewState({
      type:
        ENGINEERING_AI_VIEW_TYPE,

      active:
        true,
    });

    this.app.workspace.revealLeaf(
      leaf!,
    );

  },
});

    this.addCommand({
  id: "ask-engineering-ai",
  name: "Ask Engineering AI",
  callback: async () => {

    if (!this.core) {
      new Notice("Engineering core is not available.");
      return;
    }


    const assistant =
      this.core.createEngineeringAssistant();


    const command =
      new AskEngineeringAICommand(
        assistant,
      );


    const objectId =
  await new TextInputModal(
    this.app,
    "Engineering object ID",
  ).openAndGetValue();

    if (!objectId) {
      return;
    }


    const question =
  await new TextInputModal(
    this.app,
    "Question",
  ).openAndGetValue();


    if (!question) {
      return;
    }


    const answer =
      await command.execute(
        objectId,
        question,
      );


    new Notice(
      answer,
    );

  },
});
  }

  private async generateEngineeringReports(logger: ConsoleLogger): Promise<void> {
    if (!this.core) {
      new Notice("Engineering core is not available.");
      return;
    }

    try {
      const database = this.core.database;

      const services = new EngineeringServices(database);

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
        new DashboardRenderer(),
        new TraceabilityRenderer(),
      );

      const writer = new ObsidianReportWriter(this.app.vault);

      const command = new GenerateEngineeringReportsCommand(reportService, writer);

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

  private async generateTraceabilityReport(logger: ConsoleLogger): Promise<void> {
    if (!this.core) {
      new Notice("Engineering core is not available.");
      return;
    }

    try {
      const services = new EngineeringServices(this.core.database);
      const renderer = new TraceabilityRenderer();
      const writer = new ObsidianReportWriter(this.app.vault);

      const command = new GenerateTraceabilityReportCommand(services, renderer, writer);

      await command.execute();

      new Notice("Traceability report generated at Engineering/Reports/Traceability Report.md.");
    } catch (error: unknown) {
      logger.error("Failed to generate traceability report.", error);

      new Notice("Failed to generate the traceability report.");
    }
  }

  public override onunload(): void {
    this.core?.shutdown();
    this.core = undefined;
  }
  public async loadSettings(): Promise<void> {

  this.settings = {
    ...DEFAULT_ENGINEERING_OS_SETTINGS,
    ...(await this.loadData()),
  };

}


public async saveSettings(): Promise<void> {

  await this.saveData(
    this.settings,
  );

}
}
