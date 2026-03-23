<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNav from '../components/AppNav.vue'

const route = useRoute()
const showAppNav = computed(() => !route.meta.hideAppNav)
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <!-- 通用导航模块，所有业务页面复用 -->
    <AppNav v-if="showAppNav" />
    <main class="mx-auto max-w-6xl px-4 py-6">
      <router-view />
    </main>
  </div>
</template>
