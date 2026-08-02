"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PlcEngineeringToolsPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/commands/GenerateTraceabilityReportCommand.ts
var GenerateTraceabilityReportCommand = class {
  constructor(services, renderer, writer) {
    this.services = services;
    this.renderer = renderer;
    this.writer = writer;
  }
  async execute() {
    const snapshot = this.services.traceability.createSnapshot();
    const markdown = this.renderer.render(snapshot);
    await this.writer.write("Engineering/Reports/Traceability Report.md", markdown);
  }
};

// src/commands/GenerateEngineeringReportsCommand.ts
var GenerateEngineeringReportsCommand = class {
  constructor(reports, writer) {
    this.reports = reports;
    this.writer = writer;
  }
  async execute() {
    const report = this.reports.generate();
    await this.writer.write("Engineering/Reports/Dashboard.md", report.dashboard);
    await this.writer.write("Engineering/Reports/Traceability Report.md", report.traceability);
    await this.writer.write("Engineering/Reports/Health Report.md", report.health);
  }
};

// src/rendering/HealthReportRenderer.ts
function renderHealthReport(report) {
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
      "Every entity has at least one incoming link."
    ),
    "",
    "## Entities without outgoing links",
    "",
    renderEntities(
      report.entitiesWithoutOutgoingLinks,
      "Every entity has at least one outgoing link."
    ),
    "",
    "## Duplicate relationships",
    "",
    renderDuplicateRelationships(report.duplicateRelationships),
    ""
  ].join("\n");
}
function renderBrokenLinks(brokenLinks) {
  if (brokenLinks.length === 0) {
    return "No broken links found.";
  }
  return brokenLinks.map(
    ({ entityId, brokenLinkId }) => `- \`${entityId}\` links to missing entity \`${brokenLinkId}\``
  ).join("\n");
}
function renderEntities(entities, emptyMessage) {
  if (entities.length === 0) {
    return emptyMessage;
  }
  return entities.map((entity) => `- \`${entity.id}\` \u2014 ${entity.title}`).join("\n");
}
function renderDuplicateRelationships(relationships) {
  if (relationships.length === 0) {
    return "No duplicate relationships found.";
  }
  return relationships.map(({ sourceId, targetId }) => `- \`${sourceId}\` links multiple times to \`${targetId}\``).join("\n");
}

// src/services/EngineeringReportService.ts
var EngineeringReportService = class {
  constructor(dashboardService, dashboardStatisticsService, traceabilityService, healthService, dashboardRenderer, traceabilityRenderer) {
    this.dashboardService = dashboardService;
    this.dashboardStatisticsService = dashboardStatisticsService;
    this.traceabilityService = traceabilityService;
    this.healthService = healthService;
    this.dashboardRenderer = dashboardRenderer;
    this.traceabilityRenderer = traceabilityRenderer;
  }
  generate() {
    const dashboardSnapshot = this.dashboardService.createSnapshot();
    const dashboardStatistics = this.dashboardStatisticsService.calculate(dashboardSnapshot);
    const traceabilitySnapshot = this.traceabilityService.createSnapshot();
    const healthReport = this.healthService.healthReport();
    return {
      dashboard: this.dashboardRenderer.render(dashboardSnapshot, dashboardStatistics),
      traceability: this.traceabilityRenderer.render(traceabilitySnapshot),
      health: renderHealthReport(healthReport)
    };
  }
};

// src/services/DashboardService.ts
var DashboardService = class {
  constructor(dataSource, healthMetrics) {
    this.dataSource = dataSource;
    this.healthMetrics = healthMetrics;
  }
  createSnapshot() {
    return {
      requirementCount: this.dataSource.getRequirements().length,
      componentCount: this.dataSource.getComponents().length,
      verificationCount: this.dataSource.getVerifications().length,
      riskCount: this.dataSource.getRisks().length,
      adrCount: this.dataSource.getAdrs().length,
      brokenLinks: this.healthMetrics?.getBrokenLinkCount() ?? 0,
      orphanRequirements: this.healthMetrics?.getOrphanRequirementCount() ?? 0,
      duplicateRelationships: this.healthMetrics?.getDuplicateRelationshipCount() ?? 0
    };
  }
};

// src/services/DashboardStatisticsService.ts
var DEFAULT_WEIGHTS = {
  brokenLinkPenalty: 5,
  orphanRequirementPenalty: 3,
  duplicateRelationshipPenalty: 2
};
var DashboardStatisticsService = class {
  calculate(snapshot) {
    const healthScore = Math.max(
      0,
      100 - snapshot.brokenLinks * DEFAULT_WEIGHTS.brokenLinkPenalty - snapshot.orphanRequirements * DEFAULT_WEIGHTS.orphanRequirementPenalty - snapshot.duplicateRelationships * DEFAULT_WEIGHTS.duplicateRelationshipPenalty
    );
    return {
      healthScore
    };
  }
};

