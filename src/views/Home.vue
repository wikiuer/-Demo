<template>
  <div class="bg-cn-white" ref="homeRoot">
    <GlobalMenu />
    <!-- 全屏轮播区域 -->
    <div class="relative min-h-screen overflow-hidden section">
      <div 
        v-for="(building, index) in carouselBuildings" 
        :key="building.id"
        class="absolute inset-0 transition-opacity duration-700"
        :class="{ 'opacity-100 z-10': currentSlide === index, 'opacity-0 z-0': currentSlide !== index }"
      >
        <img 
          :src="building.images[0]" 
          :alt="building.name"
          class="w-full h-full object-cover"
        />
        <!-- 渐变蒙版 -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
        <!-- 文字内容 -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-20 w-full max-w-4xl px-6">
          <div class="text-lg md:text-xl text-cn-yellow font-medium mb-3 tracking-widest uppercase">
            {{ building.dynasty }}
          </div>
          <h1 class="text-5xl md:text-7xl font-bold mb-6 font-serif drop-shadow-lg">
            {{ building.name }}
          </h1>
          <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
            {{ building.description }}
          </p>
          <router-link 
            :to="`/architecture/${building.id}`" 
            class="px-8 py-3 rounded-md bg-cn-red/90 text-white hover:bg-cn-red font-medium inline-block transition-all duration-300 backdrop-blur-sm border border-cn-red/30 hover:scale-105"
          >
            了解详情
          </router-link>
        </div>
      </div>

      <!-- 轮播控制按钮 -->
      <button 
        @click="prevSlide"
        class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 backdrop-blur-sm z-30 flex items-center justify-center"
      >
        ←
      </button>
      <button 
        @click="nextSlide"
        class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300 backdrop-blur-sm z-30 flex items-center justify-center"
      >
        →
      </button>

      <!-- 轮播指示器 -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        <button
          v-for="(building, index) in carouselBuildings"
          :key="building.id"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="{ 'bg-cn-red w-10': currentSlide === index, 'bg-white/50 hover:bg-white/80': currentSlide !== index }"
        ></button>
      </div>

      <!-- 传统装饰元素 -->
      <div class="absolute top-10 right-10 w-32 h-32 opacity-10 z-20 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" class="text-cn-yellow">
          <path d="M50,0 L100,50 L50,100 L0,50 Z M50,20 L80,50 L50,80 L20,50 Z" />
        </svg>
      </div>
      <div class="absolute bottom-10 left-10 w-24 h-24 opacity-10 z-20 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor" class="text-cn-red">
          <path d="M10,10 H90 V90 H10 Z M20,20 H80 V80 H20 Z" />
        </svg>
      </div>

      <!-- 下滑提示 -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm opacity-70 animate-bounce z-30">
        下滑了解更多 ↓
      </div>
    </div>

    <!-- 网站介绍板块 -->
    <div class="h-screen relative w-full section overflow-hidden" ref="introSection">
      <!-- 顶部主题色装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cn-yellow via-cn-yellow/70 to-transparent z-20"></div>
      
      <!-- 标题区域（悬浮在板块上方） -->
      <div class="absolute top-24 left-1/2 -translate-x-1/2 text-center z-20 w-full px-6">
        <div class="w-20 h-1 bg-white mx-auto mb-6"></div>
        <h2 class="text-5xl font-bold mb-4 text-white font-serif drop-shadow-2xl">关于我们</h2>
        <p class="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
          致力于传承和弘扬中国古代建筑文化，让更多人了解中华建筑的独特魅力与匠艺智慧
        </p>
      </div>

      <!-- 全屏倾斜分割板块 -->
      <div class="flex flex-col md:flex-row gap-0 h-full w-full">
          <!-- 第一个板块：建筑资料库 -->
          <div class="flex-1 group relative overflow-hidden transform transition-all duration-700 hover:flex-[1.3] skew-x-[-5deg] origin-bottom-left ml-[-4%]">
            <div class="absolute inset-0 transform skew-x-[5deg] scale-110 origin-center transition-transform duration-700 group-hover:scale-125">
              <img src="https://picsum.photos/id/1018/1200/1600" alt="建筑资料库" class="w-full h-full object-cover">
              <!-- 国风渐变蒙版 -->
              <div class="absolute inset-0 bg-gradient-to-t from-cn-red/90 via-cn-red/60 to-transparent opacity-95"></div>
            </div>
            <!-- 内容区域 -->
            <div class="absolute inset-0 transform skew-x-[5deg] p-12 flex flex-col justify-end z-10">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                🏛️
              </div>
              <h3 class="text-4xl font-bold mb-6 text-white font-serif drop-shadow-lg group-hover:translate-y-[-5px] transition-transform duration-300">建筑资料库</h3>
              <p class="text-white/90 text-lg leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                收录了从先秦到明清各个朝代的代表性建筑，详细介绍建筑历史、结构特点、文化价值
              </p>
              <!-- 传统装饰线条 -->
              <div class="w-0 h-1 bg-cn-yellow mt-6 group-hover:w-20 transition-all duration-500"></div>
            </div>
          </div>

          <!-- 第二个板块：发展时间轴 -->
          <div class="flex-1 group relative overflow-hidden transform transition-all duration-700 hover:flex-[1.3] skew-x-[-5deg] origin-bottom">
            <div class="absolute inset-0 transform skew-x-[5deg] scale-110 origin-center transition-transform duration-700 group-hover:scale-125">
              <img src="https://picsum.photos/id/1019/1200/1600" alt="发展时间轴" class="w-full h-full object-cover">
              <!-- 国风渐变蒙版 -->
              <div class="absolute inset-0 bg-gradient-to-t from-cn-yellow/90 via-cn-yellow/60 to-transparent opacity-95"></div>
            </div>
            <!-- 内容区域 -->
            <div class="absolute inset-0 transform skew-x-[5deg] p-12 flex flex-col justify-end z-10">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                📜
              </div>
              <h3 class="text-4xl font-bold mb-6 text-white font-serif drop-shadow-lg group-hover:translate-y-[-5px] transition-transform duration-300">发展时间轴</h3>
              <p class="text-white/90 text-lg leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                按时间顺序梳理中国古代建筑的发展脉络，展现不同朝代的建筑风格演变与技术突破
              </p>
              <!-- 传统装饰线条 -->
              <div class="w-0 h-1 bg-cn-red mt-6 group-hover:w-20 transition-all duration-500"></div>
            </div>
          </div>

          <!-- 第三个板块：互动体验 -->
          <div class="flex-1 group relative overflow-hidden transform transition-all duration-700 hover:flex-[1.3] skew-x-[-5deg] origin-bottom-right mr-[-4%]">
            <div class="absolute inset-0 transform skew-x-[5deg] scale-110 origin-center transition-transform duration-700 group-hover:scale-125">
              <img src="https://picsum.photos/id/1036/1200/1600" alt="互动体验" class="w-full h-full object-cover">
              <!-- 国风渐变蒙版 -->
              <div class="absolute inset-0 bg-gradient-to-t from-cn-cyan/90 via-cn-cyan/60 to-transparent opacity-95"></div>
            </div>
            <!-- 内容区域 -->
            <div class="absolute inset-0 transform skew-x-[5deg] p-12 flex flex-col justify-end z-10">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                🎮
              </div>
              <h3 class="text-4xl font-bold mb-6 text-white font-serif drop-shadow-lg group-hover:translate-y-[-5px] transition-transform duration-300">互动体验</h3>
              <p class="text-white/90 text-lg leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                通过3D模型、动画演示、知识问答等互动方式，深入了解古建筑的结构原理与建造工艺
              </p>
              <!-- 传统装饰线条 -->
              <div class="w-0 h-1 bg-cn-yellow mt-6 group-hover:w-20 transition-all duration-500"></div>
            </div>
          </div>
        </div>
    </div>

    <!-- 页脚 -->
    <footer class="bg-cn-black text-white py-12 section" ref="entrySection">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <router-link :to="/architecture/" class="group flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-cn-red/20 rounded-full flex items-center justify-center mb-4 text-cn-red text-2xl group-hover:scale-110 transition-transform duration-300">
              🏛️
            </div>
            <h3 class="text-xl font-bold mb-2 font-serif">建筑库</h3>
            <p class="text-white/70 text-sm mb-3">浏览中国古代建筑典藏</p>
            <span class="text-cn-red group-hover:translate-x-1 transition-transform duration-300 text-sm">
              开始探索 →
            </span>
          </router-link>
          <router-link :to="/timeline/" class="group flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-cn-yellow/20 rounded-full flex items-center justify-center mb-4 text-cn-yellow text-2xl group-hover:scale-110 transition-transform duration-300">
              📜
            </div>
            <h3 class="text-xl font-bold mb-2 font-serif">时间轴</h3>
            <p class="text-white/70 text-sm mb-3">穿越千年建筑发展历程</p>
            <span class="text-cn-yellow group-hover:translate-x-1 transition-transform duration-300 text-sm">
              穿越时空 →
            </span>
          </router-link>
          <router-link :to="/interactive/" class="group flex flex-col items-center text-center p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-cn-cyan/20 rounded-full flex items-center justify-center mb-4 text-cn-cyan text-2xl group-hover:scale-110 transition-transform duration-300">
              🎮
            </div>
            <h3 class="text-xl font-bold mb-2 font-serif">互动体验</h3>
            <p class="text-white/70 text-sm mb-3">沉浸式感受建筑魅力</p>
            <span class="text-cn-cyan group-hover:translate-x-1 transition-transform duration-300 text-sm">
              立即体验 →
            </span>
          </router-link>
        </div>
        <!-- 版权信息 -->
        <div class="pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© 2026 中国古代建筑数字博物馆 | 致力于传承中华建筑文化</p>
        </div>
      </div>
    </footer>

    <!-- 底部装饰条 -->
    <div class="h-2 bg-gradient-to-r from-cn-red via-cn-yellow to-cn-cyan"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlobalMenu from '../components/GlobalMenu.vue'

