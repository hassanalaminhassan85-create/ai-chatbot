import { createWorkersAI } from "workers-ai-provider";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { env } from "cloudflare:workers";
import { isTestEnvironment } from "../constants";

const workersAI = createWorkersAI({ binding: env.AI });

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": workersAI("@cf/zai-org/glm-5.3-flash"),
        "chat-model-reasoning": wrapLanguageModel({
          model: workersAI("@cf/openai/gpt-oss-120b"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": workersAI("@cf/zai-org/glm-5.3-flash"),
        "artifact-model": workersAI("@cf/zai-org/glm-5.3-flash"),
      },
    });
