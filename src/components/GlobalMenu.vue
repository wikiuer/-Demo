<template>
  <div class="fixed top-10 left-6 z-[70]">
    <button 
      @click="toggleMenu"
      class="w-14 h-14 flex items-center justify-center bg-cn-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-100"
      :class="{ 'bg-cn-red text-white shadow-cn-red/20 shadow-lg': isOpen }"
    >
      <div class="w-7 flex flex-col gap-1.5">
        <span class="h-0.5 bg-cn-black transition-all duration-300" :class="{ 'rotate-45 translate-y-2 bg-white': isOpen }"></span>
        <span class="h-0.5 bg-cn-black transition-all duration-300" :class="{ 'opacity-0 bg-white': isOpen }"></span>
        <span class="h-0.5 bg-cn-black transition-all duration-300" :class="{ '-rotate-45 -translate-y-2 bg-white': isOpen }"></span>
      </div>
    </button>

    <transition name="menu">
      <div v-if="isOpen" ref="menuPanel" class="fixed top-0 left-0 h-screen w-96 bg-gradient-to-b from-cn-white to-gray-50 shadow-2xl p-8 pt-28 border-r border-gray-100">
        <!-- 装饰元素 -->
        <div class="absolute top-8 left-8 text-2xl font-serif text-cn-red font-bold">
          中国传统建筑
        </div>
        <div class="absolute top-14 left-8 w-16 h-1 bg-cn-red rounded-full"></div>

        <nav class="flex flex-col gap-8 mt-12">
          <RouterLink 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            @click="closeMenu"
            class="group text-2xl font-medium text-cn-black hover:text-cn-red transition-all duration-300 flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-cn-red/5"
          >
            <span class="w-3 h-3 rounded-full bg-cn-red opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125"></span>
            {{ item.label }}
            <span class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto">
              {{ item.en }}
            </span>
          </RouterLink>
        </nav>

        <!-- 底部装饰 -->
        <div class="absolute bottom-12 left-8 right-8">
          <div class="h-px bg-gradient-to-r from-cn-red/20 via-cn-red to-cn-red/20 mb-6"></div>
          <div class="text-sm text-gray-500 text-center font-serif">
            探索中华五千年建筑智慧
          </div>
        </div>

        <!-- 背景装饰图案 -->
        <div class="absolute bottom-0 right-0 w-48 h-48 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" class="text-cn-red">
            <path d="M50,10 L90,50 L50,90 L10,50 Z" />
            <path d="M50,25 L75,50 L50,75 L25,50 Z" />
          </svg>
        </div>
      </div>
    </transition>

    <!-- 遮罩层 -->
    <transition name="overlay">
      <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 bg-black/10 backdrop-blur-sm z-[-1]"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const isOpen = ref(false)
const menuPanel = ref<HTMLElement | null>(null)

const menuItems = [
  { path: '/', label: '首页', en: 'Home' },
  { path: '/architecture', label: '建筑库', en: 'Architecture' },
  { path: '/timeline', label: '时间轴', en: 'Timeline' },
  { path: '/map', label: '地图分布', en: 'Map' },
  { path: '/interactive', label: '互动体验', en: 'Interactive' },
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  window.dispatchEvent(new CustomEvent('menu-toggle', { detail: { isOpen: isOpen.value } }))
}

const closeMenu = () => {
  isOpen.value = false
  window.dispatchEvent(new CustomEvent('menu-toggle', { detail: { isOpen: false } }))
}

onMounted(() => {
  if (menuPanel.value) {
    gsap.fromTo(menuPanel.value, 
      { x: '100%', opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
  }
})
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-enter-from,
.menu-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
