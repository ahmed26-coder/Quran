import React from 'react'
import Button from '../../ui/Button'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import SectionTitle from '../../ui/SectionTitle'
import { DataStudies } from '@/Constents'

export function HomeSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondar/15 to-white dark:from-gray-900 dark:to-black ">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                استكشف القرآن الكريم والتعاليم الإسلامية
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                استمع إلى تلاوات القرآن من شيوخ مشهورين، واقرأ الأدعية، واستكشف القرآن الكريم بواجهة حديثة وجميلة.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link href="/Quran">
                                <Button highlighted={true} title='قراءة القرآن ' icon={<ChevronLeft />} />
                            </Link>
                            <Link href="/Sheikhs">
                                <Button highlighted={false} title='استكشف القراء' icon={<ChevronLeft />} />
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[300px] lg:h-[400px] xl:h-[500px] overflow-hidden rounded-xl">
                        <Image
                            src="/Yourspiritualjourney.webp"
                            width={600}
                            height={500}
                            alt="داخل المسجد"
                            className="object-cover w-full h-full"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 right-0 p-6 text-white">
                            <p className="text-xl font-medium">ابدأ رحلتك الدينيه اليوم</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



export function Studies() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center" >
                    <SectionTitle headline=' المميزات' title='كل ما تحتاجه لدراساتك الإسلامية' highlighted={true} description='توفر منصتنا موارد شاملة للمسلمين الباحثين عن المعرفة والنمو الروحي.' />
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                    {DataStudies.map((item, index) => (
                        <article key={index} className="flex flex-col justify-center space-y-4 rounded-lg border border-gray-300 p-6 shadow-sm">
                            <span className=" text-emerald-600">{item.icon}</span>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                            <Link href={item.link}>
                                <Button title={item.button} highlighted={false} />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function Sheikhs() {
    return (
        <section className=" bg-secondar/10 py-12 dark:from-gray-900 xl:py-20 dark:bg-black">
            <div className=" max-w-7xl mx-auto">
                <SectionTitle title='الشيوخ المميزون' description='استمع إلى تلاوات من هؤلاء القراء المشهورين للقرآن الكريم' highlighted={false} />
                <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { id: 1, name: "الشيخ عبد الباسط عبد الصمد", img: "/abdulbasit.webp" },
                        { id: 2, name: "الشيخ عبد الرحمن السديس", img: "/اللمنشاوي.webp" },
                        { id: 3, name: "الشيخ مشاري راشد العفاسي", img: "/الدوسري.webp" },
                    ].map((sheikh) => (
                        <Link href={`/sheikhs/${sheikh.id}`} key={sheikh.id} className="group">
                            <div className="flex flex-col space-y-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="relative h-40 w-40 mx-auto overflow-hidden rounded-full">
                                    <Image
                                        src={sheikh.img}
                                        width={160}
                                        height={160}
                                        alt={sheikh.name}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xl font-bold group-hover:text-emerald-600 dark:text-black">{sheikh.name}</h3>
                                    <p className="text-sm text-muted-foreground">قارئ مشهور بصوت جميل وتجويد مثالي</p>
                                </div>
                                <Button title='عرض الملف الشخصي ' highlighted={false} icon={<ChevronLeft />} />
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center">
                    <Link href="/Sheikhs">
                        <Button title='عرض جميع الشيوخ' highlighted={false} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export function Supplications() {
    return (
        <section className=" py-12 xl:py-20">
            <div className=" max-w-7xl mx-auto">
                <SectionTitle title='الأدعية اليومية' description='أدعية صحيحة لمختلف المناسبات' highlighted={false} />
                <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
              {["أذكار الصباح والمساء", "أدعية قبل النوم", "أذكار بعد الصلاة", "أدعية الاستغفار"].map((category, i) => (
                <div key={i} className="flex flex-col space-y-4 rounded-lg border border-gray-300 p-6 shadow-sm">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{category}</h3>
                    <p className="text-muted-foreground">مجموعة من الأدعية الصحيحة {category}</p>
                  </div>
                  <Link href={`/supplications?category=${category.replace(/\s+/g, "-").toLowerCase()}`}>
                    <Button title='عرض المجموعة' />
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/Supplications">
                <Button title='عرض جميع الأدعية' />
              </Link>
            </div>
            </div>
        </section>
    )
}

export function Team() {
    return(
        <section className="bg-secondar/10 dark:from-gray-900 py-12 xl:py-20 dark:bg-black">
            <div className=" max-w-7xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">انضم إلى مجتمعنا</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    تواصل مع إخوانك المسلمين، وشارك الأفكار، وانمو روحياً معاً.
                  </p>
                </div>
                <Link href="/About" className="flex max-w-[200PX]">
                  <Button title='تعرف على المزيد' />
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/team.webp"
                    width={500}
                    height={350}
                    alt="المجتمع"
                    className=" w-full h-full"
                  />
                </div>
              </div>
            </div>
            </div>
        </section>
    )
}