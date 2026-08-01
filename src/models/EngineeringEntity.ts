import type { Adr } from "./Adr";
import type { Component } from "./Component";
import type { EngineeringObject } from "./EngineeringObject";
import type { Requirement } from "./Requirement";
import type { Risk } from "./Risk";
import type { Verification } from "./Verification";
import type { EngineeringCad } from "./EngineeringCad";
import type { EngineeringDocument } from "./EngineeringDocument";
import type { EngineeringFile } from "./EngineeringFile";
import type { EngineeringSoftware } from "./EngineeringSoftware";
export type EngineeringEntity =
  | Requirement
  | Component
  | Verification
  | Adr
  | Risk
  | EngineeringDocument
  | EngineeringCad
  | EngineeringFile
  | EngineeringSoftware
  | EngineeringObject;
export const isRequirement = (entity: EngineeringEntity): entity is Requirement =>
  entity.type === "requirement";
export const isComponent = (entity: EngineeringEntity): entity is Component =>
  entity.type === "component";
export const isVerification = (entity: EngineeringEntity): entity is Verification =>
  entity.type === "verification";
export const isAdr = (entity: EngineeringEntity): entity is Adr => entity.type === "adr";
export const isRisk = (entity: EngineeringEntity): entity is Risk => entity.type === "risk";
export const isDocument = (
  entity: EngineeringEntity,
): entity is EngineeringDocument =>
  entity.type === "document";


export const isCad = (
  entity: EngineeringEntity,
): entity is EngineeringCad =>
  entity.type === "cad";


export const isFile = (
  entity: EngineeringEntity,
): entity is EngineeringFile =>
  entity.type === "file";


export const isSoftware = (
  entity: EngineeringEntity,
): entity is EngineeringSoftware =>
  entity.type === "software";
