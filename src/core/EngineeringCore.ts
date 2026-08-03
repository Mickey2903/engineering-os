import type { App, TFile } from "obsidian";

import { EngineeringDatabase } from "../database/EngineeringDatabase";
import { MetadataParser } from "../parser/MetadataParser";
import { VaultScanner } from "../scanner/VaultScanner";

import type { Logger } from "./Logger";

import { EngineeringAssetScanner } from "../services/EngineeringAssetScanner";

import type { EngineeringOSSettings } from "../settings/EngineeringOSSettings";

import { AIConfigurationService } from "../services/ai/AIConfigurationService";
import { AIService } from "../services/ai/AIService";
import { EngineeringAssistantService } from "../services/ai/EngineeringAssistantService";
import { EngineeringContextResolver } from "../services/ai/EngineeringContextResolver";

import { EngineeringKnowledgeGraphService } from "../services/knowledge/EngineeringKnowledgeGraphService";
import { EngineeringContextService } from "../services/knowledge/EngineeringContextService";
import { EngineeringContextExporter } from "../services/knowledge/EngineeringContextExporter";
import { EngineeringRelatedContextService } 
from "../services/knowledge/EngineeringRelatedContextService";
import { ContextRankingService } from "../services/ai/memory/ContextRankingService";


export class EngineeringCore {

  public readonly database =
    new EngineeringDatabase();


  private readonly scanner:
    VaultScanner;


  public readonly contextResolver:
    EngineeringContextResolver;


  public readonly aiService:
    AIService;


  public constructor(
    private readonly app: App,
    private readonly logger: Logger,
    settings: EngineeringOSSettings,
  ) {

    const parser =
      new MetadataParser();


    this.aiService =
      new AIService(
        new AIConfigurationService(
          settings,
        ),
      );


    this.contextResolver =
      new EngineeringContextResolver(
  new ContextRankingService(
    this.database,
  ),

  this.database,
);

    this.scanner =
      new VaultScanner(
        app.vault,
        app.metadataCache,
        parser,
        this.database,
        logger,
        new EngineeringAssetScanner(),
      );

  }


  public initialize(): void {

    const result =
      this.scanner.scanAll();


    this.logger.info(
      "Initial Vault scan complete.",
      result,
    );

  }


  public updateFile(
    file: TFile,
  ): void {

    this.scanner.scanFile(
      file,
    );

  }


  public removeFile(
    path: string,
  ): void {

    this.scanner.remove(
      path,
    );

  }


  public createEngineeringAssistant():
    EngineeringAssistantService {

    const graphService =
      new EngineeringKnowledgeGraphService(
        this.database,
      );


    const snapshot =
      graphService.createSnapshot();


return new EngineeringAssistantService(
  this.aiService,
  new EngineeringContextService(snapshot),
  new EngineeringContextExporter(),
  new EngineeringRelatedContextService(snapshot),
  this.contextResolver,
);
  }


  public shutdown(): void {

    this.database.clear();

  }

}