gsap.registerPlugin(ScrollTrigger)

const carouselBuildings = ref([])
const currentSlide = ref(0)
const introSection = ref(null)
const entrySection = ref(null)
const homeRoot = ref(null)
let autoplayInterval = null

// 轮播控制
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % carouselBuildings.value.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + carouselBuildings.value.length) % carouselBuildings.value.length
}

function goToSlide(index) {
  currentSlide.value = index
}

onMounted(async () => {
  try {
    const res = await fetch('data/buildings.json')
    const buildings = await res.json()
    // 指定轮播建筑：故宫、万里长城、颐和园、布达拉宫
    const carouselIds = ['forbidden-city', 'great-wall', 'summer-palace', 'potala-palace']
    carouselBuildings.value = carouselIds.map(id => buildings.find(b => b.id === id)).filter(Boolean)

    // 自动轮播，每5秒切换
    autoplayInterval = setInterval(nextSlide, 5000)

    // 滚动入场动画
    gsap.fromTo('.feature-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: introSection.value,
          start: 'top 80%'
        }
      }
    )

    gsap.fromTo('a[href^="/"]',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: entrySection.value,
          start: 'top 80%'
        }
      }
    )



    // 整页滚动吸附效果（仅首页生效）
    const sections = gsap.utils.toArray(".section")
    const viewHeight = window.innerHeight
    const totalScroll = homeRoot.value.scrollHeight - viewHeight
    const aboutTop = sections[1].offsetTop
    const aboutHeight = sections[1].offsetHeight
    const aboutBottom = aboutTop + aboutHeight
    // 动态计算精确吸附点，确保刚好对齐板块顶部
    const carouselSnap = 0 // 轮播板块顶部
    const aboutSnap = aboutTop / totalScroll // 关于我们板块顶部
    ScrollTrigger.create({
      id: "homePageSnap",
      trigger: homeRoot.value,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: (progress) => {
          const scrollPos = progress * totalScroll
          if (scrollPos < aboutBottom) {
            // 轮播和关于我们区域，启用吸附
            return gsap.utils.snap([carouselSnap, aboutSnap], progress)
          }
          // 超过关于我们板块后取消吸附，可自由滚动到页脚
          return progress
        },
        duration: 0.6,
        ease: "power2.inOut",
        inertia: false
      }
    })

  } catch (e) {
    console.error('加载建筑数据失败', e)
  }
})

onUnmounted(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
  // 销毁首页专属的滚动吸附效果，避免影响其他页面
  ScrollTrigger.getById("homePageSnap")?.kill()
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
}
.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
