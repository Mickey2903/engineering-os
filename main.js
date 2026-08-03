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
var import_obsidian4 = require("obsidian");

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
      } : this.settings.aiProvider === "ollama" ? {
        endpoint: "http://localhost:11434"
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
  async getAvailableModels() {
    return [
      "mock-model"
    ];
  }
  async checkConnection() {
    return true;
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
  async getAvailableModels() {
    return [
      "gpt-4.1",
      "gpt-4.1-mini"
    ];
  }
  async checkConnection() {
    return true;
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
  baseUrl = "http://localhost:11434";
  async getAvailableModels() {
    try {
      const response = await fetch(
        `${this.configuration.endpoint ?? this.baseUrl}/api/tags`
      );
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data.models?.map(
        (model) => model.name
      ) ?? [];
    } catch (error) {
      console.error(
        "Ollama model loading failed",
        error
      );
      return [];
    }
  }
  async checkConnection() {
    try {
      const url = this.configuration.endpoint ?? this.baseUrl;
      const response = await fetch(
        `${url}/api/tags`
      );
      return response.ok;
    } catch {
      return false;
    }
  }
  async generate(request) {
    const endpoint = `${this.configuration.endpoint ?? this.baseUrl}/api/chat`;
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.configuration.model ?? "qwen2.5-coder:7b",
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
  async getAvailableModels() {
    const configuration = this.configurationService.get();
    const provider = AIProviderFactory.create(
      configuration
    );
    return provider.getAvailableModels();
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

// src/services/ai/EngineeringAssistantService.ts
var EngineeringAssistantService = class {
  constructor(aiService, contextService, exporter, relatedContextService, contextResolver, contextFormatter) {
    this.aiService = aiService;
    this.contextService = contextService;
    this.exporter = exporter;
    this.relatedContextService = relatedContextService;
    this.contextResolver = contextResolver;
    this.contextFormatter = contextFormatter;
  }
  async getAvailableModels() {
    const models = await this.aiService.getAvailableModels();
    return models;
  }
  async ask(question, objectId, model) {
    let engineeringContext = "No engineering object context available.";
    const resolved = this.contextResolver.resolve(
      question,
      objectId
    );
    const resolvedContext = resolved;
    if (resolved.objects.length > 0) {
      const combinedContexts = [];
      for (const object of resolved.objects) {
        const context = this.contextService.generateContext(
          object.objectId
        );
        const related = this.relatedContextService.findRelated(
          object.objectId
        );
        if (context.root) {
          combinedContexts.push(
            {
              root: context.root,
              related: [
                ...context.related,
                ...related
              ]
            }
          );
        }
      }
      engineeringContext = this.contextFormatter.format(
        combinedContexts
      );
    }
    const prompt = `
Engineering context:
${engineeringContext}

Question:
${question}
`;
    const response = await this.aiService.generate(
      {
        prompt,
        ...model ? { model } : {}
      }
    );
    return {
      ...response,
      context: {
        objects: resolvedContext.objects.map(
          (object) => ({
            id: object.objectId,
            title: object.objectTitle,
            type: object.objectType,
            confidence: object.confidence
          })
        ),
        confidence: resolvedContext.confidence
      }
    };
  }
};

// src/services/ai/EngineeringContextResolver.ts
var EngineeringContextResolver = class {
  constructor(rankingService, database) {
    this.rankingService = rankingService;
    this.database = database;
  }
  resolve(question, activeObjectId) {
    const ranked = this.rankingService.rank(
      question
    );
    console.log(
      "Context matches:",
      ranked.map(
        (object) => ({
          id: object.objectId,
          title: object.objectTitle,
          score: object.score,
          reason: object.reason
        })
      )
    );
    if (ranked.length > 0) {
      const topMatch = ranked[0];
      return {
        objects: ranked.map(
          (object) => ({
            objectId: object.objectId,
            objectTitle: object.objectTitle,
            objectType: object.objectType,
            confidence: object.score >= 80 ? "high" : "medium"
          })
        ),
        confidence: topMatch !== void 0 && topMatch.score >= 80 ? "high" : "medium"
      };
    }
    if (activeObjectId) {
      const activeObject = this.database.all().find(
        (object) => object.id === activeObjectId
      );
      if (activeObject !== void 0) {
        return {
          objects: [
            {
              objectId: activeObject.id,
              objectTitle: activeObject.title,
              objectType: activeObject.type,
              confidence: "high"
            }
          ],
          confidence: "high"
        };
      }
    }
    return {
      objects: [],
      confidence: "none"
    };
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

// src/services/knowledge/EngineeringKnowledgeGraphService.ts
var EngineeringKnowledgeGraphService = class {
  constructor(database) {
    this.database = database;
    this.relationshipService = new RelationshipService(
      database
    );
  }
  relationshipService;
  createSnapshot() {
    const objects = this.database.all();
    const graph = this.relationshipService.buildGraph();
    return {
      objects,
      relationships: graph.all(),
      graph
    };
  }
};

// src/services/knowledge/EngineeringContextService.ts
var EngineeringContextService = class {
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
  generateContext(id) {
    const root = this.snapshot.objects.find(
      (object) => object.id === id
    );
    const relatedIds = /* @__PURE__ */ new Set();
    for (const relationship of this.snapshot.graph.outgoing(id)) {
      relatedIds.add(
        relationship.targetId
      );
    }
    for (const relationship of this.snapshot.graph.incoming(id)) {
      relatedIds.add(
        relationship.sourceId
      );
    }
    const related = this.snapshot.objects.filter(
      (object) => relatedIds.has(object.id)
    );
    return {
      root,
      related
    };
  }
};

// src/services/knowledge/EngineeringContextExporter.ts
var EngineeringContextExporter = class {
  export(context) {
    const objects = [
      ...context.root ? [context.root] : [],
      ...context.related
    ];
    return {
      generatedAt: Date.now(),
      ...context.root ? {
        rootId: context.root.id,
        rootType: context.root.type
      } : {},
      objects: objects.map(
        (object) => ({
          id: object.id,
          type: object.type,
          title: object.title,
          status: object.status,
          sourcePath: object.sourcePath,
          tags: object.tags,
          metadata: object.metadata
        })
      )
    };
  }
};

// src/services/knowledge/EngineeringRelatedContextService.ts
var EngineeringRelatedContextService = class {
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
  findRelated(objectId) {
    const relatedIds = /* @__PURE__ */ new Set();
    for (const relationship of this.snapshot.graph.outgoing(objectId)) {
      relatedIds.add(
        relationship.targetId
      );
    }
    for (const relationship of this.snapshot.graph.incoming(objectId)) {
      relatedIds.add(
        relationship.sourceId
      );
    }
    return this.snapshot.objects.filter(
      (object) => relatedIds.has(
        object.id
      )
    );
  }
};

// src/services/ai/memory/ContextRankingService.ts
var ContextRankingService = class {
  constructor(database) {
    this.database = database;
  }
  rank(question) {
    const objects = this.database.all();
    const normalizedQuestion = question.toLowerCase();
    const ranked = objects.map(
      (object) => {
        let score = 0;
        const reasons = [];
        if (normalizedQuestion.includes(
          object.id.toLowerCase()
        )) {
          score += 100;
          reasons.push(
            "ID match"
          );
        }
        const normalizedTitle = object.title.toLowerCase();
        const tags = object.tags?.map(
          (tag) => tag.toLowerCase()
        ) ?? [];
        if (normalizedQuestion.includes(
          normalizedTitle
        )) {
          score += 80;
          reasons.push(
            "title match"
          );
        }
        const matchedTags = tags.filter(
          (tag) => normalizedQuestion.includes(
            tag
          )
        );
        if (matchedTags.length > 0) {
          score += matchedTags.length * 25;
          reasons.push(
            `matched tags: ${matchedTags.join(", ")}`
          );
        }
        const words = normalizedTitle.split(/\s+/).filter(
          (word) => word.length > 2
        );
        const matchedWords = words.filter(
          (word) => normalizedQuestion.includes(
            word
          )
        );
        if (matchedWords.length > 0) {
          score += matchedWords.length * 20;
          reasons.push(
            `matched words: ${matchedWords.join(", ")}`
          );
        }
        return {
          objectId: object.id,
          objectTitle: object.title,
          objectType: object.type,
          score,
          reason: reasons.join("; ")
        };
      }
    );
    return ranked.filter(
      (object) => object.score > 0
    ).sort(
      (a, b) => b.score - a.score
    ).slice(
      0,
      5
    );
  }
};

// src/services/ai/memory/EngineeringContextFormatter.ts
var EngineeringContextFormatter = class {
  format(contexts) {
    if (contexts.length === 0) {
      return "No engineering context available.";
    }
    const lines = [];
    lines.push(
      "Relevant engineering context:"
    );
    for (const context of contexts) {
      lines.push(
        "",
        `Object: ${context.root.title}`,
        `ID: ${context.root.id}`,
        `Type: ${context.root.type}`
      );
      if (context.root.status) {
        lines.push(
          `Status: ${context.root.status}`
        );
      }
      if (context.related.length > 0) {
        lines.push(
          "Related objects:"
        );
        for (const related of context.related) {
          lines.push(
            `- ${related.id}: ${related.title} (${related.type})`
          );
        }
      }
    }
    return lines.join("\n");
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
    this.contextResolver = new EngineeringContextResolver(
      new ContextRankingService(
        this.database
      ),
      this.database
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
  contextResolver;
  aiService;
  initialize() {
    const result = this.scanner.scanAll();
    this.logger.info(
      "Initial Vault scan complete.",
      result
    );
  }
  updateFile(file) {
    this.scanner.scanFile(
      file
    );
  }
  removeFile(path) {
    this.scanner.remove(
      path
    );
  }
  createEngineeringAssistant() {
    const graphService = new EngineeringKnowledgeGraphService(
      this.database
    );
    const snapshot = graphService.createSnapshot();
    return new EngineeringAssistantService(
      this.aiService,
      new EngineeringContextService(snapshot),
      new EngineeringContextExporter(),
      new EngineeringRelatedContextService(snapshot),
      this.contextResolver,
      new EngineeringContextFormatter()
    );
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

// src/commands/AskEngineeringAICommand.ts
var AskEngineeringAICommand = class {
  constructor(assistant) {
    this.assistant = assistant;
  }
  async execute(objectId, question) {
    const response = await this.assistant.ask(
      objectId,
      question
    );
    return response.content;
  }
};

// src/ui/TextInputModal.ts
var import_obsidian = require("obsidian");
var TextInputModal = class extends import_obsidian.Modal {
  constructor(app, title) {
    super(app);
    this.title = title;
  }
  value = "";
  resolve;
  openAndGetValue() {
    return new Promise(
      (resolve) => {
        this.resolve = resolve;
        this.open();
      }
    );
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl(
      "h2",
      {
        text: this.title
      }
    );
    new import_obsidian.Setting(contentEl).setName(
      "Value"
    ).addText(
      (text2) => {
        text2.onChange(
          (value) => {
            this.value = value;
          }
        );
        text2.inputEl.focus();
      }
    );
    new import_obsidian.Setting(contentEl).addButton(
      (button) => {
        button.setButtonText(
          "OK"
        ).setCta().onClick(
          () => {
            this.resolve?.(
              this.value
            );
            this.close();
          }
        );
      }
    );
  }
  onClose() {
    this.resolve?.(
      void 0
    );
  }
};

// src/services/ai/storage/AIStorageService.ts
var AIStorageService = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  key = "engineering-os-ai";
  async load() {
    const data = await this.plugin.loadData();
    return {
      selectedModel: data?.[this.key]?.selectedModel,
      activeConversationId: data?.[this.key]?.activeConversationId,
      conversations: data?.[this.key]?.conversations ?? []
    };
  }
  async save(data) {
    const current = await this.plugin.loadData();
    await this.plugin.saveData(
      {
        ...current,
        [this.key]: data
      }
    );
  }
  async getSelectedModel() {
    const data = await this.load();
    return data.selectedModel;
  }
  async setSelectedModel(model) {
    const data = await this.load();
    await this.save(
      {
        ...data,
        selectedModel: model
      }
    );
  }
  async getActiveConversationId() {
    const data = await this.load();
    return data.activeConversationId;
  }
  async setActiveConversationId(id) {
    const data = await this.load();
    await this.save(
      {
        ...data,
        activeConversationId: id
      }
    );
  }
  async getConversations() {
    const data = await this.load();
    return data.conversations;
  }
  async saveConversation(conversation) {
    const data = await this.load();
    const existing = data.conversations.filter(
      (item) => item.id !== conversation.id
    );
    await this.save(
      {
        ...data,
        conversations: [
          ...existing,
          conversation
        ]
      }
    );
  }
  async deleteEmptyConversations() {
    const data = await this.load();
    await this.save(
      {
        ...data,
        conversations: data.conversations.filter(
          (conversation) => conversation.messages.length > 0
        )
      }
    );
  }
  async deleteConversation(id) {
    const data = await this.load();
    await this.save(
      {
        ...data,
        conversations: data.conversations.filter(
          (conversation) => conversation.id !== id
        )
      }
    );
  }
  async updateConversationTitle(id, title) {
    const data = await this.load();
    const conversation = data.conversations.find(
      (item) => item.id === id
    );
    if (!conversation) {
      return;
    }
    conversation.title = title;
    await this.save(
      data
    );
  }
  async createConversation(title) {
    const conversation = {
      id: crypto.randomUUID(),
      title,
      created: Date.now(),
      messages: []
    };
    await this.saveConversation(
      conversation
    );
    return conversation;
  }
};

// src/services/ai/AIStatusService.ts
var AIStatusService = class {
  constructor(provider, providerName) {
    this.provider = provider;
    this.providerName = providerName;
  }
  async checkStatus() {
    const connected = await this.provider.checkConnection();
    return {
      provider: this.providerName,
      connected
    };
  }
};

// src/views/EngineeringAIChatView.ts
var import_obsidian2 = require("obsidian");

// src/services/ai/ConversationService.ts
var ConversationService = class {
  messages = [];
  addUserMessage(content) {
    this.messages.push({
      role: "user",
      content,
      timestamp: Date.now()
    });
  }
  addAssistantMessage(content) {
    this.messages.push({
      role: "assistant",
      content,
      timestamp: Date.now()
    });
  }
  getMessages() {
    return this.messages;
  }
  clear() {
    this.messages.length = 0;
  }
};

// src/views/EngineeringAIChatView.ts
var ENGINEERING_AI_VIEW_TYPE = "engineering-ai-chat";
var EngineeringAIChatView = class extends import_obsidian2.ItemView {
  conversation = new ConversationService();
  conversationId;
  selectedModel;
  assistant;
  storage;
  contextResolver;
  statusService;
  appInstance;
  statusEl;
  inputEl;
  messagesEl;
  conversationsEl;
  chatContainer;
  modelSelect;
  contextEl;
  loadingEl;
  lastQuestion;
  lastContextObjectId;
  constructor(leaf, app, assistant, contextResolver, storage, statusService) {
    super(leaf);
    this.statusService = statusService;
    this.appInstance = app;
    this.assistant = assistant;
    this.contextResolver = contextResolver;
    this.storage = storage;
  }
  updateAIContext(context) {
    if (!context || !this.contextEl) {
      return;
    }
    this.contextEl.empty();
    this.contextEl.createDiv({
      cls: "plc-eng-ai-context-sidebar-title",
      text: "Engineering Context"
    });
    if (context.objects.length === 0) {
      this.contextEl.createDiv({
        text: "\u26AA Geen gebruikte objecten"
      });
      return;
    }
    for (const object of context.objects) {
      this.contextEl.createDiv({
        cls: "plc-eng-ai-context-object",
        text: `\u{1F7E2} ${object.id} - ${object.title}`
      });
    }
    this.contextEl.createDiv({
      cls: "plc-eng-ai-context-confidence",
      text: `Confidence: ${context.confidence}`
    });
  }
  getViewType() {
    return ENGINEERING_AI_VIEW_TYPE;
  }
  getDisplayText() {
    return "Engineering AI";
  }
  async loadModels() {
    if (!this.modelSelect) {
      return;
    }
    const models = await this.assistant.getAvailableModels();
    this.modelSelect.empty();
    if (models.length === 0) {
      this.modelSelect.createEl(
        "option",
        {
          value: "",
          text: "Geen modellen beschikbaar"
        }
      );
      return;
    }
    for (const model of models) {
      const option = this.modelSelect.createEl(
        "option",
        {
          value: model,
          text: model
        }
      );
      if (model === this.selectedModel) {
        option.selected = true;
      }
    }
    this.modelSelect.onchange = async () => {
      this.selectedModel = this.modelSelect?.value;
      if (this.selectedModel) {
        await this.storage.setSelectedModel(
          this.selectedModel
        );
      }
    };
  }
  async updateAIStatus() {
    if (!this.statusEl) {
      return;
    }
    const status = await this.statusService.checkStatus();
    this.statusEl.setText(
      status.connected ? `\u{1F7E2} ${status.provider} connected` : `\u{1F534} ${status.provider} offline`
    );
  }
  setLoading(loading) {
    if (!this.messagesEl) {
      return;
    }
    if (loading) {
      this.loadingEl = this.messagesEl.createDiv({
        cls: "plc-eng-ai-loading"
      });
      this.loadingEl.setText(
        "\u23F3 AI analyseert..."
      );
    } else {
      this.loadingEl?.remove();
      this.loadingEl = void 0;
    }
  }
  async onOpen() {
    const container = this.contentEl;
    container.addClass(
      "plc-eng-ai-container"
    );
    container.empty();
    container.createEl(
      "h2",
      {
        text: "Engineering AI"
      }
    );
    const aiWorkspace = container.createDiv({
      cls: "plc-eng-ai-workspace"
    });
    const historyContainer = aiWorkspace.createDiv({
      cls: "plc-eng-ai-history"
    });
    historyContainer.createEl(
      "h3",
      {
        text: "Conversations"
      }
    );
    const newConversationButton = historyContainer.createEl(
      "button",
      {
        text: "+ Nieuwe chat",
        cls: "plc-eng-ai-new-chat"
      }
    );
    newConversationButton.onclick = async () => {
      await this.createNewConversation();
    };
    this.conversationsEl = historyContainer.createDiv({
      cls: "plc-eng-ai-conversations"
    });
    await this.loadConversations();
    const aiSettings = historyContainer.createDiv({
      cls: "plc-eng-ai-sidebar-settings"
    });
    this.statusEl = aiSettings.createEl(
      "p",
      {
        cls: "plc-eng-ai-status"
      }
    );
    await this.updateAIStatus();
    const modelContainer = aiSettings.createDiv({
      cls: "plc-eng-ai-model"
    });
    modelContainer.createEl(
      "label",
      {
        text: "Model:"
      }
    );
    this.modelSelect = modelContainer.createEl(
      "select"
    );
    const refreshButton = modelContainer.createEl(
      "button",
      {
        text: "\u21BB"
      }
    );
    refreshButton.onclick = async () => {
      await this.updateAIStatus();
      await this.loadModels();
    };
    this.chatContainer = aiWorkspace.createDiv({
      cls: "plc-eng-ai-chat-container"
    });
    const savedModel = await this.storage.getSelectedModel();
    this.selectedModel = savedModel;
    await this.loadModels();
    await this.storage.deleteEmptyConversations();
    const activeConversationId = await this.storage.getActiveConversationId();
    if (activeConversationId) {
      this.conversationId = activeConversationId;
    } else {
      const conversation = await this.storage.createConversation(
        "Engineering AI Session"
      );
      this.conversationId = conversation.id;
      await this.storage.setActiveConversationId(
        conversation.id
      );
    }
    this.contextEl = aiSettings.createEl(
      "div",
      {
        cls: "plc-eng-ai-context-sidebar"
      }
    );
    this.updateContextDisplay({
      objects: [],
      confidence: "none"
    });
    this.messagesEl = this.chatContainer?.createDiv({
      cls: "plc-eng-ai-messages"
    });
    this.inputEl = this.chatContainer?.createEl(
      "input",
      {
        type: "text",
        placeholder: "Ask engineering question..."
      }
    );
    const button = this.chatContainer?.createEl(
      "button",
      {
        text: "Send"
      }
    );
    button.onclick = async () => {
      const question = this.inputEl?.value.trim() ?? "";
      this.lastQuestion = question;
      if (!question) {
        return;
      }
      const activeFile = this.appInstance.workspace.getActiveFile();
      const resolvedContext = this.contextResolver.resolve(
        question,
        activeFile?.basename
      );
      this.updateContextDisplay(
        resolvedContext
      );
      this.lastContextObjectId = resolvedContext.objects[0]?.objectId;
      await this.addMessage(
        "user",
        question
      );
      if (this.inputEl) {
        this.inputEl.value = "";
      }
      this.setLoading(
        true
      );
      let response;
      try {
        const response2 = await this.assistant.ask(
          question,
          this.lastContextObjectId,
          this.modelSelect?.value
        );
        await this.addMessage(
          "assistant",
          response2.content
        );
        if (response2.context) {
          this.updateAIContext(
            response2.context
          );
        }
      } catch (error) {
        this.showAIError(
          error
        );
      } finally {
        this.setLoading(
          false
        );
      }
    };
    this.inputEl?.addEventListener(
      "keydown",
      async (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          await button.click();
        }
      }
    );
  }
  showAIError(error) {
    const message = this.messagesEl?.createDiv({
      cls: "plc-eng-ai-error"
    });
    if (!message) {
      return;
    }
    message.createEl(
      "strong",
      {
        text: "\u26A0 AI request mislukt"
      }
    );
    message.createEl(
      "p",
      {
        text: String(error)
      }
    );
    const editButton = message.createEl(
      "button",
      {
        text: "\u270F Vraag aanpassen"
      }
    );
    editButton.onclick = () => {
      if (this.inputEl && this.lastQuestion) {
        this.inputEl.value = this.lastQuestion;
        this.inputEl.focus();
      }
    };
    const retryButton = message.createEl(
      "button",
      {
        text: "\u21BB Opnieuw proberen"
      }
    );
    retryButton.onclick = async () => {
      await this.retryLastRequest();
    };
  }
  async retryLastRequest() {
    if (!this.lastQuestion) {
      return;
    }
    this.setLoading(true);
    try {
      const response = await this.assistant.ask(
        this.lastQuestion,
        this.lastContextObjectId,
        this.modelSelect?.value
      );
      await this.addMessage(
        "assistant",
        response.content
      );
    } catch (error) {
      this.showAIError(
        error
      );
    } finally {
      this.setLoading(false);
    }
  }
  async openConversation(id) {
    const conversations = await this.storage.getConversations();
    const conversation = conversations.find(
      (item) => item.id === id
    );
    if (!conversation) {
      return;
    }
    this.messagesEl?.empty();
    this.conversationId = conversation.id;
    for (const message of conversation.messages) {
      await this.renderMessage(
        message.role,
        message.content
      );
    }
  }
  async loadConversations() {
    if (!this.conversationsEl) {
      return;
    }
    this.conversationsEl.empty();
    const conversations = await this.storage.getConversations();
    if (conversations.length === 0) {
      this.conversationsEl.createEl(
        "p",
        {
          text: "Geen gesprekken opgeslagen"
        }
      );
      return;
    }
    for (const conversation of conversations) {
      const item = this.conversationsEl.createDiv({
        cls: "plc-eng-ai-conversation-item"
      });
      const button = item.createEl(
        "button",
        {
          text: conversation.title
        }
      );
      button.onclick = async () => {
        await this.openConversation(
          conversation.id
        );
      };
      const deleteButton = item.createEl(
        "button",
        {
          text: "\u{1F5D1}"
        }
      );
      deleteButton.onclick = async () => {
        await this.storage.deleteConversation(
          conversation.id
        );
        if (this.conversationId === conversation.id) {
          this.conversationId = void 0;
          this.messagesEl?.empty();
        }
        await this.loadConversations();
      };
    }
  }
  updateContextDisplay(context) {
    if (!this.contextEl) {
      return;
    }
    if (context.confidence === "none" || context.objects.length === 0) {
      this.contextEl.setText(
        "Context: \u26AA Geen engineering object"
      );
      return;
    }
    const contextLines = context.objects.map(
      (object) => `${object.objectId} - ${object.objectTitle} (${object.objectType})`
    );
    this.contextEl.setText(
      [
        "Context:",
        ...contextLines,
        `Confidence: ${context.confidence}`
      ].join("\n")
    );
  }
  async renderMessage(role, content) {
    const message = this.messagesEl?.createDiv({
      cls: [
        "plc-eng-ai-message",
        role === "user" ? "plc-eng-ai-user" : "plc-eng-ai-assistant"
      ]
    });
    if (!message) {
      return;
    }
    message.createEl(
      "strong",
      {
        text: `${role}:`
      }
    );
    if (role === "assistant") {
      const copyButton = message.createEl(
        "button",
        {
          text: "\u{1F4CB}",
          cls: "plc-eng-ai-copy-button"
        }
      );
      copyButton.onclick = async () => {
        await navigator.clipboard.writeText(
          content
        );
        copyButton.textContent = "\u2713";
        setTimeout(
          () => {
            copyButton.textContent = "\u{1F4CB}";
          },
          1500
        );
      };
    }
    const contentEl = message.createDiv();
    await import_obsidian2.MarkdownRenderer.renderMarkdown(
      content,
      contentEl,
      "",
      this
    );
    if (this.messagesEl) {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }
  }
  async createNewConversation() {
    const conversation = await this.storage.createConversation(
      "Engineering AI Session"
    );
    this.conversationId = conversation.id;
    await this.storage.setActiveConversationId(
      conversation.id
    );
    this.messagesEl?.empty();
    this.updateContextDisplay({
      objects: [],
      confidence: "none"
    });
    await this.loadConversations();
  }
  async addMessage(role, content) {
    this.conversation[role === "user" ? "addUserMessage" : "addAssistantMessage"](
      content
    );
    await this.renderMessage(
      role,
      content
    );
    if (!this.conversationId) {
      return;
    }
    const conversations = await this.storage.getConversations();
    const conversation = conversations.find(
      (item) => item.id === this.conversationId
    );
    if (!conversation) {
      return;
    }
    if (role === "user" && conversation.messages.length === 0) {
      conversation.title = content.substring(0, 40);
    }
    conversation.messages.push(
      {
        role,
        content
      }
    );
    await this.storage.saveConversation(
      conversation
    );
    await this.loadConversations();
  }
  async onClose() {
  }
};

// src/settings/EngineeringOSSettings.ts
var DEFAULT_ENGINEERING_OS_SETTINGS = {
  aiProvider: "ollama",
  aiModel: "qwen2.5-coder:7b",
  aiEndpoint: "http://localhost:11434"
};

// src/settings/EngineeringOSSettingTab.ts
var import_obsidian3 = require("obsidian");
var EngineeringOSSettingTab = class extends import_obsidian3.PluginSettingTab {
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
    new import_obsidian3.Setting(containerEl).setName("AI Provider").addDropdown(
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
    new import_obsidian3.Setting(containerEl).setName("AI Model").addText(
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
    new import_obsidian3.Setting(containerEl).setName("AI Endpoint").addText(
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
    new import_obsidian3.Setting(containerEl).setName("AI API Key").addText(
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
var PlcEngineeringToolsPlugin = class extends import_obsidian4.Plugin {
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
        if (file instanceof import_obsidian4.TFile) {
          this.core?.removeFile(file.path);
        }
      })
    );
    this.addCommand({
      id: "show-engineering-index-status",
      name: "Show engineering index status",
      callback: () => {
        const count = this.core?.database.count() ?? 0;
        new import_obsidian4.Notice(`Engineering index contains ${String(count)} Markdown documents.`);
      }
    });
    this.registerView(
      ENGINEERING_AI_VIEW_TYPE,
      (leaf) => {
        if (!this.core) {
          throw new Error(
            "Engineering core is not initialized."
          );
        }
        const configurationService = new AIConfigurationService(
          this.settings
        );
        const configuration = configurationService.get();
        const provider = AIProviderFactory.create(
          configuration
        );
        const statusService = new AIStatusService(
          provider,
          configuration.provider
        );
        return new EngineeringAIChatView(
          leaf,
          this.app,
          this.core.createEngineeringAssistant(),
          this.core.contextResolver,
          new AIStorageService(this),
          statusService
        );
      }
    );
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
    this.addCommand({
      id: "open-engineering-ai",
      name: "Open Engineering AI",
      callback: async () => {
        const leaf = this.app.workspace.getRightLeaf(
          false
        );
        await leaf?.setViewState({
          type: ENGINEERING_AI_VIEW_TYPE,
          active: true
        });
        this.app.workspace.revealLeaf(
          leaf
        );
      }
    });
    this.addCommand({
      id: "ask-engineering-ai",
      name: "Ask Engineering AI",
      callback: async () => {
        if (!this.core) {
          new import_obsidian4.Notice("Engineering core is not available.");
          return;
        }
        const assistant = this.core.createEngineeringAssistant();
        const command = new AskEngineeringAICommand(
          assistant
        );
        const objectId = await new TextInputModal(
          this.app,
          "Engineering object ID"
        ).openAndGetValue();
        if (!objectId) {
          return;
        }
        const question = await new TextInputModal(
          this.app,
          "Question"
        ).openAndGetValue();
        if (!question) {
          return;
        }
        const answer = await command.execute(
          objectId,
          question
        );
        new import_obsidian4.Notice(
          answer
        );
      }
    });
  }
  async generateEngineeringReports(logger) {
    if (!this.core) {
      new import_obsidian4.Notice("Engineering core is not available.");
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
      new import_obsidian4.Notice("Engineering reports generated.");
    } catch (error) {
      logger.error("Failed to generate engineering reports.", error);
      new import_obsidian4.Notice("Failed to generate engineering reports.");
    }
  }
  async runHealthCheck(logger) {
    if (!this.core) {
      new import_obsidian4.Notice("Engineering core is not available.");
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
      new import_obsidian4.Notice("Engineering health report generated at Engineering/Reports/Health Report.md.");
    } catch (error) {
      logger.error("Failed to generate engineering health report.", error);
      new import_obsidian4.Notice("Failed to generate the engineering health report.");
    }
  }
  async generateTraceabilityReport(logger) {
    if (!this.core) {
      new import_obsidian4.Notice("Engineering core is not available.");
      return;
    }
    try {
      const services = new EngineeringServices(this.core.database);
      const renderer = new TraceabilityRenderer();
      const writer = new ObsidianReportWriter(this.app.vault);
      const command = new GenerateTraceabilityReportCommand(services, renderer, writer);
      await command.execute();
      new import_obsidian4.Notice("Traceability report generated at Engineering/Reports/Traceability Report.md.");
    } catch (error) {
      logger.error("Failed to generate traceability report.", error);
      new import_obsidian4.Notice("Failed to generate the traceability report.");
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
