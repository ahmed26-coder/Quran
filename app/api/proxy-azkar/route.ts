import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const DATA_SOURCE = "https://raw.githubusercontent.com/nawafalqari/azkar-api/master/src/data/adkar.json";

const CATEGORY_MAP: Record<string, string> = {
    "m=true": "أذكار الصباح",
    "e=true": "أذكار المساء",
    "as=true": "أذكار بعد السلام من الصلاة المفروضة",
    "t=true": "تسابيح",
    "bs=true": "أذكار النوم",
    "wu=true": "أذكار الاستيقاظ",
    "qd=true": "أدعية قرآنية",
    "pd=true": "أدعية الأنبياء",
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Find which category is requested
    let categoryKey = "تسابيح"; // Default
    for (const [param, categoryName] of Object.entries(CATEGORY_MAP)) {
        const [key] = param.split('=');
        if (searchParams.has(key)) {
            categoryKey = categoryName;
            break;
        }
    }

    const returnAll = searchParams.get('all') === 'true';

    try {
        // We fetch from GitHub instead of azkar.ml to avoid DNS issues (ENOTFOUND .ml)
        const res = await fetch(DATA_SOURCE, {
            next: { revalidate: 3600 }, // Cache for an hour
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch from GitHub: ${res.status}`);
        }

        const allData = await res.json();
        const categoryData = allData[categoryKey];

        if (!categoryData || !Array.isArray(categoryData)) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        if (returnAll) {
            const mappedAllData = categoryData.map((item: any) => ({
                zekr: item.content,
                repeat: parseInt(item.count) || 1,
                bless: item.description || "",
                source: item.reference || ""
            }));
            return NextResponse.json(mappedAllData);
        }

        // Pick a random zekr
        const randomIndex = Math.floor(Math.random() * categoryData.length);
        const item = categoryData[randomIndex];

        // Map to the format the frontend expects
        const mappedData = {
            zekr: item.content,
            repeat: parseInt(item.count) || 1,
            bless: item.description || "",
            source: item.reference || ""
        };

        return NextResponse.json(mappedData);
    } catch (error: any) {
        console.error("[Proxy] Error:", error.message);
        return NextResponse.json({
            error: "Failed to fetch Azkar data",
            detail: error.message
        }, { status: 500 });
    }
}
