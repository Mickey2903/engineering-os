import type { AIConfiguration } from "../../models/AIConfiguration";
import type { EngineeringOSSettings } from "../../settings/EngineeringOSSettings";


export class AIConfigurationService {

  public constructor(
    private readonly settings:
      EngineeringOSSettings,
  ) {}


  public get():
    AIConfiguration {

    return {
      provider:
        this.settings.aiProvider,

      ...(this.settings.aiModel
        ? {
            model:
              this.settings.aiModel,
          }
        : {}),

    ...(this.settings.aiEndpoint
  ? {
      endpoint:
        this.settings.aiEndpoint,
    }
  : this.settings.aiProvider === "ollama"
    ? {
        endpoint:
          "http://localhost:11434",
      }
    : {}),
      ...(this.settings.aiApiKey
        ? {
            apiKey:
              this.settings.aiApiKey,
          }
        : {}),
    };

  }

}
