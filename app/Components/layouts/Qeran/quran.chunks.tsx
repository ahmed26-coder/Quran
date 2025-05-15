import React from 'react'
import SectionHead from '../../ui/SectionHead'
import { Search } from 'lucide-react'

export function QuranHead() {
    return (
        <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondar/15 dark:from-gray-900 to-white dark:to-black ">
            <div className=" max-w-7xl mx-auto">
                <SectionHead title='القرآن الكريم' description='اقرأ واستمع وادرس القرآن الكريم مع ترجمات متعددة وموارد التفسير.' />
                <form action="" className=" w-[30%] mt-4 mx-auto relative">
                    <input type="search" className={` w-full rounded-md outline-0 border-1 border-gray-300 focus:border-emerald-600 focus:border-2 px-3 py-2`} placeholder='ابحث في القرآن....' />
                    <Search className=" text-gray-500 absolute top-2 left-4 " />
                </form>
            </div>
        </div>
    )
}
