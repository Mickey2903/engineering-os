import type { AIProviderType } from "../models/AIConfiguration";


export interface EngineeringOSSettings {

  readonly aiProvider: AIProviderType;

  readonly aiModel?: string;

  readonly aiEndpoint?: string;

  readonly aiApiKey?: string;

}


export const DEFAULT_ENGINEERING_OS_SETTINGS:
  EngineeringOSSettings = {

  aiProvider:
    "mock",

};
