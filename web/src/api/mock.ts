import type { ApiErrorCode } from './errors'
import { AppApiError, createRequestId } from './errors.js'
import type { CartItem } from '../store/modules/cart'
import type { Course, UserProfileBundle } from '../types'

export interface ApiResult<T> {
  status: number
  data: T
}

export interface PlayChapter {
  id: number
  title: string
  duration: string
  isLocked?: boolean
}

export interface PlayNote {
  id: number
  chapterId: number
  content: string
  createdAt: string
}

export interface PlayDiscussion {
  id: number
  chapterId: number
  userName: string
  minutesAgo: number
  content: string
  likeCount: number
}

// 课程/学习/购物车均使用 mock 数据，便于在无后端情况下把动作链路打通并可测试。
const courseDetail: Course = {
  id: 1,
  title: 'Python全栈开发实战',
  category: '编程开发',
  level: '进阶',
  price: 299,
  originalPrice: 599,
  duration: '12小时',
  teacher: '张老师',
  rating: 4.8,
  description:
    '从零基础到项目实战，全面掌握Python开发技能，包含Web开发、数据处理、API设计、部署运维等核心技术',
  imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  teacherAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  badgeLabel: '热门',
  badgeColor: 'red',
  timeBadge: '预览时长: 12:34',
  discountTag: '限时5折优惠',
  teacherRole: '高级Python开发工程师',
  certificateName: '结业证书',
  totalDurationText: '12小时',
  courseCountText: '36节',
  studentCountText: '8,945',
}

export interface CourseDetailBundle {
  previewImageUrl: string
  previewDurationText: string
  purchase: {
    price: number
    originalPrice: number
    discountTag: string
    remainingTimeText: string
    contents: Array<{ iconClass: string; text: string }>
  }
  courseStats: {
    totalDurationText: string
    courseCountText: string
    studentCountText: string
    certificateName: string
    ratingText: string
  }
  intro: {
    overview: string
    learnItems: string[]
    features: Array<{ iconClass: string; title: string; desc: string; tone: 'blue' | 'green' | 'purple' }>
    audience: string[]
  }
  catalog: {
    // 原型里“课程目录”tab 未展示内容，先提供章节列表用于交互一致性。
    chapters: Array<{ chapterTitle: string; items: Array<{ title: string; duration: string }> }>
  }
  ratings: {
    summary: string
    items: Array<{ userName: string; content: string; rating: number; avatarUrl: string }>
  }
  faq: {
    items: Array<{ question: string; answer: string }>
  }
  recommendations: Course[]
}

