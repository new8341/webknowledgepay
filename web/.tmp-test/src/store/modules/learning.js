import { toApiErrorPayload } from '../../api/errors.js';
import { apiFetchChapters, apiFetchDiscussions, apiFetchLearnCenterBundle, apiFetchNotes, } from '../../api/index.js';
const state = {
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
};
export default {
    namespaced: true,
    state: () => state,
    mutations: {
        setPlaybackLoading(localState, loading) {
            localState.playback.loading = loading;
        },
        setPlaybackError(localState, error) {
            localState.playback.error = error;
        },
        setActiveTab(localState, tab) {
            localState.playback.activeTab = tab;
        },
        setActiveChapterId(localState, chapterId) {
            localState.playback.activeChapterId = chapterId;
        },
        setChapters(localState, chapters) {
            localState.playback.chapters = chapters;
        },
        setNotes(localState, notes) {
            localState.playback.notes = notes;
        },
        setDiscussions(localState, discussions) {
            localState.playback.discussions = discussions;
        },
        setLearnCenterLoading(localState, loading) {
            localState.learnCenter.loading = loading;
        },
        setLearnCenterError(localState, error) {
            localState.learnCenter.error = error;
        },
        setLearnCenterBundle(localState, bundle) {
            localState.learnCenter = bundle;
        },
        // 将学习中心的统计同步到顶层字段，避免其它页面复用逻辑缺失
        setTopOverviewFromCenter(localState, payload) {
            localState.totalHours = payload.totalHours;
            localState.completedCourses = payload.completedCourses;
            localState.learningCourses = payload.learningCourses;
        },
    },
    actions: {
        async initPlayback({ commit }) {
            commit('setPlaybackLoading', true);
            commit('setPlaybackError', null);
            try {
                const res = await apiFetchChapters();
                commit('setChapters', res.data);
            }
            catch (err) {
                // 统一错误结构：error.code + message + requestId
                const normalized = toApiErrorPayload(err, {
                    code: 'UNKNOWN',
                    message: '加载播放页目录失败',
                    status: 500,
                });
                commit('setPlaybackError', normalized);
                throw normalized;
            }
            finally {
                commit('setPlaybackLoading', false);
            }
        },
        async selectChapter({ state, commit, dispatch }, chapterId) {
            commit('setActiveChapterId', chapterId);
            // 切换章节后，根据当前 tab 拉取对应数据
            const tab = state.playback.activeTab;
            if (tab === 'notes') {
                await dispatch('fetchNotes');
            }
            else if (tab === 'discussion') {
                await dispatch('fetchDiscussions');
            }
        },
        async setPlaybackTab({ state, commit, dispatch }, tab) {
            commit('setActiveTab', tab);
            const chapterId = state.playback.activeChapterId;
            if (!chapterId)
                return;
            // tab 切换时拉取对应数据，保证“交互细节由状态驱动”
            if (tab === 'notes') {
                await dispatch('fetchNotes');
            }
            else if (tab === 'discussion') {
                await dispatch('fetchDiscussions');
            }
        },
        async fetchNotes({ state, commit }) {
            if (!state.playback.activeChapterId)
                return;
            commit('setPlaybackLoading', true);
            commit('setPlaybackError', null);
            try {
                const chapterId = state.playback.activeChapterId;
                const res = await apiFetchNotes(chapterId);
                commit('setNotes', res.data);
            }
            catch (err) {
                const normalized = toApiErrorPayload(err, {
                    code: 'UNKNOWN',
                    message: '加载笔记失败',
                    status: 500,
                });
                commit('setPlaybackError', normalized);
                throw normalized;
            }
            finally {
                commit('setPlaybackLoading', false);
            }
        },
        async fetchDiscussions({ state, commit }) {
            if (!state.playback.activeChapterId)
                return;
            commit('setPlaybackLoading', true);
            commit('setPlaybackError', null);
            try {
                const chapterId = state.playback.activeChapterId;
                const res = await apiFetchDiscussions(chapterId);
                commit('setDiscussions', res.data);
            }
            catch (err) {
                const normalized = toApiErrorPayload(err, {
                    code: 'UNKNOWN',
                    message: '加载讨论失败',
                    status: 500,
                });
                commit('setPlaybackError', normalized);
                throw normalized;
            }
            finally {
                commit('setPlaybackLoading', false);
            }
        },
        async initLearnCenter({ commit }) {
            commit('setLearnCenterLoading', true);
            commit('setLearnCenterError', null);
            try {
                const res = await apiFetchLearnCenterBundle();
                // API 返回的是 learnCenter bundle；这里做直写以保持结构完整。
                commit('setLearnCenterBundle', {
                    ...res.data,
                    loading: false,
                    error: null,
                });
                // 顶部统计也同步到 state 的通用字段，避免其他页面复用逻辑缺失
                commit('setTopOverviewFromCenter', {
                    totalHours: res.data.overview.totalHours,
                    completedCourses: res.data.overview.completedCourses,
                    learningCourses: res.data.overview.learningCourses,
                });
            }
            catch (err) {
                const normalized = toApiErrorPayload(err, {
                    code: 'UNKNOWN',
                    message: '加载学习中心失败',
                    status: 500,
                });
                commit('setLearnCenterError', normalized);
                throw normalized;
            }
            finally {
                commit('setLearnCenterLoading', false);
            }
        },
    },
};