// src/rendering/MarkdownReportBuilder.ts
var MarkdownReportBuilder = class {
  lines = [];
  heading(text2) {
    this.lines.push(`# ${text2}`);
  }
  line(text2) {
    this.lines.push(text2);
  }
  section(title) {
    this.lines.push(`## ${title}`);
  }
  bullet(text2) {
    this.lines.push(`- ${text2}`);
  }
  metric(label, value) {
    this.lines.push(`${label}: **${String(value)}**`);
  }
  blank() {
    this.lines.push("");
  }
  build() {
    return this.lines.join("\n");
  }
};

// src/rendering/DashboardRenderer.ts
var DashboardRenderer = class {
  render(snapshot, statistics) {
    const builder = new MarkdownReportBuilder();
    builder.heading("Engineering Dashboard");
    builder.blank();
    builder.line(`Health score: ${String(statistics.healthScore)}`);
    builder.blank();
    this.renderEngineeringOverview(builder, snapshot);
    builder.blank();
    this.renderHealthDetails(builder, snapshot);
    return builder.build();
  }
  renderEngineeringOverview(builder, snapshot) {
    builder.section("Engineering Overview");
    builder.blank();
    builder.line(`Requirements: ${String(snapshot.requirementCount)}`);
    builder.line(`Components: ${String(snapshot.componentCount)}`);
    builder.line(`Verifications: ${String(snapshot.verificationCount)}`);
    builder.line(`Risks: ${String(snapshot.riskCount)}`);
    builder.line(`ADRs: ${String(snapshot.adrCount)}`);
  }
  renderHealthDetails(builder, snapshot) {
    builder.section("Health Details");
    builder.blank();
    builder.line(`Broken links: ${String(snapshot.brokenLinks)}`);
    builder.line(`Orphan requirements: ${String(snapshot.orphanRequirements)}`);
    builder.line(`Duplicate relationships: ${String(snapshot.duplicateRelationships)}`);
  }
};

// src/commands/RunHealthCheckCommand.ts
var RunHealthCheckCommand = class {
  constructor(services, renderer, writer) {
    this.services = services;
    this.renderer = renderer;
    this.writer = writer;
  }
  async execute() {
    const report = this.services.health.healthReport();
    const markdown = this.renderer.render(report);
    await this.writer.write("Engineering/Reports/Health Report.md", markdown);
  }
};

// src/database/EngineeringDatabase.ts
var EngineeringDatabase = class {
  entitiesById = /* @__PURE__ */ new Map();
  idByPath = /* @__PURE__ */ new Map();
  upsert(entity) {
    const oldId = this.idByPath.get(entity.sourcePath);
    if (oldId && oldId !== entity.id) this.entitiesById.delete(oldId);
    const duplicate = this.entitiesById.get(entity.id);
    if (duplicate && duplicate.sourcePath !== entity.sourcePath)
      throw new Error(
        `Duplicate engineering ID "${entity.id}" in "${duplicate.sourcePath}" and "${entity.sourcePath}".`
      );
    this.entitiesById.set(entity.id, entity);
    this.idByPath.set(entity.sourcePath, entity.id);
  }
  removeByPath(path) {
    const id = this.idByPath.get(path);
    if (!id) return false;
    this.idByPath.delete(path);
    return this.entitiesById.delete(id);
  }
  findById(id) {
    return this.entitiesById.get(id);
  }
  findByType(type) {
    return this.all().filter((entity) => entity.type === type);
  }
  all() {
    return [...this.entitiesById.values()];
  }
  count() {
    return this.entitiesById.size;
  }
  clear() {
    this.entitiesById.clear();
    this.idByPath.clear();
  }
};

