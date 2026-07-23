import type { CreateEntryInput, CreateToyInput, Entry, Toy } from '../types'

const STORAGE_KEY = 'toydairy.mock.v1'

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

function delay(ms = 280) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Simple zodiac from birth date (Western, month-day) */
export function zodiacFromDate(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return '神秘座'
  const m = d.getMonth() + 1
  const day = d.getDate()
  const table: [number, number, string][] = [
    [1, 20, '摩羯座'],
    [2, 19, '水瓶座'],
    [3, 21, '双鱼座'],
    [4, 20, '白羊座'],
    [5, 21, '金牛座'],
    [6, 21, '双子座'],
    [7, 23, '巨蟹座'],
    [8, 23, '狮子座'],
    [9, 23, '处女座'],
    [10, 23, '天秤座'],
    [11, 22, '天蝎座'],
    [12, 22, '射手座'],
    [12, 32, '摩羯座'],
  ]
  for (const [month, lastDay, name] of table) {
    if (m < month || (m === month && day <= lastDay)) return name
  }
  return '摩羯座'
}

function mockProfile(input: CreateToyInput) {
  const zodiac = zodiacFromDate(input.birthDate)
  const traitStr = input.traits.join('、') || '温柔'
  const bio = `${input.name}是一只${traitStr}的${input.role}，出生于${input.birthPlace}。作为${zodiac}，ta 总在小小的身体里装着大大的世界。`
  const monologue = `我是${input.name}，最大的梦想是和主人一起把路上的光都记下来。`
  return { zodiac, bio, monologue }
}

function mockDiary(toy: Toy, entry: Pick<Entry, 'date' | 'location' | 'userNote' | 'mood' | 'type' | 'title'>) {
  const place = entry.location || '某个温柔的地方'
  const mood = entry.mood ? `今天心里有点${entry.mood}。` : ''
  const note = entry.userNote ? entry.userNote.trim() : ''
  const trait = toy.traits[0] || '安静'
  return (
    `${entry.date.replace(/-/g, '年').replace(/年(\d+)$/, '月$1日')}，${place}。\n\n` +
    `主人带着我来到这里。我有点${trait}，但还是把眼睛睁得大大的。` +
    (note ? `\n\n主人说：${note}` : '') +
    `\n\n${mood}我想，这些瞬间以后都会变成我们的小秘密。` +
    (entry.title ? `\n\n—— 关于「${entry.title}」` : '')
  )
}

interface StoreData {
  toys: Toy[]
  entries: Entry[]
  currentToyId: string | null
}

function seed(): StoreData {
  const lunaId = 'toy_luna_demo'
  const beanId = 'toy_bean_demo'
  const toys: Toy[] = [
    {
      id: lunaId,
      name: '小熊 Luna',
      birthDate: '2026-07-23',
      birthPlace: '上海迪士尼',
      role: '旅行搭子',
      traits: ['温柔', '胆小', '好奇'],
      zodiac: '巨蟹座',
      bio: '一只相信世界很大的熊，最大的梦想是看遍世界所有日落。',
      monologue: '第 1 天啦，谢谢你把我带回家～',
      createdAt: '2026-07-23T10:00:00.000Z',
    },
    {
      id: beanId,
      name: '豆豆',
      birthDate: '2025-12-01',
      birthPlace: '成都宽窄巷子',
      role: '童年伙伴',
      traits: ['活泼', '话多'],
      zodiac: '射手座',
      bio: '豆豆喜欢热闹，也喜欢在口袋里藏糖纸。',
      monologue: '今天也要一起出门吗？',
      createdAt: '2026-01-10T08:00:00.000Z',
    },
  ]
  const entries: Entry[] = [
    {
      id: 'entry_gulangyu',
      toyId: lunaId,
      type: 'travel',
      date: '2026-04-03',
      location: '鼓浪屿',
      title: '橘子汽水色的天空',
      userNote: '和主人看日落',
      mood: '平静',
      imageUrl:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      aiDiary:
        '2026年4月3日，鼓浪屿。\n\n今天主人带我来看日落。海风有点大，但我终于知道，太阳回家时，天空会变成橘子汽水的颜色。',
      createdAt: '2026-04-03T18:30:00.000Z',
    },
    {
      id: 'entry_daily1',
      toyId: lunaId,
      type: 'daily',
      date: '2026-05-12',
      location: '家',
      title: '窗台的光',
      userNote: '午睡',
      mood: '温柔',
      aiDiary:
        '2026年5月12日，家。\n\n窗台有一小块阳光，刚好够我躺下。主人说今天什么也不做，我也跟着什么都不想。',
      createdAt: '2026-05-12T14:00:00.000Z',
    },
    {
      id: 'entry_bean1',
      toyId: beanId,
      type: 'travel',
      date: '2026-03-01',
      location: '大理',
      title: '风很大',
      mood: '兴奋',
      aiDiary: '2026年3月1日，大理。\n\n风把我的围巾吹成一面小旗。我告诉主人：再大的风也吹不走我们的脚印。',
      createdAt: '2026-03-01T12:00:00.000Z',
    },
  ]
  return { toys, entries, currentToyId: lunaId }
}

