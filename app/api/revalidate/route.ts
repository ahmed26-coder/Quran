import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { API_CONFIG } from "@/lib/api/config";

/**
 * PRODUCTION-GRADE REVALIDATION ENDPOINT
 * 
 * Supports both Tag-based and Path-based revalidation.
 * Securely protected by a shared secret.
 */
export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // 1. Security Check
    if (secret !== API_CONFIG.revalidateSecret) {
        return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { tag, path, source } = body;

        // 2. Validate Payload
        if (!tag && !path) {
            return NextResponse.json({ message: "Tag or Path is required" }, { status: 400 });
        }

        // 3. Execution
        if (tag) {
            // Revalidate by granular tag (recommended for data updates)
            revalidateTag(tag);
            console.log(`[ISR] Revalidated Tag: ${tag} (Source: ${source || 'Unknown'})`);
        }

        if (path) {
            // Revalidate by path (useful for UI changes or forced layout updates)
            revalidatePath(path);
            console.log(`[ISR] Revalidated Path: ${path}`);
        }

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            target: tag || path
        });
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating", error: String(err) }, { status: 500 });
    }
}
