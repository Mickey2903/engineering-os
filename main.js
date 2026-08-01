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
  constructor(reports, writer, metrics) {
    this.reports = reports;
    this.writer = writer;
    this.metrics = metrics;
  }
  async execute() {
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0] ?? "unknown";
    await this.metrics.capture(date);
    const report = this.reports.generate();
    await this.writer.write("Engineering/Reports/Dashboard.md", report.dashboard);
    await this.writer.write("Engineering/Reports/Traceability Report.md", report.traceability);
    await this.writer.write("Engineering/Reports/Health Report.md", report.health);
    await this.writer.write(
      "Engineering/Reports/Requirement Quality Report.md",
      report.requirementQuality
    );
    await this.writer.write(
      "Engineering/Reports/Verification Coverage Report.md",
      report.verificationCoverage
    );
    await this.writer.write(
      "Engineering/Reports/Engineering Intelligence Dashboard.md",
      report.intelligence
    );
    await this.writer.write(
      "Engineering/Reports/Engineering Trend Report.md",
      report.trend
    );
    await this.writer.write(
      "Engineering/Reports/Impact Analysis Report.md",
      report.impactAnalysis
    );
    await this.writer.write(
      "Engineering/Reports/Verification Traceability Matrix.md",
      report.verificationTraceability
    );
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
  constructor(dashboardService, dashboardStatisticsService, traceabilityService, healthService, requirementQualityService, verificationCoverageService, intelligenceService, metricsHistoryService, trendService, impactAnalysisService, verificationTraceabilityService, dashboardRenderer, traceabilityRenderer, requirementQualityRenderer, verificationCoverageRenderer, intelligenceRenderer, trendRenderer, impactAnalysisRenderer, verificationTraceabilityRenderer) {
    this.dashboardService = dashboardService;
    this.dashboardStatisticsService = dashboardStatisticsService;
    this.traceabilityService = traceabilityService;
    this.healthService = healthService;
    this.requirementQualityService = requirementQualityService;
    this.verificationCoverageService = verificationCoverageService;
    this.intelligenceService = intelligenceService;
    this.metricsHistoryService = metricsHistoryService;
    this.trendService = trendService;
    this.impactAnalysisService = impactAnalysisService;
    this.verificationTraceabilityService = verificationTraceabilityService;
    this.dashboardRenderer = dashboardRenderer;
    this.traceabilityRenderer = traceabilityRenderer;
    this.requirementQualityRenderer = requirementQualityRenderer;
    this.verificationCoverageRenderer = verificationCoverageRenderer;
    this.intelligenceRenderer = intelligenceRenderer;
    this.trendRenderer = trendRenderer;
    this.impactAnalysisRenderer = impactAnalysisRenderer;
    this.verificationTraceabilityRenderer = verificationTraceabilityRenderer;
  }
  generate() {
    const dashboardSnapshot = this.dashboardService.createSnapshot();
    const dashboardStatistics = this.dashboardStatisticsService.calculate(dashboardSnapshot);
    const traceabilitySnapshot = this.traceabilityService.createSnapshot();
    const healthReport = this.healthService.healthReport();
    const requirementQualityReport = this.requirementQualityService.analyze();
    const verificationCoverageReport = this.verificationCoverageService.analyze();
    const intelligenceReport = this.intelligenceService.analyze();
    const trendReport = this.trendService.analyze(
      this.metricsHistoryService.getHistory()
    );
    const impactReport = this.impactAnalysisService.analyze(
      "REQ-001"
    );
    const verificationTraceabilityReport = this.verificationTraceabilityService.analyze(
      ["REQ-001"]
    );
    return {
      dashboard: this.dashboardRenderer.render(
        dashboardSnapshot,
        dashboardStatistics
      ),
      traceability: this.traceabilityRenderer.render(traceabilitySnapshot),
      health: renderHealthReport(healthReport),
      requirementQuality: this.requirementQualityRenderer.render(requirementQualityReport),
      verificationCoverage: this.verificationCoverageRenderer.render(verificationCoverageReport),
      intelligence: this.intelligenceRenderer.render(intelligenceReport),
      trend: this.trendRenderer.render(
        trendReport,
        this.metricsHistoryService.getHistory()
      ),
      impactAnalysis: this.impactAnalysisRenderer.render(
        impactReport
      ),
      verificationTraceability: this.verificationTraceabilityRenderer.render(
        verificationTraceabilityReport
      )
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
  findByPath(path) {
    const id = this.idByPath.get(path);
    if (!id) {
      return void 0;
    }
    return this.entitiesById.get(id);
  }
  findByType(type) {
    return this.all().filter((entity) => entity.type === type);
  }
  findByProject(projectId) {
    return this.all().filter(
      (entity) => entity.projectId === projectId
    );
  }
  countByProject(projectId) {
    return this.findByProject(projectId).length;
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
  "document"
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

// src/parser/ProjectMetadataParser.ts
var ProjectMetadataParser = class {
  parse(metadata) {
    if (metadata.type !== "project") {
      return void 0;
    }
    if (typeof metadata.id !== "string" || typeof metadata.name !== "string") {
      return void 0;
    }
    const project = {
      id: metadata.id,
      name: metadata.name,
      projectType: typeof metadata.projectType === "string" ? metadata.projectType : "unknown",
      status: typeof metadata.status === "string" ? metadata.status : "unknown",
      ...typeof metadata.description === "string" ? {
        description: metadata.description
      } : {}
    };
    return project;
  }
};

// src/scanner/VaultScanner.ts
var VaultScanner = class {
  constructor(vault, metadataCache, parser, database, projects, logger) {
    this.vault = vault;
    this.metadataCache = metadataCache;
    this.parser = parser;
    this.database = database;
    this.projects = projects;
    this.logger = logger;
  }
  projectParser = new ProjectMetadataParser();
  scanFile(file) {
    if (file.extension !== "md") return;
    const metadata = this.metadataCache.getFileCache(file);
    const document = this.parser.parse(file, metadata);
    this.database.upsert(document);
    const frontmatter = metadata?.frontmatter ?? {};
    const project = this.projectParser.parse(frontmatter);
    if (project) {
      this.projects.add({
        id: project.id,
        name: project.name,
        description: project.description ?? "",
        type: project.projectType,
        status: project.status,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  scanAll() {
    const files = this.vault.getMarkdownFiles();
    let indexed = 0;
    let errors = 0;
    this.database.clear();
    this.projects.clear();
    for (const file of files) {
      try {
        this.scanFile(file);
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

// src/services/EngineeringRelationshipIndexer.ts
var EngineeringRelationshipIndexer = class {
  constructor(relationshipService) {
    this.relationshipService = relationshipService;
  }
  indexObject(object) {
    this.relationshipService.removeLinksForObject(
      object.id
    );
    const metadata = object.metadata ?? {};
    this.indexRelation(
      object,
      metadata.implements,
      "implements"
    );
    this.indexRelation(
      object,
      metadata.verifies,
      "verifies"
    );
    this.indexRelation(
      object,
      metadata.affects,
      "affects"
    );
  }
  indexRelation(object, targets, type) {
    if (!Array.isArray(targets)) {
      return;
    }
    for (const target of targets) {
      if (typeof target !== "string") {
        continue;
      }
      this.relationshipService.addLink({
        id: `${object.id}-${type}-${target}`,
        sourceId: object.id,
        targetId: target,
        type,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
};

// src/services/EngineeringRelationshipService.ts
var EngineeringRelationshipService = class {
  links = [];
  addLink(link) {
    this.links.push(link);
  }
  getLinks() {
    return this.links;
  }
  removeLinksForObject(id) {
    const remaining = this.links.filter(
      (link) => link.sourceId !== id && link.targetId !== id
    );
    this.links.length = 0;
    this.links.push(...remaining);
  }
  getOutgoingLinks(id) {
    return this.links.filter(
      (link) => link.sourceId === id
    );
  }
  getIncomingLinks(id) {
    return this.links.filter(
      (link) => link.targetId === id
    );
  }
  findImpact(id) {
    const visited = /* @__PURE__ */ new Set();
    const queue = [id];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current)) {
        continue;
      }
      visited.add(current);
      for (const link of this.getOutgoingLinks(current)) {
        queue.push(link.targetId);
      }
    }
    visited.delete(id);
    return [...visited];
  }
};

// src/repositories/EngineeringProjectRepository.ts
var EngineeringProjectRepository = class {
  projects = /* @__PURE__ */ new Map();
  add(project) {
    this.projects.set(
      project.id,
      project
    );
  }
  remove(id) {
    return this.projects.delete(id);
  }
  findById(id) {
    return this.projects.get(id);
  }
  findAll() {
    return [
      ...this.projects.values()
    ];
  }
  count() {
    return this.projects.size;
  }
  clear() {
    this.projects.clear();
  }
};

// src/core/EngineeringCore.ts
var EngineeringCore = class {
  constructor(app, logger) {
    this.app = app;
    this.logger = logger;
    this.relationships = new EngineeringRelationshipService();
    this.relationshipIndexer = new EngineeringRelationshipIndexer(
      this.relationships
    );
    this.scanner = new VaultScanner(
      app.vault,
      app.metadataCache,
      new MetadataParser(),
      this.database,
      this.projects,
      logger
    );
  }
  database = new EngineeringDatabase();
  projects = new EngineeringProjectRepository();
  scanner;
  relationships;
  relationshipIndexer;
  initialize() {
    const result = this.scanner.scanAll();
    this.logger.info("Initial Vault scan complete.", result);
  }
  updateFile(file) {
    this.scanner.scanFile(file);
    const object = this.database.findByPath(file.path);
    if (object) {
      this.relationshipIndexer.indexObject(object);
    }
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

// src/rendering/EngineeringIntelligenceRenderer.ts
var EngineeringIntelligenceRenderer = class {
  render(report) {
    const builder = new MarkdownReportBuilder();
    builder.heading("Engineering Intelligence Dashboard");
    builder.blank();
    builder.section("Overall Maturity");
    builder.blank();
    builder.line(`Score: **${String(report.overallScore)}%**`);
    builder.blank();
    builder.section("Engineering Metrics");
    builder.blank();
    builder.line(`Health: **${String(report.healthScore)}%**`);
    builder.line(
      `Requirement Quality: **${String(report.requirementQualityScore)}%**`
    );
    builder.line(
      `Verification Coverage: **${String(report.verificationCoverageScore)}%**`
    );
    builder.line(
      `Traceability: **${String(report.traceabilityScore)}%**`
    );
    if (report.improvementAreas.length > 0) {
      builder.blank();
      builder.section("Improvement Areas");
      builder.blank();
      for (const area of report.improvementAreas) {
        builder.bullet(
          `${area.category} - ${area.message}`
        );
      }
    }
    if (report.insights.length > 0) {
      builder.blank();
      builder.section("Intelligence Findings");
      builder.blank();
      for (const insight of report.insights) {
        builder.bullet(
          `${insight.severity}: ${insight.title} - ${insight.description}`
        );
      }
    }
    builder.blank();
    return builder.build();
  }
};

// src/rendering/EngineeringTrendRenderer.ts
var EngineeringTrendRenderer = class {
  render(report, history) {
    const builder = new MarkdownReportBuilder();
    builder.heading("Engineering Trend Report");
    builder.blank();
    builder.section("Current Maturity");
    builder.blank();
    builder.line(`Score: **${String(report.currentScore)}%**`);
    builder.blank();
    builder.section("Trend");
    builder.blank();
    builder.line(`Direction: **${report.direction}**`);
    builder.line(`Change: **${String(report.scoreChange)}%**`);
    builder.blank();
    builder.section("Strongest Improvement");
    builder.blank();
    builder.line(report.strongestMetric);
    builder.blank();
    builder.section("History");
    builder.blank();
    for (const snapshot of history) {
      builder.bullet(
        `${snapshot.date}: ${String(snapshot.overallScore)}%`
      );
    }
    return builder.build();
  }
};

// src/rendering/ImpactAnalysisRenderer.ts
var ImpactAnalysisRenderer = class {
  render(report) {
    const builder = new MarkdownReportBuilder();
    builder.heading(
      "Impact Analysis Report"
    );
    builder.blank();
    builder.section(
      "Changed Object"
    );
    builder.line(
      report.rootObjectId
    );
    builder.blank();
    builder.section(
      "Affected Objects"
    );
    for (const object of report.affectedObjects) {
      builder.bullet(object);
    }
    builder.blank();
    builder.section(
      "Affected Requirements"
    );
    for (const requirement of report.affectedRequirements) {
      builder.bullet(requirement);
    }
    builder.blank();
    builder.section(
      "Affected Components"
    );
    for (const component of report.affectedComponents) {
      builder.bullet(component);
    }
    builder.blank();
    builder.section(
      "Affected Tests"
    );
    for (const test of report.affectedTests) {
      builder.bullet(test);
    }
    return builder.build();
  }
};

// src/rendering/VerificationTraceabilityRenderer.ts
var VerificationTraceabilityRenderer = class {
  render(entries) {
    const lines = [];
    lines.push("# Verification Traceability Matrix");
    lines.push("");
    lines.push(
      "| Requirement | Components | Verification | Status |"
    );
    lines.push(
      "|---|---|---|---|"
    );
    for (const entry of entries) {
      const components = entry.componentIds.length > 0 ? entry.componentIds.join(", ") : "-";
      const verifications = entry.verificationIds.length > 0 ? entry.verificationIds.join(", ") : "-";
      const status = entry.status === "verified" ? "\u2705 Verified" : entry.status === "partial" ? "\u26A0 Partial" : "\u274C Missing";
      lines.push(
        `| ${entry.requirementId} | ${components} | ${verifications} | ${status} |`
      );
    }
    return lines.join("\n");
  }
};

// src/rendering/RequirementQualityRenderer.ts
var RequirementQualityRenderer = class {
  render(report) {
    const builder = new MarkdownReportBuilder();
    builder.heading("Requirement Quality Report");
    builder.blank();
    builder.line(`Requirements: **${String(report.requirementCount)}**`);
    builder.line(`Average quality score: **${String(report.averageScore)}%**`);
    if (report.entries.length > 0) {
      builder.blank();
      builder.section("Requirements");
      for (const entry of report.entries) {
        builder.blank();
        builder.line(`### ${entry.requirementId} \u2013 ${entry.title}`);
        builder.line(`Score: **${String(entry.score)}%**`);
        if (entry.issues.length === 0) {
          builder.line("No issues found.");
        } else {
          builder.blank();
          builder.line("Issues:");
          for (const issue of entry.issues) {
            builder.bullet(issue.message);
          }
        }
      }
    }
    builder.blank();
    return builder.build();
  }
};

// src/rendering/VerificationCoverageRenderer.ts
var VerificationCoverageRenderer = class {
  render(report) {
    const builder = new MarkdownReportBuilder();
    builder.heading("Verification Coverage Report");
    builder.blank();
    builder.line(`Requirements: **${String(report.requirementCount)}**`);
    builder.line(
      `Verified requirements: **${String(report.verifiedRequirementCount)}**`
    );
    builder.line(
      `Coverage: **${String(report.coveragePercentage)}%**`
    );
    if (report.missingVerifications.length > 0) {
      builder.blank();
      builder.section("Missing verifications");
      builder.blank();
      for (const requirement of report.missingVerifications) {
        builder.bullet(`${requirement.requirementId} \u2013 ${requirement.title}`);
      }
    }
    builder.blank();
    return builder.build();
  }
};

// src/models/EngineeringEntity.ts
var isRequirement = (entity) => entity.type === "requirement";
var isVerification = (entity) => entity.type === "verification";
var isAdr = (entity) => entity.type === "adr";

// src/services/RequirementQualityService.ts
var RequirementQualityService = class {
  constructor(database) {
    this.database = database;
  }
  analyze() {
    const requirements = this.database.findByType("requirement").filter(isRequirement);
    const entries = requirements.map(
      (requirement) => this.analyzeRequirement(requirement)
    );
    const averageScore = entries.length === 0 ? 0 : Math.round(
      entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length
    );
    return {
      requirementCount: requirements.length,
      averageScore,
      entries
    };
  }
  analyzeRequirement(requirement) {
    const issues = [];
    let score = 100;
    if (!requirement.description) {
      score -= 10;
      issues.push(this.issue(requirement, "missing-description", "Missing description."));
    }
    if (!requirement.rationale) {
      score -= 10;
      issues.push(this.issue(requirement, "missing-rationale", "Missing rationale."));
    }
    if (requirement.acceptanceCriteria.length === 0) {
      score -= 25;
      issues.push(
        this.issue(
          requirement,
          "missing-acceptance-criteria",
          "Missing acceptance criteria."
        )
      );
    }
    if (!requirement.verificationMethod) {
      score -= 20;
      issues.push(
        this.issue(
          requirement,
          "missing-verification-method",
          "Missing verification method."
        )
      );
    }
    const hasComponentLink = requirement.links.some(
      (id) => this.database.findById(id)?.type === "component"
    );
    if (!hasComponentLink) {
      score -= 20;
      issues.push(
        this.issue(
          requirement,
          "missing-component-link",
          "Missing component link."
        )
      );
    }
    return {
      requirementId: requirement.id,
      title: requirement.title,
      score: Math.max(0, score),
      issues
    };
  }
  issue(requirement, type, message) {
    return {
      requirementId: requirement.id,
      title: requirement.title,
      type,
      message
    };
  }
};

// src/services/VerificationCoverageService.ts
var VerificationCoverageService = class {
  constructor(database) {
    this.database = database;
  }
  analyze() {
    const requirements = this.database.findByType("requirement").filter(isRequirement);
    const missingVerifications = requirements.filter((requirement) => !this.hasVerification(requirement.id)).map((requirement) => ({
      requirementId: requirement.id,
      title: requirement.title
    }));
    const verifiedRequirementCount = requirements.length - missingVerifications.length;
    const coveragePercentage = requirements.length === 0 ? 0 : Math.round(verifiedRequirementCount / requirements.length * 100);
    return {
      requirementCount: requirements.length,
      verifiedRequirementCount,
      missingVerificationCount: missingVerifications.length,
      coveragePercentage,
      missingVerifications
    };
  }
  hasVerification(requirementId) {
    return this.database.findByType("verification").some(
      (verification) => verification.metadata.requirementIds instanceof Array ? verification.metadata.requirementIds.includes(requirementId) : false
    );
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

// src/services/ImpactAnalysisService.ts
var ImpactAnalysisService = class {
  constructor(relationships, database) {
    this.relationships = relationships;
    this.database = database;
  }
  analyze(objectId) {
    const affected = this.relationships.findImpact(
      objectId
    );
    return {
      rootObjectId: objectId,
      affectedObjects: affected,
      affectedComponents: affected.filter(
        (id) => this.database.findById(id)?.type === "component"
      ),
      affectedRequirements: affected.filter(
        (id) => this.database.findById(id)?.type === "requirement"
      ),
      affectedTests: affected.filter(
        (id) => this.database.findById(id)?.type === "test-case"
      )
    };
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
  dependencies(id) {
    return this.outgoing(id).map(
      (relationship) => relationship.targetId
    );
  }
  dependents(id) {
    return this.incoming(id).map(
      (relationship) => relationship.sourceId
    );
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

// src/services/EngineeringServices.ts
var EngineeringServices = class {
  constructor(database) {
    this.database = database;
    this.traceability = new TraceabilityService(
      database
    );
    this.health = new HealthService(
      database
    );
    this.relationships = new EngineeringRelationshipService();
    this.impactAnalysis = new ImpactAnalysisService(
      this.relationships,
      this.database
    );
  }
  traceability;
  health;
  impactAnalysis;
  relationships;
};

// src/services/VerificationTraceabilityService.ts
var VerificationTraceabilityService = class {
  constructor(relationships) {
    this.relationships = relationships;
  }
  analyze(requirementIds) {
    return requirementIds.map((requirementId) => {
      const components = this.relationships.getOutgoingLinks(requirementId).filter(
        (link) => link.type === "implements"
      ).map((link) => link.targetId);
      const verifications = components.flatMap(
        (componentId) => this.relationships.getOutgoingLinks(componentId).filter(
          (link) => link.type === "verifies"
        ).map((link) => link.targetId)
      );
      return {
        requirementId,
        componentIds: components,
        verificationIds: verifications,
        status: verifications.length > 0 ? "verified" : components.length > 0 ? "partial" : "missing"
      };
    });
  }
};

// src/obsidian/ObsidianMetricsStorage.ts
var import_obsidian = require("obsidian");
var ObsidianMetricsStorage = class {
  constructor(vault) {
    this.vault = vault;
  }
  path = "Engineering/History/Engineering Metrics.json";
  async read() {
    const file = this.vault.getAbstractFileByPath(this.path);
    if (!(file instanceof import_obsidian.TFile)) {
      return void 0;
    }
    return this.vault.read(file);
  }
  async write(content) {
    const existing = this.vault.getAbstractFileByPath(this.path);
    if (existing instanceof import_obsidian.TFile) {
      await this.vault.modify(existing, content);
      return;
    }
    await this.vault.create(this.path, content);
  }
};

// src/services/EngineeringIntelligenceService.ts
var EngineeringIntelligenceService = class {
  constructor(dashboardService, dashboardStatisticsService, requirementQualityService, verificationCoverageService, traceabilityService, intelligenceEngine, database) {
    this.dashboardService = dashboardService;
    this.dashboardStatisticsService = dashboardStatisticsService;
    this.requirementQualityService = requirementQualityService;
    this.verificationCoverageService = verificationCoverageService;
    this.traceabilityService = traceabilityService;
    this.intelligenceEngine = intelligenceEngine;
    this.database = database;
  }
  analyze() {
    const dashboardSnapshot = this.dashboardService.createSnapshot();
    const healthScore = this.dashboardStatisticsService.calculate(dashboardSnapshot).healthScore;
    const requirementQuality = this.requirementQualityService.analyze();
    const verificationCoverage = this.verificationCoverageService.analyze();
    const traceability = this.traceabilityService.createSnapshot();
    const insights = this.intelligenceEngine.analyze(
      this.database
    );
    const requirementQualityScore = requirementQuality.averageScore;
    const verificationCoverageScore = verificationCoverage.coveragePercentage;
    const traceabilityScore = traceability.requirementCount === 0 ? 0 : Math.round(
      traceability.tracedRequirementCount / traceability.requirementCount * 100
    );
    const overallScore = dashboardSnapshot.requirementCount === 0 ? 0 : Math.round(
      (healthScore + requirementQualityScore + verificationCoverageScore + traceabilityScore) / 4
    );
    return {
      overallScore,
      healthScore,
      requirementQualityScore,
      verificationCoverageScore,
      traceabilityScore,
      improvementAreas: this.createImprovementAreas(
        healthScore,
        requirementQualityScore,
        verificationCoverageScore,
        traceabilityScore
      ),
      insights
    };
  }
  createImprovementAreas(healthScore, requirementQualityScore, verificationCoverageScore, traceabilityScore) {
    const areas = [];
    if (healthScore < 90) {
      areas.push({
        category: "health",
        message: "Engineering health issues detected.",
        severity: "high"
      });
    }
    if (requirementQualityScore < 70) {
      areas.push({
        category: "requirement-quality",
        message: "Requirement quality is below target.",
        severity: "medium"
      });
    }
    if (verificationCoverageScore < 80) {
      areas.push({
        category: "verification",
        message: "Verification coverage needs improvement.",
        severity: "high"
      });
    }
    if (traceabilityScore < 90) {
      areas.push({
        category: "traceability",
        message: "Traceability coverage is incomplete.",
        severity: "medium"
      });
    }
    return areas;
  }
};

// src/services/EngineeringMetricsHistoryService.ts
var EngineeringMetricsHistoryService = class {
  snapshots;
  constructor(initialSnapshots = []) {
    this.snapshots = [...initialSnapshots];
  }
  addSnapshot(snapshot) {
    this.snapshots.push(snapshot);
  }
  getHistory() {
    return this.snapshots;
  }
  latest() {
    return this.snapshots.at(-1);
  }
};

// src/services/EngineeringTrendService.ts
var EngineeringTrendService = class {
  analyze(history) {
    if (history.length === 0) {
      return {
        currentScore: 0,
        previousScore: 0,
        scoreChange: 0,
        direction: "stable",
        strongestMetric: "none"
      };
    }
    const current = history.at(-1);
    if (!current) {
      return {
        currentScore: 0,
        previousScore: 0,
        scoreChange: 0,
        direction: "stable",
        strongestMetric: "none"
      };
    }
    const previous = history.length > 1 ? history.at(-2) ?? current : current;
    const scoreChange = current.overallScore - previous.overallScore;
    return {
      currentScore: current.overallScore,
      previousScore: previous.overallScore,
      scoreChange,
      direction: scoreChange > 0 ? "improving" : scoreChange < 0 ? "declining" : "stable",
      strongestMetric: this.findStrongestMetric(
        current,
        previous
      )
    };
  }
  findStrongestMetric(current, previous) {
    const metrics = [
      {
        name: "Health",
        change: current.healthScore - previous.healthScore
      },
      {
        name: "Requirement Quality",
        change: current.requirementQualityScore - previous.requirementQualityScore
      },
      {
        name: "Verification Coverage",
        change: current.verificationCoverageScore - previous.verificationCoverageScore
      },
      {
        name: "Traceability",
        change: current.traceabilityScore - previous.traceabilityScore
      }
    ];
    const strongestMetric = metrics.sort(
      (a, b) => b.change - a.change
    )[0];
    return strongestMetric?.name ?? "none";
  }
};

// src/services/EngineeringMetricsPersistenceService.ts
var EngineeringMetricsPersistenceService = class {
  constructor(snapshotService, historyService, storageService) {
    this.snapshotService = snapshotService;
    this.historyService = historyService;
    this.storageService = storageService;
  }
  async capture(date) {
    const snapshot = this.snapshotService.createSnapshot(date);
    this.historyService.addSnapshot(snapshot);
    await this.storageService.save(
      this.historyService.getHistory()
    );
  }
};

// src/services/EngineeringMetricsSnapshotService.ts
var EngineeringMetricsSnapshotService = class {
  constructor(intelligenceService) {
    this.intelligenceService = intelligenceService;
  }
  createSnapshot(date) {
    const report = this.intelligenceService.analyze();
    return {
      date,
      overallScore: report.overallScore,
      healthScore: report.healthScore,
      requirementQualityScore: report.requirementQualityScore,
      verificationCoverageScore: report.verificationCoverageScore,
      traceabilityScore: report.traceabilityScore
    };
  }
};

// src/services/EngineeringMetricsStorageService.ts
var EngineeringMetricsStorageService = class {
  constructor(storage) {
    this.storage = storage;
  }
  async save(history) {
    await this.storage.write(
      JSON.stringify(history, null, 2)
    );
  }
  async load() {
    const content = await this.storage.read();
    if (!content) {
      return [];
    }
    return JSON.parse(content);
  }
};

// src/commands/GenerateProjectDashboardsCommand.ts
var GenerateProjectDashboardsCommand = class {
  constructor(projects, dashboards, renderer, writer) {
    this.projects = projects;
    this.dashboards = dashboards;
    this.renderer = renderer;
    this.writer = writer;
  }
  async execute() {
    const projects = this.projects.findAll();
    for (const project of projects) {
      const dashboard = this.dashboards.generate(
        project.id
      );
      const content = this.renderer.render(
        dashboard
      );
      await this.writer.write(
        `Engineering/Projects/${project.name}/Dashboard.md`,
        content
      );
    }
  }
};

// src/database/ProjectDatabaseView.ts
var ProjectDatabaseView = class {
  constructor(database, projectId) {
    this.database = database;
    this.projectId = projectId;
  }
  findByType(type) {
    return this.database.findByProject(this.projectId).filter((entity) => entity.type === type);
  }
  findById(id) {
    const entity = this.database.findById(id);
    if (!entity || entity.projectId !== this.projectId) {
      return void 0;
    }
    return entity;
  }
  all() {
    return this.database.findByProject(
      this.projectId
    );
  }
  findByProject(projectId) {
    if (projectId !== this.projectId) {
      return [];
    }
    return this.all();
  }
};

// src/services/EngineeringProjectDashboardService.ts
var EngineeringProjectDashboardService = class {
  constructor(database, projects) {
    this.database = database;
    this.projects = projects;
  }
  generate(projectId) {
    const project = this.projects.findById(projectId);
    if (!project) {
      throw new Error(
        `Project "${projectId}" not found.`
      );
    }
    const projectDatabase = new ProjectDatabaseView(
      this.database,
      projectId
    );
    const entities = projectDatabase.all();
    const requirementQuality = new RequirementQualityService(
      projectDatabase
    ).analyze();
    const verificationCoverage = new VerificationCoverageService(
      projectDatabase
    ).analyze();
    const traceability = new TraceabilityService(
      projectDatabase
    ).createSnapshot();
    const health = new HealthService(
      projectDatabase
    ).healthReport();
    return {
      projectId,
      projectName: project.name,
      requirementCount: entities.filter(
        (entity) => entity.type === "requirement"
      ).length,
      componentCount: entities.filter(
        (entity) => entity.type === "component"
      ).length,
      verificationCount: entities.filter(
        (entity) => entity.type === "verification"
      ).length,
      riskCount: entities.filter(
        (entity) => entity.type === "risk"
      ).length,
      adrCount: entities.filter(
        (entity) => entity.type === "adr"
      ).length,
      requirementQualityScore: requirementQuality.averageScore,
      verificationCoverageScore: verificationCoverage.coveragePercentage,
      traceabilityScore: traceability.requirementCount === 0 ? 0 : Math.round(
        traceability.tracedRequirementCount / traceability.requirementCount * 100
      ),
      healthScore: Math.max(
        0,
        100 - health.brokenLinks.length - health.duplicateRelationships.length
      )
    };
  }
};

// src/rendering/EngineeringProjectDashboardRenderer.ts
var EngineeringProjectDashboardRenderer = class {
  render(dashboard) {
    return `# ${dashboard.projectName} Dashboard

## Overview

| Metric | Value |
|---|---:|
| Requirements | ${dashboard.requirementCount} |
| Components | ${dashboard.componentCount} |
| Verification | ${dashboard.verificationCount} |
| Risks | ${dashboard.riskCount} |
| ADRs | ${dashboard.adrCount} |

## Engineering Quality

| Metric | Score |
|---|---:|
| Requirement Quality | ${dashboard.requirementQualityScore}% |
| Verification Coverage | ${dashboard.verificationCoverageScore}% |
| Traceability | ${dashboard.traceabilityScore}% |
| Health | ${dashboard.healthScore}% |
`;
  }
};

// src/intelligence/EngineeringIntelligenceEngine.ts
var EngineeringIntelligenceEngine = class {
  constructor(rules) {
    this.rules = rules;
  }
  analyze(database) {
    return this.rules.flatMap(
      (rule) => rule.evaluate(database)
    );
  }
};

// src/intelligence/rules/RequirementQualityRule.ts
var RequirementQualityRule = class {
  id = "requirement-quality";
  name = "Requirement quality analysis";
  evaluate(database) {
    const insights = [];
    const requirements = database.findByType("requirement");
    for (const requirement of requirements) {
      if (!requirement.verificationMethod) {
        insights.push({
          id: `${requirement.id}-missing-verification`,
          severity: "warning",
          title: "Missing verification method",
          description: `Requirement ${requirement.id} has no verification method.`,
          objectId: requirement.id,
          recommendation: "Add analysis, inspection, demonstration or test verification."
        });
      }
      if (requirement.acceptanceCriteria.length === 0) {
        insights.push({
          id: `${requirement.id}-missing-criteria`,
          severity: "warning",
          title: "Missing acceptance criteria",
          description: `Requirement ${requirement.id} has no acceptance criteria.`,
          objectId: requirement.id,
          recommendation: "Define measurable acceptance criteria."
        });
      }
    }
    return insights;
  }
};

// src/intelligence/rules/TraceabilityRule.ts
var TraceabilityRule = class {
  id = "traceability";
  name = "Requirement traceability analysis";
  evaluate(database) {
    const insights = [];
    const requirements = database.findByType(
      "requirement"
    );
    for (const requirement of requirements) {
      if (requirement.links.length === 0) {
        insights.push({
          id: `${requirement.id}-missing-links`,
          severity: "warning",
          title: "Incomplete traceability",
          description: `Requirement ${requirement.id} has no linked engineering objects.`,
          objectId: requirement.id,
          recommendation: "Link the requirement to components, verifications or other engineering objects."
        });
      }
    }
    return insights;
  }
};

// src/intelligence/rules/VerificationCoverageRule.ts
var VerificationCoverageRule = class {
  id = "verification-coverage";
  name = "Verification coverage analysis";
  evaluate(database) {
    const insights = [];
    const requirements = database.findByType(
      "requirement"
    );
    const verifications = database.findByType(
      "verification"
    );
    const verifiedRequirementIds = new Set(
      verifications.flatMap(
        (verification) => verification.requirementIds
      )
    );
    for (const requirement of requirements) {
      if (!verifiedRequirementIds.has(
        requirement.id
      )) {
        insights.push({
          id: `${requirement.id}-missing-verification-coverage`,
          severity: "warning",
          title: "Missing verification coverage",
          description: `Requirement ${requirement.id} has no verification activity.`,
          objectId: requirement.id,
          recommendation: "Create a verification linked to this requirement."
        });
      }
    }
    return insights;
  }
};

// src/intelligence/rules/ComponentHealthRule.ts
var ComponentHealthRule = class {
  id = "component-health";
  name = "Component health analysis";
  evaluate(database) {
    const insights = [];
    const components = database.findByType(
      "component"
    );
    for (const component of components) {
      if (component.lifecycle === "unknown") {
        insights.push({
          id: `${component.id}-missing-lifecycle`,
          severity: "warning",
          title: "Missing component lifecycle",
          description: `Component ${component.id} has no lifecycle information.`,
          objectId: component.id,
          recommendation: "Define the lifecycle state of the component."
        });
      }
      if (component.lifecycle === "obsolete") {
        insights.push({
          id: `${component.id}-obsolete`,
          severity: "critical",
          title: "Obsolete component",
          description: `Component ${component.id} is marked as obsolete.`,
          objectId: component.id,
          recommendation: "Review replacement or migration strategy."
        });
      }
      if (component.links.length === 0) {
        insights.push({
          id: `${component.id}-no-links`,
          severity: "info",
          title: "Component has no relations",
          description: `Component ${component.id} has no linked engineering objects.`,
          objectId: component.id,
          recommendation: "Link the component to requirements, interfaces or verification."
        });
      }
    }
    return insights;
  }
};

// src/intelligence/rules/RiskHealthRule.ts
var RiskHealthRule = class {
  id = "risk-health";
  name = "Risk health analysis";
  evaluate(database) {
    const insights = [];
    const risks = database.findByType(
      "risk"
    );
    for (const risk of risks) {
      if (risk.level === "unknown") {
        insights.push({
          id: `${risk.id}-unknown-level`,
          severity: "warning",
          title: "Unknown risk level",
          description: `Risk ${risk.id} has no defined risk level.`,
          objectId: risk.id,
          recommendation: "Define the risk classification."
        });
      }
      if ((risk.level === "critical" || risk.level === "high") && !risk.mitigation) {
        insights.push({
          id: `${risk.id}-missing-mitigation`,
          severity: "critical",
          title: "High risk without mitigation",
          description: `Risk ${risk.id} has a high impact level but no mitigation plan.`,
          objectId: risk.id,
          recommendation: "Create a mitigation plan for this risk."
        });
      }
      if (risk.riskState === "open" && !risk.owner) {
        insights.push({
          id: `${risk.id}-missing-owner`,
          severity: "warning",
          title: "Open risk without owner",
          description: `Risk ${risk.id} is open but has no assigned owner.`,
          objectId: risk.id,
          recommendation: "Assign an owner responsible for risk handling."
        });
      }
    }
    return insights;
  }
};

// src/intelligence/rules/ArchitectureHealthRule.ts
var ArchitectureHealthRule = class {
  id = "architecture-health";
  name = "Architecture health analysis";
  evaluate(database) {
    const insights = [];
    const architectures = database.findByType(
      "architecture"
    );
    const interfaces = database.findByType(
      "interface"
    );
    const components = database.findByType(
      "component"
    );
    for (const architecture of architectures) {
      if (architecture.links.length === 0) {
        insights.push({
          id: `${architecture.id}-no-links`,
          severity: "warning",
          title: "Architecture has no relations",
          description: `Architecture ${architecture.id} has no linked engineering objects.`,
          objectId: architecture.id,
          recommendation: "Link architecture elements to components or interfaces."
        });
      }
    }
    for (const item of interfaces) {
      if (item.links.length === 0) {
        insights.push({
          id: `${item.id}-no-links`,
          severity: "warning",
          title: "Interface has no relations",
          description: `Interface ${item.id} has no connected engineering objects.`,
          objectId: item.id,
          recommendation: "Connect the interface to related components."
        });
      }
    }
    for (const component of components) {
      if (component.links.length === 0) {
        insights.push({
          id: `${component.id}-architecture-link`,
          severity: "info",
          title: "Component has no architecture relation",
          description: `Component ${component.id} is not linked to architecture elements.`,
          objectId: component.id,
          recommendation: "Assign the component to an architecture structure."
        });
      }
    }
    return insights;
  }
};

// src/commands/InitializeEngineeringWorkspaceCommand.ts
var InitializeEngineeringWorkspaceCommand = class {
  constructor(writer, templates) {
    this.writer = writer;
    this.templates = templates;
  }
  async execute() {
    const createdFolders = [];
    const folders = [
      "Engineering",
      "Engineering/Projects",
      "Engineering/Requirements",
      "Engineering/Components",
      "Engineering/Verification",
      "Engineering/Risks",
      "Engineering/Architecture",
      "Engineering/Interfaces",
      "Engineering/Reports"
    ];
    for (const folder of folders) {
      await this.writer.createFolder(
        folder
      );
      createdFolders.push(
        folder
      );
    }
    const templateResult = await this.templates.deploy();
    return {
      createdFolders,
      createdTemplates: templateResult.createdTemplates,
      skippedTemplates: templateResult.skippedTemplates
    };
  }
};

// src/services/TemplateDeploymentService.ts
var TemplateDeploymentService = class {
  constructor(writer, templates) {
    this.writer = writer;
    this.templates = templates;
  }
  async deploy() {
    const createdTemplates = [];
    const skippedTemplates = [];
    const templates = [
      {
        source: "Requirement.md",
        target: "Engineering/Requirements/Requirement Template.md"
      },
      {
        source: "Component.md",
        target: "Engineering/Components/Component Template.md"
      },
      {
        source: "Verification.md",
        target: "Engineering/Verification/Verification Template.md"
      },
      {
        source: "Risk.md",
        target: "Engineering/Risks/Risk Template.md"
      },
      {
        source: "Architecture.md",
        target: "Engineering/Architecture/Architecture Template.md"
      },
      {
        source: "Interface.md",
        target: "Engineering/Interfaces/Interface Template.md"
      },
      {
        source: "Project.md",
        target: "Engineering/Projects/Project Template.md"
      }
    ];
    for (const template of templates) {
      const content = await this.templates.getTemplate(
        template.source
      );
      const exists = await this.writer.exists(
        template.target
      );
      if (exists) {
        skippedTemplates.push(
          template.target
        );
      } else {
        await this.writer.write(
          template.target,
          content
        );
        createdTemplates.push(
          template.target
        );
      }
    }
    return {
      createdTemplates,
      skippedTemplates
    };
  }
};

// src/services/ObsidianTemplateRepository.ts
var ObsidianTemplateRepository = class {
  constructor(adapter, basePath) {
    this.adapter = adapter;
    this.basePath = basePath;
  }
  async getTemplate(name) {
    return await this.adapter.read(
      `${this.basePath}/${name}`
    );
  }
};

// src/services/WorkspaceMigrationRunner.ts
var WorkspaceMigrationRunner = class {
  constructor(versions, migrations, targetVersion) {
    this.versions = versions;
    this.migrations = migrations;
    this.targetVersion = targetVersion;
  }
  async run() {
    const current = await this.versions.getVersion();
    console.log(
      "[PLC Migration] Current version:",
      current
    );
    if (current >= this.targetVersion) {
      console.log(
        "[PLC Migration] Workspace already up to date"
      );
      return;
    }
    console.log(
      "[PLC Migration] Starting migration"
    );
    const version = await this.migrations.migrate(
      current,
      this.targetVersion
    );
    console.log(
      "[PLC Migration] Migration result:",
      version
    );
    await this.versions.setVersion(
      version
    );
    console.log(
      "[PLC Migration] Version saved"
    );
  }
};

// src/services/WorkspaceMigrationService.ts
var WorkspaceMigrationService = class {
  constructor(migrations) {
    this.migrations = migrations;
  }
  async migrate(currentVersion, targetVersion) {
    let version = currentVersion;
    while (version < targetVersion) {
      const migration = this.migrations.find(
        (item) => item.fromVersion === version
      );
      if (!migration) {
        throw new Error(
          `No migration found from version ${String(version)}`
        );
      }
      await migration.execute();
      version = migration.toVersion;
    }
    return version;
  }
};

// src/services/WorkspaceVersionService.ts
var WorkspaceVersionService = class {
  constructor(readFile, writeFile) {
    this.readFile = readFile;
    this.writeFile = writeFile;
  }
  versionPath = "Engineering/.workspace-version.md";
  async getVersion() {
    try {
      const content = await this.readFile(
        this.versionPath
      );
      const match = content.match(
        /version:\s*(\d+)/
      );
      if (!match) {
        return 0;
      }
      return Number(match[1]);
    } catch {
      return 0;
    }
  }
  async setVersion(version) {
    await this.writeFile(
      this.versionPath,
      `---
version: ${String(version)}
---
`
    );
  }
};

// src/migrations/Migration001InitialWorkspace.ts
var Migration001InitialWorkspace = class {
  constructor(createFolder) {
    this.createFolder = createFolder;
  }
  fromVersion = 0;
  toVersion = 1;
  async execute() {
    await this.createFolder(
      "Engineering/Reports"
    );
    await this.createFolder(
      "Engineering/Interfaces"
    );
  }
};

// src/services/WorkspaceStatusService.ts
var WorkspaceStatusService = class {
  constructor(versions, database) {
    this.versions = versions;
    this.database = database;
  }
  async generate() {
    const workspaceVersion = await this.versions.getVersion();
    const entities = this.database.all();
    return {
      workspaceVersion,
      indexedObjects: entities.length,
      requirements: entities.filter(
        (entity) => entity.type === "requirement"
      ).length,
      components: entities.filter(
        (entity) => entity.type === "component"
      ).length,
      risks: entities.filter(
        (entity) => entity.type === "risk"
      ).length,
      verificationCoverage: 0
    };
  }
};

// src/rendering/WorkspaceStatusRenderer.ts
var WorkspaceStatusRenderer = class {
  render(report) {
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
      ""
    ].join("\n");
  }
};

// src/commands/GenerateWorkspaceStatusReportCommand.ts
var GenerateWorkspaceStatusReportCommand = class {
  constructor(service, renderer, writer) {
    this.service = service;
    this.renderer = renderer;
    this.writer = writer;
  }
  async execute() {
    const report = await this.service.generate();
    const markdown = this.renderer.render(
      report
    );
    await this.writer.write(
      "Engineering/Reports/Workspace Status.md",
      markdown
    );
  }
};

// src/commands/GenerateImpactAnalysisReportCommand.ts
var GenerateImpactAnalysisReportCommand = class {
  constructor(analysis, renderer, writer) {
    this.analysis = analysis;
    this.renderer = renderer;
    this.writer = writer;
  }
  async execute(objectId) {
    const report = this.analysis.analyze(
      objectId
    );
    const markdown = this.renderer.render(
      report
    );
    await this.writer.write(
      "Engineering/Reports/Impact Analysis.md",
      markdown
    );
  }
};

// main.ts
var PlcEngineeringToolsPlugin = class extends import_obsidian2.Plugin {
  core;
  onload() {
    const logger = new ConsoleLogger("PLC Engineering Tools");
    this.core = new EngineeringCore(this.app, logger);
    this.app.workspace.onLayoutReady(async () => {
      await this.runWorkspaceMigrations();
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
      id: "generate-project-dashboards",
      name: "Generate project dashboards",
      callback: async () => {
        await this.generateProjectDashboards(logger);
      }
    });
    this.addCommand({
      id: "generate-engineering-reports",
      name: "Generate engineering reports",
      callback: async () => {
        await this.generateEngineeringReports(logger);
      }
    });
    this.addCommand({
      id: "generate-workspace-status-report",
      name: "Generate Workspace Status Report",
      callback: async () => {
        const versionService = new WorkspaceVersionService(
          async (path) => {
            return await this.app.vault.adapter.read(
              path
            );
          },
          async (path, content) => {
            await this.app.vault.adapter.write(
              path,
              content
            );
          }
        );
        const service = new WorkspaceStatusService(
          versionService,
          this.core.database
        );
        const renderer = new WorkspaceStatusRenderer();
        const writer = new ObsidianReportWriter(
          this.app.vault
        );
        const command = new GenerateWorkspaceStatusReportCommand(
          service,
          renderer,
          writer
        );
        await command.execute();
      }
    });
    this.addRibbonIcon("activity", "Engineering Health Check", async () => {
      await this.runHealthCheck(logger);
    });
    this.addCommand({
      id: "initialize-engineering-workspace",
      name: "Initialize engineering workspace",
      callback: async () => {
        await this.initializeEngineeringWorkspace();
      }
    });
    this.addCommand({
      id: "generate-impact-analysis-report",
      name: "Generate Impact Analysis Report",
      callback: async () => {
        if (!this.core) {
          return;
        }
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new import_obsidian2.Notice(
            "No active file selected."
          );
          return;
        }
        const object = this.core.database.findByPath(
          file.path
        );
        if (!object) {
          new import_obsidian2.Notice(
            "Active file is not an indexed engineering object."
          );
          return;
        }
        const services = new EngineeringServices(
          this.core.database
        );
        const renderer = new ImpactAnalysisRenderer();
        const writer = new ObsidianReportWriter(
          this.app.vault
        );
        const command = new GenerateImpactAnalysisReportCommand(
          services.impactAnalysis,
          renderer,
          writer
        );
        await command.execute(
          object.id
        );
        new import_obsidian2.Notice(
          "Impact analysis report generated."
        );
      }
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
      const intelligenceService = new EngineeringIntelligenceService(
        new DashboardService({
          getRequirements: () => database.findByType("requirement"),
          getComponents: () => database.findByType("component"),
          getVerifications: () => database.findByType("verification"),
          getRisks: () => database.findByType("risk"),
          getAdrs: () => database.findByType("adr")
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
          new ArchitectureHealthRule()
        ]),
        database
      );
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
        new RequirementQualityService(database),
        new VerificationCoverageService(database),
        new EngineeringIntelligenceService(
          new DashboardService({
            getRequirements: () => database.findByType("requirement"),
            getComponents: () => database.findByType("component"),
            getVerifications: () => database.findByType("verification"),
            getRisks: () => database.findByType("risk"),
            getAdrs: () => database.findByType("adr")
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
            new ArchitectureHealthRule()
          ]),
          database
        ),
        new EngineeringMetricsHistoryService(),
        new EngineeringTrendService(),
        new ImpactAnalysisService(
          services.relationships,
          this.core.database
        ),
        new VerificationTraceabilityService(
          services.relationships
        ),
        new DashboardRenderer(),
        new TraceabilityRenderer(),
        new RequirementQualityRenderer(),
        new VerificationCoverageRenderer(),
        new EngineeringIntelligenceRenderer(),
        new EngineeringTrendRenderer(),
        new ImpactAnalysisRenderer(),
        new VerificationTraceabilityRenderer()
      );
      const writer = new ObsidianReportWriter(this.app.vault);
      const command = new GenerateEngineeringReportsCommand(
        reportService,
        writer,
        new EngineeringMetricsPersistenceService(
          new EngineeringMetricsSnapshotService(
            intelligenceService
          ),
          new EngineeringMetricsHistoryService(),
          new EngineeringMetricsStorageService(
            new ObsidianMetricsStorage(this.app.vault)
          )
        )
      );
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
  async initializeEngineeringWorkspace() {
    const templateDeployment = new TemplateDeploymentService(
      {
        exists: async (path) => {
          return this.app.vault.getAbstractFileByPath(path) !== null;
        },
        write: async (path, content) => {
          const existing = this.app.vault.getAbstractFileByPath(path);
          if (existing) {
            return;
          }
          await this.app.vault.create(
            path,
            content
          );
        }
      },
      new ObsidianTemplateRepository(
        this.app.vault.adapter,
        `${this.manifest.dir}/templates`
      )
    );
    const command = new InitializeEngineeringWorkspaceCommand(
      {
        createFolder: async (path) => {
          const existing = this.app.vault.getAbstractFileByPath(path);
          if (!existing) {
            await this.app.vault.createFolder(path);
          }
        }
      },
      templateDeployment
    );
    try {
      const result = await command.execute();
      new import_obsidian2.Notice(
        [
          "Engineering workspace initialized.",
          `Folders created: ${String(result.createdFolders.length)}`,
          `Templates created: ${String(result.createdTemplates.length)}`,
          `Templates skipped: ${String(result.skippedTemplates.length)}`
        ].join("\n")
      );
    } catch (error) {
      new import_obsidian2.Notice(
        "Failed to initialize engineering workspace."
      );
      console.error(
        "Initialize workspace failed:",
        error
      );
    }
  }
  async generateProjectDashboards(logger) {
    new import_obsidian2.Notice("Starting project dashboard generation");
    try {
      const database = this.core?.database;
      if (!database) {
        throw new Error(
          "Engineering database is not initialized."
        );
      }
      const projects = this.core?.projects;
      if (!projects) {
        throw new Error(
          "Project repository is not initialized."
        );
      }
      const dashboardService = new EngineeringProjectDashboardService(
        database,
        projects
      );
      const renderer = new EngineeringProjectDashboardRenderer();
      const writer = new ObsidianReportWriter(
        this.app.vault
      );
      const command = new GenerateProjectDashboardsCommand(
        projects,
        dashboardService,
        renderer,
        writer
      );
      await command.execute();
      new import_obsidian2.Notice(
        "Project dashboards generated."
      );
    } catch (error) {
      logger.error(
        "Failed to generate project dashboards.",
        error
      );
      new import_obsidian2.Notice(
        "Failed to generate project dashboards."
      );
    }
  }
  async generateTraceabilityReport(logger) {
    if (!this.core) {
      new import_obsidian2.Notice("Engineering core is not available.");
      return;
    }
    try {
      const services = new EngineeringServices(
        this.core.database
      );
      const renderer = new TraceabilityRenderer();
      const writer = new ObsidianReportWriter(
        this.app.vault
      );
      const command = new GenerateTraceabilityReportCommand(
        services,
        renderer,
        writer
      );
      await command.execute();
      new import_obsidian2.Notice(
        "Traceability report generated at Engineering/Reports/Traceability Report.md."
      );
    } catch (error) {
      logger.error(
        "Failed to generate traceability report.",
        error
      );
      new import_obsidian2.Notice(
        "Failed to generate the traceability report."
      );
    }
  }
  async runWorkspaceMigrations() {
    const versionService = new WorkspaceVersionService(
      async (path) => {
        return await this.app.vault.adapter.read(
          path
        );
      },
      async (path, content) => {
        await this.app.vault.adapter.write(
          path,
          content
        );
      }
    );
    const migrationService = new WorkspaceMigrationService([
      new Migration001InitialWorkspace(
        async (path) => {
          const existing = this.app.vault.getAbstractFileByPath(
            path
          );
          if (!existing) {
            await this.app.vault.createFolder(
              path
            );
          }
        }
      )
    ]);
    const runner = new WorkspaceMigrationRunner(
      versionService,
      migrationService,
      1
    );
    await runner.run();
  }
  onunload() {
    this.core?.shutdown();
    this.core = void 0;
  }
};
