export interface NavModule {
  key: string
  name: string
  description: string
  route: string
}

export interface Course {
  id: number
  title: string
  category: string
  level: string
  price: number
  duration: string
  teacher: string
  rating: number

  // 以下字段用于“课程列表/详情卡片”高保真展示（原型对齐）
  imageUrl?: string
  teacherAvatarUrl?: string
  description?: string
  badgeLabel?: string // 顶部角标，如热门/新课/精品
  badgeColor?: 'red' | 'green' | 'purple'
  timeBadge?: string
  originalPrice?: number
  discountTag?: string

  // 详情页附加字段（可选，避免影响课程列表复用）
  teacherRole?: string
  certificateName?: string
  totalDurationText?: string
  courseCountText?: string
  studentCountText?: string
}

export interface UserProfileBundle {
  profile: {
    name: string
    phoneMasked: string
    email: string
    role: string
    avatarUrl: string
    vipText: string
    city: string
    workYears: string
    bio: string
  }
  stats: {
    purchasedCoursesText: string
    totalHoursText: string
    certificatesCountText: string
    totalCostText: string
  }
  recentOrders: Array<{
    id: number
    title: string
    orderNo: string
    purchaseTimeText: string
    price: number
    statusLabel: string
    statusTone: 'green' | 'blue' | 'gray'
    coverUrl: string
  }>
  achievements: Array<{
    id: number
    title: string
    subtitle: string
    tone: 'yellow' | 'blue' | 'green'
  }>
  analysis: {
    weeklyLearningText: string
    consecutiveLearningText: string
    completionRateText: string
    avgRatingText: string
  }
}
