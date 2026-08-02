export interface AIRequest {

  readonly prompt: string;

  readonly context?: string;

  readonly model?: string;

}