// src/parser/MetadataParser.ts
var values = (...items) => new Set(items);
var types = values(
  "requirement",
  "component",
  "verification",
  "adr",
  "risk",
  "architecture",
  "interface",
  "test-case",
  "manufacturing-item",
  // Workspace objects
  "document",
  "cad",
  "software",
  "file"
);
var statuses = values(
  "draft",
  "proposed",
  "approved",
  "active",
  "verified",
  "rejected",
  "deprecated",
  "obsolete",
  "closed",
  "unknown"
);
var priorities = values("critical", "high", "medium", "low", "unknown");
var domains = values(
  "system",
  "power",
  "io",
  "communication",
  "control",
  "firmware",
  "software",
  "mechanical",
  "safety",
  "security",
  "manufacturing",
  "verification",
  "unknown"
);
var methods = values(
  "analysis",
  "inspection",
  "demonstration",
  "test",
  "review",
  "unknown"
);
var lifecycles = values(
  "concept",
  "prototype",
  "active",
  "not-recommended",
  "end-of-life",
  "obsolete",
  "unknown"
);
var results = values(
  "not-run",
  "passed",
  "failed",
  "blocked",
  "not-applicable",
  "unknown"
);
var adrStatuses = values(
  "proposed",
  "accepted",
  "rejected",
  "superseded",
  "deprecated",
  "unknown"
);
var riskLevels = values("critical", "high", "medium", "low", "unknown");
var riskStates = values("open", "mitigating", "accepted", "closed", "unknown");
var text = (value) => typeof value === "string" && value.trim() ? value.trim() : void 0;
var numberValue = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
var list = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string").map((item) => item.trim()).filter((item) => item.length > 0);
  }
  const singleValue = text(value);
  return singleValue ? [singleValue] : [];
};
var normalized = (value, allowed, fallback) => {
  const candidate = text(value)?.toLowerCase();
  if (!candidate) {
    return fallback;
  }
  for (const allowedValue of allowed) {
    if (allowedValue === candidate) {
      return allowedValue;
    }
  }
  return fallback;
};
var MetadataParser = class {
  parse(file, cache) {
    const fm = cache?.frontmatter ?? {};
    const base = {
      id: text(fm.id) ?? file.basename,
      title: text(fm.title) ?? file.basename,
      type: normalized(fm.type, types, "unknown"),
      status: normalized(fm.status, statuses, "unknown"),
      tags: list(fm.tags),
      sourcePath: file.path,
      links: (cache?.links ?? []).map((link) => link.link),
      createdTime: file.stat.ctime,
      modifiedTime: file.stat.mtime,
      metadata: { ...fm }
    };
    switch (base.type) {
      case "requirement":
        return this.requirement(base, fm);
      case "component":
        return this.component(base, fm);
      case "verification":
        return this.verification(base, fm);
      case "adr":
        return this.adr(base, fm);
      case "risk":
        return this.risk(base, fm);
      default:
        return base;
    }
  }
  requirement(base, fm) {
    const description = text(fm.description);
    const rationale = text(fm.rationale);
    const verificationMethod = text(fm.verificationMethod);
    const parentId = text(fm.parent);
    return {
      ...base,
      type: "requirement",
      domain: normalized(fm.domain, domains, "unknown"),
      priority: normalized(fm.priority, priorities, "unknown"),
      ...description ? { description } : {},
      ...rationale ? { rationale } : {},
      acceptanceCriteria: list(fm.acceptanceCriteria ?? fm.acceptance),
      ...verificationMethod ? { verificationMethod: normalized(verificationMethod, methods, "unknown") } : {},
      ...parentId ? { parentId } : {}
    };
  }
  component(base, fm) {
    const manufacturer = text(fm.manufacturer);
    const partNumber = text(fm.partNumber);
    const datasheet = text(fm.datasheet);
    return {
      ...base,
      type: "component",
      ...manufacturer ? { manufacturer } : {},
      ...partNumber ? { partNumber } : {},
      ...datasheet ? { datasheet } : {},
      lifecycle: normalized(fm.lifecycle, lifecycles, "unknown")
    };
  }
  verification(base, fm) {
    return {
      ...base,
      type: "verification",
      method: normalized(fm.method, methods, "unknown"),
      requirementIds: list(fm.requirementIds ?? fm.requirements),
      result: normalized(fm.result, results, "unknown")
    };
  }
  adr(base, fm) {
    const context = text(fm.context);
    const decision = text(fm.decision);
    const supersedesId = text(fm.supersedes);
    return {
      ...base,
      type: "adr",
      decisionStatus: normalized(fm.decisionStatus ?? fm.status, adrStatuses, "unknown"),
      ...context ? { context } : {},
      ...decision ? { decision } : {},
      consequences: list(fm.consequences),
      ...supersedesId ? { supersedesId } : {}
    };
  }
  risk(base, fm) {
    const probability = numberValue(fm.probability);
    const impact = numberValue(fm.impact);
    const mitigation = text(fm.mitigation);
    const owner = text(fm.owner);
    return {
      ...base,
      type: "risk",
      ...probability !== void 0 ? { probability } : {},
      ...impact !== void 0 ? { impact } : {},
      level: normalized(fm.level, riskLevels, "unknown"),
      riskState: normalized(fm.riskState ?? fm.state, riskStates, "unknown"),
      ...mitigation ? { mitigation } : {},
      ...owner ? { owner } : {}
    };
  }
};

// src/scanner/VaultScanner.ts
var VaultScanner = class {
  constructor(vault, metadataCache, parser, database, logger, assetScanner) {
    this.vault = vault;
    this.metadataCache = metadataCache;
    this.parser = parser;
    this.database = database;
    this.logger = logger;
    this.assetScanner = assetScanner;
  }
  scanFile(file) {
    if (file.extension !== "md") return;
    const metadata = this.metadataCache.getFileCache(file);
    const document = this.parser.parse(file, metadata);
    this.database.upsert(document);
  }
  scanAssetFile(file) {
    const asset = this.assetScanner.scanFile(
      file.path
    );
    this.database.upsert(asset);
  }
  scanAll() {
    const files = this.vault.getFiles();
    let indexed = 0;
    let errors = 0;
    this.database.clear();
    for (const file of files) {
      try {
        if (file.extension === "md") {
          this.scanFile(file);
        } else {
          this.scanAssetFile(file);
        }
        indexed += 1;
      } catch (error) {
        errors += 1;
        this.logger.error(`Could not index ${file.path}`, error);
      }
    }
    return { scanned: files.length, indexed, errors };
  }
  remove(path) {
    this.database.removeByPath(path);
  }
};

