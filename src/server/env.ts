/**
 * A proxy for process.env that allows us to use default values and assert that
 * values exist. This reduces wasted debugging time when a variable is mispelled
 * or not set.
 */

export const __DEV__ = process.env.NODE_ENV === "development";

// Next.js or something overrides NODE_ENV, so we use a separate variable.
export const __TEST__ = !!process.env.TEST;

export enum Env {
  DATABASE_URL = "DATABASE_URL",
  SURVEY_PASSWORD = "SURVEY_PASSWORD",
}

export function hasEnv(env: Env): boolean {
  return getEnv(env, "") !== "";
}

/**
 * Get the value of an environment variable. If the variable is not set, return
 * the default value. If no default value is provided, throw an error.
 */
export function getEnv(env: Env, defaultValue?: string): string {
  const value = process.env[env];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`${env} is not set`);
  }
  return value;
}
