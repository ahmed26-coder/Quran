export interface Category {
    id: number
    title: string
    slug: string
}

export interface Supplication {
    id: number
    title: string
    arabic: string
    latin: string
    translation: string
    notes?: string
    source?: string
    fawaid?: string
}

import { getCategoriesAction, getCategorySupplicationsAction } from "@/app/actions/supplications"

export async function getCategories(): Promise<Category[]> {
    return await getCategoriesAction()
}

export async function getCategorySupplications(slug: string): Promise<Supplication[]> {
    return await getCategorySupplicationsAction(slug)
}
