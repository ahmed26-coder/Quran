"use client";

import { useState } from "react";
import { Client, Databases, ID } from "appwrite";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendWelcomeEmail } from "@/app/actions/subscribe";

const client = new Client();
client
    .setEndpoint("https://nyc.cloud.appwrite.io/v1") // رابط Appwrite
    .setProject("696bf0f30026eca12bd2"); // Project ID

const databases = new Databases(client);

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await databases.createDocument(
                "6970d96b000f94329ee0", // databaseId
                "form-footer", // collectionId
                ID.unique(),
                { email }
            );

            // Send welcome email using server action
            const emailResult = await sendWelcomeEmail(email);

            if (emailResult.success) {
                toast.success("تم الاشتراك بنجاح!", {
                    description: "تم إرسال رسالة ترحيبية إلى بريدك الإلكتروني.",
                });
            } else {
                toast.success("تم الاشتراك بنجاح!", {
                    description: "ولكن حدث خطأ أثناء إرسال البريد الإلكتروني.",
                });
            }

            setEmail("");
        } catch (error: any) {
            console.error(error);
            if (error?.code === 409) {
                toast.info("أنت مشترك بالفعل", {
                    description: "هذا البريد الإلكتروني مسجل لدينا مسبقًا.",
                });
            } else {
                toast.error("حدث خطأ", {
                    description: "يرجى المحاولة مرة أخرى لاحقًا.",
                });
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? "جاري الاشتراك..." : "اشترك"}
            </Button>
        </form>
    );
}
function setKey(arg0: string) {
    throw new Error("Function not implemented.");
}