const mockCourses: Course[] = [
  // 编程开发
  {
    id: 1,
    title: 'Python全栈开发实战',
    category: '编程开发',
    level: '进阶',
    price: 299,
    originalPrice: 599,
    discountTag: '5折',
    duration: '12小时',
    teacher: '张老师',
    rating: 4.8,
    description: '从零基础到项目实战，全面掌握Python开发技能，包含Web开发、数据处理、API设计等',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '热门',
    badgeColor: 'red',
    timeBadge: '12小时',
  },
  {
    id: 4,
    title: 'JavaScript核心技术',
    category: '编程开发',
    level: '入门',
    price: 199,
    originalPrice: 399,
    discountTag: '5折',
    duration: '15小时',
    teacher: '王老师',
    rating: 4.6,
    description: '深入掌握JavaScript核心概念，ES6+新特性，异步编程，DOM操作等',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b780?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '新课',
    badgeColor: 'green',
    timeBadge: '15小时',
  },
  {
    id: 5,
    title: 'Java企业级开发',
    category: '编程开发',
    level: '高级',
    price: 899,
    originalPrice: 1799,
    discountTag: '5折',
    duration: '28小时',
    teacher: '李老师',
    rating: 4.9,
    description: 'Spring Boot、微服务架构、数据库设计，打造企业级Java应用',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '精品',
    badgeColor: 'purple',
    timeBadge: '28小时',
  },
  {
    id: 6,
    title: '前端开发进阶实战',
    category: '编程开发',
    level: '进阶',
    price: 259,
    originalPrice: 519,
    discountTag: '5折',
    duration: '10小时',
    teacher: '陈老师',
    rating: 4.4,
    description: '掌握前端工程化、性能优化与组件化开发，提升交付能力',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '热门',
    badgeColor: 'red',
    timeBadge: '10小时',
  },

  // 数据分析
  {
    id: 2,
    title: '数据分析与可视化',
    category: '数据分析',
    level: '入门',
    price: 399,
    originalPrice: 799,
    discountTag: '5折',
    duration: '18小时',
    teacher: '王老师',
    rating: 4.9,
    description: '掌握Excel、Python数据分析，制作专业图表，完成从数据到洞察的闭环',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b780?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '新课',
    badgeColor: 'green',
    timeBadge: '18小时',
  },
  {
    id: 7,
    title: '数据科学实战（含建模）',
    category: '数据分析',
    level: '进阶',
    price: 499,
    originalPrice: 999,
    discountTag: '5折',
    duration: '20小时',
    teacher: '赵老师',
    rating: 4.5,
    description: '从数据清洗到建模评估，学会端到端的数据科学流程',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '精品',
    badgeColor: 'purple',
    timeBadge: '20小时',
  },

  // UI设计
  {
    id: 3,
    title: 'UI/UX设计系统课',
    category: 'UI设计',
    level: '高级',
    price: 599,
    originalPrice: 1199,
    discountTag: '5折',
    duration: '24小时',
    teacher: '李老师',
    rating: 4.7,
    description: '从设计理论到实战项目，构建可复用的UI设计系统，提升交付效率与一致性',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '精品',
    badgeColor: 'purple',
    timeBadge: '24小时',
  },

  // 营销推广
  {
    id: 8,
    title: '增长营销与投放优化',
    category: '营销推广',
    level: '入门',
    price: 129,
    originalPrice: 259,
    discountTag: '5折',
    duration: '8小时',
    teacher: '孙老师',
    rating: 4.3,
    description: '掌握用户增长漏斗与投放优化方法，提升转化与ROI',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    teacherAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    badgeLabel: '新课',
    badgeColor: 'green',
    timeBadge: '8小时',
  },
]

const chapters: PlayChapter[] = [
  { id: 101, title: '第1章: Python开发环境搭建', duration: '—' },
  { id: 201, title: '第2章: Python基础语法详解', duration: '—' },
  { id: 202, title: '2.1 变量与数据类型', duration: '15:20' },
  { id: 203, title: '2.2 控制结构详解', duration: '28:45' },
  { id: 204, title: '2.3 函数定义与调用', duration: '22:10', isLocked: true },
  { id: 301, title: '第3章: 面向对象编程', duration: '—' },
]

const mockNotes: PlayNote[] = [
  { id: 1, chapterId: 203, content: 'Python变量命名规范很重要，需要遵循... ', createdAt: '2024-01-01T10:00:00Z' },
  { id: 2, chapterId: 202, content: 'for循环和while循环的使用场景区别', createdAt: '2024-01-01T10:05:00Z' },
]

const mockDiscussions: PlayDiscussion[] = [
  {
    id: 1,
    chapterId: 203,
    userName: '张同学',
    minutesAgo: 3,
    content: '老师讲解的变量作用域部分很清楚，但是有个疑问...',
    likeCount: 5,
  },
  {
    id: 2,
    chapterId: 203,
    userName: '李同学',
    minutesAgo: 10,
    content: '这节课的代码示例能否提供下载？',
    likeCount: 2,
  },
]

let mockCartItems: Array<CartItem & { quantity: number; imageUrl?: string; teacher?: string; duration?: string; rating?: number; category?: string; level?: string }> = [
  {
    id: 1,
    title: 'Python全栈开发实战',
    price: 299,
    selected: true,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    teacher: '张老师',
    duration: '12小时',
    rating: 4.8,
    category: '编程开发',
    level: '进阶',
  },
  {
    id: 2,
    title: '数据分析与可视化',
    price: 399,
    selected: true,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    teacher: '王老师',
    duration: '18小时',
    rating: 4.9,
    category: '数据分析',
    level: '入门',
  },
  {
    id: 3,
    title: 'UI/UX设计系统课',
    price: 599,
    selected: false,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    teacher: '李老师',
    duration: '24小时',
    rating: 4.7,
    category: 'UI设计',
    level: '高级',
  },
]

function maybeThrow(simulate?: { code: ApiErrorCode; message?: string; status?: number }): void {
  if (!simulate) return
  const payload = {
    code: simulate.code,
    message: simulate.message ?? 'Mock API error',
    status: simulate.status ?? 500,
    requestId: createRequestId(),
  }
  throw new AppApiError(payload)
}

