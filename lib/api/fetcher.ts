import { API_CONFIG, ApiSource, ResourceTag } from "./config";

interface FetcherOptions extends RequestInit {
    tags?: ResourceTag[];
    revalidate?: number | false;
    params?: Record<string, string | number | boolean>;
}

/**
 * Staff-level fetch wrapper for Next.js ISR.
 * Handles automatic tagging, build-time caching, and error state tracking.
 */
export async function apiFetch<T>(
    source: ApiSource,
    endpoint: string,
    options: FetcherOptions = {}
): Promise<T> {
    const {
        tags = [],
        revalidate = false, // Force fully static by default
        params,
        ...rest
    } = options;

    // Construct URL with search params
    const baseUrl = API_CONFIG.sources[source];
    const url = new URL(`${baseUrl}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
    }

    try {
        const response = await fetch(url.toString(), {
            ...rest,
            next: {
                tags: [...tags, `source:${source}`], // Always tag the source
                revalidate,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error [${source}]: ${response.statusText} (${response.status})`);
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`Fetcher error for ${url}:`, error);
        throw error;
    }
}
