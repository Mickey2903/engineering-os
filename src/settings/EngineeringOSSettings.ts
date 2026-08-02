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
    "ollama",

  aiModel:
    "qwen2.5-coder:7b",

  aiEndpoint:
    "http://localhost:11434",

};
