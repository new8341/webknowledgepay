<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type { UserProfileBundle } from '../types'

const store = useStore()
const router = useRouter()

const loading = computed(() => store.state.user.loading as boolean)
const error = computed(() => store.state.user.error as any)
const bundle = computed(() => store.state.user.profile as UserProfileBundle | null)

const activeMenu = ref<'profile' | 'orders' | 'payment' | 'security' | 'notification' | 'help' | 'logout'>('profile')

const isEditing = ref(false)

const draft = reactive({
  name: '',
  phoneMasked: '',
  email: '',
  role: '',
  city: '',
  workYears: '',
  bio: '',
})

onMounted(async () => {
  // 进入个人中心页初始化 profile：由 Vuex/Mock API 驱动
  await store.dispatch('user/fetchProfile')
  if (bundle.value) {
    draft.name = bundle.value.profile.name
    draft.phoneMasked = bundle.value.profile.phoneMasked
    draft.email = bundle.value.profile.email
    draft.role = bundle.value.profile.role
    draft.city = bundle.value.profile.city
    draft.workYears = bundle.value.profile.workYears
    draft.bio = bundle.value.profile.bio
  }
})

function setEditing(locked: boolean) {
  isEditing.value = locked
}

function onCancel() {
  isEditing.value = false
  if (bundle.value) {
    draft.name = bundle.value.profile.name
    draft.phoneMasked = bundle.value.profile.phoneMasked
    draft.email = bundle.value.profile.email
    draft.role = bundle.value.profile.role
    draft.city = bundle.value.profile.city
    draft.workYears = bundle.value.profile.workYears
    draft.bio = bundle.value.profile.bio
  }
}

function onSave() {
  // 当前高保真阶段只做 UI 与本地状态一致性；真实项目可继续补齐 updateProfile API。
  isEditing.value = false
  // 不直接写 Vuex，避免“顺手重构/改动 public API”。留待后续你要求后补齐 action/mutation。
}

function onLogout() {
  store.commit('user/setLoginStatus', false)
  router.push('/')
}
</script>

