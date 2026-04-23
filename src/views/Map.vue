<template>
  <div class="min-h-screen bg-cn-white">
    <GlobalMenu />
    <div class="h-screen relative">
      <!-- 国风装饰元素 -->
      <div class="absolute top-4 right-4 w-32 h-32 opacity-10 z-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" class="text-cn-yellow">
          <path d="M50,0 L100,50 L50,100 L0,50 Z M50,20 L80,50 L50,80 L20,50 Z" />
        </svg>
      </div>
      <div class="absolute bottom-4 left-4 w-24 h-24 opacity-10 z-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" class="text-cn-red">
          <path d="M10,10 H90 V90 H10 Z M20,20 H80 V80 H20 Z" />
        </svg>
      </div>

      <!-- 页面标题 -->
      <div class="absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center w-full px-6">
        <div class="w-20 h-1 bg-cn-yellow mx-auto mb-4"></div>
        <h1 class="text-4xl font-bold mb-3 text-white font-serif drop-shadow-lg">建筑地理分布</h1>
        <p class="text-white/90 max-w-2xl mx-auto drop-shadow-md">直观查看中国古代建筑在全国各地的分布情况</p>
      </div>

      <!-- 左侧工具栏 -->
      <div class="absolute left-20 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        <button @click="zoomIn" class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-cn-black hover:bg-cn-red hover:text-white transition-all duration-300 border border-gray-100">
          +
        </button>
        <button @click="zoomOut" class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-cn-black hover:bg-cn-red hover:text-white transition-all duration-300 border border-gray-100">
          -
        </button>
        <button @click="resetMap" class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-cn-black hover:bg-cn-red hover:text-white transition-all duration-300 border border-gray-100">
          ↻
        </button>
      </div>

      <!-- 右上角统计面板 -->
      <div class="absolute right-20 top-32 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 min-w-[180px] border border-gray-100">
        <h3 class="text-lg font-bold text-cn-black mb-3 font-serif">建筑统计</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">总计</span>
            <span class="font-bold text-cn-red">{{ allBuildings.length }}</span>
          </div>
          <div v-for="item in dynastyStats" :key="item.dynasty" class="flex justify-between items-center">
            <span class="text-xs text-gray-600 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: getDynastyColor(item.dynasty) }"></span>
              {{ item.dynasty }}
            </span>
            <span class="text-xs font-medium">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- 右下角筛选面板 -->
      <div class="absolute right-20 bottom-32 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-100 overflow-hidden">
        <div @click="filterExpanded = !filterExpanded" class="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors">
          <h3 class="text-lg font-bold text-cn-black font-serif m-0">朝代筛选</h3>
          <span class="text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': filterExpanded }">▼</span>
        </div>
        <transition name="filterExpand">
          <div v-if="filterExpanded" class="p-4 space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="selectedDynasty" value="all" class="accent-cn-red">
              <span class="text-sm">全部朝代</span>
            </label>
            <label v-for="dynasty in dynasties" :key="dynasty" class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="selectedDynasty" :value="dynasty" class="accent-cn-red">
              <span class="text-sm flex items-center gap-1">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: getDynastyColor(dynasty) }"></span>
                {{ dynasty }}
              </span>
            </label>
          </div>
        </transition>
      </div>

      <!-- 地图容器 -->
      <div id="map-container" class="w-full h-full"></div>

      <!-- 信息弹窗 -->
      <transition name="popup">
        <div v-if="currentBuilding" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 bg-white rounded-lg shadow-xl p-6 max-w-md w-[90%] border border-gray-100 border-t-4 border-t-cn-red">
          <div class="absolute -top-3 left-4 bg-cn-red text-white text-xs px-2 py-0.5 rounded">建筑详情</div>
          <div class="flex gap-4">
            <div class="w-24 h-24 rounded overflow-hidden flex-shrink-0 border-2 border-cn-red/10">
              <img :src="currentBuilding.images[0]" :alt="currentBuilding.name" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-cn-black mb-1 font-serif">{{ currentBuilding.name }}</h3>
              <div class="flex gap-2 mb-2">
                <span class="text-xs bg-cn-yellow/20 text-cn-yellow px-2 py-0.5 rounded">{{ currentBuilding.dynasty }}</span>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ currentBuilding.type }}</span>
                <span class="text-xs bg-cn-cyan/20 text-cn-cyan px-2 py-0.5 rounded">{{ currentBuilding.year }}</span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ currentBuilding.description }}</p>
              <div class="flex gap-2">
                <RouterLink :to="`/architecture/${currentBuilding.id}`" class="px-3 py-1.5 bg-cn-red text-white text-sm rounded hover:bg-cn-red/90 transition-colors flex items-center gap-1">
                  <span>🏛️</span>
                  查看详情
                </RouterLink>
                <button @click="closePopup" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition-colors">
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import GlobalMenu from '../components/GlobalMenu.vue'

const router = useRouter()
const map = ref(null)
const markers = ref([])
const currentBuilding = ref(null)
const allBuildings = ref([])
const selectedDynasty = ref(['all'])
const filterExpanded = ref(true)

// 朝代颜色配置
const dynastyColors = {
  '先秦': '#9D5C63',
  '秦': '#A23E48',
  '汉': '#E3655B',
  '三国两晋南北朝': '#FF9F1C',
  '隋': '#FFBF69',
  '唐': '#FFA62B',
  '五代十国': '#C16200',
  '宋': '#2EC4B6',
  '辽': '#0FA3B1',
  '金': '#7209B7',
  '元': '#4361EE',
  '明': '#3A0CA3',
  '清': '#F72585',
  '近代': '#4CC9F0',
  '现代': '#560BAD',
  '多个朝代修建': '#7209B7',
  '前秦至元': '#3A86FF',
  '吐蕃至清': '#FF6B6B',
  '宋至清': '#4ECDC4',
  '春秋至清': '#FFD166',
  '元至现代': '#6A0572',
  '北周至现代': '#AB83A1',
}

