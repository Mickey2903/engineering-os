import {
  ItemView,
  WorkspaceLeaf,
} from "obsidian";

import { ConversationService } from "../services/ai/ConversationService";
import type { EngineeringAssistantService } from "../services/ai/EngineeringAssistantService";


export const ENGINEERING_AI_VIEW_TYPE =
  "engineering-ai-chat";


export class EngineeringAIChatView extends ItemView {

  private readonly conversation =
    new ConversationService();


  private readonly assistant:
    EngineeringAssistantService;


  private messagesEl:
    HTMLElement | undefined;


  public constructor(
    leaf: WorkspaceLeaf,
    assistant: EngineeringAssistantService,
  ) {
    super(leaf);

    this.assistant =
      assistant;
  }


  public getViewType(): string {

    return ENGINEERING_AI_VIEW_TYPE;

  }


  public getDisplayText(): string {

    return "Engineering AI";

  }


  public async onOpen(): Promise<void> {

    const container =
      this.contentEl;


    container.empty();


    container.createEl(
      "h2",
      {
        text:
          "Engineering AI",
      },
    );


    const objectInput =
      container.createEl(
        "input",
        {
          type:
            "text",

          placeholder:
            "Engineering object ID",
        },
      );


    this.messagesEl =
      container.createDiv();


    const input =
      container.createEl(
        "input",
        {
          type:
            "text",

          placeholder:
            "Ask engineering question...",
        },
      );


    const button =
      container.createEl(
        "button",
        {
          text:
            "Send",
        },
      );


    button.onclick =
      async () => {

        const objectId =
          objectInput.value.trim();


        const question =
          input.value.trim();


        if (
          !objectId ||
          !question
        ) {
          return;
        }


        this.addMessage(
          "user",
          question,
        );


        input.value =
          "";


        const response =
          await this.assistant.ask(
            objectId,
            question,
          );


        this.addMessage(
          "assistant",
          response.content,
        );

      };

  }


  private addMessage(
    role: "user" | "assistant",
    content: string,
  ): void {

    this.conversation[
      role === "user"
        ? "addUserMessage"
        : "addAssistantMessage"
    ](
      content,
    );


    this.messagesEl?.createEl(
      "p",
      {
        text:
          `${role}: ${content}`,
      },
    );

  }


  public async onClose(): Promise<void> {

  }

}
