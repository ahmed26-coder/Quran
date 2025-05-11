import React from 'react'
import SectionHead from '../../ui/SectionHead'
import { contactInfo, DataFaq } from '@/Constents';

export function ContactHead() {
    return (
        <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondar/15 to-white dark:to-black ">
            <div className=" max-w-7xl mx-auto">
                <SectionHead title='اتصل بنا' description='نحن هنا للإجابة على أسئلتكم واستقبال اقتراحاتكم. لا تترددوا في التواصل معنا.' />
            </div>
        </div>
    )
}



export default function ContactText() {
    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter">معلومات الاتصال</h2>
                <p className="text-muted-foreground">
                    يمكنكم التواصل معنا من خلال وسائل الاتصال التالية أو عبر نموذج الاتصال.
                </p>
            </div>

            <div className="space-y-4">
                {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium">{item.title}</h3>
                                <p className="text-muted-foreground">{item.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778101.0779485824!2d31.608731000000002!3d29.9889912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458109d9117a8cf%3A0x269b3d02e26da2b9!2sCairo%20Governorate!5e1!3m2!1sen!2seg!4v1746788874215!5m2!1sen!2seg&controls=0&disableDefaultUI=true"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                className="rounded-md"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="space-y-4">
                <h3 className="text-xl font-bold">ساعات العمل</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium">الأحد - الخميس</p>
                        <p className="text-muted-foreground">9:00 ص - 5:00 م</p>
                    </div>
                    <div>
                        <p className="font-medium">الجمعة - السبت</p>
                        <p className="text-muted-foreground">مغلق</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export function ContactFAQ() {
    return (
        <section className="w-full py-12 xl:py-20 bg-secondar/10">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <SectionHead title='الأسئلة الشائعة' description='إجابات على الأسئلة الأكثر شيوعاً' />
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
                    {DataFaq.map((faq, i) => (
                        <div key={i} className="rounded-lg border hover:shadow-md border-gray-300 bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-bold">{faq.question}</h3>
                            <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
