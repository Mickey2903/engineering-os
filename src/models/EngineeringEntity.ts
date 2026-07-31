import type { Adr } from "./Adr";
import type { Component } from "./Component";
import type { EngineeringObject } from "./EngineeringObject";
import type { Requirement } from "./Requirement";
import type { Risk } from "./Risk";
import type { Verification } from "./Verification";
export type EngineeringEntity =
  Requirement | Component | Verification | Adr | Risk | EngineeringObject;
export const isRequirement = (entity: EngineeringEntity): entity is Requirement =>
  entity.type === "requirement";
export const isComponent = (entity: EngineeringEntity): entity is Component =>
  entity.type === "component";
export const isVerification = (entity: EngineeringEntity): entity is Verification =>
  entity.type === "verification";
export const isAdr = (entity: EngineeringEntity): entity is Adr => entity.type === "adr";
export const isRisk = (entity: EngineeringEntity): entity is Risk => entity.type === "risk";
