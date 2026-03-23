import type { ApiErrorPayload } from '../../api/errors'
import { toApiErrorPayload } from '../../api/errors'
import { apiFetchProfile, apiLogin, apiRegister } from '../../api'
import type { UserProfileBundle } from '../../types'
import type { ApiResult } from '../../api'

export interface UserState {
  name: string
  role: string
  isLoggedIn: boolean

  loading: boolean
  error: ApiErrorPayload | null

  profile: UserProfileBundle | null
}

const state: UserState = {
  name: '张同学',
  role: 'Python 开发学习者',
  isLoggedIn: true,
  loading: false,
  error: null,
  profile: null,
}

export default {
  namespaced: true,
  state: () => state,
  mutations: {
    setLoginStatus(localState: UserState, loggedIn: boolean) {
      localState.isLoggedIn = loggedIn
    },
    setLoading(localState: UserState, loading: boolean) {
      localState.loading = loading
    },
    setError(localState: UserState, error: ApiErrorPayload | null) {
      localState.error = error
    },
    setProfile(localState: UserState, profile: UserProfileBundle) {
      localState.profile = profile
      localState.name = profile.profile.name
      localState.role = profile.profile.role
    },
  },
  actions: {
    async login(
      { commit }: any,
      payload: {
        phone: string
        password: string
      },
    ) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ isLoggedIn: boolean; user: { name: string; role: string }; profile: UserProfileBundle }> = await apiLogin(
          payload.phone,
          payload.password,
        )
        commit('setLoginStatus', res.data.isLoggedIn)
        // 同时加载 profile：登录后用户信息展示更一致
        commit('setProfile', res.data.profile)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '登录失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },

    async fetchProfile({ commit }: any) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<UserProfileBundle> = await apiFetchProfile()
        commit('setProfile', res.data)
        commit('setLoginStatus', true)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '获取个人中心信息失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },

    async register(
      { commit }: any,
      payload: {
        phone: string
        code: string
        password: string
        confirmPassword: string
      },
    ) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ isLoggedIn: boolean; user: { name: string; role: string }; profile: UserProfileBundle }> = await apiRegister(
          payload.phone,
          payload.code,
          payload.password,
          payload.confirmPassword,
        )
        commit('setLoginStatus', res.data.isLoggedIn)
        commit('setProfile', res.data.profile)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '注册失败',
          status: 500,
        } as Omit<ApiErrorPayload, 'requestId'>)
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
  },
}
