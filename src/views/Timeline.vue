<template>
  <div class="min-h-screen bg-cn-white">
    <GlobalMenu />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold mb-2 text-center text-cn-black font-serif">中国古代建筑发展时间轴</h1>
      <p class="text-gray-600 text-center mb-8">跨越千年的建筑智慧发展历程</p>

      <!-- 左侧长城导航 -->
      <div class="hidden md:block fixed left-8 top-1/2 -translate-y-1/2 z-30">
        <div class="relative py-8">
          <!-- 长城城墙背景 -->
          <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-6 bg-gradient-to-b from-gray-100 to-gray-300 rounded-md shadow-inner">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gray-400 rounded-t-md"></div>
            <div class="absolute -top-2 left-1 w-2 h-2 bg-gray-400 rounded-tl-sm"></div>
            <div class="absolute -top-2 right-1 w-2 h-2 bg-gray-400 rounded-tr-sm"></div>
            <div class="space-y-4 mt-2">
              <div v-for="i in 20" :key="i" class="h-1 bg-gray-400 w-1/2 mx-auto rounded-sm opacity-30"></div>
            </div>
          </div>
          
          <!-- 长城城台节点 -->
          <div class="space-y-8 relative z-10">
            <div
              v-for="dynasty in dynasties"
              :key="dynasty.id"
              @click="scrollToDynasty(dynasty.id)"
              class="relative cursor-pointer group"
            >
              <div
                class="w-10 h-8 bg-gradient-to-b from-gray-100 to-gray-300 border-2 border-gray-500 transition-all duration-300 relative rounded-sm shadow-md"
                :class="[
                  activeDynasty === dynasty.id ? 'border-cn-red from-cn-red to-cn-red/80 shadow-lg scale-125' : 'hover:border-cn-red hover:scale-110',
                  ['qin', 'han', 'three-kingdoms', 'sui', 'tang', 'song', 'yuan', 'ming'].includes(dynasty.id) ? 'after:content-[\'\'] after:absolute after:-right-2 after:top-1/2 after:-translate-y-1/2 after:w-3 after:h-4 after:bg-gray-400 after:rounded-r-sm after:border-r-2 after:border-r-gray-500' : ''
                ]"
              >
                <div class="absolute top-0 left-0 right-0 h-2 bg-gray-400 rounded-t-sm border-b border-gray-500"></div>
                <div class="absolute -top-2 left-0 w-2 h-2 bg-gray-400 rounded-tl-sm border-t border-l border-gray-500"></div>
                <div class="absolute -top-2 right-0 w-2 h-2 bg-gray-400 rounded-tr-sm border-t border-r border-gray-500"></div>
                <div v-if="['qin', 'han', 'three-kingdoms', 'sui', 'tang', 'song', 'yuan', 'ming'].includes(dynasty.id)" class="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-4 bg-gray-400 rounded-l-sm border-l-2 border-l-gray-500"></div>
                <div v-if="activeDynasty === dynasty.id" class="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">•</div>
              </div>
              <div class="absolute left-16 top-1/2 -translate-y-1/2 bg-white shadow-lg px-3 py-1.5 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-gray-100">
                {{ dynasty.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷朝代导航 -->
      <div class="flex flex-wrap justify-center gap-2 mb-12 sticky top-0 bg-cn-white/90 backdrop-blur-sm py-4 z-20 border-b border-gray-100" role="navigation" aria-label="朝代快速导航">
        <button
          v-for="dynasty in dynasties"
          :key="dynasty.id"
          @click="scrollToDynasty(dynasty.id)"
          @keydown.enter="scrollToDynasty(dynasty.id)"
          class="px-3 py-1.5 rounded-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cn-red focus:ring-offset-2"
          :class="activeDynasty === dynasty.id ? 'bg-cn-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          :aria-current="activeDynasty === dynasty.id ? 'true' : undefined"
        >
          {{ dynasty.name }}
        </button>
      </div>

      <!-- 时间轴主体 -->
      <div class="relative">
        <!-- 时间轴线 -->
        <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cn-red via-cn-yellow to-cn-cyan rounded-full"></div>

        <!-- 朝代节点 -->
        <div class="space-y-16">
          <div
            v-for="(dynasty, index) in dynasties"
            :key="dynasty.id"
            :ref="el => setDynastyRef(dynasty.id, el)"
            class="relative"
          >
            <!-- 时间点 -->
            <div class="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-cn-red z-10 shadow-lg"></div>

            <!-- 朝代内容卡片 -->
            <div :class="index % 2 === 0 ? 'ml-auto mr-[52%]' : 'mr-auto ml-[52%]'" class="w-[calc(50%-32px)]">
              <div
                class="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                @click="toggleDynasty(dynasty.id)"
              >
                <div class="flex justify-between items-start mb-3">
                  <h2 class="text-2xl font-bold text-cn-black font-serif">{{ dynasty.name }}</h2>
                  <span class="px-3 py-1 bg-cn-yellow/20 text-cn-yellow rounded-full text-sm">{{ dynasty.period }}</span>
                </div>
                <p class="text-gray-700 mb-4">{{ dynasty.description }}</p>
                
                <!-- 技术亮点 -->
                <div class="mb-4" v-if="dynasty.milestones.length > 0">
                  <h3 class="text-sm font-semibold text-gray-700 mb-2">技术里程碑</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(milestone, mIndex) in dynasty.milestones"
                      :key="mIndex"
                      class="px-2 py-1 bg-cn-cyan/10 text-cn-cyan text-xs rounded"
                    >
                      {{ milestone }}
                    </span>
                  </div>
                </div>

                <!-- 展开/收起按钮 -->
                <div class="flex justify-between items-center">
                  <span class="text-sm text-cn-red font-medium">
                    {{ dynasty.buildings.length }}个代表性建筑
                  </span>
                  <span class="text-gray-400 group-hover:text-cn-red transition-colors">
                    {{ expandedDynasty === dynasty.id ? '收起 ↑' : '展开 ↓' }}
                  </span>
                </div>
              </div>

              <!-- 展开的建筑列表 -->
              <div
                v-show="expandedDynasty === dynasty.id"
                class="mt-4 grid grid-cols-1 gap-3"
                ref="expandRef"
              >
                <div
                  v-for="buildingId in dynasty.buildings"
                  :key="buildingId"
                  class="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
                  @click="goToBuilding(buildingId)"
                  @mouseenter="features.preview3d.enabled && isDesktop && show3dPreviewOnHover(buildingId, $event)"
                  @mouseleave="features.preview3d.enabled && isDesktop && hide3dPreview()"
                >
                  <div class="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      :src="getBuildingById(buildingId)?.images[0]"
                      :alt="getBuildingById(buildingId)?.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-cn-black mb-0.5">{{ getBuildingById(buildingId)?.name }}</h3>
                    <div class="flex gap-2">
                      <span class="text-xs text-gray-500">{{ getBuildingById(buildingId)?.type }}</span>
                      <span class="text-xs text-cn-yellow">{{ getBuildingById(buildingId)?.year }}</span>
                      <span v-if="getBuildingById(buildingId)?.dynasty?.split(/、|,/).length > 1" class="text-xs bg-cn-cyan/10 text-cn-cyan px-1 rounded">跨朝代建筑</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="features.panorama.enabled"
                      @click.stop="openPanorama(buildingId)"
                      class="text-xs px-2 py-1 bg-cn-cyan/10 text-cn-cyan rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      查看全景
                    </button>
                    <span class="text-gray-400 group-hover:text-cn-red transition-colors">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import GlobalMenu from '../components/GlobalMenu.vue'

const router = useRouter()
const allBuildings = ref([])
const expandedDynasty = ref(null)
const activeDynasty = ref('qin')
const dynastyRefs = ref({})
const expandRef = ref(null)

// 功能配置
const features = ref({
  preview3d: { enabled: false },
  panorama: { enabled: false }
})

// 判断是否为桌面端
const isDesktop = ref(window.innerWidth >= 768)

// 3D预览相关空实现
function show3dPreviewOnHover() {}
function hide3dPreview() {}
function openPanorama() {}

// 朝代数据
const dynasties = [
  {
    id: 'qin',
    name: '秦朝',
    period: '公元前221年-公元前207年',
    description: '中国历史上第一个大一统王朝，建筑风格恢弘大气，以大型工程建设为主要特征，奠定了中国古代建筑的基本规制。',
    milestones: ['夯土技术成熟', '大型水利工程建设', '城市规划体系形成'],
    buildings: ['dujiangyan', 'epang-palace']
  },
  {
    id: 'han',
    name: '汉朝',
    period: '公元前202年-公元220年',
    description: '建筑技术进一步发展，木构建筑体系逐渐成熟，斗拱技术开始广泛应用，楼阁建筑大量出现。',
    milestones: ['木构建筑体系成型', '斗拱技术普及', '砖石建筑发展'],
    buildings: ['weiyang-palace']
  },
  {
    id: 'three-kingdoms',
    name: '三国两晋南北朝',
    period: '公元220年-公元589年',
    description: '佛教建筑兴盛，石窟、佛塔、寺庙大量修建，建筑装饰艺术得到极大发展。',
    milestones: ['佛教建筑兴起', '石窟艺术繁荣', '琉璃工艺应用'],
    buildings: ['hanging-temple', 'songyue-pagoda', 'mogao-grottoes', 'yungang-grottoes', 'nanxiangtang-grottoes', 'foguang-temple-pagoda', 'guanque-tower']
  },
  {
    id: 'sui',
    name: '隋朝',
    period: '公元581年-公元618年',
    description: '建筑技术取得重大突破，桥梁建造技术达到世界领先水平，城市规划更加科学合理。',
    milestones: ['敞肩拱桥梁技术发明', '大运河工程建设', '都城规划体系完善'],
    buildings: ['zhaozhou-bridge']
  },
  {
    id: 'tang',
    name: '唐朝',
    period: '公元618年-公元907年',
    description: '中国古代建筑的鼎盛时期，建筑规模宏大，气势磅礴，造型庄重优美，技术与艺术完美结合。',
    milestones: ['斗拱技术成熟', '琉璃瓦广泛使用', '建筑标准化体系建立'],
    buildings: ['mogao-grottoes', 'potala-palace', 'nanchan-temple', 'small-wild-goose-pagoda']
  },
  {
    id: 'song',
    name: '宋朝',
    period: '公元960年-公元1279年',
    description: '建筑风格趋向精致细腻，园林建筑高度发展，《营造法式》颁布标志着建筑技术的系统化规范化。',
    milestones: ['《营造法式》颁布', '园林艺术鼎盛', '建筑装饰精细化'],
    buildings: ['yingxian-wooden-pagoda', 'jin-temple', 'qingjing-temple', 'mogao-grottoes', 'baoguo-temple', 'wanan-bridge']
  },
  {
    id: 'yuan',
    name: '元朝',
    period: '公元1271年-公元1368年',
    description: '多民族建筑风格融合，藏传佛教建筑传入内地，城市建设规模宏大。',
    milestones: ['藏传佛教建筑传入', '大都城建设', '多民族建筑风格融合'],
    buildings: ['mogao-grottoes', 'fujian-tulou', 'yongle-palace']
  },
  {
    id: 'ming',
    name: '明朝',
    period: '公元1368年-公元1644年',
    description: '建筑技术进一步发展，官式建筑高度标准化，大规模修建长城、宫殿、皇家园林。',
    milestones: ['明长城修建', '官式建筑标准化', '无梁殿技术出现'],
    buildings: ['forbidden-city', 'great-wall', 'fujian-tulou', 'suzhou-gardens', 'confucius-temple']
  },
  {
    id: 'qing',
    name: '清朝',
    period: '公元1636年-公元1912年',
    description: '中国古代建筑的集大成时期，皇家园林建造达到顶峰，建筑工艺精湛，装饰华丽繁复。',
    milestones: ['皇家园林艺术顶峰', '样式雷建筑家族', '建筑装饰工艺极致'],
    buildings: ['summer-palace', 'potala-palace', 'fujian-tulou', 'suzhou-gardens', 'confucius-temple', 'huangcheng-prime-minister-residence', 'yonghe-lamasery']
  }
]

function setDynastyRef(id, el) {
  if (el) {
    dynastyRefs.value[id] = el
  }
}

function toggleDynasty(id) {
  if (expandedDynasty.value === id) {
    // 收起动画
    if (expandRef.value) {
      gsap.to(expandRef.value, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          expandedDynasty.value = null
        }
      })
    }
  } else {
    expandedDynasty.value = id
    // 展开动画
    nextTick(() => {
      if (expandRef.value) {
        gsap.fromTo(expandRef.value,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3 }
        )
      }
    })
  }
}

