import type { AIRequest } from "../../models/AIRequest";
import type { AIResponse } from "../../models/AIResponse";


export interface AIProvider {

  generate(
    request: AIRequest,
  ): Promise<AIResponse>;
  
  checkConnection():
  Promise<boolean>;
  
  getAvailableModels():
  Promise<string[]>;

}
