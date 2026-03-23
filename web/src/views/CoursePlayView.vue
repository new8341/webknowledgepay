<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import type { PlaybackTabKey, PlaybackChapter } from '../store/modules/learning'

const store = useStore()

const playback = computed(() => store.state.learning.playback)
const activeTab = computed(() => playback.value.activeTab as PlaybackTabKey)
const activeChapterId = computed(() => playback.value.activeChapterId as number | null)
const chapters = computed(() => playback.value.chapters as PlaybackChapter[])
const notes = computed(() => playback.value.notes)
const discussions = computed(() => playback.value.discussions)
const loading = computed(() => playback.value.loading)
const error = computed(() => playback.value.error)

onMounted(() => {
  // 页面首次进入就初始化目录；tab 切换和章节选择由 Vuex 状态驱动
  store.dispatch('learning/initPlayback')
})

async function onSelectTab(tab: PlaybackTabKey) {
  if (tab === activeTab.value) return
  await store.dispatch('learning/setPlaybackTab', tab)
}

async function onSelectChapter(chapterId: number) {
  await store.dispatch('learning/selectChapter', chapterId)
}

const expandedGroupId = ref<number | null>(null)

type ChapterGroup = {
  groupId: number
  groupTitle: string
  items: PlaybackChapter[]
}

const groups = computed<ChapterGroup[]>(() => {
  const list = chapters.value ?? []
  const groupsAcc: ChapterGroup[] = []
  let current: ChapterGroup | null = null

  for (const ch of list) {
    const isGroupHeader = ch.title.startsWith('第')
    if (isGroupHeader) {
      current = { groupId: ch.id, groupTitle: ch.title, items: [] }
      groupsAcc.push(current)
      continue
    }
    if (!current) continue
    current.items.push(ch)
  }
  return groupsAcc
})

const currentGroupTitle = computed(() => {
  const aid = activeChapterId.value
  if (!aid) return '—'
  for (const g of groups.value) {
    if (g.items.some((it) => it.id === aid)) return g.groupTitle
  }
  return '—'
})

const currentExpandedId = computed(() => {
  const aid = activeChapterId.value
  if (!aid) return null
  for (const g of groups.value) {
    if (g.items.some((it) => it.id === aid)) return g.groupId
  }
  return null
})

// 根据当前播放章节决定默认展开组（目录数据加载后自动生效）
watchEffect(() => {
  if (expandedGroupId.value === null && currentExpandedId.value !== null) {
    expandedGroupId.value = currentExpandedId.value
  }
})

function toggleGroup(groupId: number) {
  expandedGroupId.value = expandedGroupId.value === groupId ? null : groupId
}
</script>