function load(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const s = seed()
      save(s)
      return s
    }
    return JSON.parse(raw) as StoreData
  } catch {
    const s = seed()
    save(s)
    return s
  }
}

function save(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const mockStore = {
  async listToys(): Promise<Toy[]> {
    await delay()
    return load().toys
  },

  async getToy(id: string): Promise<Toy | undefined> {
    await delay()
    return load().toys.find((t) => t.id === id)
  },

  async createToy(input: CreateToyInput): Promise<Toy> {
    await delay(400)
    const data = load()
    const profile = mockProfile(input)
    const toy: Toy = {
      id: uid('toy'),
      ...input,
      ...profile,
      createdAt: new Date().toISOString(),
    }
    data.toys.unshift(toy)
    data.currentToyId = toy.id
    save(data)
    return toy
  },

  async generateProfile(id: string): Promise<Toy> {
    await delay(500)
    const data = load()
    const toy = data.toys.find((t) => t.id === id)
    if (!toy) throw new Error('玩偶不存在')
    const profile = mockProfile(toy)
    Object.assign(toy, profile)
    save(data)
    return toy
  },

  async listEntries(toyId: string): Promise<Entry[]> {
    await delay()
    return load()
      .entries.filter((e) => e.toyId === toyId)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  },

  async getEntry(id: string): Promise<Entry | undefined> {
    await delay()
    return load().entries.find((e) => e.id === id)
  },

  async createEntry(toyId: string, input: CreateEntryInput): Promise<Entry> {
    await delay(500)
    const data = load()
    const toy = data.toys.find((t) => t.id === toyId)
    if (!toy) throw new Error('玩偶不存在')
    const entry: Entry = {
      id: uid('entry'),
      toyId,
      ...input,
      aiDiary: mockDiary(toy, input),
      createdAt: new Date().toISOString(),
    }
    data.entries.unshift(entry)
    save(data)
    return entry
  },

  async regenerateEntry(id: string): Promise<Entry> {
    await delay(450)
    const data = load()
    const entry = data.entries.find((e) => e.id === id)
    if (!entry) throw new Error('记录不存在')
    const toy = data.toys.find((t) => t.id === entry.toyId)
    if (!toy) throw new Error('玩偶不存在')
    entry.aiDiary =
      mockDiary(toy, entry) +
      `\n\n（重新生成于 ${new Date().toLocaleString('zh-CN')}）`
    save(data)
    return entry
  },

  getCurrentToyId(): string | null {
    return load().currentToyId
  },

  setCurrentToyId(id: string | null) {
    const data = load()
    data.currentToyId = id
    save(data)
  },

  resetDemo() {
    localStorage.removeItem(STORAGE_KEY)
    return seed()
  },
}
