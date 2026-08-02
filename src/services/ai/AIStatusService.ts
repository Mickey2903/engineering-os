import type { AIProvider } from "./AIProvider";


export interface AIStatus {

  provider:
    string;

  connected:
    boolean;

}



export class AIStatusService {


  public constructor(
    private readonly provider: AIProvider,
    private readonly providerName: string,
  ) {}



  public async checkStatus():
    Promise<AIStatus> {

    const connected =
      await this.provider.checkConnection();


    return {

      provider:
        this.providerName,

      connected,

    };

  }

}