<template>
  <section class="bg-gray-900 text-white">
    <!-- 顶部导航 -->
    <div class="bg-black/50">
      <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="hover:text-blue-400" aria-label="返回">
              <i class="fas fa-arrow-left text-lg"></i>
            </button>
            <div class="flex items-center gap-2">
              <i class="fas fa-graduation-cap text-xl text-blue-400"></i>
              <span class="font-semibold">稀际课堂</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-300">
              <span class="text-gray-400">播放章节：</span>
              <span class="text-white">{{ currentGroupTitle }}</span>
            </div>
            <button
              class="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
              @click="onSelectTab('catalog')"
            >
              <i class="fas fa-list mr-1"></i>目录
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex min-h-[calc(100svh-64px)]">
      <!-- 左侧：视频播放区 -->
      <div class="relative flex-1 bg-black">
        <div class="relative h-full">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Python学习视频"
            class="h-full w-full object-cover opacity-80"
          />

          <!-- 播放按钮覆盖层（示意） -->
          <div class="absolute inset-0 flex items-center justify-center">
            <button
              class="h-20 w-20 rounded-full bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600"
              aria-label="播放/暂停"
            >
              <i class="fas fa-pause text-white text-2xl"></i>
            </button>
          </div>

          <!-- 视频控制栏（示意） -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <div class="video-controls rounded-lg bg-gradient-to-t from-black/60 to-transparent p-3">
              <div class="w-full">
                <div class="relative">
                  <div class="h-1 w-full rounded-full bg-gray-600"></div>
                  <div class="absolute left-1/3 top-0 h-1 w-1/3 rounded-full bg-blue-500"></div>
                </div>
              </div>
              <div class="mt-3 flex items-center justify-between text-white">
                <div class="flex items-center gap-3">
                  <button class="hover:text-blue-400" aria-label="后退">
                    <i class="fas fa-step-backward text-lg"></i>
                  </button>
                  <button class="hover:text-blue-400" aria-label="暂停">
                    <i class="fas fa-pause text-xl"></i>
                  </button>
                  <button class="hover:text-blue-400" aria-label="前进">
                    <i class="fas fa-step-forward text-lg"></i>
                  </button>
                  <div class="flex items-center gap-1 text-sm text-gray-200">
                    <span>12:34</span>
                    <span>/</span>
                    <span>28:45</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button class="hover:text-blue-400" aria-label="字幕">
                    <i class="fas fa-closed-captioning"></i>
                  </button>
                  <div class="flex items-center gap-2 text-sm text-gray-200">
                    <span>1.0x</span>
                    <button class="hover:text-blue-400" aria-label="调速">
                      <i class="fas fa-tachometer-alt"></i>
                    </button>
                  </div>
                  <button class="hover:text-blue-400" aria-label="设置">
                    <i class="fas fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部学习工具栏（示意） -->
        <div class="bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <button class="flex items-center gap-2 hover:text-blue-400">
                <i class="fas fa-sticky-note"></i><span class="text-sm">笔记</span>
              </button>
              <button class="flex items-center gap-2 hover:text-blue-400">
                <i class="fas fa-question-circle"></i><span class="text-sm">提问</span>
              </button>
              <button class="flex items-center gap-2 hover:text-blue-400">
                <i class="fas fa-download"></i><span class="text-sm">下载</span>
              </button>
              <button class="flex items-center gap-2 hover:text-blue-400">
                <i class="fas fa-share"></i><span class="text-sm">分享</span>
              </button>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-sm text-gray-300">
                学习进度：<span class="text-blue-400">65%</span>
              </div>
              <button class="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700">
                下一节
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧边栏：目录/笔记/讨论 tabs（交互细节由状态驱动） -->
      <aside class="w-80 bg-white text-slate-900">
        <div class="flex border-b bg-gray-50">
          <button
            class="flex-1 border-b-2 px-4 py-3 text-sm font-medium"
            :class="activeTab === 'catalog' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'"
            @click="onSelectTab('catalog')"
          >
            <i class="fas fa-list mr-2"></i>目录
          </button>
          <button
            class="flex-1 border-b-2 px-4 py-3 text-sm font-medium"
            :class="activeTab === 'notes' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'"
            @click="onSelectTab('notes')"
          >
            <i class="fas fa-sticky-note mr-2"></i>笔记
          </button>
          <button
            class="flex-1 border-b-2 px-4 py-3 text-sm font-medium"
            :class="activeTab === 'discussion' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'"
            @click="onSelectTab('discussion')"
          >
            <i class="fas fa-comments mr-2"></i>讨论
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="loading" class="text-sm text-gray-500">加载中...</div>
          <div v-else-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-600">
            加载失败：{{ error.code }} - {{ error.message }}
          </div>

          <!-- 目录面板 -->
          <div v-else-if="activeTab === 'catalog'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-800">课程目录</h3>
              <span class="text-sm text-gray-500">{{ chapters.length }}节</span>
            </div>
            <div class="space-y-2">
              <div v-for="g in groups" :key="g.groupId" class="border-b pb-2">
                <button
                  class="flex w-full items-center justify-between py-2 text-left hover:text-blue-600"
                  type="button"
                  @click="toggleGroup(g.groupId)"
                >
                  <span class="font-medium" :class="g.groupId === currentExpandedId ? 'text-blue-600' : 'text-gray-800'">
                    {{ g.groupTitle }}
                  </span>
                  <i
                    class="fas"
                    :class="expandedGroupId === g.groupId ? 'fa-chevron-up text-blue-600' : 'fa-chevron-down text-gray-400'"
                  ></i>
                </button>

                <!-- 组展开时展示章节条目 -->
                <div v-if="expandedGroupId === g.groupId" class="ml-4 space-y-1">
                  <div
                    v-for="ch in g.items"
                    :key="ch.id"
                    class="flex items-center justify-between rounded p-2 text-sm cursor-pointer"
                    :class="ch.id === activeChapterId ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'"
                  >
                    <div class="flex items-center gap-2 flex-1" @click="onSelectChapter(ch.id)">
                      <i class="fas fa-play-circle text-green-500" v-if="!ch.isLocked"></i>
                      <i class="fas fa-lock text-gray-400" v-else></i>
                      <span class="flex-1">{{ ch.title }}</span>
                    </div>
                    <span class="text-xs text-gray-500" v-if="!ch.isLocked">{{ ch.duration }}</span>
                    <span class="text-xs text-gray-400" v-else>{{ ch.duration }}</span>
                  </div>
                </div>
              </div>
              <div v-if="groups.length === 0" class="text-sm text-gray-500">暂无目录</div>
            </div>
          </div>

          <!-- 笔记面板 -->
          <div v-else-if="activeTab === 'notes'">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-800">我的笔记</h3>
              <button class="text-blue-600 hover:text-blue-700 text-sm" type="button">
                <i class="fas fa-plus mr-1"></i>新建
              </button>
            </div>
            <div class="space-y-3">
              <div
                v-for="n in notes"
                :key="n.id"
                class="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <p class="text-sm text-gray-800 mb-1 line-clamp-2">{{ n.content }}</p>
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                      <i class="fas fa-clock"></i>
                      <span>{{ new Date(n.createdAt).toLocaleString() }}</span>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-red-500" type="button" aria-label="删除笔记">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <div v-if="notes.length === 0" class="text-sm text-gray-500">暂无笔记</div>
            </div>
          </div>

          <!-- 讨论面板 -->
          <div v-else>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-800">课程讨论</h3>
              <button class="text-blue-600 hover:text-blue-700 text-sm" type="button">
                <i class="fas fa-comment mr-1"></i>发表
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="d in discussions" :key="d.id" class="border-b border-gray-100 pb-4">
                <div class="flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="用户头像"
                    class="h-8 w-8 rounded-full"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm font-medium text-gray-800">{{ d.userName }}</span>
                      <span class="text-xs text-gray-500">{{ d.minutesAgo }}分钟前</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">{{ d.content }}</p>
                    <div class="flex items-center gap-5 text-xs text-gray-500">
                      <button class="hover:text-blue-600" type="button">
                        <i class="fas fa-thumbs-up mr-1"></i>{{ d.likeCount }}
                      </button>
                      <button class="hover:text-blue-600" type="button">
                        <i class="fas fa-comment mr-1"></i>回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="discussions.length === 0" class="text-sm text-gray-500">暂无讨论</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
