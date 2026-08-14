import { isCodeLanguage, type CodeLanguage, type SeedForm } from './generator'

export const seedPreferencesStorageKey = 'seed.generator.preferences'

export interface SeedPreferences {
  version: 1
  api: string
  key: string
  model: string
  language: CodeLanguage
  bootstrap: string
}

export function serializeSeedPreferences(form: SeedForm): string {
  const preferences: SeedPreferences = {
    version: 1,
    api: form.api,
    key: form.key,
    model: form.model,
    language: form.language,
    bootstrap: form.bootstrap,
  }

  return JSON.stringify(preferences)
}

export function parseSeedPreferences(value: string | null): SeedPreferences | null {
  if (value === null) return null

  try {
    const parsed: unknown = JSON.parse(value)
    if (!isRecord(parsed) || parsed.version !== 1) return null
    if (
      typeof parsed.api !== 'string' ||
      typeof parsed.key !== 'string' ||
      typeof parsed.model !== 'string' ||
      typeof parsed.bootstrap !== 'string' ||
      !isCodeLanguage(parsed.language)
    ) {
      return null
    }

    return {
      version: 1,
      api: parsed.api,
      key: parsed.key,
      model: parsed.model,
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