export async function apiFetchHotCourses(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<Course[]>> {
  maybeThrow(opts?.simulateError)
  return { status: 200, data: [courseDetail] }
}

export async function apiFetchNotes(
  chapterId: number,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<PlayNote[]>> {
  maybeThrow(opts?.simulateError)
  // 简化：只返回与 chapterId 对应的笔记。
  return { status: 200, data: mockNotes.filter((n) => n.chapterId === chapterId) }
}

export async function apiFetchDiscussions(
  chapterId: number,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<PlayDiscussion[]>> {
  maybeThrow(opts?.simulateError)
  return { status: 200, data: mockDiscussions.filter((d) => d.chapterId === chapterId) }
}

export async function apiFetchChapters(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<PlayChapter[]>> {
  maybeThrow(opts?.simulateError)
  return { status: 200, data: chapters }
}

export async function apiFetchCourseDetailBundle(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<CourseDetailBundle>> {
  maybeThrow(opts?.simulateError)
  const bundle: CourseDetailBundle = {
    previewImageUrl: courseDetail.imageUrl ?? '',
    previewDurationText: '预览时长: 12:34',
    purchase: {
      price: courseDetail.price,
      originalPrice: courseDetail.originalPrice ?? 0,
      discountTag: '限时5折优惠',
      remainingTimeText: '还剩2天',
      contents: [
        { iconClass: 'fas fa-video text-blue-600 w-5', text: '36节视频课程' },
        { iconClass: 'fas fa-file-alt text-green-600 w-5', text: '完整课程资料' },
        { iconClass: 'fas fa-code text-purple-600 w-5', text: '项目源码下载' },
        { iconClass: 'fas fa-certificate text-orange-600 w-5', text: '结业证书' },
        { iconClass: 'fas fa-comments text-red-600 w-5', text: '在线答疑服务' },
        { iconClass: 'fas fa-infinity text-gray-600 w-5', text: '永久学习权限' },
      ],
    },
    courseStats: {
      totalDurationText: courseDetail.totalDurationText ?? '—',
      courseCountText: courseDetail.courseCountText ?? '—',
      studentCountText: courseDetail.studentCountText ?? '—',
      certificateName: courseDetail.certificateName ?? '—',
      ratingText: '4.8 (1,245条评价)',
    },
    intro: {
      overview:
        '本课程是一门完整的Python全栈开发课程，从基础语法到高级应用，从前端到后端，从开发到部署，涵盖了现代Python开发的全部技能栈。适合有一定编程基础，想要系统学习Python开发的学员。',
      learnItems: [
        'Python核心语法和高级特性',
        'Flask/Django Web框架开发',
        '数据库设计与操作（MySQL/MongoDB）',
        'RESTful API开发与测试',
        '前端技术（HTML/CSS/JavaScript）',
        '项目部署与运维（Docker/云服务）',
      ],
      features: [
        { iconClass: 'fas fa-project-diagram text-blue-600 text-2xl mb-2', title: '项目驱动', desc: '通过实际项目学习，边学边练', tone: 'blue' },
        { iconClass: 'fas fa-hands-helping text-green-600 text-2xl mb-2', title: '在线答疑', desc: '专业助教团队在线解答问题', tone: 'green' },
        { iconClass: 'fas fa-infinity text-purple-600 text-2xl mb-2', title: '终身学习', desc: '一次购买，终身免费更新', tone: 'purple' },
      ],
      audience: [
        '有一定编程基础，想要学习Python的开发者',
        '想要转型做Python开发的程序员',
        '在校计算机专业学生',
        '希望提升Python技能的在职开发者',
      ],
    },
    catalog: {
      chapters: [
        {
          chapterTitle: '第2章：Python基础语法详解',
          items: [
            { title: '2.1 变量与数据类型', duration: '15:20' },
            { title: '2.2 控制结构详解', duration: '28:45' },
            { title: '2.3 函数定义与调用', duration: '22:10' },
          ],
        },
        {
          chapterTitle: '第1章：Python开发环境搭建',
          items: [{ title: 'Python简介与安装', duration: '—' }],
        },
      ],
    },
    ratings: {
      summary: '学员评价',
      items: [
        {
          userName: '张同学',
          content: '老师讲解非常清晰，从基础到实战路径完整。',
          rating: 5,
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
        {
          userName: '李同学',
          content: '案例很实用，做完之后能直接上手项目。',
          rating: 4.5,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b780?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
      ],
    },
    faq: {
      items: [
        { question: '课程适合零基础吗？', answer: '建议有一定编程基础。如果完全零基础，也可以先完成入门内容再开始。' },
        { question: '学习完成后是否支持资料与源码？', answer: '购买后可获得完整课程资料与项目源码下载。' },
        { question: '是否支持终身学习？', answer: '一次购买，终身免费更新与学习权限。' },
      ],
    },
    recommendations: [courseDetail],
  }
  // 相关推荐：直接复用 hotCourses（若已有更多则补齐）
  return { status: 200, data: { ...bundle, recommendations: [courseDetail, ...mockCourses.filter((c) => c.id !== courseDetail.id)].slice(0, 2) } }
}

// -------------------- 登录 / 个人中心 --------------------

export interface ApiLoginResponse {
  isLoggedIn: boolean
  user: {
    name: string
    role: string
  }
  profile: UserProfileBundle
}

export async function apiLogin(
  phone: string,
  password: string,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<ApiLoginResponse>> {
  maybeThrow(opts?.simulateError)

  if (!phone || !password) {
    throw new AppApiError({
      code: 'VALIDATION_ERROR',
      message: '手机号或密码不能为空',
      status: 400,
      requestId: createRequestId(),
    })
  }

  // mock 规则：固定账号密码成功，其它失败
  const mockOk = phone === '13800000000' && password === '123456'
  if (!mockOk) {
    throw new AppApiError({
      code: 'AUTH_REQUIRED',
      message: '手机号或密码错误',
      status: 401,
      requestId: createRequestId(),
    })
  }

  const profileRes = await apiFetchProfile()
  return {
    status: 200,
    data: {
      isLoggedIn: true,
      user: { name: profileRes.data.profile.name, role: profileRes.data.profile.role },
      profile: profileRes.data,
    },
  }
}

export async function apiFetchProfile(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<UserProfileBundle>> {
  maybeThrow(opts?.simulateError)

  const bundle: UserProfileBundle = {
    profile: {
      name: '张同学',
      phoneMasked: '138****8888',
      email: 'zhang@example.com',
      role: 'Python开发工程师',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      vipText: 'VIP会员',
      city: '北京',
      workYears: '1-3年',
      bio: '热爱编程，专注于Python后端开发，希望通过学习不断提升技能水平。',
    },
    stats: {
      purchasedCoursesText: '17门',
      totalHoursText: '168小时',
      certificatesCountText: '8张',
      totalCostText: '¥3,256',
    },
    recentOrders: [
      {
        id: 1,
        title: 'Python全栈开发实战',
        orderNo: '202401150001',
        purchaseTimeText: '2024-01-15 14:30',
        price: 299,
        statusLabel: '已完成',
        statusTone: 'green',
        coverUrl:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
      {
        id: 2,
        title: '数据分析与可视化',
        orderNo: '202401120002',
        purchaseTimeText: '2024-01-12 10:15',
        price: 399,
        statusLabel: '已完成',
        statusTone: 'green',
        coverUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
      {
        id: 3,
        title: 'UI/UX设计系统课',
        orderNo: '202401100003',
        purchaseTimeText: '2024-01-10 16:45',
        price: 599,
        statusLabel: '学习中',
        statusTone: 'blue',
        coverUrl:
          'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      },
    ],
    achievements: [
      { id: 1, title: 'Python达人', subtitle: '获得徽章', tone: 'yellow' },
      { id: 2, title: '坚持学习者', subtitle: '获得徽章', tone: 'blue' },
      { id: 3, title: '优秀学员', subtitle: '获得徽章', tone: 'green' },
    ],
    analysis: {
      weeklyLearningText: '12小时',
      consecutiveLearningText: '15天',
      completionRateText: '85%',
      avgRatingText: '4.8',
    },
  }

  return { status: 200, data: bundle }
}

// -------------------- 注册 --------------------

export async function apiRegister(
  phone: string,
  code: string,
  password: string,
  confirmPassword: string,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<ApiLoginResponse>> {
  maybeThrow(opts?.simulateError)

  if (!phone || !code || !password || !confirmPassword) {
    throw new AppApiError({
      code: 'VALIDATION_ERROR',
      message: '手机号、验证码或密码不能为空',
      status: 400,
      requestId: createRequestId(),
    })
  }

  if (password !== confirmPassword) {
    throw new AppApiError({
      code: 'VALIDATION_ERROR',
      message: '两次输入的密码不一致',
      status: 400,
      requestId: createRequestId(),
    })
  }

  // mock 规则：固定账号 + 固定验证码 + 固定密码
  const mockOk = phone === '13800000000' && code === '123456' && password === '123456'
  if (!mockOk) {
    // 错误码优先模拟“验证码错误”，便于前端展示对齐
    const message = code !== '123456' ? '验证码错误' : '注册信息不正确'
    const status = code !== '123456' ? 401 : 401
    throw new AppApiError({
      code: 'AUTH_REQUIRED',
      message,
      status,
      requestId: createRequestId(),
    })
  }

  const profileRes = await apiFetchProfile()
  return {
    status: 200,
    data: {
      isLoggedIn: true,
      user: { name: profileRes.data.profile.name, role: profileRes.data.profile.role },
      profile: profileRes.data,
    },
  }
}

export interface LearnCenterBundle {
  profile: {
    name: string
    role: string
    avatarUrl: string
    vipText: string
  }
  overview: {
    totalHours: number
    completedCourses: number
    learningCourses: number
    certificatesCount: number
  }
  recentLearning: Array<{
    id: number
    title: string
    teacher: string
    durationText: string
    imageUrl: string
    statusLabel: string
    progressPercent: number
    progressButtonText: string
  }>
  weeklyPlan: Array<{
    id: number
    title: string
    expectedHoursText: string
    statusText: string
    statusTone: 'green' | 'orange' | 'gray'
    checked: boolean
  }>
  categoryMonthlyStats: Array<{ category: string; hoursText: string; tone: 'blue' | 'green' | 'purple' }>
  achievements: Array<{ id: number; title: string; subtitle: string; tone: 'yellow' | 'blue' | 'green' }>
}

export async function apiFetchLearnCenterBundle(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<LearnCenterBundle>> {
  maybeThrow(opts?.simulateError)

  const bundle: LearnCenterBundle = {
    profile: {
      name: '张同学',
      role: 'Python开发工程师',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      vipText: 'VIP会员',
    },
    overview: {
      totalHours: 168,
      completedCourses: 12,
      learningCourses: 5,
      certificatesCount: 8,
    },
    recentLearning: [
      {
        id: 1,
        title: 'Python全栈开发实战',
        teacher: '张老师',
        durationText: '12小时',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        statusLabel: '学习中',
        progressPercent: 65,
        progressButtonText: '继续学习',
      },
      {
        id: 2,
        title: '数据分析与可视化',
        teacher: '王老师',
        durationText: '18小时',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        statusLabel: '学习中',
        progressPercent: 30,
        progressButtonText: '继续学习',
      },
      {
        id: 3,
        title: 'UI/UX设计系统课',
        teacher: '李老师',
        durationText: '24小时',
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        statusLabel: '暂停中',
        progressPercent: 15,
        progressButtonText: '继续学习',
      },
    ],
    weeklyPlan: [
      {
        id: 1,
        title: '完成Python Web开发 第5-7章',
        expectedHoursText: '预计用时: 2小时',
        statusText: '已完成',
        statusTone: 'green',
        checked: true,
      },
      {
        id: 2,
        title: '数据分析项目实战练习',
        expectedHoursText: '预计用时: 3小时',
        statusText: '进行中',
        statusTone: 'orange',
        checked: false,
      },
      {
        id: 3,
        title: 'UI设计理论学习',
        expectedHoursText: '预计用时: 1.5小时',
        statusText: '待完成',
        statusTone: 'gray',
        checked: false,
      },
    ],
    categoryMonthlyStats: [
      { category: '编程开发', hoursText: '32h', tone: 'blue' },
      { category: '数据分析', hoursText: '24h', tone: 'green' },
      { category: 'UI设计', hoursText: '16h', tone: 'purple' },
    ],
    achievements: [
      { id: 1, title: 'Python进阶达人', subtitle: '完成10门Python相关课程', tone: 'yellow' },
      { id: 2, title: '坚持学习者', subtitle: '连续学习30天', tone: 'blue' },
      { id: 3, title: '优秀学员', subtitle: '课程平均评分4.8分', tone: 'green' },
    ],
  }

  return { status: 200, data: bundle }
}

// -------------------- 课程列表 --------------------

export async function apiFetchCourses(
  opts?: {
    category?: string
    simulateError?: { code: ApiErrorCode; message?: string; status?: number }
  },
): Promise<ApiResult<{ total: number; courses: Course[] }>> {
  maybeThrow(opts?.simulateError)
  const category = opts?.category
  const list = category ? mockCourses.filter((c) => c.category === category) : mockCourses
  const totalByCategory: Record<string, number> = {
    '编程开发': 1234,
    '数据分析': 856,
    'UI设计': 642,
    '营销推广': 528,
  }
  const total = category ? totalByCategory[category] ?? list.length : list.length
  return { status: 200, data: { total, courses: list } }
}

// -------------------- 购物车相关 --------------------

export async function apiFetchCart(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<{ items: any[] }>> {
  maybeThrow(opts?.simulateError)
  return { status: 200, data: { items: mockCartItems } }
}

export async function apiSetCartItemSelected(
  itemId: number,
  selected: boolean,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<{ items: any[] }>> {
  maybeThrow(opts?.simulateError)
  const existed = mockCartItems.some((it) => it.id === itemId)
  if (existed) {
    mockCartItems = mockCartItems.map((it) => (it.id === itemId ? { ...it, selected } : it))
  } else {
    const course = mockCourses.find((c) => c.id === itemId)
    if (!course) {
      throw new AppApiError({
        code: 'NOT_FOUND',
        message: '课程不存在',
        status: 404,
        requestId: createRequestId(),
      })
    }
    mockCartItems.push({
      id: course.id,
      title: course.title,
      price: course.price,
      selected,
      quantity: 1,
      imageUrl: course.imageUrl,
      teacher: course.teacher,
      duration: course.duration,
      rating: course.rating,
      category: course.category,
      level: course.level,
    })
  }
  return { status: 200, data: { items: mockCartItems } }
}

export async function apiSetCartItemQuantity(
  itemId: number,
  quantity: number,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<{ items: any[] }>> {
  maybeThrow(opts?.simulateError)
  const existed = mockCartItems.some((it) => it.id === itemId)
  if (!existed) {
    throw new AppApiError({
      code: 'NOT_FOUND',
      message: '购物车商品不存在',
      status: 404,
      requestId: createRequestId(),
    })
  }
  const nextQty = Math.max(1, Math.floor(quantity))
  mockCartItems = mockCartItems.map((it) => (it.id === itemId ? { ...it, quantity: nextQty } : it))
  return { status: 200, data: { items: mockCartItems } }
}

export async function apiDeleteCartSelected(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<{ items: any[] }>> {
  maybeThrow(opts?.simulateError)
  mockCartItems = mockCartItems.filter((it) => !it.selected)
  return { status: 200, data: { items: mockCartItems } }
}

export async function apiDeleteCartItem(
  itemId: number,
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<{ items: any[] }>> {
  maybeThrow(opts?.simulateError)
  const existed = mockCartItems.some((it) => it.id === itemId)
  if (!existed) {
    throw new AppApiError({
      code: 'NOT_FOUND',
      message: '购物车商品不存在',
      status: 404,
      requestId: createRequestId(),
    })
  }
  mockCartItems = mockCartItems.filter((it) => it.id !== itemId)
  return { status: 200, data: { items: mockCartItems } }
}

export async function apiCheckoutSelected(
  opts?: { simulateError?: { code: ApiErrorCode; message?: string; status?: number } },
): Promise<ApiResult<{ orderId: string }>> {
  maybeThrow(opts?.simulateError)
  const selectedCount = mockCartItems.filter((it) => it.selected).length
  if (selectedCount === 0) {
    throw new AppApiError({
      code: 'VALIDATION_ERROR',
      message: '未选择要结算的商品',
      status: 400,
      requestId: createRequestId(),
    })
  }
  const orderId = `ord_${Date.now()}_${Math.random().toString(16).slice(2)}`
  // 模拟：结算成功后移除已选商品。
  mockCartItems = mockCartItems.filter((it) => !it.selected)
  return { status: 200, data: { orderId } }
}

