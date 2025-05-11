"use client"
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail } from "lucide-react"

export default function ComingSoon() {
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.elements.namedItem('email') as HTMLInputElement;

        const emailValue = email.value;

        const { error } = await supabase
            .from("subscribers")
            .insert([{ email: emailValue }]);

        if (error) {
            console.error("Error inserting email:", error);
            alert(`Error: ${error.message}`);
        } else {

            email.value = "";
            setMessage("تم إرسال بريدك الإلكتروني بنجاح! شكراً لك.");
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-black p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svgPattern)}")`,
                        backgroundRepeat: "repeat",
                    }}
                />
            </div>

            <main className="relative z-10 container max-w-7xl mx-auto flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 dark:text-emerald-300 mb-4 font-arabic">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </h1>

                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">موقع القرآن الكريم قريباً</h2>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
                    نحن نعمل بجد لإنشاء مصدر شامل للقرآن الكريم يحتوي على ترجمات، تفسير، وتلاوات صوتية تساعدك على التواصل مع كتاب الله.
                </p>

                <div className="w-full max-w-md mb-12">
                    <div className="border border-emerald-200 dark:border-emerald-700 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-emerald-700 mb-4">كن أول من يعرف عند الإطلاق</h3>
                        <form
                            className="flex flex-col sm:flex-row gap-3"
                            onSubmit={handleSubmit}
                        >
                            <input
                                name="email"
                                type="email"
                                placeholder="أدخل بريدك الإلكتروني"
                                className="flex-1 px-4 py-2 rounded-md border border-emerald-300 dark:border-emerald-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition"
                            >
                                <Mail className="h-4 w-4" />
                                أبلغني
                            </button>
                        </form>
                        {message && (
                            <div className="mt-4 text-green-600 font-semibold">{message}</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <FeatureCard
                        title="النص الكامل للقرآن الكريم"
                        description="الوصول إلى النص الكامل للقرآن مع النص العربي الدقيق  ."
                    />
                    <FeatureCard
                        title="تلاوات صوتية"
                        description="استمع إلى تلاوات جميلة من نخبة من قراء العالم الإسلامي."
                    />
                    <FeatureCard
                        title="تفسير وشرح"
                        description="عمّق فهمك مع تفسير شامل وشرح مفصل للآيات."
                    />
                </div>

                <footer className="mt-16 text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} موقع القرآن الكريم. جميع الحقوق محفوظة.</p>
                </footer>
            </main>
        </div>
    )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg border border-emerald-100 dark:border-emerald-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>

    )
}

const svgPattern = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h100v100H0z" fill="none"/>
  <path d="M50 0L0 50l50 50 50-50L50 0zm0 20l30 30-30 30-30-30 30-30z" fill="gray"/>
  <path d="M50 30l20 20-20 20-20-20 20-20z" fill="gray"/>
  <path d="M50 40l10 10-10 10-10-10 10-10z" fill="gray"/>
</svg>
`