<template>
  <div class="bg-gray-50">
    <!-- 顶部导航 -->
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
                <RouterLink to="/" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  首页
                </RouterLink>
                <RouterLink
                  to="/courses"
                  class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >课程</RouterLink>
                <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" @click.prevent>直播</a>
                <span class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">个人中心</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-600 hover:text-blue-600 relative" type="button">
              <i class="fas fa-bell text-lg"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <div class="flex items-center space-x-3" v-if="bundle">
              <img :src="bundle.profile.avatarUrl" alt="用户头像" class="w-8 h-8 rounded-full" />
              <span class="text-gray-700">{{ bundle.profile.name }}</span>
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧导航 -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-sm p-2 sticky top-8">
            <div class="text-center p-4 border-b">
              <div class="avatar-upload relative inline-block">
                <img
                  v-if="bundle"
                  :src="bundle.profile.avatarUrl"
                  alt="用户头像"
                  class="w-20 h-20 rounded-full mx-auto"
                />
                <div class="avatar-overlay absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 transition-opacity cursor-pointer">
                  <i class="fas fa-camera text-white text-xl"></i>
                </div>
              </div>
              <h3 class="font-semibold text-gray-800 mt-3" v-if="bundle">{{ bundle.profile.name }}</h3>
              <p class="text-gray-500 text-sm" v-if="bundle">{{ bundle.profile.role }}</p>
              <div class="mt-3 flex justify-center" v-if="bundle">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs rounded-full">
                  {{ bundle.profile.vipText }}
                </div>
              </div>
            </div>

            <nav class="py-2">
              <a href="#" class="tab-active flex items-center px-4 py-3 text-sm font-medium rounded-lg" @click.prevent>
                <i class="fas fa-user mr-3"></i>
                个人资料
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="activeMenu = 'orders'">
                <i class="fas fa-shopping-bag mr-3"></i>
                订单管理
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="activeMenu = 'payment'">
                <i class="fas fa-credit-card mr-3"></i>
                支付管理
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="activeMenu = 'security'">
                <i class="fas fa-shield-alt mr-3"></i>
                账户安全
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="activeMenu = 'notification'">
                <i class="fas fa-bell mr-3"></i>
                通知设置
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="activeMenu = 'help'">
                <i class="fas fa-question-circle mr-3"></i>
                帮助中心
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="onLogout">
                <i class="fas fa-sign-out-alt mr-3"></i>
                退出登录
              </a>
            </nav>
          </div>
        </div>

        <!-- 右侧主内容 -->
        <div class="flex-1">
          <div v-if="loading" class="bg-white rounded-xl shadow-sm p-6 mb-8 text-sm text-gray-500">加载中...</div>
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-sm text-red-600">
            {{ error.message }}（{{ error.code }}，requestId: {{ error.requestId }}）
          </div>

          <template v-else-if="bundle">
            <!-- 个人资料 -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-800">个人资料</h2>
                <button class="text-blue-600 hover:text-blue-700 text-sm font-medium" type="button" @click="setEditing(true)">
                  编辑资料
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input :disabled="!isEditing" v-model="draft.name" type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                  <input :disabled="!isEditing" v-model="draft.phoneMasked" type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input :disabled="!isEditing" v-model="draft.email" type="email" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">职业</label>
                  <select :disabled="!isEditing" v-model="draft.role" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Python开发工程师</option>
                    <option>前端开发工程师</option>
                    <option>后端开发工程师</option>
                    <option>数据分析师</option>
                    <option>产品经理</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">所在城市</label>
                  <input :disabled="!isEditing" v-model="draft.city" type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">工作年限</label>
                  <select :disabled="!isEditing" v-model="draft.workYears" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>1-3年</option>
                    <option>3-5年</option>
                    <option>5-10年</option>
                    <option>10年以上</option>
                  </select>
                </div>
              </div>

              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
                <textarea :disabled="!isEditing" rows="4" v-model="draft.bio" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="介绍一下您自己..."></textarea>
              </div>

              <div class="mt-6 flex items-center gap-4">
                <button :disabled="!isEditing" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60" type="button" @click="onSave">
                  保存修改
                </button>
                <button :disabled="!isEditing" class="ml-0 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-60" type="button" @click="onCancel">
                  取消
                </button>
              </div>
            </div>

            <!-- 账户统计 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-100 text-sm">已购课程</p>
                    <p class="text-2xl font-bold">{{ bundle.stats.purchasedCoursesText }}</p>
                  </div>
                  <i class="fas fa-graduation-cap text-3xl text-blue-200"></i>
                </div>
              </div>
              <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-100 text-sm">学习时长</p>
                    <p class="text-2xl font-bold">{{ bundle.stats.totalHoursText }}</p>
                  </div>
                  <i class="fas fa-clock text-3xl text-green-200"></i>
                </div>
              </div>
              <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-100 text-sm">获得证书</p>
                    <p class="text-2xl font-bold">{{ bundle.stats.certificatesCountText }}</p>
                  </div>
                  <i class="fas fa-certificate text-3xl text-purple-200"></i>
                </div>
              </div>
              <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-orange-100 text-sm">累计消费</p>
                    <p class="text-2xl font-bold">{{ bundle.stats.totalCostText }}</p>
                  </div>
                  <i class="fas fa-wallet text-3xl text-orange-200"></i>
                </div>
              </div>
            </div>

            <!-- 最近订单 -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-800">最近订单</h3>
                <button class="text-blue-600 hover:text-blue-700 text-sm font-medium" type="button">查看全部</button>
              </div>
              <div class="space-y-4">
                <div v-for="o in bundle.recentOrders" :key="o.id" class="order-card flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md">
                  <img :src="o.coverUrl" :alt="o.title" class="w-16 h-12 object-cover rounded" />
                  <div class="ml-4 flex-1">
                    <h4 class="font-medium text-gray-800">{{ o.title }}</h4>
                    <p class="text-gray-500 text-sm">订单号: {{ o.orderNo }}</p>
                    <p class="text-gray-500 text-sm">购买时间: {{ o.purchaseTimeText }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-800">¥{{ o.price }}</p>
                    <span
                      :class="o.statusTone === 'green' ? 'bg-green-100 text-green-800' : o.statusTone === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                      class="px-2 py-1 text-xs rounded-full"
                    >{{ o.statusLabel }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习成就与分析 -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-6">学习成就</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-gray-700 mb-4">获得徽章</h4>
                  <div class="grid grid-cols-3 gap-4">
                    <div v-for="a in bundle.achievements" :key="a.id" class="text-center p-3 rounded-lg"
                      :class="a.tone === 'yellow' ? 'bg-yellow-50' : a.tone === 'blue' ? 'bg-blue-50' : 'bg-green-50'"
                    >
                      <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                        :class="a.tone === 'yellow' ? 'bg-yellow-500' : a.tone === 'blue' ? 'bg-blue-500' : 'bg-green-500'"
                      >
                        <i class="fas fa-star text-white" v-if="a.tone === 'green'"></i>
                        <i class="fas fa-star text-white" v-else-if="a.tone === 'blue'"></i>
                        <i class="fas fa-trophy text-white" v-else></i>
                      </div>
                      <p class="text-xs text-gray-600">{{ a.title }}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="font-medium text-gray-700 mb-4">学习分析</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">本周学习</span>
                      <span class="font-medium">{{ bundle.analysis.weeklyLearningText }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">连续学习</span>
                      <span class="font-medium">{{ bundle.analysis.consecutiveLearningText }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">完成率</span>
                      <span class="font-medium">{{ bundle.analysis.completionRateText }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">平均评分</span>
                      <div class="flex items-center">
                        <div class="flex text-yellow-400 text-sm mr-1">
                          <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                        </div>
                        <span class="font-medium">{{ bundle.analysis.avgRatingText }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.tab-active {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  color: #1d4ed8;
}
</style>
