import type { CachedMetadata, TFile } from "obsidian";
import type { Adr, AdrStatus } from "../models/Adr";
import type { Component, ComponentLifecycle } from "../models/Component";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type {
  EngineeringObject,
  EngineeringObjectType,
  EngineeringStatus,
} from "../models/EngineeringObject";
import type {
  Requirement,
  RequirementDomain,
  RequirementPriority,
  VerificationMethod,
} from "../models/Requirement";
import type { Risk, RiskLevel, RiskState } from "../models/Risk";
import type { Verification, VerificationResult } from "../models/Verification";

const values = <T extends string>(...items: T[]): ReadonlySet<T> => new Set(items);
const types = values<EngineeringObjectType>(
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
  "file",
);
const statuses = values<EngineeringStatus>(
  "draft",
  "proposed",
  "approved",
  "active",
  "verified",
  "rejected",
  "deprecated",
  "obsolete",
  "closed",
  "unknown",
);
const priorities = values<RequirementPriority>("critical", "high", "medium", "low", "unknown");
const domains = values<RequirementDomain>(
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
  "unknown",
);
const methods = values<VerificationMethod>(
  "analysis",
  "inspection",
  "demonstration",
  "test",
  "review",
  "unknown",
);
const lifecycles = values<ComponentLifecycle>(
  "concept",
  "prototype",
  "active",
  "not-recommended",
  "end-of-life",
  "obsolete",
  "unknown",
);
const results = values<VerificationResult>(
  "not-run",
  "passed",
  "failed",
  "blocked",
  "not-applicable",
  "unknown",
);
const adrStatuses = values<AdrStatus>(
  "proposed",
  "accepted",
  "rejected",
  "superseded",
  "deprecated",
  "unknown",
);
const riskLevels = values<RiskLevel>("critical", "high", "medium", "low", "unknown");
const riskStates = values<RiskState>("open", "mitigating", "accepted", "closed", "unknown");

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const numberValue = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const list = (value: unknown): readonly string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  const singleValue = text(value);
  return singleValue ? [singleValue] : [];
};

const normalized = <T extends string>(value: unknown, allowed: ReadonlySet<T>, fallback: T): T => {
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

export class MetadataParser {
  public parse(file: TFile, cache: CachedMetadata | null): EngineeringEntity {
    const fm = (cache?.frontmatter ?? {}) as Record<string, unknown>;
    const base: EngineeringObject = {
      id: text(fm.id) ?? file.basename,
      title: text(fm.title) ?? file.basename,
      type: normalized(fm.type, types, "unknown"),
      status: normalized(fm.status, statuses, "unknown"),
      tags: list(fm.tags),
      sourcePath: file.path,
      links: (cache?.links ?? []).map((link) => link.link),
      createdTime: file.stat.ctime,
      modifiedTime: file.stat.mtime,
      metadata: { ...fm },
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

  private requirement(base: EngineeringObject, fm: Record<string, unknown>): Requirement {
    const description = text(fm.description);
    const rationale = text(fm.rationale);
    const verificationMethod = text(fm.verificationMethod);
    const parentId = text(fm.parent);
    return {
      ...base,
      type: "requirement",
      domain: normalized(fm.domain, domains, "unknown"),
      priority: normalized(fm.priority, priorities, "unknown"),
      ...(description ? { description } : {}),
      ...(rationale ? { rationale } : {}),
      acceptanceCriteria: list(fm.acceptanceCriteria ?? fm.acceptance),
      ...(verificationMethod
        ? { verificationMethod: normalized(verificationMethod, methods, "unknown") }
        : {}),
      ...(parentId ? { parentId } : {}),
    };
  }

  private component(base: EngineeringObject, fm: Record<string, unknown>): Component {
    const manufacturer = text(fm.manufacturer);
    const partNumber = text(fm.partNumber);
    const datasheet = text(fm.datasheet);
    return {
      ...base,
      type: "component",
      ...(manufacturer ? { manufacturer } : {}),
      ...(partNumber ? { partNumber } : {}),
      ...(datasheet ? { datasheet } : {}),
      lifecycle: normalized(fm.lifecycle, lifecycles, "unknown"),
    };
  }

  private verification(base: EngineeringObject, fm: Record<string, unknown>): Verification {
    return {
      ...base,
      type: "verification",
      method: normalized(fm.method, methods, "unknown"),
      requirementIds: list(fm.requirementIds ?? fm.requirements),
      result: normalized(fm.result, results, "unknown"),
    };
  }

  private adr(base: EngineeringObject, fm: Record<string, unknown>): Adr {
    const context = text(fm.context);
    const decision = text(fm.decision);
    const supersedesId = text(fm.supersedes);
    return {
      ...base,
      type: "adr",
      decisionStatus: normalized(fm.decisionStatus ?? fm.status, adrStatuses, "unknown"),
      ...(context ? { context } : {}),
      ...(decision ? { decision } : {}),
      consequences: list(fm.consequences),
      ...(supersedesId ? { supersedesId } : {}),
    };
  }

  private risk(base: EngineeringObject, fm: Record<string, unknown>): Risk {
    const probability = numberValue(fm.probability);
    const impact = numberValue(fm.impact);
    const mitigation = text(fm.mitigation);
    const owner = text(fm.owner);
    return {
      ...base,
      type: "risk",
      ...(probability !== undefined ? { probability } : {}),
      ...(impact !== undefined ? { impact } : {}),
      level: normalized(fm.level, riskLevels, "unknown"),
      riskState: normalized(fm.riskState ?? fm.state, riskStates, "unknown"),
      ...(mitigation ? { mitigation } : {}),
      ...(owner ? { owner } : {}),
    };
  }
}
