import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  accountId: "8f58ef5027ba3822189f6387979ce898",
  worker: defineWorker({
    name: "ai-chatbot",
    entrypoint: "./worker/index.ts",
    compatibilityDate: "2026-11-03",
    compatibilityFlags: ["nodejs_compat"],
    workersDev: true,
    previewUrls: true,
    env: {
      DB: bindings.d1({
        id: "fd7eac79-7e5d-4100-9f5c-f6b959e3b287",
        name: "ai-chatbot",
      }),
      FILES: bindings.r2({ name: "ai-chatbot-files" }),
      AI: bindings.ai(),
    },
    observability: {
      enabled: true,
      headSamplingRate: 1,
      logs: { enabled: true, invocationLogs: true },
    },
  }),
});
