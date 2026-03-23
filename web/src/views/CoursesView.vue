<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { Course } from '../types'

const store = useStore()

const categories = computed(() => store.state.course.categories as string[])
const courseList = computed(() => store.state.course.courseList as Course[])
const totalCount = computed(() => store.state.course.totalCount as number)
const loading = computed(() => store.state.course.loading as boolean)
const error = computed(() => store.state.course.error as any)
const activeCategory = computed(() => store.state.course.activeCategory as string)

const isLoggedIn = computed(() => store.state.user.isLoggedIn as boolean)
const cartSelectedCount = computed(() => store.getters['cart/selectedCount'] as number)

// 顶部搜索（原型是“搜索课程...”）
const navSearch = ref('')

// 左侧筛选器（原型：分类/难度/价格/评分）
const selectedCategories = ref<string[]>(['编程开发'])
const selectedLevels = ref<string[]>(['进阶'])
const priceRange = ref<'free' | '0-100' | '100-500' | '500+' >('100-500')
const selectedRatingMins = ref<number[]>([4.0]) // 默认选中“4.0分及以上”

// 右侧工具栏
const sortKey = ref('综合排序')
const viewMode = ref<'grid' | 'list'>('grid')

// 热门标签（原型点击可切换高亮）
const activeTag = ref<string | null>(null)
const tags = ['Python', 'JavaScript', 'Java', '前端开发', '后端开发', '移动开发']

// 收藏：心形按钮状态（组件本地状态）
const favorites = ref<Set<number>>(new Set())

function badgeBgClass(color?: 'red' | 'green' | 'purple') {
  if (color === 'red') return 'bg-red-500'
  if (color === 'green') return 'bg-green-500'
  if (color === 'purple') return 'bg-purple-500'
  return 'bg-blue-500'
}

function tagBgForCategory(category: string) {
  if (category === '编程开发') return 'bg-blue-100 text-blue-800'
  if (category === '数据分析') return 'bg-green-100 text-green-800'
  if (category === 'UI设计') return 'bg-purple-100 text-purple-800'
  return 'bg-orange-100 text-orange-800'
}

