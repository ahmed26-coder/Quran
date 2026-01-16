/**
 * API Configuration for On-Demand ISR
 */

export const API_CONFIG = {
    // Shared secret for revalidation requests
    // Should be set in Vercel environment variables
    revalidateSecret: process.env.REVALIDATION_SECRET || "default_dev_secret",

    // Base URLs for external APIs
    sources: {
        quran: process.env.NEXT_PUBLIC_QURAN_API_URL || "https://api.quran.com/api/v4",
        supplications: process.env.NEXT_PUBLIC_SUPPLICATIONS_API_URL || "https://dua-dhikr.com/api",
    },

    // Standardized resource tags for next.tags
    tags: {
        surah: (id?: string | number) => id ? `quran:surah:${id}` : "quran:surah",
        juz: (id?: string | number) => id ? `quran:juz:${id}` : "quran:juz",
        page: (id?: string | number) => id ? `quran:page:${id}` : "quran:page",
        supplication: (id?: string | number) => id ? `supp:item:${id}` : "supp:item",
        category: (slug?: string) => slug ? `supp:cat:${slug}` : "supp:cat",
    }
} as const;

export type ApiSource = keyof typeof API_CONFIG.sources;
export type ResourceTag = string;
