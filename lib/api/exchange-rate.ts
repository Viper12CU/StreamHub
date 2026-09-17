import fs from "node:fs/promises"
import path from "node:path"

// ─── Daily cache on disk ────────────────────────────────

const CACHE_DIR = path.join(process.cwd(), ".cache")
const CACHE_FILE = path.join(CACHE_DIR, "eltoque-trmi.json")

interface ExchangeCacheEntry {
  date: string
  usd: number | null
}

function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10)
}

async function readCache(): Promise<ExchangeCacheEntry | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8")
    return JSON.parse(raw) as ExchangeCacheEntry
  } catch {
    return null
  }
}

async function writeCache(entry: ExchangeCacheEntry): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true })
    await fs.writeFile(CACHE_FILE, JSON.stringify(entry), "utf-8")
  } catch {
    // Best effort: ignore disk errors
  }
}

interface ElToqueResponse {
  date?: string
  tasas?: {
    USD?: number
  }
}

/**
 * Returns today's USD→CUP exchange rate from elToque's API.
 * The API is queried at most once per day; results are cached
 * locally to avoid abusing the upstream service.
 *
 * Falls back to the last cached value if the API call fails.
 */
export async function getUsdCupRate(): Promise<number | null> {
  const cached = await readCache()

  if (cached && cached.date === todayKey() && cached.usd !== null) {
    return cached.usd
  }

  const apiKey = process.env.ELTOQUE_API_KEY
  if (!apiKey) {
    return cached?.usd ?? null
  }

  try {
    const res = await fetch("https://tasas.eltoque.com/v1/trmi", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    })

    if (!res.ok) {
      return cached?.usd ?? null
    }

    const data = (await res.json()) as ElToqueResponse
    const usd = typeof data.tasas?.USD === "number" ? data.tasas.USD : null

    if (usd !== null) {
      await writeCache({ date: data.date || todayKey(), usd })
      return usd
    }

    return cached?.usd ?? null
  } catch {
    return cached?.usd ?? null
  }
}