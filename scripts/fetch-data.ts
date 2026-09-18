/**
 * Build-time data fetcher
 * This script fetches data from APIs and saves it as static JSON files
 * Run this before building the application: npm run build-data
 */

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Helper function to save JSON
function saveJSON(filename: string, data: any) {
  const filepath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✅ Saved: ${filename}`)
}

// Helper function to fetch with retry
async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}

// 1. Fetch Surah List
async function fetchSurahs() {
  console.log('📥 Fetching Surah list...')
  try {
    const data = await fetchWithRetry('http://api.alquran.cloud/v1/surah')
    if (data.code === 200) {
      saveJSON('surahs.json', data.data)
    } else {
      throw new Error('Invalid response code')
    }
  } catch (error) {
    console.error('❌ Failed to fetch surahs:', error)
  }
}

// 2. Fetch Reciters (Sheikhs)
async function fetchReciters() {
  console.log('📥 Fetching Reciters list...')
  try {
    const data = await fetchWithRetry('https://mp3quran.net/api/v3/reciters?language=ar')
    if (data.reciters) {
      saveJSON('reciters.json', data.reciters)
    } else {
      throw new Error('Invalid response structure')
    }
  } catch (error) {
    console.error('❌ Failed to fetch reciters:', error)
  }
}

// 3. Fetch Azkar Data
async function fetchAzkar() {
  console.log('📥 Fetching Azkar data...')
  try {
    const data = await fetchWithRetry('https://raw.githubusercontent.com/nawafalqari/azkar-api/master/src/data/adkar.json')
    saveJSON('azkar.json', data)
  } catch (error) {
    console.error('❌ Failed to fetch azkar:', error)
  }
}

// 4. Fetch Tafseer Sources (static, no API needed)
function saveTafseerSources() {
  console.log('📥 Saving Tafseer sources...')
  const tafseerSources = [
    {
      id: 1,
      identifier: "ar.muyassar",
      name: "تفسير الميسر",
      author: "مجمع الملك فهد",
      language: "ar"
    },
    {
      id: 2,
      identifier: "ar.jalalayn",
      name: "تفسير الجلالين",
      author: "جلال الدين المحلي وجلال الدين السيوطي",
      language: "ar"
    },
    {
      id: 3,
      identifier: "ar.qurtubi",
      name: "تفسير القرطبي",
      author: "أبو عبد الله القرطبي",
      language: "ar"
    },
    {
      id: 4,
      identifier: "ar.waseet",
      name: "التفسير الوسيط",
      author: "محمد سيد طنطاوي",
      language: "ar"
    },
    {
      id: 5,
      identifier: "ar.baghawi",
      name: "تفسير البغوي",
      author: "الحسين بن مسعود البغوي",
      language: "ar"
    },
    {
      id: 6,
      identifier: "ar.miqbas",
      name: "تنوير المقباس من تفسير ابن عباس",
      author: "منسوب لابن عباس",
      language: "ar"
    }
  ]
  saveJSON('tafseer-sources.json', tafseerSources)
}

// 5. Fetch Quran Pages (optional - this is large, so we'll fetch a sample)
async function fetchQuranPages() {
  console.log('📥 Fetching Quran pages (this may take a while)...')
  const pages: Record<number, any[]> = {}
  
  // Fetch first 10 pages as sample (you can increase this to fetch all 604 pages)
  for (let page = 1; page <= 10; page++) {
    try {
      console.log(`  Fetching page ${page}...`)
      const data = await fetchWithRetry(`https://api.alquran.cloud/v1/page/${page}`)
      if (data.code === 200) {
        pages[page] = data.data.ayahs
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`  ❌ Failed to fetch page ${page}:`, error)
    }
  }
  
  saveJSON('quran-pages-sample.json', pages)
}

// Main execution
async function main() {
  console.log('🚀 Starting data fetch...\n')
  
  await Promise.all([
    fetchSurahs(),
    fetchReciters(),
    fetchAzkar(),
  ])
  
  saveTafseerSources()
  
  // Uncomment to fetch Quran pages (this is large and slow)
  // await fetchQuranPages()
  
  console.log('\n✨ Data fetch complete!')
}

main().catch(console.error)
