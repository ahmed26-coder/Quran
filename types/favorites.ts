export type AyahData = {
    number: number;
    text: string;
    surahName: string;
    surahNumber: number;
    numberInSurah: number;
    juz: number;
    page: number;
};

export type HadithData = {
    id: number;
    text: string;
    source: string; // Book name
    number: string;
    grade: string;
    chapter?: string;
};

export type SupplicationData = {
    id: string; // generated ID
    text: string;
    category: string;
    count?: number;
    translation?: string;
};

export type SheikhData = {
    id: number;
    name: string;
    image?: string;
    bio?: string;
};

export type RecitationData = {
    id: string; // sheikhId-surahId
    surahName: string;
    surahId: number;
    sheikhId: number;
    sheikhName: string;
    moshafId: number;
    server: string;
};

export type FavoriteItem =
    | { type: 'ayah'; id: string; data: AyahData; timestamp: number } // id: surah:ayah
    | { type: 'hadith'; id: number; data: HadithData; timestamp: number }
    | { type: 'supplication'; id: string; data: SupplicationData; timestamp: number }
    | { type: 'sheikh'; id: number; data: SheikhData; timestamp: number }
    | { type: 'recitation'; id: string; data: RecitationData; timestamp: number };

