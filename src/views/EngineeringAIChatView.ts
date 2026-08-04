import {
  ItemView,
  WorkspaceLeaf,
  MarkdownRenderer,
  App,
} from "obsidian";

import { ConversationService } from "../services/ai/ConversationService";
import {
  EngineeringContextResolver,
  type ResolvedEngineeringContext,
} from "../services/ai/EngineeringContextResolver";

import type { EngineeringAssistantService } from "../services/ai/EngineeringAssistantService";
import {
  AIStorageService,
  type AIConversation,
} from "../services/ai/storage/AIStorageService";
import type { AIStatusService } from "../services/ai/AIStatusService";
export const ENGINEERING_AI_VIEW_TYPE =
  "engineering-ai-chat";

import type { AIResponse } from "../models/AIResponse";
export class EngineeringAIChatView extends ItemView {

  private readonly conversation =
    new ConversationService();
private conversationId:
  string | undefined;
private selectedModel:
  string | undefined;
  
  private readonly assistant:
    EngineeringAssistantService;

private readonly storage:
  AIStorageService;
  
  private readonly contextResolver:
    EngineeringContextResolver;

private readonly statusService:
  AIStatusService;
  
  private readonly appInstance:
    App;

private statusEl:
  HTMLElement | undefined;
  
  private inputEl:
  HTMLInputElement | undefined;

  private messagesEl:
    HTMLElement | undefined;
private conversationsEl:
  HTMLElement | undefined;
  
  private chatContainer:
  HTMLElement | undefined;

  private modelSelect:
  HTMLSelectElement | undefined;
  
  private contextEl:
    HTMLElement | undefined;
    
private loadingEl:
  HTMLElement | undefined;

private lastQuestion:
  string | undefined;
  
  private lastContextObjectId:
  string | undefined;
  
 private lastContextObjects:
  string[] = []; 
  
 private isTemporaryConversation =
  false;
  
  public constructor(
  leaf: WorkspaceLeaf,
  app: App,
  assistant: EngineeringAssistantService,
contextResolver: EngineeringContextResolver,
storage: AIStorageService,
statusService: AIStatusService,
) {
    super(leaf);
	
    this.statusService =
  statusService;
  
    this.appInstance =
      app;

    this.assistant =
      assistant;

    this.contextResolver =
      contextResolver;
      
      this.storage =
  storage;
  }
private updateAIContext(
  context: AIResponse["context"],
): void {

  if (!context || !this.contextEl) {
    return;
  }


  this.contextEl.empty();


  this.contextEl.createDiv({
    cls:
      "plc-eng-ai-context-sidebar-title",

    text:
      "Engineering Context",
  });


  if (context.objects.length === 0) {

    this.contextEl.createDiv({
      text:
        "⚪ Geen gebruikte objecten",
    });

    return;

  }


  for (const object of context.objects) {

  const button =
    this.contextEl.createEl(
      "button",
      {
        cls:
          "plc-eng-ai-context-object",

        text:
          `🟢 ${object.id} - ${object.title}`,
      },
    );


  button.onclick =
    async () => {

      await this.appInstance.workspace.openLinkText(
        object.sourcePath,
        "",
      );

    };

}


  this.contextEl.createDiv({
    cls:
      "plc-eng-ai-context-confidence",

    text:
      `Confidence: ${context.confidence}`,
  });

}

  public getViewType(): string {

    return ENGINEERING_AI_VIEW_TYPE;

  }


