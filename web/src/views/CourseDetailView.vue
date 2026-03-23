<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type { CourseDetailTabKey } from '../store/modules/course'

const store = useStore()
const router = useRouter()

const detailLoading = computed(() => store.state.course.detail.loading as boolean)
const detailError = computed(() => store.state.course.detail.error as any)
const bundle = computed(() => store.state.course.detail.bundle)
const activeTab = computed(() => store.state.course.detail.activeTab as CourseDetailTabKey)

const cartSelectedCount = computed(() => store.getters['cart/selectedCount'] as number)
const isLoggedIn = computed(() => store.state.user.isLoggedIn as boolean)

// 收藏：组件本地状态（不影响其他模块）
const isFavorite = ref(false)

onMounted(() => {
  store.dispatch('course/initCourseDetail')
})

async function onSelectTab(tab: CourseDetailTabKey) {
  if (tab === activeTab.value) return
  await store.dispatch('course/setCourseDetailTab', tab)
}

async function onToggleFavorite() {
  isFavorite.value = !isFavorite.value
}

async function onAddToCart() {
  if (!bundle.value) return
  await store.dispatch('cart/setItemSelected', { itemId: bundle.value.course.id, selected: true })
}

async function onBuyNow() {
  await onAddToCart()
  router.push('/cart')
}

function onFreePreview() {
  router.push('/course-play')
}
</script>

