<template>
  <div class="welcome-container fixed inset-0 z-[100] overflow-hidden" ref="welcomeRef">
    <!-- 建筑拼图背景 -->
    <div class="bg-layer absolute inset-0 overflow-hidden">
      <div class="puzzle-grid absolute" ref="puzzleRef">
        <div 
          v-for="(img, index) in puzzleImages" 
          :key="index" 
          class="puzzle-item bg-cover bg-center"
          :style="{ 
            backgroundImage: `url(${img})`,
            animationDelay: `${index * 0.2}s`
          }"
          :data-row="Math.floor(index / 4)"
        ></div>
      </div>
      <!-- 暗色遮罩 -->
      <div class="absolute inset-0 bg-black/70 backdrop-saturate-50"></div>
    </div>

    <!-- 主题文字 -->
    <div class="content-wrapper relative z-10 h-full flex flex-col items-center justify-center px-4">
      <h1 class="title text-4xl md:text-6xl font-serif text-white font-bold text-center leading-tight">
        <span 
          v-for="(char, index) in titleText" 
          :key="index" 
          class="char inline-block opacity-0"
          :ref="el => { if (el) charRefs[index] = el }"
        >{{ char }}</span>
      </h1>
      <p class="subtitle text-gray-300 mt-6 text-base md:text-lg opacity-0" ref="subtitleRef">
        探索中华五千年营造智慧
      </p>
    </div>

    <!-- 极简时间轴 -->
    <div class="timeline-wrapper absolute bottom-12 left-0 right-0 px-6 md:px-20 opacity-0" ref="timelineRef">
      <div class="timeline-line h-0.5 bg-gray-600 relative">
        <div class="timeline-progress absolute left-0 top-0 h-full bg-cn-red w-0" ref="progressRef"></div>
        <div 
          v-for="(dynasty, index) in dynasties" 
          :key="dynasty.id"
          class="timeline-node absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500"
          :style="{ left: `${(index / (dynasties.length - 1)) * 100}%` }"
          :ref="el => { if (el) nodeRefs[index] = el }"
        >
          <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
            {{ dynasty.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- 点击提示 -->
    <div class="hint absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm opacity-0 animate-pulse" ref="hintRef">
      点击任意位置进入
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['complete'])

const welcomeRef = ref(null)
const charRefs = ref([])
const subtitleRef = ref(null)
const timelineRef = ref(null)
const progressRef = ref(null)
const nodeRefs = ref([])
const hintRef = ref(null)
const puzzleRef = ref(null)
const puzzleImages = ref([])

const titleText = "筑梦千年：中国古建筑技艺演进博物馆"
const dynasties = [
  { id: 'pre-qin', name: '先秦' },
  { id: 'han', name: '汉' },
  { id: 'tang', name: '唐' },
  { id: 'song', name: '宋' },
  { id: 'yuan', name: '元' },
  { id: 'ming', name: '明' },
  { id: 'qing', name: '清' }
]

// 生成拼图所需图片（12张拼图，不足则重复）
async function loadPuzzleImages() {
  try {
    const res = await fetch('data/buildings.json')
    const buildings = await res.json()
    const images = buildings.map(b => b.images[0])
    // 复制数组凑够12张拼图
    while (images.length < 12) {
      images.push(...images)
    }
    puzzleImages.value = images.slice(0, 12)
  } catch (e) {
    // 加载失败使用默认占位图
    puzzleImages.value = Array(12).fill('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=')
  }
}

// 背景斜向流动动效：每行反向移动
function startPuzzleAnimation() {
  const items = puzzleRef.value.querySelectorAll('.puzzle-item')
  items.forEach((item, index) => {
    const row = Math.floor(index / 4)
    const direction = row % 2 === 0 ? 1 : -1 // 偶数行向右，奇数行向左反向移动
    gsap.to(item, {
      x: direction * 80,
      y: direction * 30,
      duration: 30 + row * 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  })
}

// 启动动画序列
function startAnimation() {
  const tl = gsap.timeline({
    onComplete: () => {
      // 动画结束后显示点击提示
      gsap.to(hintRef.value, { opacity: 1, duration: 0.8 })
      // 5秒后自动跳转
      setTimeout(handleComplete, 5000)
    }
  })

  // 文字逐字浮现
  tl.to(charRefs.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
  }, 0.5)

  // 副标题浮现
  tl.to(subtitleRef.value, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.3')

  // 时间轴浮现
  tl.to(timelineRef.value, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.5')

  // 时间轴进度条动画
  tl.to(progressRef.value, {
    width: '100%',
    duration: 2,
    ease: 'power1.inOut'
  }, '-=0.3')

  // 时间轴节点依次点亮
  tl.to(nodeRefs.value, {
    backgroundColor: '#c41e3a',
    scale: 1.5,
    duration: 0.3,
    stagger: 0.2,
    ease: 'power2.out'
  }, '-=1.8')
}

// 完成跳转
function handleComplete() {
  gsap.to(welcomeRef.value, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in',
    onComplete: () => {
      emit('complete')
    }
  })
}

onMounted(async () => {
  await loadPuzzleImages()
  startPuzzleAnimation()
  // 初始化文字位置
  gsap.set(charRefs.value, { y: 20 })
  gsap.set(subtitleRef.value, { y: 20 })
  // 绑定点击事件
  welcomeRef.value.addEventListener('click', handleComplete)
  // 启动动画
  startAnimation()
})
</script>

<style scoped>
.welcome-container {
  cursor: pointer;
}
.puzzle-grid {
  left: -15%;
  top: -10%;
  width: 130%;
  height: 120%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
  transform: skewX(-8deg);
  will-change: transform;
}
.puzzle-item {
  animation: fadeInPuzzle 1.5s ease forwards;
  opacity: 0;
  transform: skewX(8deg);
  will-change: transform;
}
@keyframes fadeInPuzzle {
  from {
    opacity: 0;
    scale: 0.95;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
.title .char {
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
}
.timeline-node {
  transition: all 0.3s ease;
}
@media (max-width: 768px) {
  .puzzle-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    transform: skewX(-5deg);
    left: -20%;
    width: 140%;
  }
  .puzzle-item {
    transform: skewX(5deg);
  }
  .timeline-wrapper {
    bottom: 80px;
    padding: 0 24px;
  }
  .timeline-node span {
    font-size: 10px;
  }
  .title {
    font-size: 2rem;
    line-height: 1.3;
  }
}
</style>
