export type BookmarkData = {
    surahNumber: number;
    ayahNumber: number;
    surahName: string;
    ayahText: string;
    note?: string;
    imageId?: string;
};

export type BookmarkItem = {
    id: string; // surah:ayah
    data: BookmarkData;
    timestamp: number;
    $id?: string; // Appwrite document ID
};
