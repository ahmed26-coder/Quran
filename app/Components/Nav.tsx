"use client"
import React, { useState } from 'react'
import Link from "next/link"
import { Menu, Moon, X } from "lucide-react"
import { DataNav } from '@/Constents'
import ThemeToggle from './ThemeToggle'

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <header className="sticky top-0 z-50 w-full border-b-1 border-gray-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-5 max-w-7xl xl:mx-auto flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Moon className="h-10 w-10 text-emerald-600" />
                    <span className="text-3xl font-bold">بوابة القرآن</span>
                </Link>

                <nav className="hidden lg:flex gap-6">
                    {DataNav.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            className="text-lg font-medium transition-colors hover:text-emerald-600"
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <ThemeToggle />

                <div className="lg:hidden">
                    <button onClick={toggleMenu} className="p-2">
                        <span className="sr-only">القائمة</span>
                        {isOpen ? <X className="h-10 w-10 border-1 hover:bg-gray-50/90 border-gray-200 rounded-md p-1" /> : (<Menu className="h-10 w-10 border-1 border-gray-200 rounded-md p-1" />)}
                    </button>
                </div>
            </div>

            {isOpen && (
                <nav className="lg:hidden bg-background bg-white z-50 absolute w-full mx-auto shadow-sm rounded-b-md animate-slide-down">
                    <div className="flex flex-col gap-4 p-4">
                        {DataNav.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className="text-lg font-medium transition-colors hover:text-emerald-600"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <ThemeToggle />
                </nav>
            )}
        </header>
    )
}
