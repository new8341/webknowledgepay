import type { ApiErrorPayload } from '../../api/errors'
import { toApiErrorPayload } from '../../api/errors.js'
import {
  apiFetchChapters,
  apiFetchDiscussions,
  apiFetchLearnCenterBundle,
  apiFetchNotes,
  type ApiResult,
} from '../../api/index.js'

export type PlaybackTabKey = 'catalog' | 'notes' | 'discussion'

export interface PlaybackChapter {
  id: number
  title: string
  duration: string
  isLocked?: boolean
}

export interface PlaybackNote {
  id: number
  chapterId: number
  content: string
  createdAt: string
}

export interface PlaybackDiscussion {
  id: number
  chapterId: number
  userName: string
  minutesAgo: number
  content: string
  likeCount: number
}

export interface LearningState {
  totalHours: number
  completedCourses: number
  learningCourses: number

  // 播放页状态：目录/笔记/讨论 tabs + 当前选中章节
  playback: {
    loading: boolean
    error: ApiErrorPayload | null
    activeTab: PlaybackTabKey
    activeChapterId: number | null
    chapters: PlaybackChapter[]
    notes: PlaybackNote[]
    discussions: PlaybackDiscussion[]
  }

  // 学习中心页状态
  learnCenter: {
    loading: boolean
    error: ApiErrorPayload | null
    profile: { name: string; role: string; avatarUrl: string; vipText: string }
    overview: { totalHours: number; completedCourses: number; learningCourses: number; certificatesCount: number }
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
}

const state: LearningState = {
  totalHours: 168,
  completedCourses: 12,
  learningCourses: 5,
  playback: {
    loading: false,
    error: null,
    activeTab: 'catalog',
      // 默认选中“当前播放”：原型中高亮的是 2.2 控制结构详解（id=203）
      activeChapterId: 203,
    chapters: [],
    notes: [],
    discussions: [],
  },
  learnCenter: {
    loading: false,
    error: null,
    profile: { name: '张同学', role: 'Python开发工程师', avatarUrl: '', vipText: 'VIP会员' },
    overview: { totalHours: 168, completedCourses: 12, learningCourses: 5, certificatesCount: 8 },
    recentLearning: [],
    weeklyPlan: [],
    categoryMonthlyStats: [],
    achievements: [],
  },
}

export default {
  namespaced: true,
  state: () => state,
  mutations: {
    setPlaybackLoading(localState: LearningState, loading: boolean) {
      localState.playback.loading = loading
    },
    setPlaybackError(localState: LearningState, error: ApiErrorPayload | null) {
      localState.playback.error = error
    },
    setActiveTab(localState: LearningState, tab: PlaybackTabKey) {
      localState.playback.activeTab = tab
    },
    setActiveChapterId(localState: LearningState, chapterId: number) {
      localState.playback.activeChapterId = chapterId
    },
    setChapters(localState: LearningState, chapters: PlaybackChapter[]) {
      localState.playback.chapters = chapters
    },
    setNotes(localState: LearningState, notes: PlaybackNote[]) {
      localState.playback.notes = notes
    },
    setDiscussions(localState: LearningState, discussions: PlaybackDiscussion[]) {
      localState.playback.discussions = discussions
    },

    setLearnCenterLoading(localState: LearningState, loading: boolean) {
      localState.learnCenter.loading = loading
    },
    setLearnCenterError(localState: LearningState, error: ApiErrorPayload | null) {
      localState.learnCenter.error = error
    },
    setLearnCenterBundle(localState: LearningState, bundle: LearningState['learnCenter']) {
      localState.learnCenter = bundle
    },

    // 将学习中心的统计同步到顶层字段，避免其它页面复用逻辑缺失
    setTopOverviewFromCenter(
      localState: LearningState,
      payload: { totalHours: number; completedCourses: number; learningCourses: number },
    ) {
      localState.totalHours = payload.totalHours
      localState.completedCourses = payload.completedCourses
      localState.learningCourses = payload.learningCourses
    },
  },
  actions: {
    async initPlayback({ commit }: any) {
      commit('setPlaybackLoading', true)
      commit('setPlaybackError', null)
      try {
        const res: ApiResult<PlaybackChapter[]> = await apiFetchChapters()
        commit('setChapters', res.data)
      } catch (err) {
        // 统一错误结构：error.code + message + requestId
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载播放页目录失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setPlaybackError', normalized)
        throw normalized
      } finally {
        commit('setPlaybackLoading', false)
      }
    },
    async selectChapter({ state, commit, dispatch }: any, chapterId: number) {
      commit('setActiveChapterId', chapterId)
      // 切换章节后，根据当前 tab 拉取对应数据
      const tab: PlaybackTabKey = state.playback.activeTab
      if (tab === 'notes') {
        await dispatch('fetchNotes')
      } else if (tab === 'discussion') {
        await dispatch('fetchDiscussions')
      }
    },
    async setPlaybackTab({ state, commit, dispatch }: any, tab: PlaybackTabKey) {
      commit('setActiveTab', tab)
      const chapterId: number | null = state.playback.activeChapterId
      if (!chapterId) return
      // tab 切换时拉取对应数据，保证“交互细节由状态驱动”
      if (tab === 'notes') {
        await dispatch('fetchNotes')
      } else if (tab === 'discussion') {
        await dispatch('fetchDiscussions')
      }
    },
    async fetchNotes({ state, commit }: any) {
      if (!state.playback.activeChapterId) return
      commit('setPlaybackLoading', true)
      commit('setPlaybackError', null)
      try {
        const chapterId: number = state.playback.activeChapterId
        const res: ApiResult<PlaybackNote[]> = await apiFetchNotes(chapterId)
        commit('setNotes', res.data)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载笔记失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setPlaybackError', normalized)
        throw normalized
      } finally {
        commit('setPlaybackLoading', false)
      }
    },
    async fetchDiscussions({ state, commit }: any) {
      if (!state.playback.activeChapterId) return
      commit('setPlaybackLoading', true)
      commit('setPlaybackError', null)
      try {
        const chapterId: number = state.playback.activeChapterId
        const res: ApiResult<PlaybackDiscussion[]> = await apiFetchDiscussions(chapterId)
        commit('setDiscussions', res.data)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载讨论失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setPlaybackError', normalized)
        throw normalized
      } finally {
        commit('setPlaybackLoading', false)
      }
    },

    async initLearnCenter({ commit }: any) {
      commit('setLearnCenterLoading', true)
      commit('setLearnCenterError', null)
      try {
        const res: ApiResult<any> = await apiFetchLearnCenterBundle()
        // API 返回的是 learnCenter bundle；这里做直写以保持结构完整。
        commit('setLearnCenterBundle', {
          ...res.data,
          loading: false,
          error: null,
        })
        // 顶部统计也同步到 state 的通用字段，避免其他页面复用逻辑缺失
        commit('setTopOverviewFromCenter', {
          totalHours: res.data.overview.totalHours,
          completedCourses: res.data.overview.completedCourses,
          learningCourses: res.data.overview.learningCourses,
        })
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载学习中心失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setLearnCenterError', normalized)
        throw normalized
      } finally {
        commit('setLearnCenterLoading', false)
      }
    },
  },
}
