<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const modules = computed(() => store.state.app.modules)
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <h1 class="text-lg font-bold text-slate-800">{{ store.state.app.platformName }}</h1>
      <nav class="flex flex-wrap gap-2">
        <RouterLink
          v-for="item in modules"
          :key="item.key"
          :to="item.route"
          class="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
