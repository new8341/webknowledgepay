<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const items = computed(() => store.state.cart.items)
const totalPrice = computed(() => store.getters['cart/totalPrice'] as number)
const loading = computed(() => store.state.cart.loading as boolean)
const error = computed(() => store.state.cart.error as any)
const paymentMethod = computed(() => store.state.cart.paymentMethod as 'wechat' | 'alipay' | 'bank')
const checkoutStep = computed(() => store.state.cart.checkoutStep as 1 | 2 | 3)
const couponType = computed(() => store.state.cart.couponType as 'newUser' | 'study')

const selectedCount = computed(() => items.value.filter((it: any) => it.selected).length)
const isAllSelected = computed(() => items.value.length > 0 && items.value.every((it: any) => it.selected))

// 根据原型展示的固定优惠（后续可再接入真实计算逻辑/接口）
const couponDiscount = computed(() => {
  if (couponType.value === 'newUser') return 50
  // 学习加油券：满 500 减 80（mock 规则）
  return totalPrice.value >= 500 ? 80 : 0
})
const activityDiscount = computed(() => (totalPrice.value > 0 ? 699 : 0))
const payableAmount = computed(() => Math.max(0, totalPrice.value - couponDiscount.value - activityDiscount.value))

onMounted(() => {
  store.dispatch('cart/fetchCart')
})

async function onToggleSelectedAll(checked: boolean) {
  await store.dispatch('cart/toggleSelectedAll', checked)
}

async function onToggleItem(itemId: number, selected: boolean) {
  await store.dispatch('cart/setItemSelected', { itemId, selected })
}

async function onDecQty(itemId: number, quantity: number) {
  if (quantity <= 1) return
  await store.dispatch('cart/setItemQuantity', { itemId, quantity: quantity - 1 })
}

async function onIncQty(itemId: number, quantity: number) {
  await store.dispatch('cart/setItemQuantity', { itemId, quantity: quantity + 1 })
}

async function onDeleteSelected() {
  await store.dispatch('cart/deleteSelected')
}

async function onDeleteItem(itemId: number) {
  await store.dispatch('cart/deleteItem', itemId)
}

function onSelectPayment(method: 'wechat' | 'alipay' | 'bank') {
  store.dispatch('cart/setPaymentMethod', method)
}

function onSelectCoupon(type: 'newUser' | 'study') {
  store.dispatch('cart/setCouponType', type)
}

async function onCheckout() {
  try {
    await store.dispatch('cart/checkout')
  } catch {
    // 统一错误展示在页面上
  }
}
</script>