// src/services/EngineeringAssetScanner.ts
var EngineeringAssetScanner = class {
  scanFile(path) {
    const extension = this.getExtension(path);
    return {
      id: this.generateId(path),
      type: "file",
      title: this.getFileName(path),
      status: "active",
      sourcePath: path,
      path,
      extension,
      fileType: this.classifyExtension(extension),
      tags: this.generateTags(path, extension),
      links: [],
      modifiedTime: Date.now(),
      metadata: {
        projectId: this.detectProject(path)
      }
    };
  }
  getExtension(path) {
    const parts = path.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }
  getFileName(path) {
    return path.split("/").pop() ?? path;
  }
  classifyExtension(extension) {
    switch (extension) {
      case "step":
      case "stp":
      case "kicad_sch":
      case "kicad_pcb":
      case "kicad_pro":
        return "cad";
      case "pdf":
      case "doc":
      case "docx":
      case "md":
        return "document";
      case "c":
      case "cpp":
      case "h":
      case "hpp":
      case "py":
      case "ts":
      case "js":
        return "software";
      default:
        return "unknown";
    }
  }
  generateTags(path, extension) {
    const tags = [];
    if (extension.startsWith("kicad") || extension === "step" || extension === "stp") {
      tags.push("hardware");
      tags.push("cad");
    }
    if (extension === "cpp" || extension === "c" || extension === "py" || extension === "ts") {
      tags.push("software");
    }
    return tags;
  }
  detectProject(path) {
    const parts = path.split("/");
    const projectsIndex = parts.indexOf("Projects");
    if (projectsIndex >= 0 && parts.length > projectsIndex + 1) {
      return parts[projectsIndex + 1];
    }
    return void 0;
  }
  generateId(path) {
    const hash = Math.abs(
      this.simpleHash(path)
    );
    return `FILE-${hash}`;
  }
  simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
};

// src/services/ai/AIConfigurationService.ts
var AIConfigurationService = class {
  constructor(settings) {
    this.settings = settings;
  }
  get() {
    return {
      provider: this.settings.aiProvider,
      ...this.settings.aiModel ? {
        model: this.settings.aiModel
      } : {},
      ...this.settings.aiEndpoint ? {
        endpoint: this.settings.aiEndpoint
      } : {},
      ...this.settings.aiApiKey ? {
        apiKey: this.settings.aiApiKey
      } : {}
    };
  }
};

// src/services/ai/providers/MockAIProvider.ts
var MockAIProvider = class {
  constructor(configuration) {
    this.configuration = configuration;
  }
  async generate(request) {
    return {
      content: `Mock response for: ${request.prompt}`,
      ...this.configuration.model ? {
        model: this.configuration.model
      } : {
        model: "mock"
      }
    };
  }
};

// src/services/ai/providers/OpenAIProvider.ts
var OpenAIProvider = class {
  constructor(configuration) {
    this.configuration = configuration;
  }
  async generate(request) {
    if (!this.configuration.apiKey) {
      throw new Error(
        "OpenAI API key is missing."
      );
    }
    const endpoint = this.configuration.endpoint ?? "https://api.openai.com/v1/chat/completions";
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.configuration.apiKey}`
        },
        body: JSON.stringify({
          model: this.configuration.model ?? "gpt-5",
          messages: [
            {
              role: "user",
              content: request.prompt
            }
          ]
        })
      }
    );
    if (!response.ok) {
      throw new Error(
        `OpenAI request failed: ${response.status}`
      );
    }
    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content ?? "",
      ...this.configuration.model ? {
        model: this.configuration.model
      } : {}
    };
  }
};

// src/services/ai/providers/OllamaProvider.ts
var OllamaProvider = class {
  constructor(configuration) {
    this.configuration = configuration;
  }
  async generate(request) {
    const endpoint = this.configuration.endpoint ?? "http://localhost:11434/api/chat";
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.configuration.model ?? "llama3",
          messages: [
            {
              role: "user",
              content: request.prompt
            }
          ],
          stream: false
        })
      }
    );
    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status}`
      );
    }
    const data = await response.json();
    return {
      content: data.message?.content ?? "",
      ...this.configuration.model ? {
        model: this.configuration.model
      } : {}
    };
  }
};

// src/services/ai/AIProviderFactory.ts
var AIProviderFactory = class {
  static create(configuration) {
    switch (configuration.provider) {
      case "mock":
        return new MockAIProvider(
          configuration
        );
      case "openai":
        return new OpenAIProvider(
          configuration
        );
      case "ollama":
        return new OllamaProvider(
          configuration
        );
    }
  }
};

// src/services/ai/AIService.ts
var AIService = class {
  constructor(configurationService) {
    this.configurationService = configurationService;
  }
  async generate(request) {
    const configuration = this.configurationService.get();
    const provider = AIProviderFactory.create(
      configuration
    );
    return provider.generate(
      request
    );
  }
};

