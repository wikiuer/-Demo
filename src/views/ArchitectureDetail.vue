<template>
  <div class="min-h-screen bg-cn-white" v-if="building">
    <GlobalMenu />
    <!-- 顶部图片轮播 -->
    <div class="relative bg-gray-900">
      <div class="max-w-7xl mx-auto">
        <div class="relative h-[500px] overflow-hidden">
          <img
            :src="building.images[currentImageIndex]"
            :alt="building.name"
            class="w-full h-full object-cover"
          />
          <!-- 轮播控制按钮 -->
          <button
            v-if="building.images.length > 1"
            @click="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ←
          </button>
          <button
            v-if="building.images.length > 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            →
          </button>
          <!-- 轮播指示器 -->
          <div v-if="building.images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(img, index) in building.images"
              :key="index"
              @click="currentImageIndex = index"
              class="w-2 h-2 rounded-full transition-all"
              :class="index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'"
            ></button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 基本信息 -->
      <div class="mb-12">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 class="text-4xl font-bold text-cn-black font-serif mb-2">{{ building.name }}</h1>
            <div class="flex flex-wrap gap-3">
              <span class="px-3 py-1 bg-cn-yellow/20 text-cn-yellow rounded-full text-sm">{{ building.dynasty }}</span>
              <span class="px-3 py-1 bg-cn-cyan/20 text-cn-cyan rounded-full text-sm">{{ building.type }}</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{{ building.year }}</span>
              <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">📍 {{ building.location }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p class="text-gray-700 text-lg leading-relaxed">{{ building.description }}</p>
        </div>
      </div>

      <!-- 技术亮点 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6 text-cn-black flex items-center">
          <span class="w-1 h-8 bg-cn-red mr-3 rounded"></span>
          技术亮点
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(highlight, index) in building.tech_highlights"
            :key="index"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h3 class="text-xl font-bold text-cn-red mb-3">{{ highlight.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ highlight.content }}</p>
          </div>
        </div>
      </div>

      <!-- 结构说明 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6 text-cn-black flex items-center">
          <span class="w-1 h-8 bg-cn-cyan mr-3 rounded"></span>
          结构说明
        </h2>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p class="text-gray-700 leading-relaxed">{{ building.structure }}</p>
        </div>
      </div>

      <!-- 相关建筑 -->
      <div v-if="building.related && building.related.length > 0">
        <h2 class="text-2xl font-bold mb-6 text-cn-black flex items-center">
          <span class="w-1 h-8 bg-cn-yellow mr-3 rounded"></span>
          相关建筑
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="relatedId in building.related"
            :key="relatedId"
            class="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
            @click="goToDetail(relatedId)"
          >
            <div class="h-32 overflow-hidden">
              <img
                :src="getBuildingById(relatedId)?.images[0]"
                :alt="getBuildingById(relatedId)?.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold text-cn-black mb-1">{{ getBuildingById(relatedId)?.name }}</h3>
              <p class="text-gray-500 text-sm line-clamp-1">{{ getBuildingById(relatedId)?.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else class="min-h-screen bg-cn-white flex items-center justify-center">
    <div class="text-center">
      <div class="text-4xl mb-4 animate-spin">⚙️</div>
      <p class="text-gray-600">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import GlobalMenu from '../components/GlobalMenu.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const allBuildings = ref([])
const currentImageIndex = ref(0)

const building = computed(() => {
  return allBuildings.value.find(b => b.id === props.id)
})

function getBuildingById(id) {
  return allBuildings.value.find(b => b.id === id)
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + building.value.images.length) % building.value.images.length
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % building.value.images.length
}

function goToDetail(id) {
  router.push(`/architecture/${id}`)
}

onMounted(async () => {
  try {
    const res = await fetch('data/buildings.json')
    allBuildings.value = await res.json()
  } catch (e) {
    console.error('加载建筑数据失败', e)
  }
})
</script>
