import {
  ItemView,
  WorkspaceLeaf,
  MarkdownRenderer,
  App,
} from "obsidian";

import { ConversationService } from "../services/ai/ConversationService";
import { EngineeringContextResolver } from "../services/ai/EngineeringContextResolver";
import type { EngineeringAssistantService } from "../services/ai/EngineeringAssistantService";


export const ENGINEERING_AI_VIEW_TYPE =
  "engineering-ai-chat";


export class EngineeringAIChatView extends ItemView {

  private readonly conversation =
    new ConversationService();


  private readonly assistant:
    EngineeringAssistantService;


  private readonly contextResolver:
    EngineeringContextResolver;


  private readonly appInstance:
    App;


  private messagesEl:
    HTMLElement | undefined;


  public constructor(
    leaf: WorkspaceLeaf,
    app: App,
    assistant: EngineeringAssistantService,
    contextResolver: EngineeringContextResolver,
  ) {
    super(leaf);

    this.appInstance =
      app;

    this.assistant =
      assistant;

    this.contextResolver =
      contextResolver;
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


    container.createEl(
      "p",
      {
        text:
          "Context: automatisch bepaald",
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

        const question =
          input.value.trim();


        if (!question) {
          return;
        }


        await this.addMessage(
          "user",
          question,
        );


        input.value =
          "";


        const activeFile =
          this.appInstance.workspace.getActiveFile();


        const resolvedContext =
          this.contextResolver.resolve(
            question,
            activeFile?.basename,
          );


        const response =
          await this.assistant.ask(
            question,
            resolvedContext.objectId,
          );


        await this.addMessage(
          "assistant",
          response.content,
        );

      };


    input.addEventListener(
      "keydown",
      async (event) => {

        if (
          event.key === "Enter"
          && !event.shiftKey
        ) {

          event.preventDefault();

          await button.click();

        }

      },
    );

  }


  private async addMessage(
    role: "user" | "assistant",
    content: string,
  ): Promise<void> {

    this.conversation[
      role === "user"
        ? "addUserMessage"
        : "addAssistantMessage"
    ](
      content,
    );


    const message =
      this.messagesEl?.createDiv();


    if (!message) {
      return;
    }


    message.createEl(
      "strong",
      {
        text:
          `${role}:`,
      },
    );


    const contentEl =
      message.createDiv();


    await MarkdownRenderer.renderMarkdown(
      content,
      contentEl,
      "",
      this,
    );

  }


  public async onClose(): Promise<void> {

  }

}
