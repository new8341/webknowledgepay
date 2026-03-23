<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const modules = computed(() => store.state.app.modules)
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 class="mb-3 text-lg font-semibold text-slate-800">全局模块划分</h2>
    <p class="mb-4 text-sm text-slate-500">按业务拆分模块，并在导航中独立展示。</p>
    <div class="grid gap-3 md:grid-cols-2">
      <article v-for="item in modules" :key="item.key" class="rounded-lg bg-slate-50 p-3">
        <p class="font-medium text-slate-800">{{ item.name }}</p>
        <p class="text-sm text-slate-500">{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
