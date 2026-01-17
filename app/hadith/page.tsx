import { SiteHeader } from "@/components/site-header"
import { HadithContent } from "@/components/hadith-content"

export const metadata = {
  title: "الأحاديث النبوية - بوابة القرآن",
  description: "موسوعة شاملة للأحاديث النبوية الشريفة من أشهر المصادر الإسلامية",
}

export default function HadithPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <HadithContent />
      </main>
    </div>
  )
}