function tagBgForLevel(level: string) {
  if (level === '入门') return 'bg-orange-100 text-orange-800'
  if (level === '进阶') return 'bg-green-100 text-green-800'
  if (level === '高级') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

function filterByNavSearch(list: Course[]) {
  const kw = navSearch.value.trim()
  if (!kw) return list
  return list.filter((c) => c.title.includes(kw) || c.teacher.includes(kw) || c.category.includes(kw))
}

function filterByActiveTag(list: Course[]) {
  if (!activeTag.value) return list
  // 简化：用“标题包含”模拟标签筛选行为（mock 数据下足够可视化）
  const t = activeTag.value
  return list.filter((c) => c.title.includes(t) || c.category.includes(t))
}

function filterBySidebar(list: Course[]) {
  // 分类（支持多选）
  if (selectedCategories.value.length > 0) {
    list = list.filter((c) => selectedCategories.value.includes(c.category))
  }

  // 难度（多选）
  if (selectedLevels.value.length > 0) {
    list = list.filter((c) => selectedLevels.value.includes(c.level))
  }

  // 价格范围（单选）
  const pr = priceRange.value
  if (pr === '0-100') list = list.filter((c) => c.price >= 0 && c.price <= 100)
  else if (pr === '100-500') list = list.filter((c) => c.price >= 100 && c.price <= 500)
  else if (pr === '500+') list = list.filter((c) => c.price >= 500)
  else if (pr === 'free') list = list.filter((c) => c.price === 0)

  // 用户评分（多选：取最小阈值，等价于“>=其中任意一个选中的阈值”）
  if (selectedRatingMins.value.length > 0) {
    const minRating = Math.min(...selectedRatingMins.value)
    list = list.filter((c) => c.rating >= minRating)
  }

  return list
}

function sortByKey(list: Course[]) {
  const key = sortKey.value
  const next = [...list]
  if (key === '价格从低到高') next.sort((a, b) => a.price - b.price)
  else if (key === '价格从高到低') next.sort((a, b) => b.price - a.price)
  else if (key === '评分最高') next.sort((a, b) => b.rating - a.rating)
  else if (key === '最新发布') next.sort((a, b) => b.id - a.id)
  // 综合排序：保持原顺序（API 返回顺序）
  return next
}

const visibleCourses = computed(() => {
  return sortByKey(filterByActiveTag(filterByNavSearch(filterBySidebar(courseList.value))))
})

async function fetchByCurrentFilters() {
  // 原型右上标题以“当前分类”展示，这里以左侧分类勾选为准。
  const cat = selectedCategories.value[0] ?? '编程开发'
  // TODO：price/level/rating 在 mock API 中目前主要用于 UI 呈现；后续可继续扩展 mock API 过滤逻辑。
  await store.dispatch('course/fetchCourses', { category: cat, sortKey: sortKey.value })
}

function resetFilters() {
  selectedCategories.value = ['编程开发']
  selectedLevels.value = ['进阶']
  priceRange.value = '100-500'
  selectedRatingMins.value = [4.0]
  sortKey.value = '综合排序'
  viewMode.value = 'grid'
  activeTag.value = null
  navSearch.value = ''
  // 重置后拉取默认分类数据
  fetchByCurrentFilters()
}

function onToggleFavorite(courseId: number) {
  const next = new Set(favorites.value)
  if (next.has(courseId)) next.delete(courseId)
  else next.add(courseId)
  favorites.value = next
}

async function onAddToCart(courseId: number) {
  // “加入购物车”按原型：把对应课程条目标记为已选中（cart checkout 需要 selected 状态）
  await store.dispatch('cart/setItemSelected', { itemId: courseId, selected: true })
}

onMounted(() => {
  // 首屏默认显示“编程开发课程”
  store.dispatch('course/fetchCourses', { category: selectedCategories.value[0] ?? '编程开发', sortKey: sortKey.value })
})
</script>

<template>
  <section class="bg-gray-50">
    <!-- 顶部导航（对齐原型 courses.html） -->
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
                v-model="navSearch"
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <button class="relative p-2 text-gray-600 hover:text-blue-600" type="button">
              <i class="fas fa-shopping-cart text-lg"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartSelectedCount }}
              </span>
            </button>
            <RouterLink v-if="!isLoggedIn" to="/login" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登录</RouterLink>
            <RouterLink v-else to="/learn-center" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">学习中心</RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 面包屑导航（原型） -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <div>
                <a href="#" class="text-gray-400 hover:text-gray-500" @click.prevent>
                  <i class="fas fa-home"></i>
                  首页
                </a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-300 mx-3"></i>
                <a href="#" class="text-gray-500 hover:text-gray-700" @click.prevent>所有课程</a>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-300 mx-3"></i>
                <span class="text-gray-700">{{ activeCategory }}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧筛选器（原型） -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">筛选条件</h3>

            <!-- 分类筛选 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">课程分类</h4>
              <div class="space-y-2">
                <label class="flex items-center" v-for="cat in categories" :key="cat">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600"
                    :checked="selectedCategories.includes(cat)"
                    @change="(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      const next = new Set(selectedCategories)
                      checked ? next.add(cat) : next.delete(cat)
                      selectedCategories = Array.from(next)
                    }"
                  />
                  <span class="ml-2 text-sm text-gray-600">{{ cat }}</span>
                </label>
              </div>
            </div>

            <!-- 难度筛选 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">课程难度</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600"
                    :checked="selectedLevels.includes('入门')"
                    @change="(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      const next = new Set(selectedLevels)
                      checked ? next.add('入门') : next.delete('入门')
                      selectedLevels = Array.from(next)
                    }"
                  />
                  <span class="ml-2 text-sm text-gray-600">入门</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600"
                    :checked="selectedLevels.includes('进阶')"
                    @change="(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      const next = new Set(selectedLevels)
                      checked ? next.add('进阶') : next.delete('进阶')
                      selectedLevels = Array.from(next)
                    }"
                  />
                  <span class="ml-2 text-sm text-gray-600">进阶</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600"
                    :checked="selectedLevels.includes('高级')"
                    @change="(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      const next = new Set(selectedLevels)
                      checked ? next.add('高级') : next.delete('高级')
                      selectedLevels = Array.from(next)
                    }"
                  />
                  <span class="ml-2 text-sm text-gray-600">高级</span>
                </label>
              </div>
            </div>

            <!-- 价格筛选 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">价格范围</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" name="price" class="border-gray-300 text-blue-600" value="free" v-model="priceRange" />
                  <span class="ml-2 text-sm text-gray-600">免费</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="price" class="border-gray-300 text-blue-600" value="0-100" v-model="priceRange" />
                  <span class="ml-2 text-sm text-gray-600">0-100元</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="price" class="border-gray-300 text-blue-600" value="100-500" v-model="priceRange" />
                  <span class="ml-2 text-sm text-gray-600">100-500元</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="price" class="border-gray-300 text-blue-600" value="500+" v-model="priceRange" />
                  <span class="ml-2 text-sm text-gray-600">500元以上</span>
                </label>
              </div>
            </div>

            <!-- 评分筛选 -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">用户评分</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600"
                    :checked="selectedRatingMins.includes(4.5)"
                    @change="(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      const next = new Set(selectedRatingMins)
                      checked ? next.add(4.5) : next.delete(4.5)
                      selectedRatingMins = Array.from(next)
                    }"
                  />
                  <span class="ml-2 text-sm text-gray-600 flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    4.5分及以上
                  </span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600"
                    :checked="selectedRatingMins.includes(4.0)"
                    @change="(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      const next = new Set(selectedRatingMins)
                      checked ? next.add(4.0) : next.delete(4.0)
                      selectedRatingMins = Array.from(next)
                    }"
                  />
                  <span class="ml-2 text-sm text-gray-600 flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    4.0分及以上
                  </span>
                </label>
              </div>
            </div>

            <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" type="button" @click="fetchByCurrentFilters">
              应用筛选
            </button>
            <button class="w-full mt-2 text-gray-500 text-sm hover:text-gray-700" type="button" @click="resetFilters">
              重置筛选
            </button>
          </div>
        </div>

        <!-- 右侧课程列表 -->
        <div class="flex-1">
          <!-- 顶部工具栏 -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{{ activeCategory }}课程</h1>
              <p class="text-gray-600 mt-1">共找到 {{ totalCount }} 门课程</p>
            </div>
            <div class="flex items-center space-x-4">
              <select
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="sortKey"
                @change="fetchByCurrentFilters"
              >
                <option>综合排序</option>
                <option>最新发布</option>
                <option>价格从低到高</option>
                <option>价格从高到低</option>
                <option>评分最高</option>
              </select>

              <div class="flex border border-gray-300 rounded-lg">
                <button class="px-3 py-2 bg-blue-50 text-blue-600 border-r" type="button" @click="viewMode = 'grid'">
                  <i class="fas fa-th-large"></i>
                </button>
                <button class="px-3 py-2 text-gray-500" type="button" @click="viewMode = 'list'">
                  <i class="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 热门标签 -->
          <div class="mb-6">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="t in tags"
                :key="t"
                class="px-3 py-1 rounded-full text-sm cursor-pointer"
                :class="activeTag === t ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'"
                @click="activeTag = t"
              >
                {{ t }}
              </span>
              <span class="px-3 py-1 rounded-full text-sm cursor-pointer bg-gray-100 text-gray-700 hover:bg-blue-50" @click="activeTag = null">
                清空
              </span>
            </div>
          </div>

          <!-- 错误/加载 -->
          <div v-if="loading" class="text-sm text-gray-500">加载中...</div>
          <div v-else-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {{ error.message }}（{{ error.code }}，requestId: {{ error.requestId }}）
          </div>

          <!-- 课程网格 -->
          <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'">
            <article
              v-for="course in visibleCourses"
              :key="course.id"
              class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md"
            >
              <div class="relative" :class="viewMode === 'list' ? 'flex gap-4 p-4' : ''">
                <template v-if="viewMode === 'grid'">
                  <img :src="course.imageUrl" :alt="course.title" class="w-full h-48 object-cover" />
                  <div class="absolute top-4 left-4" v-if="course.badgeLabel">
                    <span class="text-white px-2 py-1 text-xs rounded-full" :class="badgeBgClass(course.badgeColor)">
                      {{ course.badgeLabel }}
                    </span>
                  </div>
                  <div class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded" v-if="course.timeBadge">
                    {{ course.timeBadge }}
                  </div>
                  <button
                    class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500"
                    type="button"
                    @click="onToggleFavorite(course.id)"
                  >
                    <i :class="favorites.has(course.id) ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
                  </button>
                </template>

                <template v-else>
                  <img :src="course.imageUrl" :alt="course.title" class="w-40 h-24 object-cover rounded-lg" />
                  <button
                    class="self-start mt-1 w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500"
                    type="button"
                    @click="onToggleFavorite(course.id)"
                  >
                    <i :class="favorites.has(course.id) ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
                  </button>
                </template>
              </div>

              <div class="p-6" :class="viewMode === 'list' ? 'pt-0' : ''">
                <div class="mb-2">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded" :class="tagBgForCategory(course.category)">
                    {{ course.category }}
                  </span>
                  <span class="px-2 py-1 text-xs rounded ml-1" :class="tagBgForLevel(course.level)">
                    {{ course.level }}
                  </span>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                  {{ course.title }}
                </h3>
                <p class="text-gray-600 text-sm mb-4">
                  {{ course.description }}
                </p>

                <div class="flex items-center mb-4">
                  <img :src="course.teacherAvatarUrl" :alt="course.teacher" class="w-8 h-8 rounded-full mr-3" />
                  <span class="text-gray-700 text-sm">{{ course.teacher }}</span>
                  <div class="ml-auto flex items-center">
                    <div class="flex text-yellow-400 text-xs">
                      <i class="fas fa-star" v-for="i in 5" :key="i"></i>
                    </div>
                    <span class="text-gray-600 text-sm ml-1">{{ course.rating.toFixed(1) }} ({{ Math.floor(course.rating * 250) }}条)</span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-baseline">
                    <span class="text-xl font-bold text-red-600">¥{{ course.price }}</span>
                    <span class="text-gray-400 text-sm line-through ml-2">¥{{ course.originalPrice }}</span>
                    <span class="bg-red-100 text-red-600 px-1 py-0.5 text-xs rounded ml-2" v-if="course.discountTag">
                      {{ course.discountTag }}
                    </span>
                  </div>
                  <button
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    type="button"
                    @click="onAddToCart(course.id)"
                  >
                    <i class="fas fa-shopping-cart mr-1"></i>加入购物车
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- 分页（原型静态） -->
          <div class="flex justify-center items-center mt-12 space-x-2">
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50" type="button" disabled>
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="px-3 py-2 bg-blue-600 text-white rounded-lg" type="button">1</button>
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" type="button">2</button>
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" type="button">3</button>
            <span class="px-3 py-2 text-gray-500">...</span>
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" type="button">10</button>
            <button class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" type="button">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