// src/core/EngineeringCore.ts
var EngineeringCore = class {
  constructor(app, logger, settings) {
    this.app = app;
    this.logger = logger;
    const parser = new MetadataParser();
    this.aiService = new AIService(
      new AIConfigurationService(
        settings
      )
    );
    this.scanner = new VaultScanner(
      app.vault,
      app.metadataCache,
      parser,
      this.database,
      logger,
      new EngineeringAssetScanner()
    );
  }
  database = new EngineeringDatabase();
  scanner;
  aiService;
  initialize() {
    const result = this.scanner.scanAll();
    this.logger.info("Initial Vault scan complete.", result);
  }
  updateFile(file) {
    this.scanner.scanFile(file);
  }
  removeFile(path) {
    this.scanner.remove(path);
  }
  shutdown() {
    this.database.clear();
  }
};

// src/core/Logger.ts
var ConsoleLogger = class {
  constructor(scope) {
    this.scope = scope;
  }
  debug(message, context) {
    console.debug(`[${this.scope}] ${message}`, context ?? "");
  }
  info(message, context) {
    console.info(`[${this.scope}] ${message}`, context ?? "");
  }
  warn(message, context) {
    console.warn(`[${this.scope}] ${message}`, context ?? "");
  }
  error(message, context) {
    console.error(`[${this.scope}] ${message}`, context ?? "");
  }
};

// src/obsidian/ObsidianReportWriter.ts
var ObsidianReportWriter = class {
  constructor(vault) {
    this.vault = vault;
  }
  async write(path, content) {
    const parts = path.split("/");
    const fileName = parts.pop();
    if (!fileName) {
      throw new Error("Report path must contain a file name");
    }
    let currentFolder = "";
    for (const folder of parts) {
      currentFolder = currentFolder ? `${currentFolder}/${folder}` : folder;
      if (!this.vault.getAbstractFileByPath(currentFolder)) {
        await this.vault.createFolder(currentFolder);
      }
    }
    const existingFile = this.vault.getAbstractFileByPath(path);
    if (existingFile) {
      await this.vault.modify(existingFile, content);
      return;
    }
    await this.vault.create(path, content);
  }
};

// src/rendering/TraceabilityRenderer.ts
var TraceabilityRenderer = class {
  renderHeading() {
    return "# Traceability Report";
  }
  renderCoverage(snapshot) {
    const coverage = snapshot.requirementCount === 0 ? 0 : Math.round(snapshot.tracedRequirementCount / snapshot.requirementCount * 100);
    return `Coverage: **${String(coverage)}%**`;
  }
  renderMissingComponents(snapshot) {
    if (snapshot.missingComponents.length === 0) {
      return [];
    }
    return [
      "",
      "## Requirements without components",
      "",
      ...snapshot.missingComponents.map(
        (requirement) => `- ${requirement.id} \u2013 ${requirement.title}`
      )
    ];
  }
  render(snapshot) {
    const builder = new MarkdownReportBuilder();
    builder.heading("Traceability Report");
    builder.blank();
    builder.metric("Requirements", snapshot.requirementCount);
    builder.metric("Traced requirements", snapshot.tracedRequirementCount);
    builder.metric("Missing components", snapshot.missingComponentCount);
    builder.metric("Missing verifications", snapshot.missingVerificationCount);
    builder.line(this.renderCoverage(snapshot));
    if (snapshot.missingComponents.length > 0) {
      builder.blank();
      builder.section("Requirements without components");
      builder.blank();
      for (const requirement of snapshot.missingComponents) {
        builder.bullet(`${requirement.id} \u2013 ${requirement.title}`);
      }
    }
    builder.blank();
    return builder.build();
  }
};

// src/services/HealthService.ts
var HealthService = class {
  constructor(database) {
    this.database = database;
  }
  findOrphanEntities() {
    const entities = this.database.all();
    const linkedIds = new Set(entities.flatMap((entity) => entity.links));
    return entities.filter((entity) => entity.links.length === 0 && !linkedIds.has(entity.id));
  }
  findEntitiesWithoutIncomingLinks() {
    const entities = this.database.all();
    const linkedIds = new Set(entities.flatMap((entity) => entity.links));
    return entities.filter((entity) => !linkedIds.has(entity.id));
  }
  findEntitiesWithoutOutgoingLinks() {
    return this.database.all().filter((entity) => entity.links.length === 0);
  }
  findDuplicateRelationships() {
    return this.database.all().flatMap((entity) => {
      const seenTargetIds = /* @__PURE__ */ new Set();
      const duplicateTargetIds = /* @__PURE__ */ new Set();
      for (const targetId of entity.links) {
        if (seenTargetIds.has(targetId)) {
          duplicateTargetIds.add(targetId);
        } else {
          seenTargetIds.add(targetId);
        }
      }
      return [...duplicateTargetIds].map((targetId) => ({
        sourceId: entity.id,
        targetId
      }));
    });
  }
  healthReport() {
    return {
      brokenLinks: this.findBrokenLinks(),
      orphanEntities: this.findOrphanEntities(),
      entitiesWithoutIncomingLinks: this.findEntitiesWithoutIncomingLinks(),
      entitiesWithoutOutgoingLinks: this.findEntitiesWithoutOutgoingLinks(),
      duplicateRelationships: this.findDuplicateRelationships()
    };
  }
  findBrokenLinks() {
    return this.database.all().flatMap(
      (entity) => entity.links.filter((linkedId) => this.database.findById(linkedId) === void 0).map((brokenLinkId) => ({
        entityId: entity.id,
        brokenLinkId
      }))
    );
  }
};

