import { isCodeLanguage, type CodeLanguage, type SeedForm } from './generator'

export const seedPreferencesStorageKey = 'seed.generator.preferences'
export const defaultSeedLog = '.seed-agent.jsonl'

export interface SeedPreferences {
  version: 2
  api: string
  key: string
  model: string
  log: string
  language: CodeLanguage
  bootstrap: string
}

export function serializeSeedPreferences(form: SeedForm): string {
  const preferences: SeedPreferences = {
    version: 2,
    api: form.api,
    key: form.key,
    model: form.model,
    log: form.log,
    language: form.language,
    bootstrap: form.bootstrap,
  }

  return JSON.stringify(preferences)
}

export function parseSeedPreferences(value: string | null): SeedPreferences | null {
  if (value === null) return null

  try {
    const parsed: unknown = JSON.parse(value)
    if (!isRecord(parsed) || (parsed.version !== 1 && parsed.version !== 2)) return null
    if (
      typeof parsed.api !== 'string' ||
      typeof parsed.key !== 'string' ||
      typeof parsed.model !== 'string' ||
      (parsed.version === 2 && typeof parsed.log !== 'string') ||
      typeof parsed.bootstrap !== 'string' ||
      !isCodeLanguage(parsed.language)
    ) {
      return null
    }

    return {
      version: 2,
      api: parsed.api,
      key: parsed.key,
      model: parsed.model,
      log: parsed.version === 2 ? parsed.log as string : defaultSeedLog,
      language: parsed.language,
      bootstrap: parsed.bootstrap,
    }
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
