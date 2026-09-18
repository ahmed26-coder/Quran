"use server"

/**
 * Quran Tafseer API Service
 * Primary API: https://api.alquran.cloud
 * Fallback/Secondary: None for now as api.quran-tafseer.com is unstable
 */

const ALQURAN_CLOUD_API = "https://api.alquran.cloud/v1"

export interface TafseerSource {
    id: number | string // Allow string IDs for AlQuran Cloud identifiers
    name: string
    author?: string
    language?: string
    identifier: string // Added identifier for AlQuran Cloud
}

export interface TafseerText {
    tafseer_id: number | string
    tafseer_name: string
    ayah_number: number
    ayah_text?: string
    text: string
}

/**
 * Fetch list of available Tafseer sources
 * Use static data file instead of hardcoding
 */
export async function fetchAvailableTafseers(): Promise<TafseerSource[]> {
    // Use static data file
    const tafseerSources = await import('@/data/tafseer-sources.json')
    return tafseerSources.default as TafseerSource[]
}

/**
 * Fetch Tafseer for a specific ayah using AlQuran Cloud
 */
export async function fetchTafseerForAyah(
    tafseerIdentifier: string,
    surahNumber: number,
    ayahNumber: number
): Promise<TafseerText> {
    try {
        const response = await fetch(
            `${ALQURAN_CLOUD_API}/ayah/${surahNumber}:${ayahNumber}/${tafseerIdentifier}`,
            {
                cache: "force-cache",
                next: { tags: ["tafseer", `tafseer:${tafseerIdentifier}`], revalidate: 3600 }
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch tafseer: ${response.status}`)
        }

        const data = await response.json()

        if (data.code !== 200) {
            throw new Error(`API Error: ${data.data}`)
        }

        return {
            tafseer_id: tafseerIdentifier,
            tafseer_name: data.data.edition.name,
            ayah_number: data.data.numberInSurah,
            ayah_text: data.data.text, // This API returns the ayah text too if needed
            text: data.data.text // For Tafsir editions, the 'text' field contains the tafsir
        }
    } catch (error) {
        console.error(`Error fetching tafseer for ${surahNumber}:${ayahNumber}:`, error)
        throw error
    }
}

/**
 * Fetch Tafseer for multiple ayahs
 * Optimized to use Promise.all for parallel fetching
 */
export async function fetchTafseerForAyahs(
    tafseerId: number | string, // Can be ID or Identifier
    ayahs: Array<{ surahNumber: number; ayahNumber: number }>
): Promise<TafseerText[]> {
    // If we receive a numeric ID, we need to map it to an identifier
    // In a real app we might want to pass the identifier directly from the UI
    let identifier = typeof tafseerId === 'string' ? tafseerId : ""

    if (typeof tafseerId === 'number') {
        const sources = await fetchAvailableTafseers()
        const source = sources.find(s => s.id === tafseerId)
        if (source) {
            identifier = source.identifier
        } else {
            // Fallback default
            identifier = "ar.muyassar"
        }
    }

    try {
        const promises = ayahs.map(({ surahNumber, ayahNumber }) =>
            fetchTafseerForAyah(identifier, surahNumber, ayahNumber)
        )

        const results = await Promise.allSettled(promises)

        return results
            .filter((result): result is PromiseFulfilledResult<TafseerText> => result.status === "fulfilled")
            .map(result => result.value)
    } catch (error) {
        console.error("Error fetching multiple tafseers:", error)
        return [] // Return empty array instead of throwing to avoid UI crash
    }
}
