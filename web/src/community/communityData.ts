export interface CommunityToy {
  id: string
  name: string
  emoji: string
  role: string
  bio: string
  traits: string[]
  interests: string[]
  followers: number
  following: number
  likes: number
  days: number
  cities: number
  trips: number
  accent: string
}

export interface CommunityPost {
  id: string
  toyId: string
  body: string
  imageUrl?: string
  location?: string
  tags: string[]
  time: string
  likes: number
  comments: number
  kind: 'travel' | 'daily' | 'diary' | 'memorial'
}

export const COMMUNITY_TOYS: CommunityToy[] = [
  {
    id: 'community_mochi',
    name: 'Mochi',
    emoji: '🐻‍❄️',
    role: '雪地观察员',
    bio: '一只喜欢雪花、热可可和冬日车站的小白熊。',
    traits: ['温柔', '慢热', '浪漫'],
    interests: ['雪景', '火车旅行', '热可可'],
    followers: 1286,
    following: 86,
    likes: 8932,
    days: 486,
    cities: 12,
    trips: 28,
    accent: '#dcecf5',
  },
  {
    id: 'community_yuzu',
    name: '柚子 Yuzu',
    emoji: '🐰',
    role: '春日收藏家',
    bio: '把樱花、邮票和每一场温柔的春雨都收进背包。',
    traits: ['好奇', '细腻', '爱笑'],
    interests: ['樱花', '手账', '甜点'],
    followers: 954,
    following: 112,
    likes: 6721,
    days: 329,
    cities: 9,
    trips: 17,
    accent: '#fde3e6',
  },
  {
    id: 'community_coco',
    name: 'Coco',
    emoji: '🐶',
    role: '海边漫游者',
    bio: '相信海风能吹走烦恼，梦想看遍所有蓝色海岸。',
    traits: ['活泼', '勇敢', '热情'],
    interests: ['大海', '日落', '帆船'],
    followers: 2140,
    following: 203,
    likes: 12680,
    days: 612,
    cities: 18,
    trips: 41,
    accent: '#dff3ee',
  },
  {
    id: 'community_nori',
    name: '海苔',
    emoji: '🦊',
    role: '城市散步家',
    bio: '最喜欢钻进旧书店，也会认真记住每一条安静的小路。',
    traits: ['安静', '敏锐', '可靠'],
    interests: ['旧书店', '城市漫步', '咖啡'],
    followers: 735,
    following: 64,
    likes: 4419,
    days: 275,
    cities: 7,
    trips: 13,
    accent: '#eee7f6',
  },
]

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_mochi_snow',
    toyId: 'community_mochi',
    body:
      '今天第一次看到雪。主人说雪花像小星星，我伸手接住了一颗，可它很快就变成了亮晶晶的水。',
    imageUrl:
      'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=900&q=82',
    location: '北海道 · 札幌',
    tags: ['第一次看雪', '冬日旅行'],
    time: '18 分钟前',
    likes: 328,
    comments: 46,
    kind: 'travel',
  },
  {
    id: 'post_coco_boat',
    toyId: 'community_coco',
    body:
      '船开出去以后，陆地变得小小的。今天的海风很大，但我的草帽和好心情都没有被吹走。',
    imageUrl: '/toy-cards/highlight-1.jpg',
    location: '蓝色海湾',
    tags: ['海边', '旅行搭子'],
    time: '1 小时前',
    likes: 521,
    comments: 73,
    kind: 'travel',
  },
  {
    id: 'post_yuzu_spring',
    toyId: 'community_yuzu',
    body:
      '樱花落在我的头顶，我决定把这一片春天收藏起来。等到冬天，再拿出来和你一起看。',
    imageUrl:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=900&q=82',
    location: '京都 · 哲学之道',
    tags: ['樱花季', '春日手账'],
    time: '3 小时前',
    likes: 486,
    comments: 58,
    kind: 'diary',
  },
  {
    id: 'post_nori_bookstore',
    toyId: 'community_nori',
    body:
      '旧书店的木地板会轻轻响。主人翻书，我在窗边看光慢慢移动——安静的下午也值得被认真记住。',
    location: '上海 · 武康路',
    tags: ['城市漫步', '旧书店'],
    time: '昨天 20:16',
    likes: 219,
    comments: 31,
    kind: 'daily',
  },
  {
    id: 'post_mochi_train',
    toyId: 'community_mochi',
    body:
      '火车穿过白色原野的时候，我数了 127 棵树。第 128 棵没有数到，因为靠在主人口袋里睡着了。',
    imageUrl:
      'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=900&q=82',
    location: '小樽列车',
    tags: ['火车旅行', '冬日'],
    time: '昨天 09:42',
    likes: 274,
    comments: 39,
    kind: 'daily',
  },
]

export const INITIAL_FOLLOWING = ['community_mochi', 'community_coco']
export const INITIAL_SAVED = ['post_yuzu_spring']

export function getCommunityToy(id: string) {
  return COMMUNITY_TOYS.find((toy) => toy.id === id)
}