function scrollToDynasty(id) {
  if (dynastyRefs.value[id]) {
    dynastyRefs.value[id].scrollIntoView({ behavior: 'smooth', block: 'center' })
    activeDynasty.value = id
  }
}

function getBuildingById(id) {
  return allBuildings.value.find(b => b.id === id)
}

function goToBuilding(id) {
  router.push(`/architecture/${id}`)
}

// 滚动事件处理
function handleScroll() {
  const scrollPosition = window.scrollY + window.innerHeight / 2
  
  for (let i = dynasties.length - 1; i >= 0; i--) {
    const dynasty = dynasties[i]
    const element = dynastyRefs.value[dynasty.id]
    if (!element) continue
    
    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + window.scrollY
    
    if (scrollPosition >= elementTop) {
      activeDynasty.value = dynasty.id
      break
    }
  }
}

// 窗口大小变化处理
function handleResize() {
  isDesktop.value = window.innerWidth >= 768
}

onMounted(async () => {
  try {
    const res = await fetch('data/buildings.json')
    allBuildings.value = await res.json()
  } catch (e) {
    console.error('加载建筑数据失败', e)
  }
  
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@media (max-width: 768px) {
  .absolute.left-1\/2 {
    left: 20px !important;
    transform: none !important;
  }
  
  .absolute.left-1\/2.w-6 {
    left: 12px !important;
    transform: none !important;
  }
  
  .w-\[calc\(50\%-32px\)\] {
    width: calc(100% - 60px) !important;
    margin-left: 48px !important;
    margin-right: 0 !important;
  }
}
</style>