<template>
  <div class="bg-gray-50">
    <!-- 顶部导航（按原型 cart.html 精细化） -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <div class="flex-shrink-0 flex items-center">
              <i class="fas fa-graduation-cap text-2xl text-blue-600 mr-2"></i>
              <span class="text-xl font-bold text-gray-800">稀际课堂</span>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <RouterLink to="/" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">首页</RouterLink>
                <RouterLink to="/courses" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">课程</RouterLink>
                <RouterLink
                  to="/learn-center"
                  class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >直播</RouterLink>
                <RouterLink
                  to="/cart"
                  class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >购物车</RouterLink>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-600 hover:text-blue-600" type="button">
              <i class="fas fa-bell text-lg"></i>
            </button>
            <div class="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="用户头像"
                class="w-8 h-8 rounded-full"
              />
              <span class="text-gray-700">张同学</span>
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 结算进度条 -->
    <div class="bg-white border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 border-2"
              :class="checkoutStep === 1 ? 'bg-blue-600 text-white border-blue-600' : checkoutStep >= 2 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-300'"
            >
              1
            </div>
            <span :class="checkoutStep === 1 ? 'text-blue-600 font-medium' : checkoutStep >= 2 ? 'text-emerald-700 font-medium' : 'text-gray-500'">购物车</span>
          </div>

          <div class="flex-1 mx-8 h-1 bg-gray-200 rounded">
            <div class="h-1 bg-blue-600 rounded checkout-progress" :class="checkoutStep === 1 ? 'w-1/3' : checkoutStep === 2 ? 'w-2/3' : 'w-full'"></div>
          </div>

          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 border-2"
              :class="checkoutStep === 2 ? 'bg-blue-600 text-white border-blue-600' : checkoutStep >= 3 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-300'"
            >
              2
            </div>
            <span :class="checkoutStep === 2 ? 'text-gray-900' : checkoutStep >= 3 ? 'text-emerald-700' : 'text-gray-500'">确认订单</span>
          </div>

          <div class="flex-1 h-1 bg-gray-200 rounded" />

          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mr-3"
              :class="checkoutStep === 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-300'"
            >
              3
            </div>
            <span :class="checkoutStep === 3 ? 'text-gray-900' : 'text-gray-500'">支付成功</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧购物车内容 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-gray-800 flex items-center">
                <i class="fas fa-shopping-cart mr-3 text-blue-600"></i>
                购物车
              </h1>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 mr-2"
                    :checked="isAllSelected"
                    :disabled="items.length === 0"
                    @change="onToggleSelectedAll(($event.target as HTMLInputElement).checked)"
                  />
                  <span class="text-gray-600">全选</span>
                </label>
                <button class="text-red-600 hover:text-red-700 text-sm flex items-center" type="button" :disabled="selectedCount === 0" @click="onDeleteSelected">
                  <i class="fas fa-trash mr-1"></i>删除选中
                </button>
              </div>
            </div>
          </div>

          <!-- 限时优惠套餐（原型静态展示） -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <i class="fas fa-fire text-orange-500 text-xl mr-2"></i>
              <h3 class="text-lg font-semibold text-gray-800">限时优惠套餐</h3>
              <span class="bg-red-500 text-white px-2 py-1 text-xs rounded ml-3">火热</span>
            </div>
            <p class="text-gray-600 mb-4">购买 Python + 数据分析课程套餐，享受额外 8 折优惠！</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-2xl font-bold text-red-600">¥558</span>
                <span class="text-gray-400 text-base line-through ml-2">¥698</span>
                <span class="bg-red-100 text-red-600 px-2 py-1 text-xs rounded ml-2">省¥140</span>
              </div>
              <button class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600" type="button">
                <i class="fas fa-plus mr-1"></i>加入套餐
              </button>
            </div>
          </div>

          <!-- 购物车商品列表 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <article v-for="item in items" :key="item.id" class="p-6 border-b border-gray-100 cart-item">
              <div class="flex items-start">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 mt-2 mr-4"
                  :checked="item.selected"
                  @change="onToggleItem(item.id, ($event.target as HTMLInputElement).checked)"
                />

                <img
                  :src="item.imageUrl"
                  :alt="item.title"
                  class="w-24 h-16 object-cover rounded-lg"
                />

                <div class="ml-4 flex-1">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ item.title }}</h3>
                  <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span><i class="fas fa-user mr-1"></i>{{ item.teacher }}</span>
                    <span><i class="fas fa-clock mr-1"></i>{{ item.duration }}</span>
                    <span class="flex items-center"><i class="fas fa-star text-yellow-400 mr-1"></i>{{ item.rating }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded" v-if="item.category">{{ item.category }}</span>
                    <span class="bg-green-100 text-green-800 px-2 py-1 text-xs rounded" v-if="item.level">{{ item.level }}</span>
                  </div>
                </div>

                <div class="text-right">
                  <div class="mb-3">
                    <span class="text-xl font-bold text-red-600">¥{{ item.price }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      class="quantity-btn w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white disabled:opacity-50"
                      type="button"
                      :disabled="item.quantity <= 1"
                      @click="onDecQty(item.id, item.quantity)"
                    >
                      <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-12 text-center text-gray-900">{{ item.quantity }}</span>
                    <button
                      class="quantity-btn w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white"
                      type="button"
                      @click="onIncQty(item.id, item.quantity)"
                    >
                      <i class="fas fa-plus text-xs"></i>
                    </button>
                  </div>
                  <button class="text-gray-400 hover:text-red-500 mt-2" type="button" @click="onDeleteItem(item.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </article>

            <div v-if="items.length === 0" class="p-6 text-sm text-gray-500">购物车为空</div>
          </div>

          <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {{ error.message }}（{{ error.code }}，requestId: {{ error.requestId }}）
          </div>
        </div>

        <!-- 右侧结算区域 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 优惠券 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-ticket-alt text-red-600 mr-2"></i>优惠券
            </h3>
            <div class="space-y-3">
              <div class="flex items-center p-3 border border-red-200 bg-red-50 rounded-lg">
                <input type="radio" name="coupon" class="mr-3" value="newUser" :checked="couponType === 'newUser'" @change="onSelectCoupon('newUser')" />
                <div class="flex-1">
                  <p class="font-medium text-red-600">新用户专享券</p>
                  <p class="text-sm text-gray-500">满300减50</p>
                </div>
                <span class="text-red-600 font-bold">-¥50</span>
              </div>

              <div class="flex items-center p-3 border border-gray-200 rounded-lg">
                <input type="radio" name="coupon" class="mr-3" value="study" :checked="couponType === 'study'" @change="onSelectCoupon('study')" />
                <div class="flex-1">
                  <p class="font-medium text-gray-700">学习加油券</p>
                  <p class="text-sm text-gray-500">满500减80</p>
                </div>
                <span class="text-gray-400" v-if="totalPrice < 500">不满足</span>
                <span class="text-red-600 font-bold" v-else>-¥80</span>
              </div>
            </div>

            <div class="mt-4 flex">
              <input
                type="text"
                placeholder="输入优惠码"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :value="store.state.cart.couponCode"
                @input="(e) => store.commit('cart/setCouponCode', (e.target as HTMLInputElement).value)"
              />
              <button class="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700" type="button">
                使用
              </button>
            </div>
          </div>

          <!-- 支付方式 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-credit-card text-green-600 mr-2"></i>支付方式
            </h3>
            <div class="space-y-3">
              <div
                class="payment-method flex items-center p-3 border-2 rounded-lg cursor-pointer"
                :class="paymentMethod === 'wechat' ? 'active border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'"
                @click="onSelectPayment('wechat')"
              >
                <input
                  type="radio"
                  name="payment"
                  class="mr-3"
                  :checked="paymentMethod === 'wechat'"
                />
                <i class="fab fa-weixin text-2xl text-green-500 mr-3"></i>
                <span class="font-medium">微信支付</span>
              </div>

              <div
                class="payment-method flex items-center p-3 border-2 rounded-lg cursor-pointer"
                :class="paymentMethod === 'alipay' ? 'active border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'"
                @click="onSelectPayment('alipay')"
              >
                <input
                  type="radio"
                  name="payment"
                  class="mr-3"
                  :checked="paymentMethod === 'alipay'"
                />
                <i class="fab fa-alipay text-2xl text-blue-500 mr-3"></i>
                <span class="font-medium">支付宝</span>
              </div>

              <div
                class="payment-method flex items-center p-3 border-2 rounded-lg cursor-pointer"
                :class="paymentMethod === 'bank' ? 'active border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'"
                @click="onSelectPayment('bank')"
              >
                <input
                  type="radio"
                  name="payment"
                  class="mr-3"
                  :checked="paymentMethod === 'bank'"
                />
                <i class="fas fa-university text-2xl text-gray-500 mr-3"></i>
                <span class="font-medium">银行卡支付</span>
              </div>
            </div>
          </div>

          <!-- 结算信息 -->
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">订单金额</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">商品总价</span>
                <span class="text-gray-800">¥{{ totalPrice }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">优惠券</span>
                <span class="text-red-600">-¥{{ couponDiscount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">活动优惠</span>
                <span class="text-red-600">-¥{{ activityDiscount }}</span>
              </div>

              <div class="border-t pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold">实付金额</span>
                  <span class="text-2xl font-bold text-red-600">¥{{ payableAmount }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">已优惠¥{{ couponDiscount + activityDiscount }}</p>
              </div>
            </div>

            <button
              class="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 mt-6 disabled:opacity-60"
              type="button"
              :disabled="selectedCount === 0 || loading || checkoutStep === 3"
              @click="onCheckout"
            >
              <i class="fas fa-lock mr-2"></i>
              立即结算 ({{ selectedCount }}件商品)
            </button>

            <div class="mt-4 flex items-center justify-center text-sm text-gray-500">
              <i class="fas fa-shield-alt mr-2"></i>
              安全支付，支持7天无理由退款
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付成功态简化展示 -->
    <div v-if="checkoutStep === 3" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="w-[520px] rounded-xl bg-white p-8 shadow-xl">
        <div class="flex items-center gap-3">
          <i class="fas fa-check-circle text-green-600 text-3xl"></i>
          <h3 class="text-2xl font-bold text-gray-900">支付成功</h3>
        </div>
        <p class="mt-3 text-sm text-gray-600">订单已处理完成，已从购物车移除选中商品。</p>
        <button
          class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white font-medium"
          type="button"
          @click="store.commit('cart/setCheckoutStep', 1); store.dispatch('cart/fetchCart')"
        >
          返回继续学习
        </button>
      </div>
    </div>
  </div>
</template>
