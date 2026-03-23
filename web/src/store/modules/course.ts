import type { Course } from '../../types'
import type { ApiErrorPayload } from '../../api/errors'
import { toApiErrorPayload } from '../../api/errors'
import type { ApiResult } from '../../api'
import { apiFetchCourses, apiFetchCourseDetailBundle } from '../../api'

export interface CourseState {
  hotCourses: Course[]
  categories: string[]

  // 课程分类页状态
  loading: boolean
  error: ApiErrorPayload | null
  activeCategory: string
  totalCount: number
  courseList: Course[]

  // 课程详情页状态
  detail: {
    loading: boolean
    error: ApiErrorPayload | null
    activeTab: CourseDetailTabKey
    bundle: CourseDetailBundle | null
  }
}

export type CourseDetailTabKey = 'intro' | 'catalog' | 'ratings' | 'faq'

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

const state: CourseState = {
  categories: ['编程开发', '数据分析', 'UI设计', '营销推广'],
  hotCourses: [
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
  ],

  loading: false,
  error: null,
  activeCategory: '编程开发',
  totalCount: 1234,
  courseList: [],
  detail: {
    loading: false,
    error: null,
    activeTab: 'intro',
    bundle: null,
  },
}

export default {
  namespaced: true,
  state: () => ({
    ...state,
    courseList: state.courseList.length ? state.courseList : state.hotCourses,
  }),
  mutations: {
    setLoading(localState: CourseState, loading: boolean) {
      localState.loading = loading
    },
    setError(localState: CourseState, error: ApiErrorPayload | null) {
      localState.error = error
    },
    setActiveCategory(localState: CourseState, category: string) {
      localState.activeCategory = category
    },
    setTotalCount(localState: CourseState, count: number) {
      localState.totalCount = count
    },
    setCourseList(localState: CourseState, list: Course[]) {
      localState.courseList = list
    },

    setDetailLoading(localState: CourseState, loading: boolean) {
      localState.detail.loading = loading
    },
    setDetailError(localState: CourseState, error: ApiErrorPayload | null) {
      localState.detail.error = error
    },
    setDetailActiveTab(localState: CourseState, tab: CourseDetailTabKey) {
      localState.detail.activeTab = tab
    },
    setDetailBundle(localState: CourseState, bundle: CourseDetailBundle) {
      localState.detail.bundle = bundle
    },
  },
  actions: {
    async fetchCourses(
      { commit }: any,
      payload: {
        category: string
        // 预留：排序/筛选字段后续可扩展
        sortKey?: string
        simulateError?: { code: ApiErrorPayload['code'] }
      },
    ) {
      commit('setLoading', true)
      commit('setError', null)
      commit('setActiveCategory', payload.category)
      try {
        const res = await apiFetchCourses({ category: payload.category, simulateError: payload.simulateError as any })
        commit('setCourseList', res.data.courses)
        commit('setTotalCount', res.data.total)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载课程列表失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },

    async initCourseDetail({ commit }: any) {
      commit('setDetailLoading', true)
      commit('setDetailError', null)
      try {
        const res: ApiResult<CourseDetailBundle> = await apiFetchCourseDetailBundle()
        commit('setDetailBundle', res.data)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载课程详情失败',
          status: 500,
        })
        commit('setDetailError', normalized)
        throw normalized
      } finally {
        commit('setDetailLoading', false)
      }
    },

    async setCourseDetailTab({ commit }: any, tab: CourseDetailTabKey) {
      commit('setDetailActiveTab', tab)
    },
  },
}
