"use server"

const BASE_URL = "https://dua-dhikr.onrender.com"
const HEADERS = {
    "Accept-Language": "en",
}

export async function getCategoriesAction() {
    try {
        const res = await fetch(`${BASE_URL}/categories`, {
            headers: HEADERS,
            cache: "force-cache",
            next: { tags: ["supplications:categories"] }
        })
        if (!res.ok) throw new Error("Failed to fetch categories")
        const json = await res.json()
        return json.data || []
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function getCategorySupplicationsAction(slug: string) {
    try {
        const res = await fetch(`${BASE_URL}/categories/${slug}`, {
            headers: HEADERS,
            cache: "force-cache",
            next: { tags: ["supplications:category", `supp:cat:${slug}`] }
        })
        if (!res.ok) throw new Error("Failed to fetch supplications")
        const json = await res.json()
        return json.data || []
    } catch (error) {
        console.error(`Error fetching supplications for ${slug}:`, error)
        return []
    }
}
