import type { AIConfiguration } from "../../models/AIConfiguration";


export class AIConfigurationService {

  private configuration:
    AIConfiguration = {
      provider:
        "mock",
    };


  public get():
    AIConfiguration {

    return this.configuration;

  }


  public set(
    configuration: AIConfiguration,
  ): void {

    this.configuration =
      configuration;

  }

}
