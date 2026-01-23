import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { API_CONFIG } from "@/lib/api/config";

/**
 * Webhook for on-demand revalidation.
 * 
 * Target URL example: /api/revalidate?secret=YOUR_SECRET&tag=quran:surah
 * Target URL example: /api/revalidate?secret=YOUR_SECRET&path=/quran
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    // 1. Security Check
    if (secret !== API_CONFIG.revalidateSecret) {
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    try {
        // 2. Revalidate by Tag
        if (tag) {
            revalidateTag(tag);
            return NextResponse.json({ revalidated: true, now: Date.now(), tag });
        }

        // 3. Revalidate by Path
        if (path) {
            revalidatePath(path);
            return NextResponse.json({ revalidated: true, now: Date.now(), path });
        }

        return NextResponse.json({
            message: "Missing 'tag' or 'path' parameter"
        }, { status: 400 });

    } catch (err) {
        return NextResponse.json({
            message: "Revalidation failed",
            error: err instanceof Error ? err.message : String(err)
        }, { status: 500 });
    }
}
