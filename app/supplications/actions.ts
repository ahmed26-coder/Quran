"use server"

export async function fetchAzkar(param: string) {
    try {
        const res = await fetch(`https://azkar.ml/zekr?${param}&json=true`, {
            cache: "no-store",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        })

        if (!res.ok) {
            const text = await res.text()
            console.error(`Azkar API Error ${res.status}:`, text)
            throw new Error(`API returned ${res.status}`)
        }

        return await res.json()
    } catch (error) {
        console.error("Azkar fetch failed:", error)
        // Re-throw so the UI knows it failed
        throw error
    }
}