// src/services/graph/GraphAlgorithms.ts
var GraphAlgorithms = class {
  constructor(graph) {
    this.graph = graph;
  }
  findReachable(startId) {
    if (!this.graph.hasNode(startId)) {
      return [];
    }
    const visited = /* @__PURE__ */ new Set();
    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === void 0 || visited.has(current)) {
        continue;
      }
      visited.add(current);
      for (const neighbor of this.graph.neighbors(current)) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    visited.delete(startId);
    return [...visited];
  }
  shortestPath(startId, targetId) {
    if (startId === targetId) {
      return [startId];
    }
    if (!this.graph.hasNode(startId) || !this.graph.hasNode(targetId)) {
      return [];
    }
    const visited = /* @__PURE__ */ new Set([startId]);
    const queue = [[startId]];
    while (queue.length > 0) {
      const currentPath = queue.shift();
      if (currentPath === void 0) {
        continue;
      }
      const currentId = currentPath[currentPath.length - 1];
      if (currentId === void 0) {
        continue;
      }
      for (const neighbor of this.graph.neighbors(currentId)) {
        if (visited.has(neighbor)) {
          continue;
        }
        const nextPath = [...currentPath, neighbor];
        if (neighbor === targetId) {
          return nextPath;
        }
        visited.add(neighbor);
        queue.push(nextPath);
      }
    }
    return [];
  }
  findAllPaths(startId, targetId) {
    if (!this.graph.hasNode(startId) || !this.graph.hasNode(targetId)) {
      return [];
    }
    const paths = [];
    const visit = (currentId, currentPath, visited) => {
      if (currentId === targetId) {
        paths.push([...currentPath]);
        return;
      }
      for (const neighbor of this.graph.neighbors(currentId)) {
        if (visited.has(neighbor)) {
          continue;
        }
        visit(neighbor, [...currentPath, neighbor], /* @__PURE__ */ new Set([...visited, neighbor]));
      }
    };
    visit(startId, [startId], /* @__PURE__ */ new Set([startId]));
    return paths;
  }
};

// src/models/EngineeringEntity.ts
var isVerification = (entity) => entity.type === "verification";
var isAdr = (entity) => entity.type === "adr";

// src/services/relationships/RelationshipGraph.ts
var RelationshipGraph = class {
  relationships;
  outgoingMap = /* @__PURE__ */ new Map();
  incomingMap = /* @__PURE__ */ new Map();
  nodeIds = /* @__PURE__ */ new Set();
  constructor(relationships) {
    this.relationships = relationships;
    const outgoing = /* @__PURE__ */ new Map();
    const incoming = /* @__PURE__ */ new Map();
    for (const relationship of relationships) {
      this.nodeIds.add(relationship.sourceId);
      this.nodeIds.add(relationship.targetId);
      const outgoingRelationships = outgoing.get(relationship.sourceId) ?? [];
      outgoingRelationships.push(relationship);
      outgoing.set(relationship.sourceId, outgoingRelationships);
      const incomingRelationships = incoming.get(relationship.targetId) ?? [];
      incomingRelationships.push(relationship);
      incoming.set(relationship.targetId, incomingRelationships);
    }
    for (const [id, values2] of outgoing) {
      this.outgoingMap.set(id, values2);
    }
    for (const [id, values2] of incoming) {
      this.incomingMap.set(id, values2);
    }
  }
  all() {
    return this.relationships;
  }
  outgoing(id) {
    return this.outgoingMap.get(id) ?? [];
  }
  incoming(id) {
    return this.incomingMap.get(id) ?? [];
  }
  hasNode(id) {
    return this.nodeIds.has(id);
  }
  neighbors(id) {
    return this.outgoing(id).map((relationship) => relationship.targetId);
  }
  hasRelationship(sourceId, targetId) {
    return this.outgoing(sourceId).some((relationship) => relationship.targetId === targetId);
  }
};

