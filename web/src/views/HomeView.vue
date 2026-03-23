<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import ModulePanel from '../components/ModulePanel.vue'

const store = useStore()

const searchKeyword = ref('')
const courses = computed(() => store.state.course.hotCourses)
const cartSelectedCount = computed(() => store.getters['cart/selectedCount'] as number)
const isLoggedIn = computed(() => store.state.user.isLoggedIn as boolean)

// 根据原型为“热门分类/热门课程卡片”补齐视觉标识（不额外改动 Vuex 数据结构，保持小改动）
const categoryCards = [
  { title: '编程开发', icon: 'fas fa-code', count: '1,234门', color: 'blue' },
  { title: '数据分析', icon: 'fas fa-chart-line', count: '856门', color: 'green' },
  { title: 'UI设计', icon: 'fas fa-palette', count: '642门', color: 'purple' },
  { title: '营销推广', icon: 'fas fa-bullhorn', count: '528门', color: 'orange' },
]

const hotCardStyles: Record<number, { badge: string; badgeClass: string; timeBadge: string }> = {
  1: { badge: '热门', badgeClass: 'bg-red-500', timeBadge: '12小时' },
  2: { badge: '新课', badgeClass: 'bg-green-500', timeBadge: '18小时' },
  3: { badge: '精品', badgeClass: 'bg-purple-500', timeBadge: '24小时' },
}

const hotCoursesFiltered = computed(() => {
  const kw = searchKeyword.value.trim()
  if (!kw) return courses.value
  return courses.value.filter((c: any) => c.title.includes(kw) || c.teacher.includes(kw) || c.category.includes(kw))
})

function onClickCart() {
  // 这里不需要复杂状态，仅用于原型路径跳转
  window.location.href = '/cart'
}
</script>

<template>
  <div class="bg-gray-50">
    <!-- 顶部导航（对齐原型 home.html） -->
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
                <RouterLink to="/" class="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">首页</RouterLink>
                <RouterLink to="/courses" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">课程</RouterLink>
                <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" @click.prevent>直播</a>
                <a href="#" class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium" @click.prevent>资料</a>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="搜索课程..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <button class="relative p-2 text-gray-600 hover:text-blue-600" type="button" @click="onClickCart">
              <i class="fas fa-shopping-cart text-lg"></i>
              <span
                v-if="cartSelectedCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >{{ cartSelectedCount }}</span>
              <span
                v-else
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >0</span>
            </button>
            <RouterLink v-if="!isLoggedIn" to="/login" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登录</RouterLink>
            <RouterLink v-else to="/learn-center" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">进入学习</RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主横幅 -->
    <section class="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl font-bold mb-6">开启您的<br />知识付费之旅</h1>
            <p class="text-xl mb-8 opacity-90">汇聚优质课程，专业讲师在线授课，助您快速掌握新技能，实现职业突破</p>
            <div class="flex space-x-4">
              <RouterLink to="/course-play" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                <i class="fas fa-play mr-2"></i>开始学习
              </RouterLink>
              <RouterLink to="/courses" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                了解更多
              </RouterLink>
            </div>
          </div>
          <div class="text-center">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="在线学习"
              class="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 热门分类 -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">热门分类</h2>
          <p class="text-gray-600">选择您感兴趣的领域，开始专业学习</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="c in categoryCards"
            :key="c.title"
            class="category-item bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer text-center transition-transform duration-300 hover:scale-105"
          >
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              :class="c.color === 'blue' ? 'bg-blue-100' : c.color === 'green' ? 'bg-green-100' : c.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'"
            >
              <i :class="c.color === 'blue' ? 'fas fa-code text-2xl text-blue-600' : c.color === 'green' ? 'fas fa-chart-line text-2xl text-green-600' : c.color === 'purple' ? 'fas fa-palette text-2xl text-purple-600' : 'fas fa-bullhorn text-2xl text-orange-600'"></i>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">{{ c.title }}</h3>
            <p class="text-sm text-gray-500">{{ c.count }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 模块命名展示（符合你的“每个模块起名并展示”要求） -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <ModulePanel />
    </div>

    <!-- 热门课程 -->
    <section class="py-16 bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">热门课程推荐</h2>
          <p class="text-gray-600">精选优质课程，助您快速提升专业技能</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="course in hotCoursesFiltered"
            :key="course.id"
            class="course-card bg-white rounded-xl shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div class="relative">
              <img
                class="w-full h-48 object-cover"
                :src="
                  course.id === 1
                    ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                    : course.id === 2
                      ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                      : 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                "
                :alt="course.title"
              />
              <div class="absolute top-4 left-4">
                <span
                  class="text-white px-2 py-1 text-xs rounded-full"
                  :class="hotCardStyles[course.id]?.badgeClass || 'bg-blue-500'"
                >{{ hotCardStyles[course.id]?.badge || '热门' }}</span>
              </div>
              <div class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                {{ hotCardStyles[course.id]?.timeBadge || course.duration }}
              </div>
            </div>

            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ course.title }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ course.category }} · {{ course.level }}</p>
              <div class="flex items-center mb-4">
                <img
                  :src="
                    course.id === 1
                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                      : course.id === 2
                        ? 'https://images.unsplash.com/photo-1494790108755-2616b612b780?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                        : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                  "
                  :alt="course.teacher"
                  class="w-8 h-8 rounded-full mr-3"
                />
                <span class="text-gray-700 text-sm">{{ course.teacher }}</span>
                <div class="ml-auto flex items-center">
                  <i class="fas fa-star text-yellow-400"></i>
                  <span class="text-gray-600 text-sm ml-1">{{ course.rating }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-red-600">¥{{ course.price }}</span>
                  <span class="text-gray-400 text-sm line-through ml-2">¥{{ course.id === 1 ? 599 : course.id === 2 ? 799 : 1199 }}</span>
                </div>
                <button
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  type="button"
                  @click="
                    store.dispatch('cart/setItemSelected', { itemId: course.id, selected: true })
                  "
                >
                  立即购买
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <RouterLink to="/courses" class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white inline-block">
            查看更多课程
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 底部信息 -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <i class="fas fa-graduation-cap text-2xl text-blue-400 mr-2"></i>
              <span class="text-xl font-bold">稀际课堂</span>
            </div>
            <p class="text-gray-400">专业的知识付费平台，为您提供优质的在线学习体验</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">课程分类</h4>
            <ul class="space-y-2 text-gray-400">
              <li><RouterLink to="/courses" class="hover:text-white">编程开发</RouterLink></li>
              <li><RouterLink to="/courses" class="hover:text-white">数据分析</RouterLink></li>
              <li><RouterLink to="/courses" class="hover:text-white">UI设计</RouterLink></li>
              <li><RouterLink to="/courses" class="hover:text-white">营销推广</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">帮助中心</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white" @click.prevent>使用指南</a></li>
              <li><a href="#" class="hover:text-white" @click.prevent>常见问题</a></li>
              <li><a href="#" class="hover:text-white" @click.prevent>联系我们</a></li>
              <li><a href="#" class="hover:text-white" @click.prevent>意见反馈</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">关注我们</h4>
            <div class="flex space-x-4">
              <a href="#" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600" @click.prevent>
                <i class="fab fa-weixin"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600" @click.prevent>
                <i class="fab fa-weibo"></i>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600" @click.prevent>
                <i class="fab fa-qq"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 稀际课堂 - 知识付费平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
