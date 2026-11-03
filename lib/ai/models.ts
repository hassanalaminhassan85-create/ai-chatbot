export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Cloudflare AI",
    description: "Multimodal assistant powered by Cloudflare Workers AI",
  },
  {
    id: "chat-model-reasoning",
    name: "Cloudflare Reasoning",
    description: "Advanced reasoning model for complex problems",
  },
];