// src/services/RelationshipService.ts
var RelationshipService = class {
  constructor(database) {
    this.database = database;
  }
  buildGraph() {
    const relationships = [];
    for (const entity of this.database.all()) {
      for (const targetId of entity.links) {
        relationships.push({
          sourceId: entity.id,
          targetId,
          type: "link"
        });
      }
      if (isVerification(entity)) {
        for (const requirementId of entity.requirementIds) {
          relationships.push({
            sourceId: entity.id,
            targetId: requirementId,
            type: "verifies"
          });
          relationships.push({
            sourceId: requirementId,
            targetId: entity.id,
            type: "verified-by"
          });
        }
      }
      if (isAdr(entity) && entity.supersedesId !== void 0) {
        relationships.push({
          sourceId: entity.id,
          targetId: entity.supersedesId,
          type: "supersedes"
        });
        relationships.push({
          sourceId: entity.supersedesId,
          targetId: entity.id,
          type: "superseded-by"
        });
      }
    }
    return new RelationshipGraph(relationships);
  }
};

// src/services/TraceabilityService.ts
var TraceabilityService = class {
  constructor(database) {
    this.database = database;
    this.relationships = new RelationshipService(database).buildGraph();
  }
  relationships;
  findReachableEntities(entityId) {
    const algorithms = new GraphAlgorithms(this.relationships);
    return algorithms.findReachable(entityId).map((reachableId) => this.database.findById(reachableId)).filter((entity) => entity !== void 0);
  }
  findShortestPathEntities(sourceId, targetId) {
    const algorithms = new GraphAlgorithms(this.relationships);
    return algorithms.shortestPath(sourceId, targetId).map((entityId) => this.database.findById(entityId)).filter((entity) => entity !== void 0);
  }
  findDirectLinks(entityId) {
    return this.relationships.outgoing(entityId).filter((relationship) => relationship.type === "link").map((relationship) => this.database.findById(relationship.targetId)).filter((entity) => entity !== void 0);
  }
  findBacklinks(entityId) {
    return this.relationships.incoming(entityId).filter((relationship) => relationship.type === "link").map((relationship) => this.database.findById(relationship.sourceId)).filter((entity) => entity !== void 0);
  }
  findBrokenLinkIds(entityId) {
    return this.relationships.outgoing(entityId).filter((relationship) => relationship.type === "link").map((relationship) => relationship.targetId).filter((targetId) => this.database.findById(targetId) === void 0);
  }
  createSnapshot() {
    const missingComponents = this.findRequirementsWithoutComponents();
    return {
      requirementCount: this.countRequirements(),
      tracedRequirementCount: this.countTracedRequirements(),
      missingComponentCount: missingComponents.length,
      missingVerificationCount: this.countMissingVerifications(),
      missingComponents
    };
  }
  requirements() {
    return this.database.findByType("requirement").filter((entity) => entity.type === "requirement");
  }
  countRequirements() {
    return this.requirements().length;
  }
  countTracedRequirements() {
    return this.requirements().filter(
      (requirement) => this.findReachableEntities(requirement.id).length > 0
    ).length;
  }
  findRequirementsWithoutComponents() {
    return this.requirements().filter(
      (requirement) => !this.findReachableEntities(requirement.id).some((entity) => entity.type === "component")
    );
  }
  countMissingVerifications() {
    return this.requirements().filter(
      (requirement) => !this.findReachableEntities(requirement.id).some(
        (entity) => entity.type === "verification"
      )
    ).length;
  }
  hasDirectLink(sourceId, targetId) {
    return this.relationships.outgoing(sourceId).some(
      (relationship) => relationship.type === "link" && relationship.targetId === targetId
    );
  }
};

// src/services/ImpactAnalysisService.ts
var ImpactAnalysisService = class {
  traceability;
  constructor(database) {
    this.traceability = new TraceabilityService(database);
  }
  findImpactedEntities(entityId) {
    return this.traceability.findReachableEntities(entityId);
  }
};

// src/services/EngineeringServices.ts
var EngineeringServices = class {
  traceability;
  health;
  impactAnalysis;
  constructor(database) {
    this.traceability = new TraceabilityService(database);
    this.health = new HealthService(database);
    this.impactAnalysis = new ImpactAnalysisService(database);
  }
};

// src/settings/EngineeringOSSettings.ts
var DEFAULT_ENGINEERING_OS_SETTINGS = {
  aiProvider: "mock"
};

// src/settings/EngineeringOSSettingTab.ts
var import_obsidian = require("obsidian");
var EngineeringOSSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  plugin;
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl(
      "h2",
      {
        text: "Engineering OS Settings"
      }
    );
    new import_obsidian.Setting(containerEl).setName("AI Provider").addDropdown(
      (dropdown) => dropdown.addOption(
        "mock",
        "Mock"
      ).addOption(
        "openai",
        "OpenAI"
      ).addOption(
        "ollama",
        "Ollama"
      ).setValue(
        this.plugin.settings.aiProvider
      ).onChange(
        async (value) => {
          this.plugin.settings = {
            ...this.plugin.settings,
            aiProvider: value
          };
          await this.plugin.saveSettings();
        }
      )
    );
    new import_obsidian.Setting(containerEl).setName("AI Model").addText(
      (text2) => text2.setValue(
        this.plugin.settings.aiModel ?? ""
      ).onChange(
        async (value) => {
          this.plugin.settings = {
            ...this.plugin.settings,
            aiModel: value
          };
          await this.plugin.saveSettings();
        }
      )
    );
    new import_obsidian.Setting(containerEl).setName("AI Endpoint").addText(
      (text2) => text2.setValue(
        this.plugin.settings.aiEndpoint ?? ""
      ).onChange(
        async (value) => {
          this.plugin.settings = {
            ...this.plugin.settings,
            aiEndpoint: value
          };
          await this.plugin.saveSettings();
        }
      )
    );
    new import_obsidian.Setting(containerEl).setName("AI API Key").addText(
      (text2) => text2.setValue(
        this.plugin.settings.aiApiKey ?? ""
      ).onChange(
        async (value) => {
          this.plugin.settings = {
            ...this.plugin.settings,
            aiApiKey: value
          };
          await this.plugin.saveSettings();
        }
      )
    );
  }
};

