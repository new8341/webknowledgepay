<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const learnCenter = computed(() => store.state.learning.learnCenter)
const overview = computed(() => store.state.learning.learnCenter.overview)

onMounted(() => {
  store.dispatch('learning/initLearnCenter')
})

function progressBarStyle(percent: number) {
  return { width: `${percent}%` }
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
                <RouterLink to="/" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">首页</RouterLink>
                <RouterLink to="/courses" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">课程</RouterLink>
                <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" @click.prevent>直播</a>
                <RouterLink to="/learn-center" class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">学习中心</RouterLink>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-600 hover:text-blue-600 relative" type="button" aria-label="通知">
              <i class="fas fa-bell text-lg"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <div class="flex items-center space-x-3">
              <img :src="learnCenter.profile.avatarUrl" alt="用户头像" class="w-8 h-8 rounded-full" />
              <span class="text-gray-700">{{ learnCenter.profile.name }}</span>
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
              <img :src="learnCenter.profile.avatarUrl" alt="用户头像" class="w-16 h-16 rounded-full mx-auto mb-3" />
              <h3 class="font-semibold text-gray-800">{{ learnCenter.profile.name }}</h3>
              <p class="text-gray-500 text-sm">{{ learnCenter.profile.role }}</p>
              <div class="mt-3 flex justify-center">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-xs rounded-full">
                  {{ learnCenter.profile.vipText }}
                </div>
              </div>
            </div>

            <nav class="py-2">
              <a
                href="#"
                class="tab-item tab-active flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 border-l-3 border-blue-600 text-blue-600"
              >
                <i class="fas fa-play-circle mr-3"></i>
                我的学习
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent>
                <i class="fas fa-heart mr-3"></i>
                我的收藏
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent>
                <i class="fas fa-download mr-3"></i>
                离线下载
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent>
                <i class="fas fa-sticky-note mr-3"></i>
                学习笔记
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent>
                <i class="fas fa-certificate mr-3"></i>
                我的证书
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent>
                <i class="fas fa-shopping-cart mr-3"></i>
                购买记录
              </a>
              <a href="#" class="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent>
                <i class="fas fa-cog mr-3"></i>
                设置
              </a>
            </nav>
          </div>
        </div>

        <!-- 右侧主内容 -->
        <div class="flex-1">
          <!-- 学习概览卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm">总学习时长</p>
                  <p class="text-2xl font-bold">{{ overview.totalHours }}小时</p>
                </div>
                <i class="fas fa-clock text-3xl text-blue-200"></i>
              </div>
            </div>
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm">已完成课程</p>
                  <p class="text-2xl font-bold">{{ overview.completedCourses }}门</p>
                </div>
                <i class="fas fa-check-circle text-3xl text-green-200"></i>
              </div>
            </div>
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm">学习中课程</p>
                  <p class="text-2xl font-bold">{{ overview.learningCourses }}门</p>
                </div>
                <i class="fas fa-play-circle text-3xl text-purple-200"></i>
              </div>
            </div>
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-orange-100 text-sm">获得证书</p>
                  <p class="text-2xl font-bold">{{ overview.certificatesCount }}张</p>
                </div>
                <i class="fas fa-certificate text-3xl text-orange-200"></i>
              </div>
            </div>
          </div>

          <!-- 最近学习 -->
          <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800">最近学习</h2>
              <button class="text-blue-600 hover:text-blue-700 text-sm font-medium" type="button">查看全部</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="c in learnCenter.recentLearning"
                :key="c.id"
                class="course-card border border-gray-200 rounded-lg overflow-hidden hover:shadow-md"
              >
                <div class="relative">
                  <img :src="c.imageUrl" :alt="c.title" class="w-full h-32 object-cover" />
                  <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button class="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30" type="button">
                      <i class="fas fa-play text-white"></i>
                    </button>
                  </div>
                  <div class="absolute top-2 left-2">
                    <span class="bg-green-500 text-white px-2 py-1 text-xs rounded" v-if="c.statusLabel === '学习中'">{{ c.statusLabel }}</span>
                    <span class="bg-blue-500 text-white px-2 py-1 text-xs rounded" v-else>{{ c.statusLabel }}</span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-800 mb-2">{{ c.title }}</h3>
                  <div class="flex items-center text-gray-500 text-sm mb-3">
                    <i class="fas fa-user mr-2"></i>
                    <span>{{ c.teacher }}</span>
                    <i class="fas fa-clock mr-2 ml-4"></i>
                    <span>{{ c.durationText }}</span>
                  </div>
                  <div class="mb-3">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                      <span>学习进度</span>
                      <span>{{ c.progressPercent }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-700"
                        :style="progressBarStyle(c.progressPercent)"
                      ></div>
                    </div>
                  </div>
                  <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" type="button">
                    {{ c.progressButtonText }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习计划 -->
          <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800">本周学习计划</h2>
              <button class="text-blue-600 hover:text-blue-700 text-sm font-medium" type="button">制定计划</button>
            </div>

            <div class="space-y-4">
              <div
                v-for="p in learnCenter.weeklyPlan"
                :key="p.id"
                class="flex items-center p-4 border border-gray-200 rounded-lg"
              >
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 mr-4" :checked="p.checked" disabled />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800">{{ p.title }}</h4>
                  <p class="text-gray-500 text-sm mt-1">{{ p.expectedHoursText }}</p>
                </div>
                <span
                  class="text-sm font-medium"
                  :class="p.statusTone === 'green' ? 'text-green-600' : p.statusTone === 'orange' ? 'text-orange-600' : 'text-gray-600'"
                >
                  {{ p.statusText }}
                </span>
              </div>
            </div>
          </div>

          <!-- 学习统计 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">本月学习统计</h3>
              <div class="space-y-4">
                <div v-for="s in learnCenter.categoryMonthlyStats" :key="s.category" class="flex items-center justify-between">
                  <span class="text-gray-600">{{ s.category }}</span>
                  <div class="flex items-center">
                    <div class="w-24 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        class="h-2 rounded-full"
                        :class="s.tone === 'blue' ? 'w-20 bg-blue-500' : s.tone === 'green' ? 'w-16 bg-green-500' : 'w-12 bg-purple-500'"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-600">{{ s.hoursText }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">最近成就</h3>
              <div class="space-y-3">
                <div
                  v-for="a in learnCenter.achievements"
                  :key="a.id"
                  class="flex items-center p-3 rounded-lg"
                  :class="a.tone === 'yellow' ? 'bg-yellow-50' : a.tone === 'blue' ? 'bg-blue-50' : 'bg-green-50'"
                >
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    :class="a.tone === 'yellow' ? 'bg-yellow-500' : a.tone === 'blue' ? 'bg-blue-500' : 'bg-green-500'"
                  >
                    <i class="fas fa-star text-white" v-if="a.tone === 'green'"></i>
                    <i class="fas fa-trophy text-white" v-else-if="a.tone === 'yellow'"></i>
                    <i class="fas fa-calendar-check text-white" v-else></i>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-800">{{ a.title }}</h4>
                    <p class="text-xs text-gray-500">{{ a.subtitle }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
