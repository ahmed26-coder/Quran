import React from 'react'
import SectionHead from '../../ui/SectionHead'
import { Search } from 'lucide-react'

export function SupplicationsHead() {
    return (
        <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondar/15 to-white dark:to-black ">
            <div className=" max-w-7xl mx-auto">
                <SectionHead title='الأدعية اليومية (الأذكار)' description='الوصول إلى مجموعة من الأدعية والأذكار الصحيحة لمختلف المناسبات والاحتياجات.' />
                <form action="" className=" w-[30%] mt-4 mx-auto relative">
                    <input type="search" className={` w-full rounded-md outline-0 border-1 border-gray-300 focus:border-emerald-600 focus:border-2 px-3 py-2`} placeholder='ابحث في الادعيه....' />
                    <Search className=" text-gray-500 absolute top-2 left-4 " />
                </form>
            </div>
        </div>
    )
}



export function SupplicationsFilters() {
  const categories = [
    { id: "morning-evening", name: "أذكار الصباح والمساء" },
    { id: "before-sleep", name: "أدعية قبل النوم" },
    { id: "after-prayer", name: "أذكار بعد الصلاة" },
    { id: "forgiveness", name: "أدعية الاستغفار" },
    { id: "protection", name: "أدعية الحماية" },
    { id: "travel", name: "أدعية السفر" },
    { id: "food", name: "أدعية قبل وبعد الطعام" },
    { id: "distress", name: "أدعية وقت الشدة" },
  ];

  const supplications = [
    {
      id: 1,
      category: "morning-evening",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ...",
      transliteration: "أصبحنا وأصبح الملك لله...",
      translation: "أصبحنا وأصبح الملك لله...",
      reference: "رواه أبو داود",
      virtues: "من قالها حين يصبح أو يمسي...",
    },
    {
      id: 2,
      category: "before-sleep",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "باسمك اللهم أموت وأحيا.",
      translation: "باسمك اللهم أموت وأحيا.",
      reference: "رواه البخاري",
      virtues: "من قالها عند النوم...",
    },
    {
      id: 3,
      category: "after-prayer",
      arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ...",
      transliteration: "اللهم أعني على ذكرك...",
      translation: "اللهم أعني على ذكرك...",
      reference: "رواه أبو داود",
      virtues: "من قالها بعد كل صلاة...",
    },
  ];

  return (
    <section>
        
    </section>
  );
}


