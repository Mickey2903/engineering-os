export type ChatRole =
  "user" | "assistant";


export interface ChatMessage {

  readonly role:
    ChatRole;

  readonly content:
    string;

  readonly timestamp:
    number;

}


export class ConversationService {

  private readonly messages:
    ChatMessage[] = [];


  public addUserMessage(
    content: string,
  ): void {

    this.messages.push({
      role:
        "user",

      content,

      timestamp:
        Date.now(),
    });

  }


  public addAssistantMessage(
    content: string,
  ): void {

    this.messages.push({
      role:
        "assistant",

      content,

      timestamp:
        Date.now(),
    });

  }


  public getMessages():
    readonly ChatMessage[] {

    return this.messages;

  }


  public clear(): void {

    this.messages.length =
      0;

  }

}