<template>
  <div class="bg-gray-50">
    <!-- 顶部导航（对齐原型） -->
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
                <RouterLink to="/courses" class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">课程</RouterLink>
                <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" @click.prevent>直播</a>
                <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" @click.prevent>资料</a>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                type="text"
                placeholder="搜索课程..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <button class="relative p-2 text-gray-600 hover:text-blue-600" type="button" @click.prevent>
              <i class="fas fa-shopping-cart text-lg"></i>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >{{ cartSelectedCount }}</span>
            </button>

            <RouterLink v-if="!isLoggedIn" to="/login" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              登录
            </RouterLink>
            <RouterLink v-else to="/learn-center" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              学习中心
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 面包屑导航 -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <a href="#" class="text-gray-400 hover:text-gray-500" @click.prevent>
                <i class="fas fa-home"></i> 首页
              </a>
            </li>
            <li>
              <i class="fas fa-chevron-right text-gray-300 mx-3"></i>
              <a href="#" class="text-gray-500 hover:text-gray-700" @click.prevent>
                {{ bundle?.course.category ?? '编程开发' }}
              </a>
            </li>
            <li>
              <i class="fas fa-chevron-right text-gray-300 mx-3"></i>
              <span class="text-gray-700">{{ bundle?.course.title ?? 'Python全栈开发实战' }}</span>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧主内容 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <!-- 视频预览区 -->
            <div class="relative h-80 bg-gradient-to-br from-blue-900 to-purple-900">
              <img
                :src="bundle?.previewImageUrl"
                alt="Python开发"
                class="w-full h-full object-cover opacity-30"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-black/70 to-black/30">
                <button class="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all" @click="onFreePreview">
                  <i class="fas fa-play text-white text-2xl ml-1"></i>
                </button>
              </div>
              <div class="absolute top-4 left-4">
                <span class="bg-red-500 text-white px-3 py-1 text-sm rounded-full">{{ bundle?.course.badgeLabel ?? '热门' }}</span>
              </div>
              <div class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 text-sm rounded">
                {{ bundle?.previewDurationText ?? '预览时长: 12:34' }}
              </div>
            </div>

            <!-- 课程基本信息 -->
            <div class="p-6">
              <div class="flex items-center mb-4">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full">{{ bundle?.course.category ?? '编程开发' }}</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full ml-2">{{ bundle?.course.level ?? '进阶' }}</span>
                <button class="ml-auto text-gray-500 hover:text-red-500" type="button" @click="onToggleFavorite">
                  <i :class="isFavorite ? 'fas fa-heart text-xl text-red-500' : 'far fa-heart text-xl'"></i>
                </button>
              </div>

              <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ bundle?.course.title ?? 'Python全栈开发实战' }}</h1>
              <p class="text-gray-600 text-lg mb-6">{{ bundle?.course.description ?? '从零基础到项目实战，全面掌握Python开发技能...' }}</p>

              <div class="flex items-center space-x-6 mb-6">
                <div class="flex items-center">
                  <img
                    :src="bundle?.course.teacherAvatarUrl"
                    alt="讲师"
                    class="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p class="font-semibold text-gray-800">{{ bundle?.course.teacher ?? '张老师' }}</p>
                    <p class="text-gray-500 text-sm">{{ bundle?.course.teacherRole ?? '高级Python开发工程师' }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="flex text-yellow-400 mr-2">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="text-gray-600">{{ bundle?.courseStats.ratingText ?? '4.8 (1,245条评价)' }}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="text-center">
                  <i class="fas fa-clock text-blue-600 text-xl mb-2"></i>
                  <p class="text-gray-600 text-sm">总时长</p>
                  <p class="font-semibold">{{ bundle?.courseStats.totalDurationText ?? '12小时' }}</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-video text-green-600 text-xl mb-2"></i>
                  <p class="text-gray-600 text-sm">课程数</p>
                  <p class="font-semibold">{{ bundle?.courseStats.courseCountText ?? '36节' }}</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-users text-purple-600 text-xl mb-2"></i>
                  <p class="text-gray-600 text-sm">学员数</p>
                  <p class="font-semibold">{{ bundle?.courseStats.studentCountText ?? '8,945' }}</p>
                </div>
                <div class="text-center">
                  <i class="fas fa-certificate text-orange-600 text-xl mb-2"></i>
                  <p class="text-gray-600 text-sm">证书</p>
                  <p class="font-semibold">{{ bundle?.courseStats.certificateName ?? '结业证书' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签页 -->
          <div class="bg-white rounded-xl shadow-sm">
            <div class="flex border-b">
              <button
                class="px-6 py-4 font-medium"
                :class="activeTab === 'intro' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'"
                @click="onSelectTab('intro')"
              >课程介绍</button>
              <button
                class="px-6 py-4 font-medium"
                :class="activeTab === 'catalog' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'"
                @click="onSelectTab('catalog')"
              >课程目录</button>
              <button
                class="px-6 py-4 font-medium"
                :class="activeTab === 'ratings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'"
                @click="onSelectTab('ratings')"
              >学员评价</button>
              <button
                class="px-6 py-4 font-medium"
                :class="activeTab === 'faq' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'"
                @click="onSelectTab('faq')"
              >常见问题</button>
            </div>

            <div class="p-6">
              <div v-if="detailLoading">加载中...</div>
              <div v-else-if="detailError" class="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {{ detailError.message }}（{{ detailError.code }}，requestId: {{ detailError.requestId }}）
              </div>
              <template v-else>
                <!-- 课程介绍内容 -->
                <div v-if="activeTab === 'intro'">
                  <h3 class="text-xl font-semibold mb-4">课程概述</h3>
                  <p class="text-gray-600 mb-6">{{ bundle?.intro.overview }}</p>

                  <h3 class="text-xl font-semibold mb-4">你将学到什么</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="flex items-center" v-for="item in bundle?.intro.learnItems" :key="item">
                      <i class="fas fa-check-circle text-green-500 mr-3"></i>
                      <span class="text-gray-700">{{ item }}</span>
                    </div>
                  </div>

                  <h3 class="text-xl font-semibold mb-4">课程特色</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                      class="text-center p-4 rounded-lg"
                      :class="f.tone === 'blue' ? 'bg-blue-50' : f.tone === 'green' ? 'bg-green-50' : 'bg-purple-50'"
                      v-for="f in bundle?.intro.features"
                      :key="f.title"
                    >
                      <i :class="f.iconClass"></i>
                      <h4 class="font-semibold mb-2">{{ f.title }}</h4>
                      <p class="text-gray-600 text-sm">{{ f.desc }}</p>
                    </div>
                  </div>

                  <h3 class="text-xl font-semibold mb-4">适合人群</h3>
                  <ul class="space-y-2 text-gray-600">
                    <li class="flex items-start" v-for="p in bundle?.intro.audience" :key="p">
                      <i class="fas fa-user-graduate text-blue-600 mt-1 mr-3"></i>{{ p }}
                    </li>
                  </ul>
                </div>

                <!-- 课程目录内容 -->
                <div v-else-if="activeTab === 'catalog'">
                  <h3 class="text-xl font-semibold mb-4">课程目录</h3>
                  <div class="space-y-4">
                    <div v-for="ch in bundle?.catalog.chapters" :key="ch.chapterTitle" class="border-b pb-4">
                      <h4 class="font-semibold text-gray-800 mb-2">{{ ch.chapterTitle }}</h4>
                      <div class="space-y-2">
                        <div v-for="it in ch.items" :key="it.title" class="flex items-center justify-between text-sm text-gray-600">
                          <span class="text-gray-700">{{ it.title }}</span>
                          <span class="text-gray-500">{{ it.duration }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 学员评价内容 -->
                <div v-else-if="activeTab === 'ratings'">
                  <h3 class="text-xl font-semibold mb-4">{{ bundle?.ratings.summary }}</h3>
                  <div class="space-y-4">
                    <div v-for="r in bundle?.ratings.items" :key="r.userName" class="rounded-lg border border-slate-200 p-4">
                      <div class="flex items-center gap-3">
                        <img :src="r.avatarUrl" :alt="r.userName" class="h-10 w-10 rounded-full" />
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-800">{{ r.userName }}</span>
                            <span class="text-sm text-gray-500">{{ r.rating.toFixed(1) }}</span>
                          </div>
                          <p class="text-sm text-gray-600 mt-2">{{ r.content }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 常见问题内容 -->
                <div v-else>
                  <h3 class="text-xl font-semibold mb-4">常见问题</h3>
                  <div class="space-y-3">
                    <div v-for="f in bundle?.faq.items" :key="f.question" class="rounded-lg border border-slate-200 p-4">
                      <p class="font-medium text-gray-800">{{ f.question }}</p>
                      <p class="mt-2 text-sm text-gray-600">{{ f.answer }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 右侧购买区域 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <!-- 价格信息 -->
            <div class="text-center mb-6">
              <div class="flex items-baseline justify-center mb-2">
                <span class="text-4xl font-bold text-red-600">¥{{ bundle?.purchase.price ?? 299 }}</span>
                <span class="text-gray-400 text-xl line-through ml-3">¥{{ bundle?.purchase.originalPrice ?? 599 }}</span>
              </div>
              <div class="flex items-center justify-center">
                <span class="bg-red-100 text-red-600 px-3 py-1 text-sm rounded-full">{{ bundle?.purchase.discountTag ?? '限时5折优惠' }}</span>
                <span class="text-gray-500 text-sm ml-2">{{ bundle?.purchase.remainingTimeText ?? '还剩2天' }}</span>
              </div>
            </div>

            <!-- 购买按钮 -->
            <div class="space-y-3 mb-6">
              <button class="w-full bg-red-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-red-700" @click="onBuyNow">
                <i class="fas fa-shopping-cart mr-2"></i>立即购买
              </button>
              <button class="w-full border border-blue-600 text-blue-600 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50" @click="onAddToCart">
                <i class="fas fa-heart mr-2"></i>加入购物车
              </button>
              <button class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50" @click="onFreePreview">
                <i class="fas fa-eye mr-2"></i>免费试看
              </button>
            </div>

            <!-- 课程包含内容 -->
            <div class="border-t pt-6">
              <h4 class="font-semibold mb-4">课程包含</h4>
              <div class="space-y-3">
                <div class="flex items-center" v-for="it in bundle?.purchase.contents" :key="it.text">
                  <i :class="it.iconClass"></i>
                  <span class="text-gray-700 ml-3">{{ it.text }}</span>
                </div>
              </div>
            </div>

            <!-- 分享 -->
            <div class="border-t pt-6 mt-6">
              <h4 class="font-semibold mb-4">分享课程</h4>
              <div class="flex space-x-3">
                <button class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600" type="button">
                  <i class="fab fa-weixin mr-1"></i>微信
                </button>
                <button class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600" type="button">
                  <i class="fab fa-weibo mr-1"></i>微博
                </button>
                <button class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" type="button">
                  <i class="fab fa-qq mr-1"></i>QQ
                </button>
              </div>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div v-if="bundle?.recommendations?.length" class="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h4 class="font-semibold mb-4">相关推荐</h4>
            <div class="space-y-4">
              <div class="flex" v-for="rec in bundle.recommendations.slice(0, 2)" :key="rec.id">
                <img :src="rec.imageUrl" :alt="rec.title" class="w-16 h-12 object-cover rounded" />
                <div class="ml-3 flex-1">
                  <h5 class="text-sm font-medium text-gray-800">{{ rec.title }}</h5>
                  <p class="text-xs text-gray-500 mt-1">¥{{ rec.price }}</p>
                  <div class="flex items-center mt-1">
                    <div class="flex text-yellow-400 text-xs">
                      <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                    </div>
                    <span class="text-xs text-gray-500 ml-1">{{ rec.rating.toFixed(1) }}</span>
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
