import { generateDummyPassword } from "./db/utils";

let dummyPassword: string | undefined;

/**
 * Generate the timing-safe fallback hash lazily.
 * Cloudflare Workers prohibit crypto randomness during module initialization,
 * so this must only run from an authentication request handler.
 */
export function getDummyPassword() {
  if (!dummyPassword) {
    dummyPassword = generateDummyPassword();
  }

  return dummyPassword;
}

export const isProductionEnvironment = process.env.NODE_ENV === "production";
export const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT
);

export const guestRegex = /^guest-\\d+$/;