  public getDisplayText(): string {

    return "Engineering AI";

  }

private async loadModels(): Promise<void> {

  if (!this.modelSelect) {
    return;
  }



const models =
  await this.assistant.getAvailableModels();


  this.modelSelect.empty();


  if (models.length === 0) {

    this.modelSelect.createEl(
      "option",
      {
        value:
          "",

        text:
          "Geen modellen beschikbaar",
      },
    );

    return;

  }


  for (const model of models) {

    const option =
      this.modelSelect.createEl(
        "option",
        {
          value:
            model,

          text:
            model,
        },
      );


    if (
      model === this.selectedModel
    ) {

      option.selected =
        true;

    }

  }


 this.modelSelect.onchange =
  async () => {

    this.selectedModel =
      this.modelSelect?.value;


    if (this.selectedModel) {

      await this.storage.setSelectedModel(
        this.selectedModel,
      );

    }

  };

}
private async updateAIStatus(): Promise<void> {

  if (!this.statusEl) {
    return;
  }


  const status =
    await this.statusService.checkStatus();


  this.statusEl.setText(
    status.connected
      ? `🟢 ${status.provider} connected`
      : `🔴 ${status.provider} offline`,
  );

}
  private setLoading(
  loading: boolean,
): void {


  if (!this.messagesEl) {
    return;
  }


  if (loading) {

    this.loadingEl =
      this.messagesEl.createDiv({
        cls:
          "plc-eng-ai-loading",
      });


    this.loadingEl.setText(
      "⏳ AI analyseert...",
    );

  }
  else {

    this.loadingEl?.remove();

    this.loadingEl =
      undefined;

  }

}

public async onOpen(): Promise<void> {

    const container =
      this.contentEl;

container.addClass(
  "plc-eng-ai-container",
);
    container.empty();


    container.createEl(
      "h2",
      {
        text:
          "Engineering AI",
      },
    );
   
const aiWorkspace =
  container.createDiv({
    cls:
      "plc-eng-ai-workspace",
  });


const historyContainer =
  aiWorkspace.createDiv({
    cls:
      "plc-eng-ai-history",
  });


historyContainer.createEl(
  "h3",
  {
    text:
      "Conversations",
  },
);


const newConversationButton =
  historyContainer.createEl(
    "button",
    {
      text:
        "+ Nieuwe chat",

      cls:
        "plc-eng-ai-new-chat",
    },
  );


newConversationButton.onclick =
  async () => {

    await this.createNewConversation();

  };


this.conversationsEl =
  historyContainer.createDiv({
    cls:
      "plc-eng-ai-conversations",
  });


await this.loadConversations();

const aiSettings =
  historyContainer.createDiv({
    cls:
      "plc-eng-ai-sidebar-settings",
  });


this.statusEl =
  aiSettings.createEl(
    "p",
    {
      cls:
        "plc-eng-ai-status",
    },
  );


await this.updateAIStatus();


const modelContainer =
  aiSettings.createDiv({
    cls:
      "plc-eng-ai-model",
  });


modelContainer.createEl(
  "label",
  {
    text:
      "Model:",
  },
);


this.modelSelect =
  modelContainer.createEl(
    "select",
  );


const refreshButton =
  modelContainer.createEl(
    "button",
    {
      text:
        "↻",
    },
  );


refreshButton.onclick =
  async () => {

    await this.updateAIStatus();

    await this.loadModels();

  };
this.chatContainer =
  aiWorkspace.createDiv({
    cls:
      "plc-eng-ai-chat-container",
  });

const savedModel =
  await this.storage.getSelectedModel();


this.selectedModel =
  savedModel;


await this.loadModels();
await this.storage.deleteEmptyConversations();


const conversation =
  await this.storage.createConversation(
    "Engineering AI Session",
  );


this.conversationId =
  conversation.id;


this.isTemporaryConversation =
  true;


await this.storage.setActiveConversationId(
  conversation.id,
);



this.contextEl =
aiSettings.createEl(
  "div",
  {
    cls:
      "plc-eng-ai-context-sidebar",
  },
);


    this.updateContextDisplay({
  objects: [],

  confidence:
    "none",
});


   this.messagesEl =
  this.chatContainer?.createDiv({
    cls:
      "plc-eng-ai-messages",
  });
  


   this.inputEl =
  this.chatContainer?.createEl(
    "input",
        {
          type:
            "text",

          placeholder:
            "Ask engineering question...",
        },
      );


    const button =
  this.chatContainer?.createEl(
        "button",
        {
          text:
            "Send",
        },
      );


    button.onclick =
  async () => {

    const question =
  this.inputEl?.value.trim() ?? "";
      this.lastQuestion =
  question;


    if (!question) {
      return;
    }


    const activeFile =
      this.appInstance.workspace.getActiveFile();


    const resolvedContext =
      this.contextResolver.resolve(
        question,
        activeFile?.basename,
      );


    this.updateContextDisplay(
      resolvedContext,
    );
this.lastContextObjectId =
  resolvedContext.objects[0]?.objectId;

    await this.addMessage(
      "user",
      question,
    );


    if (this.inputEl) {

  this.inputEl.value =
    "";

}


this.setLoading(
  true,
);


let response;

try {

  const response =
    await this.assistant.ask(
      question,
      this.lastContextObjectId,
      this.modelSelect?.value,
    );


  await this.addMessage(
  "assistant",
  response.content,
);

if (response.context) {

  this.updateAIContext(
    response.context,
  );


  this.lastContextObjects =
    response.context.objects.map(
      (object) =>
        object.id,
    );

}


}
catch (error) {

  this.showAIError(
    error,
  );

}
finally {

  this.setLoading(
    false,
  );

}
  };

    this.inputEl?.addEventListener(
  "keydown",
  async (event: KeyboardEvent) => {

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
  private showAIError(
  error: unknown,
): void {


  const message =
    this.messagesEl?.createDiv({
      cls:
        "plc-eng-ai-error",
    });


  if (!message) {
    return;
  }


  message.createEl(
    "strong",
    {
      text:
        "⚠ AI request mislukt",
    },
  );


  message.createEl(
    "p",
    {
      text:
        String(error),
    },
  );


  const editButton =
    message.createEl(
      "button",
      {
        text:
          "✏ Vraag aanpassen",
      },
    );


  editButton.onclick =
    () => {

      if (
        this.inputEl
        && this.lastQuestion
      ) {

        this.inputEl.value =
          this.lastQuestion;

        this.inputEl.focus();

      }

    };


  const retryButton =
    message.createEl(
      "button",
      {
        text:
          "↻ Opnieuw proberen",
      },
    );


  retryButton.onclick =
    async () => {

      await this.retryLastRequest();

    };

}
  private async retryLastRequest(): Promise<void> {

  if (!this.lastQuestion) {
    return;
  }


  this.setLoading(true);


  try {

    const response =
      await this.assistant.ask(
        this.lastQuestion,
        this.lastContextObjectId,
        this.modelSelect?.value,
      );


    await this.addMessage(
      "assistant",
      response.content,
    );

  }
  catch(error) {

    this.showAIError(
      error,
    );

  }
  finally {

    this.setLoading(false);

  }

}

private async renderStoredConversation(
  conversation: AIConversation,
): Promise<void> {

  this.messagesEl?.empty();


  for (const message of conversation.messages) {

    await this.renderMessage(
      message.role,
      message.content,
    );

  }

}
private async openConversation(
  id: string,
): Promise<void> {

  const conversations =
    await this.storage.getConversations();


  const conversation =
    conversations.find(
      (item) =>
        item.id === id,
    );


  if (!conversation) {
    return;
  }


this.conversationId =
  conversation.id;


this.isTemporaryConversation =
  false;


await this.storage.setActiveConversationId(
  conversation.id,
);


await this.renderStoredConversation(
  conversation,
);
  

}
private async loadConversations(): Promise<void> {

  if (!this.conversationsEl) {
    return;
  }


  this.conversationsEl.empty();


  const conversations =
    await this.storage.getConversations();


  if (conversations.length === 0) {

    this.conversationsEl.createEl(
      "p",
      {
        text:
          "Geen gesprekken opgeslagen",
      },
    );

    return;

  }


  for (const conversation of conversations) {


  const item =
    this.conversationsEl.createDiv({
      cls:
        "plc-eng-ai-conversation-item",
    });


  const button =
    item.createEl(
      "button",
      {
        text:
          conversation.title,
      },
    );


  button.onclick =
    async () => {

      await this.openConversation(
        conversation.id,
      );

    };


  const deleteButton =
    item.createEl(
      "button",
      {
        text:
          "🗑",
      },
    );


  deleteButton.onclick =
    async () => {

      await this.storage.deleteConversation(
        conversation.id,
      );


      if (
        this.conversationId === conversation.id
      ) {

        this.conversationId =
          undefined;


        this.messagesEl?.empty();

      }


      await this.loadConversations();

    };

}

}
private updateContextDisplay(
  context: ResolvedEngineeringContext,
): void {

  if (!this.contextEl) {
    return;
  }


  if (
    context.confidence === "none"
    || context.objects.length === 0
  ) {

    this.contextEl.setText(
      "Context: ⚪ Geen engineering object",
    );

    return;

  }


  const contextLines =
    context.objects.map(
      (object) =>
        `${object.objectId} - ${object.objectTitle} (${object.objectType})`,
    );


  this.contextEl.setText(
    [
      "Context:",
      ...contextLines,
      `Confidence: ${context.confidence}`,
    ].join("\n"),
  );

}
private async renderMessage(
  role: "user" | "assistant",
  content: string,
): Promise<void> {


  const message =
    this.messagesEl?.createDiv({
      cls:
        [
          "plc-eng-ai-message",

          role === "user"
            ? "plc-eng-ai-user"
            : "plc-eng-ai-assistant",

        ],
    });


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


  if (role === "assistant") {

    const copyButton =
      message.createEl(
        "button",
        {
          text:
            "📋",

          cls:
            "plc-eng-ai-copy-button",
        },
      );


    copyButton.onclick =
      async () => {

        await navigator.clipboard.writeText(
          content,
        );


        copyButton.textContent =
          "✓";


        setTimeout(
          () => {

            copyButton.textContent =
              "📋";

          },
          1500,
        );

      };

  }


  const contentEl =
    message.createDiv();


  await MarkdownRenderer.renderMarkdown(
    content,
    contentEl,
    "",
    this,
  );


  if (this.messagesEl) {

    this.messagesEl.scrollTop =
      this.messagesEl.scrollHeight;

  }

}

private async createNewConversation(): Promise<void> {

  const conversation =
    await this.storage.createConversation(
      "Engineering AI Session",
    );


  this.conversationId =
  conversation.id;

this.isTemporaryConversation =
  true;
  
await this.storage.setActiveConversationId(
  conversation.id,
);


  this.messagesEl?.empty();


  this.updateContextDisplay({
    objects: [],

    confidence:
      "none",
  });


  await this.loadConversations();

}
private async addMessage(
  role: "user" | "assistant",
  content: string,
): Promise<void> {

  await this.renderMessage(
    role,
    content,
  );

if (!this.conversationId) {

  return;
}


  const conversations =
    await this.storage.getConversations();


  const conversation =
    conversations.find(
      (item) =>
        item.id === this.conversationId,
    );

  if (!conversation) {
    return;
  }


  // Eerste gebruikersvraag wordt de titel
  if (
  role === "user"
  && conversation.messages.length === 0
) {

  conversation.title =
    content.substring(0, 40);

}

if (
  this.isTemporaryConversation
  && role === "user"
) {

  this.isTemporaryConversation =
    false;

}
conversation.messages.push(
  {
    role,

    content,

    contextObjects:
      role === "assistant"
        && this.lastContextObjectId
        ? [
            this.lastContextObjectId,
          ]
        : [],
  },
);


await this.storage.saveConversation(
  conversation,
);


await this.loadConversations();
}


  public async onClose(): Promise<void> {

  if (
    this.isTemporaryConversation
    && this.conversationId
  ) {

    await this.storage.deleteConversation(
      this.conversationId,
    );

  }

}

}
