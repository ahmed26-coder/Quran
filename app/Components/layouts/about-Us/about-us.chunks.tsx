import React from 'react'
import SectionHead from '../../ui/SectionHead'
import { DataAboutGate, features, values, AboutUsers, futureGoals } from '@/Constents'
import { Star, Target } from 'lucide-react'

export function AboutHead() {
    return (
        <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondar/15 dark:from-gray-900 to-white dark:to-black ">
            <div className=" max-w-7xl mx-auto">
                <SectionHead title='عن بوابة القرآن' description='منصة إسلامية حديثة تهدف إلى تقديم القرآن الكريم والتعاليم الإسلامية بطريقة سهلة وجذابة' />
            </div>
        </div>
    )
}


export function AboutGate() {

    return (
        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter">رؤيتنا ورسالتنا</h2>
                            <p className="text-lg font-medium">
                                تأسست بوابة القرآن بهدف تسهيل وصول المسلمين في جميع أنحاء العالم إلى القرآن الكريم والتعاليم
                                الإسلامية من خلال منصة رقمية حديثة وسهلة الاستخدام. نسعى لتقديم محتوى إسلامي أصيل وموثوق به بطريقة
                                تناسب العصر الحديث.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">أهدافنا</h3>
                            {DataAboutGate.map((items, index) => (
                                <ul key={index} className="list-disc list-inside space-y-2 text-base font-medium">
                                    <li>{items}</li>
                                </ul>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                            <video
                                src="/بوابهالقران.mp4"
                                width={700}
                                height={350}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export function AboutStart() {
    return (
        <section className="w-full py-12 xl:py20 bg-secondar/15 dark:from-gray-900 dark:bg-black">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <SectionHead title='قصة بوابة القرآن' description='كيف بدأت رحلتنا في خدمة القرآن الكريم والمسلمين حول العالم' />
                </div>
                <div className="mx-auto max-w-5xl py-12">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">البدايات</h3>
                            <p className="text-base font-medium">
                                بدأت فكرة بوابة القرآن في عام 2018 عندما لاحظ مجموعة من المطورين المسلمين الحاجة إلى منصة رقمية
                                حديثة تجمع بين التصميم الجميل وسهولة الاستخدام لتقديم القرآن الكريم والمحتوى الإسلامي. كانت الرؤية
                                هي إنشاء منصة تجمع بين الأصالة والمعاصرة، وتكون متاحة للجميع بغض النظر عن مكان تواجدهم.
                            </p>
                            <p className="text-base font-medium">
                                بعد أشهر من البحث والتطوير، تم إطلاق النسخة الأولى من الموقع في رمضان 2019، وكانت تحتوي على القرآن
                                الكريم فقط مع إمكانية الاستماع إلى بعض التلاوات. ومع مرور الوقت، توسعت المنصة لتشمل المزيد من
                                الميزات والمحتوى.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">التطور والنمو</h3>
                            <p className="text-base font-medium">
                                مع تزايد عدد المستخدمين، استمعنا إلى ملاحظاتهم واقتراحاتهم وعملنا على تحسين المنصة باستمرار. أضفنا
                                قسم الأدعية والأذكار، وقسم الشيوخ والقراء، وطورنا واجهة المستخدم لتكون أكثر سهولة وجاذبية.
                            </p>
                            <p className="text-base font-medium">
                                في عام 2021، أطلقنا تطبيق الهاتف المحمول لبوابة القرآن، مما سمح للمستخدمين بالوصول إلى المحتوى في أي
                                وقت ومكان. وفي عام 2022، أضفنا ميزة مواقيت الصلاة والقبلة، وتوسعنا لدعم المزيد من اللغات لخدمة
                                المسلمين في جميع أنحاء العالم.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export function AboutServices() {
    return (
        <section className="w-full py-12 xl:py-20 md:py-24">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <SectionHead title='خدماتنا' description='نقدم مجموعة متنوعة من الخدمات لمساعدة المسلمين في رحلتهم الروحانية' />
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col space-y-4 rounded-lg border border-gray-300 hover:shadow-md bg-background p-6 shadow-sm"
                            >
                                <Icon className="h-12 w-12 text-emerald-600" />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                                    <p className="text-base font-medium">{feature.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    )
}


export function AboutValues() {
    return (
        <section className="w-full py-12 xl:py-20 bg-secondar/15 dark:from-gray-900 dark:bg-black">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <SectionHead title='قيمنا ومبادئنا' description='المبادئ التي نلتزم بها في عملنا وخدمتنا للمجتمع الإسلامي' />
                </div>
                <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
                    {values.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex flex-col space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className=" space-y-1">
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className=" text-base font-medium">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}


export function AboutUser() {
    return (
        <section className="w-full py-12 xl:py-20 md:py-24">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">آراء المستخدمين</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            ما يقوله مستخدمو بوابة القرآن عن تجربتهم مع المنصة
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                    {AboutUsers.map((testimonial, i) => (
                        <div key={i} className="flex flex-col space-y-4 hover:shadow-md rounded-lg border border-gray-300 bg-background p-6 shadow-sm">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500" />
                                </div>
                                <p className=" text-base font-medium text-gray-600 dark:text-gray-300">{testimonial.testimonial}</p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-300">
                                <p className="font-medium">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


export function AboutPlan() {
    return (
        <section className="w-full py-12 xl:py-20 bg-secondar/15 dark:from-gray-900 dark:bg-black">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <SectionHead title='خططنا المستقبلية' description='نسعى دائماً للتطوير والتحسين لتقديم أفضل تجربة ممكنة للمستخدمين' />
                </div>
                <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
                    {futureGoals.map((goal, index) => (
                        <div key={index} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                                    <Target className="h-6 w-6" />
                                </div>
                                <div className=" space-y-1">
                                    <h3 className="text-2xl font-bold">{goal.title}</h3>
                                    <p className=" font-medium text-base">{goal.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