// main.ts
var PlcEngineeringToolsPlugin = class extends import_obsidian2.Plugin {
  core;
  settings = DEFAULT_ENGINEERING_OS_SETTINGS;
  async onload() {
    await this.loadSettings();
    this.addSettingTab(
      new EngineeringOSSettingTab(
        this.app,
        this
      )
    );
    const logger = new ConsoleLogger("Engineering OS");
    this.core = new EngineeringCore(
      this.app,
      logger,
      this.settings
    );
    this.app.workspace.onLayoutReady(() => {
      this.core?.initialize();
    });
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.core?.updateFile(file);
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof import_obsidian2.TFile) {
          this.core?.removeFile(file.path);
        }
      })
    );
    this.addCommand({
      id: "show-engineering-index-status",
      name: "Show engineering index status",
      callback: () => {
        const count = this.core?.database.count() ?? 0;
        new import_obsidian2.Notice(`Engineering index contains ${String(count)} Markdown documents.`);
      }
    });
    this.addCommand({
      id: "run-engineering-health-check",
      name: "Run engineering health check",
      callback: async () => {
        await this.runHealthCheck(logger);
      }
    });
    this.addCommand({
      id: "generate-traceability-report",
      name: "Generate traceability report",
      callback: async () => {
        await this.generateTraceabilityReport(logger);
      }
    });
    this.addCommand({
      id: "generate-engineering-reports",
      name: "Generate engineering reports",
      callback: async () => {
        await this.generateEngineeringReports(logger);
      }
    });
    this.addRibbonIcon("activity", "Engineering Health Check", async () => {
      await this.runHealthCheck(logger);
    });
    logger.info("Plugin loaded.");
  }
  async generateEngineeringReports(logger) {
    if (!this.core) {
      new import_obsidian2.Notice("Engineering core is not available.");
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
          getAdrs: () => database.findByType("adr")
        }),
        new DashboardStatisticsService(),
        services.traceability,
        services.health,
        new DashboardRenderer(),
        new TraceabilityRenderer()
      );
      const writer = new ObsidianReportWriter(this.app.vault);
      const command = new GenerateEngineeringReportsCommand(reportService, writer);
      await command.execute();
      new import_obsidian2.Notice("Engineering reports generated.");
    } catch (error) {
      logger.error("Failed to generate engineering reports.", error);
      new import_obsidian2.Notice("Failed to generate engineering reports.");
    }
  }
  async runHealthCheck(logger) {
    if (!this.core) {
      new import_obsidian2.Notice("Engineering core is not available.");
      return;
    }
    try {
      const services = new EngineeringServices(this.core.database);
      const writer = new ObsidianReportWriter(this.app.vault);
      const command = new RunHealthCheckCommand(
        services,
        {
          render: renderHealthReport
        },
        writer
      );
      await command.execute();
      new import_obsidian2.Notice("Engineering health report generated at Engineering/Reports/Health Report.md.");
    } catch (error) {
      logger.error("Failed to generate engineering health report.", error);
      new import_obsidian2.Notice("Failed to generate the engineering health report.");
    }
  }
  async generateTraceabilityReport(logger) {
    if (!this.core) {
      new import_obsidian2.Notice("Engineering core is not available.");
      return;
    }
    try {
      const services = new EngineeringServices(this.core.database);
      const renderer = new TraceabilityRenderer();
      const writer = new ObsidianReportWriter(this.app.vault);
      const command = new GenerateTraceabilityReportCommand(services, renderer, writer);
      await command.execute();
      new import_obsidian2.Notice("Traceability report generated at Engineering/Reports/Traceability Report.md.");
    } catch (error) {
      logger.error("Failed to generate traceability report.", error);
      new import_obsidian2.Notice("Failed to generate the traceability report.");
    }
  }
  onunload() {
    this.core?.shutdown();
    this.core = void 0;
  }
  async loadSettings() {
    this.settings = {
      ...DEFAULT_ENGINEERING_OS_SETTINGS,
      ...await this.loadData()
    };
  }
  async saveSettings() {
    await this.saveData(
      this.settings
    );
  }
};