// 获取所有朝代列表
const dynasties = computed(() => {
  const list = [...new Set(allBuildings.value.map(b => b.dynasty))]
  return list.sort()
})

// 朝代统计
const dynastyStats = computed(() => {
  const stats = {}
  allBuildings.value.forEach(b => {
    stats[b.dynasty] = (stats[b.dynasty] || 0) + 1
  })
  return Object.entries(stats).map(([dynasty, count]) => ({ dynasty, count })).sort((a, b) => b.count - a.count)
})

// 获取朝代对应颜色
function getDynastyColor(dynasty) {
  return dynastyColors[dynasty] || '#E63946'
}

// 初始化地图
function initMap() {
  // 全局优化Canvas性能，消除willReadFrequently警告
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, options) {
    if (type === '2d') {
      options = { ...options, willReadFrequently: true };
    }
    return originalGetContext.call(this, type, options);
  };
  
  map.value = new AMap.Map('map-container', {
    zoom: 4.5,
    center: [104.195397, 35.86166], // 中国中心点坐标
    resizeEnable: true,
    mapStyle: 'amap://styles/grey', // 灰色风格更适配国风
    renderEngine: 'canvas',
    viewMode: '2D',
  })

  // 添加建筑标记点
  addMarkers()
}

// 生成标记点SVG
function getMarkerSvg(color) {
  return `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2C14.4772 2 10 6.47715 10 12C10 18 20 36 20 36C20 36 30 18 30 12C30 6.47715 25.5228 2 20 2Z" fill="${color}" stroke="white" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"/>
      <circle cx="20" cy="12" r="6" fill="white"/>
      <path d="M20 8 L20 16 M16 12 L24 12" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    </svg>
  `
}

// 添加所有建筑标记点
function addMarkers() {
  // 先清除现有标记
  markers.value.forEach(marker => map.value.remove(marker))
  markers.value = []

  // 过滤需要显示的建筑
  const buildingsToShow = selectedDynasty.value.includes('all')
    ? allBuildings.value
    : allBuildings.value.filter(b => selectedDynasty.value.includes(b.dynasty))

  buildingsToShow.forEach(building => {
    if (!building.longitude || !building.latitude) return

    const color = getDynastyColor(building.dynasty)
    const marker = new AMap.Marker({
      position: [building.longitude, building.latitude],
      title: building.name,
      icon: new AMap.Icon({
        size: new AMap.Size(40, 40),
        image: 'data:image/svg+xml;base64,' + btoa(getMarkerSvg(color)),
        imageSize: new AMap.Size(40, 40),
      }),
      anchor: 'bottom-center',
      offset: new AMap.Pixel(0, 0),
      cursor: 'pointer',
    })

    // 点击事件
    marker.on('click', () => {
      currentBuilding.value = building
    })

    // 悬浮显示弹跳效果
    marker.on('mouseover', () => {
      const markerDom = marker.getContentElement ? marker.getContentElement() : marker.getDom();
      if (markerDom) {
        markerDom.style.animation = 'markerBounce 1.5s ease infinite';
        setTimeout(() => markerDom.style.animation = '', 1500);
      }
    })

    markers.value.push(marker)
    map.value.add(marker)
  })
}

// 地图缩放控制
function zoomIn() {
  map.value.zoomIn()
}

function zoomOut() {
  map.value.zoomOut()
}

function resetMap() {
  map.value.setZoom(4.5)
  map.value.setCenter([104.195397, 35.86166])
  selectedDynasty.value = ['all']
  closePopup()
}

// 关闭弹窗
function closePopup() {
  currentBuilding.value = null
}

// 监听筛选变化
watch(selectedDynasty, () => {
  addMarkers()
}, { deep: true })

onMounted(async () => {
  try {
    const res = await fetch('data/buildings.json')
    allBuildings.value = await res.json()
    
    // 等待高德地图加载完成后初始化
    if (window.AMap) {
      initMap()
    } else {
      window.onAMapReady = initMap
    }
  } catch (e) {
    console.error('加载建筑数据失败', e)
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 100%;
}

/* 弹窗动画 */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
}

/* 标记点弹跳动画 */
@keyframes markerBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 筛选面板展开收起动画 */
.filterExpand-enter-active,
.filterExpand-leave-active {
  transition: all 0.3s ease;
  max-height: 400px;
  opacity: 1;
}
.filterExpand-enter-from,
.filterExpand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* 适配高德地图样式 */
:deep(.amap-logo) {
  display: none !important;
}

:deep(.amap-copyright) {
  display: none !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  h1 {
    font-size: 1.8rem !important;
  }

  p {
    font-size: 0.9rem !important;
  }

  .absolute.left-20 {
    left: 16px !important;
  }

  .absolute.right-20 {
    right: 16px !important;
  }

  .absolute.right-20.top-32 {
    top: 120px !important;
    min-width: 140px !important;
    padding: 12px !important;
  }

  .absolute.right-20.bottom-32 {
    bottom: 20px !important;
    left: 16px !important;
    right: 16px !important;
  }

  .space-y-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .fixed.bottom-8 {
    bottom: 20px !important;
    width: calc(100% - 32px) !important;
    padding: 16px !important;
  }

  .w-24.h-24 {
    width: 80px !important;
    height: 80px !important;
  }

  h3.text-xl {
    font-size: 1.1rem !important;
  }
}
</style>
