import Link from "next/link";
import { Button } from "./ui/button";
import { Moon } from "lucide-react";
import Image from "next/image";
import NewsletterForm from "./form-submission";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container flex flex-col gap-6 py-12 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-6 lg:max-w-sm">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-bold flex items-center gap-2  "><Image src="/logo.jpg" priority alt="Logo" width={32} height={32} className=" rounded-xl" />بوابة القرآن</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        منصة حديثة لاستكشاف القرآن الكريم والاستماع إلى الشيوخ المشهورين والوصول إلى الأدعية الصحيحة.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                            <span className="sr-only">فيسبوك</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                            <span className="sr-only">تويتر</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                            <span className="sr-only">انستغرام</span>
                        </Button>
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:gap-10">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">استكشف</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/quran" className="text-muted-foreground hover:text-foreground">
                                    القرآن الكريم
                                </Link>
                            </li>
                            <li>
                                <Link href="/sheikhs" className="text-muted-foreground hover:text-foreground">
                                    الشيوخ
                                </Link>
                            </li>
                            <li>
                                <Link href="/supplications" className="text-muted-foreground hover:text-foreground">
                                    الأدعية
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">الموارد</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/prayer-times" className="text-muted-foreground hover:text-foreground">
                                    مواقيت الصلاة
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact#faq" className="text-muted-foreground hover:text-foreground">
                                    الأسئلة الشائعة
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                                    اتصل بنا
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">السياسات</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                                    سياسة الخصوصية
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                                    شروط الخدمة
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">اشترك</h3>
                        <NewsletterForm />
                        <p className="text-xs text-muted-foreground">احصل على تحديثات حول الميزات والمحتوى الجديد.</p>
                    </div>
                </div>
            </div>
            
            <div className="border-t">
                <div className="container flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:py-6">
                    <p className="text-center text-sm text-muted-foreground md:text-right">
                        © {new Date().getFullYear()} بوابة القرآن. جميع الحقوق محفوظة.
                    </p>
                    <p className="text-center text-sm text-muted-foreground md:text-left">صنع بحب للأمة الإسلامية</p>
                </div>
            </div>
        </footer>
    )
}