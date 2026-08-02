export type AIProviderType =
  | "mock"
  | "openai"
  | "ollama";


export interface AIConfiguration {

  readonly provider:
    AIProviderType;


  readonly model?: string;


  readonly endpoint?: string;


  readonly apiKey?: string;

}
