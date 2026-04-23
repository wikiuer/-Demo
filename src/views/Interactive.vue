<template>
  <div class="min-h-screen bg-gradient-to-br from-cn-yellow/5 via-cn-white to-cn-cyan/5 relative overflow-hidden">
    <!-- 云纹底纹 -->
    <svg class="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cloudPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25,10 Q40,0 50,10 Q60,0 75,10 Q85,20 75,30 Q85,40 75,50 Q60,60 50,50 Q40,60 25,50 Q15,40 25,30 Q15,20 25,10 Z" fill="currentColor" class="text-cn-black"/>
      </pattern>
      <rect x="0" y="0" width="100" height="100" fill="url(#cloudPattern)" />
    </svg>
    <GlobalMenu />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold mb-2 text-center text-cn-black font-serif">古建筑互动体验</h1>
      <p class="text-gray-600 text-center mb-8">探索中国古代建筑的奥秘</p>

      <!-- 功能选择卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div 
            v-for="feature in featureList" 
            :key="feature.id"
            @click="activeFeature = feature.id"
            class="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-6 border border-gray-100/50 hover:shadow-xl transition-all duration-500 cursor-pointer relative group overflow-hidden"
            :class="activeFeature === feature.id ? 'ring-[3px] ring-cn-red/70 shadow-xl bg-gradient-to-br from-white to-cn-red/10 relative after:content-[\'已选\'] after:absolute after:top-2 after:right-2 after:text-xs after:text-cn-red after:font-bold after:rotate-12 after:border-2 after:border-cn-red/70 after:px-2 after:py-0.5 after:rounded' : ''"
          >
            <!-- 边角回纹装饰 -->
            <svg class="absolute top-0 left-0 w-8 h-8 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H8V2H2V8H0V0Z" fill="currentColor"/>
              <path d="M4 4H6V6H4V4Z" fill="currentColor"/>
            </svg>
            <svg class="absolute top-0 right-0 w-8 h-8 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0H16V2H22V8H24V0Z" fill="currentColor"/>
              <path d="M20 4H18V6H20V4Z" fill="currentColor"/>
            </svg>
            <svg class="absolute bottom-0 left-0 w-8 h-8 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24H8V22H2V16H0V24Z" fill="currentColor"/>
              <path d="M4 20H6V18H4V20Z" fill="currentColor"/>
            </svg>
            <svg class="absolute bottom-0 right-0 w-8 h-8 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 24H16V22H22V16H24V24Z" fill="currentColor"/>
              <path d="M20 20H18V18H20V20Z" fill="currentColor"/>
            </svg>
            
            <!-- hover墨韵扩散效果 -->
            <div class="absolute inset-0 bg-cn-red/0 group-hover:bg-cn-red/8 transition-all duration-700 rounded-lg scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>
          
          <div class="text-4xl mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold text-cn-black mb-2 relative z-10 font-serif">{{ feature.title }}</h3>
          <p class="text-gray-600 text-sm relative z-10">{{ feature.description }}</p>
         <!-- 模块装饰线 -->
         <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cn-cyan to-transparent"></div>
         </div>
        </div>

        <!-- 功能内容区域 -->
        <transition name="fade-scale" mode="out-in">
          <div :key="activeFeature" class="bg-white/70 backdrop-blur-md rounded-lg shadow-md p-6 border border-gray-100/50 min-h-[400px] relative overflow-hidden">
            <!-- 模块顶部主题渐变装饰条 -->
            <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r" 
              :class="{
                'from-cn-red via-cn-red/70 to-transparent': activeFeature === 'preview3d',
                'from-cn-yellow via-cn-yellow/70 to-transparent': activeFeature === 'quiz',
                'from-cn-cyan via-cn-cyan/70 to-transparent': activeFeature === 'panorama'
              }"
            ></div>

            <!-- 3D预览内容 -->
            <div v-if="activeFeature === 'preview3d'" class="pt-4">
              <h2 class="text-2xl font-bold text-cn-black mb-6 font-serif">3D建筑悬浮预览</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="building in allBuildings" 
                  :key="building.id"
                  @mouseenter="show3dPreviewOnHover(building, $event)"
                  @mouseleave="hide3dPreview"
                  class="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div class="w-full h-40 rounded overflow-hidden mb-3">
                    <img :src="building.images[0]" :alt="building.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" @error="handleImageError($event)">
                  </div>
                  <h3 class="text-lg font-bold text-cn-black mb-1">{{ building.name }}</h3>
                  <p class="text-sm text-gray-600">{{ building.dynasty }}</p>
                </div>
              </div>

              <!-- 3D预览悬浮层 -->
              <div v-if="show3dPreview" class="fixed z-[1000] bg-white/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-100 p-3 w-72" :style="{ left: `${previewPosition.x}px`, top: `${previewPosition.y}px` }" ref="preview3dContainer">
                <div class="w-full h-56 rounded overflow-hidden bg-gray-50" ref="preview3dCanvas"></div>
                <p class="text-center mt-2 text-sm font-medium text-cn-black">{{ preview3dBuilding?.name }}</p>
              </div>
            </div>

            <!-- 知识测验内容 -->
            <div v-if="activeFeature === 'quiz'" class="pt-4">
              <h2 class="text-2xl font-bold text-cn-black mb-6 font-serif">古建筑知识测验</h2>
              <div v-if="!showQuiz" class="text-center py-12">
                <p class="text-gray-600 mb-6">测试你对中国古代建筑知识的了解程度</p>
                <button @click="startQuiz" class="px-6 py-3 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient">
                  开始测验
                </button>
              </div>

              <div v-if="showQuiz && !showResult" class="max-w-2xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                  <span class="text-sm text-gray-600">第 {{ quizIndex + 1 }} 题 / 共 {{ quizQuestions.length }} 题</span>
                  <span class="text-sm font-medium text-cn-red">得分: {{ score }}</span>
                </div>
                <div class="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <h3 class="text-xl font-bold text-cn-black mb-4">{{ currentQuestion.question }}</h3>
                  <div class="space-y-3">
                    <button 
                      v-for="(option, index) in currentQuestion.options" 
                      :key="index"
                      @click="selectAnswer(index)"
                      class="w-full text-left p-4 rounded-lg border transition-all"
                      :class="getAnswerClass(index)"
                    >
                      {{ option }}
                    </button>
                  </div>
                </div>
                <div class="flex justify-end">
                  <button 
                    @click="nextQuestion"
                    :disabled="!answered"
                    class="px-6 py-3 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all disabled:bg-gray-300 btn-ancient"
                  >
                    {{ quizIndex < quizQuestions.length - 1 ? '下一题' : '查看结果' }}
                  </button>
                </div>
              </div>

              <div v-if="showResult" class="max-w-md mx-auto text-center py-12">
                <div class="text-5xl mb-4">🎉</div>
                <h3 class="text-2xl font-bold text-cn-black mb-2">测验完成!</h3>
                <p class="text-gray-600 mb-6">你的得分是: {{ score }} / {{ quizQuestions.length }}</p>
                <button @click="resetQuiz" class="px-6 py-3 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient">
                  重新测验
                </button>
              </div>
            </div>

            <!-- 全景浏览内容 -->
            <div v-if="activeFeature === 'panorama'" class="pt-4">
              <h2 class="text-2xl font-bold text-cn-black mb-6 font-serif">360°全景浏览</h2>
              <p class="text-gray-600 mb-6">选择建筑进行全景浏览</p>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="building in allBuildings" 
                  :key="building.id"
                  @click="openPanorama(building)"
                  class="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div class="w-full h-40 rounded overflow-hidden mb-3 relative">
                    <img :src="building.images[0]" :alt="building.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" @error="handleImageError($event)">
                    <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="text-white px-3 py-1 rounded-full bg-cn-red/70 backdrop-blur-sm text-sm">点击查看全景</span>
                    </div>
                  </div>
                  <h3 class="text-lg font-bold text-cn-black mb-1">{{ building.name }}</h3>
                  <p class="text-sm text-gray-600">{{ building.dynasty }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 全景浏览弹窗 -->
      <div v-if="showPanorama" class="fixed inset-0 bg-black z-50">
         <div class="absolute top-4 right-4 z-10 flex gap-2">
           <button @click="closePanorama" class="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded hover:bg-white/30 transition-all btn-ancient">× 关闭</button>
         </div>
        <div 
          class="w-full h-full cursor-grab active:cursor-grabbing" 
          @mousedown="startDrag" 
          @mousemove="onDrag" 
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="stopDrag"
        >
                    <img 
                      :src="currentPanorama?.images[0]" 
                      class="w-full h-full object-cover select-none"
                      :style="{ transform: `translateX(${panoramaOffset}px)`, transition: isDragging ? 'none' : 'transform 0.1s' }"
                      draggable="false"
                      @error="handleImageError($event)"
                    >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import GlobalMenu from '../components/GlobalMenu.vue'

// 高德地图API配置，替换为自己的API Key
const GAODE_API_KEY = '6009c9a659c5161d3d41e03faccc64a7'
let AMap = null

const router = useRouter()

const allBuildings = ref([])
const activeFeature = ref('preview3d')

const featureList = [
  { id: 'preview3d', icon: '🎯', title: '3D悬浮预览', description: '鼠标悬停查看建筑3D模型' },
  { id: 'quiz', icon: '🧠', title: '知识测验', description: '测试你的古建筑知识' },
  { id: 'panorama', icon: '🌍', title: '全景浏览', description: '360度全景查看建筑' }
]

const dynasties = [
  { id: 'qin', name: '秦朝' },
  { id: 'han', name: '汉朝' },
  { id: 'three-kingdoms', name: '三国' },
  { id: 'sui', name: '隋朝' },
  { id: 'tang', name: '唐朝' },
  { id: 'song', name: '宋朝' },
  { id: 'yuan', name: '元朝' },
  { id: 'ming', name: '明朝' },
  { id: 'qing', name: '清朝' }
]

const activeDynasty = ref('qin')

// 3D预览（高德地图版）
const show3dPreview = ref(false)
const preview3dContainer = ref(null)
const preview3dCanvas = ref(null)
const preview3dBuilding = ref(null)
const previewPosition = ref({ x: 0, y: 0 })
let gaodeMap = null

function show3dPreviewOnHover(building, event) {
  preview3dBuilding.value = building
  const rect = event.currentTarget.getBoundingClientRect() // 获取当前卡片元素位置
  const previewWidth = 288
  const previewHeight = 280
  let x, y
  // 判断卡片是否在视口中间位置（左右都有足够空间放置悬浮窗）
  const leftSpaceEnough = rect.left >= previewWidth + 20
  const rightSpaceEnough = window.innerWidth - rect.right >= previewWidth + 20
  
  if (leftSpaceEnough && rightSpaceEnough) {
    // 中间位置：悬浮窗居中显示在卡片下方
    x = rect.left + (rect.width - previewWidth) / 2
    // 优先显示在卡片下方，空间不足则显示在上方
    if (rect.bottom + 20 + previewHeight < window.innerHeight) {
      y = rect.bottom + 20
    } else {
      y = rect.top - previewHeight - 20
    }
  } else {
    // 非中间位置：优先右侧，不足则左侧
    if (rightSpaceEnough) {
      x = rect.right + 20
    } else {
      x = rect.left - previewWidth - 20
    }
    // 垂直方向与卡片顶部对齐
    y = rect.top
    if (y + previewHeight > window.innerHeight) {
      y = window.innerHeight - previewHeight - 20
    }
  }
  // 最终边界校验，确保完全在视口内
  x = Math.max(20, Math.min(x, window.innerWidth - previewWidth - 20))
  y = Math.max(20, y)
  previewPosition.value = { x, y }
  show3dPreview.value = true
  nextTick(() => initGaodeMap())
}

function hide3dPreview() {
  show3dPreview.value = false
  destroyGaodeMap()
}

async function initGaodeMap() {
  if (!preview3dCanvas.value || !preview3dBuilding.value) return
  destroyGaodeMap()

  // 动态加载高德地图API
  if (!AMap) {
    try {
      await loadGaodeApi()
    } catch (e) {
      console.error('高德地图加载失败', e)
      preview3dCanvas.value.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">地图加载失败</div>'
      return
    }
  }

  const { longitude, latitude } = preview3dBuilding.value
  
  // 初始化3D地图
gaodeMap = new AMap.Map(preview3dCanvas.value, {
  center: [longitude, latitude],
  zoom: 17,
  viewMode: '3D',
  pitch: 60,
  rotation: 45,
  resizeEnable: false,
  controls: []
})

  // 添加建筑3D图层
  gaodeMap.add(new AMap.Buildings({
    zooms: [16, 20],
    heightFactor: 2,
    merge: true
  }))

  // 添加标记点
  const marker = new AMap.Marker({
    position: [longitude, latitude],
    icon: new AMap.Icon({
      size: new AMap.Size(32, 32),
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iI2M0MWUzYSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjQiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
    })
  })
  gaodeMap.add(marker)

  // 自动旋转动画
  let rotation = 45
  const rotateTimer = setInterval(() => {
    if (!gaodeMap) {
      clearInterval(rotateTimer)
      return
    }
    rotation += 0.5
    gaodeMap.setRotation(rotation)
  }, 50)
  // 保存定时器id，销毁时清除
  gaodeMap.rotateTimer = rotateTimer
}

// 加载高德地图API
function loadGaodeApi() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      AMap = window.AMap
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${GAODE_API_KEY}&plugin=AMap.Buildings`
    script.async = true
    script.onload = () => {
      AMap = window.AMap
      resolve()
    }
    script.onerror = reject
    document.body.appendChild(script)
  })
}

function destroyGaodeMap() {
  if (gaodeMap) {
    if (gaodeMap.rotateTimer) {
      clearInterval(gaodeMap.rotateTimer)
    }
    gaodeMap.destroy()
    gaodeMap = null
  }
  if (preview3dCanvas.value) {
    preview3dCanvas.value.innerHTML = ''
  }
}

// 知识测验
const quizQuestions = [
  { question: '中国现存最早的砖塔是？', options: ['应县木塔', '嵩岳寺塔', '赵州桥', '悬空寺'], answer: 1 },
  { question: '都江堰是哪个朝代修建的？', options: ['秦朝', '汉朝', '隋朝', '唐朝'], answer: 0 },
  { question: '以下哪个建筑是跨朝代修建的？', options: ['故宫', '赵州桥', '都江堰', '应县木塔'], answer: 0 },
  { question: '《营造法式》是哪个朝代颁布的？', options: ['唐朝', '宋朝', '元朝', '明朝'], answer: 1 },
  { question: '福建土楼的主要建筑材料是？', options: ['木材', '石头', '夯土', '砖'], answer: 2 }
]

const showQuiz = ref(false)
const quizIndex = ref(0)
const selectedAnswer = ref(null)
const answered = ref(false)
const score = ref(0)
const showResult = ref(false)

const currentQuestion = computed(() => quizQuestions[quizIndex.value])
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value?.answer)

function startQuiz() {
  showQuiz.value = true
  quizIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  score.value = 0
  showResult.value = false
}

function selectAnswer(index) {
  if (answered.value) return
  selectedAnswer.value = index
  answered.value = true
  if (index === currentQuestion.value.answer) {
    score.value++
  }
}

function getAnswerClass(index) {
  if (!answered.value) return 'border-gray-200 hover:border-cn-red hover:bg-cn-red/5'
  if (index === currentQuestion.value.answer) return 'border-green-500 bg-green-50'
  if (index === selectedAnswer.value) return 'border-red-500 bg-red-50'
  return 'border-gray-200 opacity-50'
}

function nextQuestion() {
  if (quizIndex.value < quizQuestions.length - 1) {
    quizIndex.value++
    selectedAnswer.value = null
    answered.value = false
  } else {
    showResult.value = true
  }
}

function resetQuiz() {
  showQuiz.value = false
  showResult.value = false
}

// 全景浏览
const showPanorama = ref(false)
const currentPanorama = ref(null)
const panoramaOffset = ref(0)
let isDragging = false
let startX = 0

function goToBuilding(id) {
  router.push(`/architecture/${id}`)
}

function openPanorama(building) {
  currentPanorama.value = building
  panoramaOffset.value = 0
  showPanorama.value = true
}

function closePanorama() {
  showPanorama.value = false
}

function startDrag(e) {
  isDragging = true
  startX = (e.clientX || e.touches?.[0]?.clientX) - panoramaOffset.value
}

function onDrag(e) {
  if (!isDragging) return
  const x = e.clientX || e.touches?.[0]?.clientX
  panoramaOffset.value = x - startX
}

function stopDrag() {
  isDragging = false
}

// 图片加载失败处理
function handleImageError(e) {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm73niYflj4bniYg8L3RleHQ+PC9zdmc+'
}

onMounted(async () => {
  try {
    const res = await fetch('data/buildings.json')
    allBuildings.value = await res.json()
  } catch (e) {
    console.error('加载建筑数据失败', e)
  }
})

onUnmounted(() => {
  destroyGaodeMap()
})
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

/* 按钮古风样式 */
.btn-ancient {
  position: relative;
  overflow: hidden;
}
.btn-ancient::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}
.btn-ancient:hover::before {
  left: 100%;
}
</style>