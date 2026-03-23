export interface CartItem {
  id: number
  title: string
  price: number
  selected: boolean

  // 用于“数量增减”交互
  quantity: number

  // 以下字段用于页面精细还原（原型卡片细节）
  imageUrl?: string
  teacher?: string
  duration?: string
  rating?: number
  category?: string
  level?: string
}

export type PaymentMethodKey = 'wechat' | 'alipay' | 'bank'

export interface CartState {
  items: CartItem[]

  loading: boolean
  error: { code: string; message: string; requestId: string; status: number } | null

  paymentMethod: PaymentMethodKey
  checkoutStep: 1 | 2 | 3
  couponType: 'newUser' | 'study'
  couponCode: string
}

import type { ApiErrorPayload } from '../../api/errors'
import { toApiErrorPayload } from '../../api/errors'
import type { ApiResult } from '../../api'
import {
  apiCheckoutSelected,
  apiDeleteCartSelected,
  apiDeleteCartItem,
  apiFetchCart,
  apiSetCartItemQuantity,
  apiSetCartItemSelected,
} from '../../api'

export default {
  namespaced: true,
  state: (): CartState => ({
    items: [
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
    ],
    loading: false,
    error: null,
    paymentMethod: 'wechat',
    checkoutStep: 1,
    couponType: 'newUser',
    couponCode: '',
  }),
  getters: {
    totalPrice(localState: CartState): number {
      return localState.items
        .filter((it) => it.selected)
        .reduce((sum, it) => sum + it.price * it.quantity, 0)
    },
    // 购物车角标：选中商品数量（原型仅用于展示，不做复杂优惠计算）
    selectedCount(localState: CartState): number {
      return localState.items.filter((it) => it.selected).reduce((sum, it) => sum + it.quantity, 0)
    },
  },
  mutations: {
    setLoading(localState: CartState, loading: boolean) {
      localState.loading = loading
    },
    setError(localState: CartState, error: ApiErrorPayload | null) {
      localState.error = error
    },
    setItems(localState: CartState, items: CartItem[]) {
      localState.items = items
    },
    setPaymentMethod(localState: CartState, method: PaymentMethodKey) {
      localState.paymentMethod = method
    },
    setCheckoutStep(localState: CartState, step: 1 | 2 | 3) {
      localState.checkoutStep = step
    },
    setCouponType(localState: CartState, couponType: 'newUser' | 'study') {
      localState.couponType = couponType
    },
    setCouponCode(localState: CartState, couponCode: string) {
      localState.couponCode = couponCode
    },
  },
  actions: {
    async fetchCart({ commit }: any) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ items: CartItem[] }> = await apiFetchCart()
        commit('setItems', res.data.items)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '加载购物车失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
    async setItemSelected({ commit }: any, payload: { itemId: number; selected: boolean }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ items: CartItem[] }> = await apiSetCartItemSelected(payload.itemId, payload.selected)
        commit('setItems', res.data.items)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '更新商品选择状态失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
    async toggleSelectedAll({ state, dispatch, commit }: any, selected: boolean) {
      commit('setError', null)
      // 逐个调用 mock API（真实场景会有批量接口，这里保持最小实现）。
      for (const it of state.cart.items) {
        if (it.selected === selected) continue
        await dispatch('setItemSelected', { itemId: it.id, selected })
      }
    },
    async setItemQuantity({ commit }: any, payload: { itemId: number; quantity: number }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ items: CartItem[] }> = await apiSetCartItemQuantity(payload.itemId, payload.quantity)
        commit('setItems', res.data.items)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '更新商品数量失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
    async deleteSelected({ commit }: any) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ items: CartItem[] }> = await apiDeleteCartSelected()
        commit('setItems', res.data.items)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '删除选中商品失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
    async deleteItem({ commit }: any, itemId: number) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const res: ApiResult<{ items: CartItem[] }> = await apiDeleteCartItem(itemId)
        commit('setItems', res.data.items)
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '删除商品失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
    setPaymentMethod({ commit }: any, method: PaymentMethodKey) {
      commit('setPaymentMethod', method)
    },
    setCouponType({ commit }: any, couponType: 'newUser' | 'study') {
      commit('setCouponType', couponType)
    },
    setCouponCode({ commit }: any, couponCode: string) {
      commit('setCouponCode', couponCode)
    },
    async checkout({ state, commit, dispatch }: any) {
      commit('setError', null)
      const selectedCount = state.cart.items.filter((it: CartItem) => it.selected).length
      if (selectedCount === 0) {
        const normalized = toApiErrorPayload(new Error('未选择要结算的商品'), {
          code: 'VALIDATION_ERROR',
          message: '未选择要结算的商品',
          status: 400,
        })
        commit('setError', normalized)
        throw normalized
      }

      commit('setLoading', true)
      try {
        commit('setCheckoutStep', 2)
        await apiCheckoutSelected()
        commit('setCheckoutStep', 3)
        await dispatch('fetchCart')
      } catch (err) {
        const normalized = toApiErrorPayload(err, {
          code: 'UNKNOWN',
          message: '结算失败',
          status: 500,
        })
        commit('setError', normalized)
        throw normalized
      } finally {
        commit('setLoading', false)
      }
    },
  },
}
