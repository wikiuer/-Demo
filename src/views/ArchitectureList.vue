<template>
  <div class="min-h-screen bg-cn-white">
    <GlobalMenu />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold mb-2 text-center text-cn-black font-serif">中国古代建筑库</h1>
      <p class="text-gray-600 text-center mb-12">探索中国古代建筑的卓越成就与匠艺智慧</p>

      <!-- 搜索和筛选区域 -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 关键词搜索 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">关键词搜索</label>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索建筑名称、描述..."
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cn-red/30 focus:border-cn-red hover:border-gray-400 transition-all duration-300"
            />
          </div>

          <!-- 建筑类型筛选 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">按类型筛选</label>
            <select
              v-model="selectedType"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cn-red/30 focus:border-cn-red hover:border-gray-400 transition-all duration-300 cursor-pointer"
            >
              <option value="">全部类型</option>
              <option v-for="type in uniqueTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <!-- 朝代筛选 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">按朝代筛选</label>
            <select
              v-model="selectedDynasty"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cn-red/30 focus:border-cn-red hover:border-gray-400 transition-all duration-300 cursor-pointer"
            >
              <option value="">全部朝代</option>
              <option v-for="dynasty in uniqueDynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
            </select>
          </div>
        </div>

        <!-- 筛选结果统计和布局切换 -->
        <div class="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="text-gray-600">
            共找到 <span class="font-bold text-cn-red">{{ filteredBuildings.length }}</span> 个建筑
          </div>
          <!-- 布局切换按钮组 -->
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button
              @click="currentLayout = 'grid'"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-all duration-300', currentLayout === 'grid' ? 'bg-white shadow-sm text-cn-red' : 'text-gray-600 hover:text-gray-900']"
            >
              网格视图
            </button>
            <button
              @click="currentLayout = 'list'"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-all duration-300', currentLayout === 'list' ? 'bg-white shadow-sm text-cn-red' : 'text-gray-600 hover:text-gray-900']"
            >
              列表视图
            </button>
            <button
              @click="currentLayout = 'card'"
              :class="['px-4 py-2 rounded-md text-sm font-medium transition-all duration-300', currentLayout === 'card' ? 'bg-white shadow-sm text-cn-red' : 'text-gray-600 hover:text-gray-900']"
            >
              浮窗视图
            </button>
          </div>
        </div>
      </div>

      <!-- 布局切换过渡容器 -->
      <TransitionGroup name="layout" tag="div">
      <!-- 建筑列表 - 网格布局 -->
      <div v-if="currentLayout === 'grid'" key="grid-layout" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="building in filteredBuildings"
          :key="building.id"
          :to="`/architecture/${building.id}`"
          class="block no-underline bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="building.images[0]"
              :alt="building.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="p-5">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xl font-bold text-cn-black">{{ building.name }}</h3>
              <span class="px-2 py-1 bg-cn-yellow/20 text-cn-yellow text-sm rounded">{{ building.dynasty }}</span>
            </div>
            <div class="mb-2">
              <span class="inline-block px-2 py-1 bg-cn-cyan/10 text-cn-cyan text-xs rounded mr-2">{{ building.type }}</span>
              <span class="text-gray-500 text-sm">{{ building.location }}</span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ building.description }}</p>
            <div class="text-cn-red hover:text-cn-red-light font-medium flex items-center">
              查看详情 <span class="ml-1">→</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- 建筑列表 - 列表布局 -->
      <div v-else-if="currentLayout === 'list'" key="list-layout" class="space-y-4">
        <router-link
          v-for="building in filteredBuildings"
          :key="building.id"
          :to="`/architecture/${building.id}`"
          class="block no-underline bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row"
        >
          <div class="md:w-48 h-40 md:h-auto overflow-hidden flex-shrink-0">
            <img
              :src="building.images[0]"
              :alt="building.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex flex-wrap justify-between items-start gap-2 mb-2">
                <h3 class="text-xl font-bold text-cn-black">{{ building.name }}</h3>
                <span class="px-2 py-1 bg-cn-yellow/20 text-cn-yellow text-sm rounded">{{ building.dynasty }}</span>
              </div>
              <div class="mb-3">
                <span class="inline-block px-2 py-1 bg-cn-cyan/10 text-cn-cyan text-xs rounded mr-2">{{ building.type }}</span>
                <span class="text-gray-500 text-sm">{{ building.location }}</span>
              </div>
              <p class="text-gray-600 mb-4 line-clamp-3">{{ building.description }}</p>
            </div>
            <div class="text-cn-red hover:text-cn-red-light font-medium flex items-center self-start">
              查看详情 <span class="ml-1">→</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- 建筑列表 - 浮窗布局 -->
      <div v-else-if="currentLayout === 'card'" key="card-layout" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="building in filteredBuildings"
          :key="building.id"
          :to="`/architecture/${building.id}`"
          class="block no-underline bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative"
        >
            <div class="h-36 overflow-hidden">
              <img
                :src="building.images[0]"
                :alt="building.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span class="absolute bottom-2 left-2 px-2 py-1 bg-cn-yellow/80 text-white text-xs rounded">{{ building.dynasty }}</span>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-bold text-cn-black mb-1">{{ building.name }}</h3>
          <div class="flex items-center justify-between">
              <span class="text-gray-500 text-xs">{{ building.location }}</span>
              <div class="text-cn-red hover:text-cn-red-light text-sm font-medium">
                查看
              </div>
            </div>
          </div>
        </router-link>
        </div>
      </TransitionGroup>

      <!-- 无结果提示 -->
      <div v-if="filteredBuildings.length === 0" class="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
        <div class="text-6xl mb-4">🏯</div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">未找到匹配的建筑</h3>
        <p class="text-gray-500">请尝试调整搜索条件或筛选选项</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { TransitionGroup } from 'vue'
import GlobalMenu from '../components/GlobalMenu.vue'

const allBuildings = ref([])
const searchKeyword = ref('')
const selectedType = ref('')
const selectedDynasty = ref('')
const currentLayout = ref('grid') // grid/list/card 三种布局模式

// 获取所有唯一的建筑类型
const uniqueTypes = computed(() => {
  const types = new Set()
  allBuildings.value.forEach(building => types.add(building.type))
  return Array.from(types).sort()
})

// 获取所有唯一的朝代
const uniqueDynasties = computed(() => {
  const dynasties = new Set()
  allBuildings.value.forEach(building => {
    // 处理多朝代的情况，拆分单独加入
    building.dynasty.split(/[、，]/).forEach(d => dynasties.add(d.trim()))
  })
  return Array.from(dynasties).sort()
})

// 筛选后的建筑列表
const filteredBuildings = computed(() => {
  return allBuildings.value.filter(building => {
    // 关键词匹配
    const keywordMatch = !searchKeyword.value || 
      building.name.includes(searchKeyword.value) || 
      building.description.includes(searchKeyword.value)
    
    // 类型匹配
    const typeMatch = !selectedType.value || building.type === selectedType.value
    
    // 朝代匹配
    const dynastyMatch = !selectedDynasty.value || 
      building.dynasty.includes(selectedDynasty.value)
    
    return keywordMatch && typeMatch && dynastyMatch
  })
})

onMounted(async () => {
  try {
    const res = await fetch('data/buildings.json')
    allBuildings.value = await res.json()
  } catch (e) {
    console.error('加载建筑数据失败', e)
  }
})
</script>

<style scoped>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s ease;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.layout-leave-active {
  position: absolute;
}
</style>
