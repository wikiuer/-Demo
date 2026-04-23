<template>
  <!-- 悬浮按钮，仅在非互动体验页面显示 -->
  <transition name="fade-scale">
    <button
      v-if="showFloatButton && !isInteractivePage"
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-cn-red text-white shadow-xl hover:bg-cn-red/90 transition-all z-[999] flex items-center justify-center text-2xl hover:scale-110"
      @click="showQuizModal = true"
    >
      🧠
    </button>
  </transition>
  <!-- 永久称号徽章，仅最终测试通过后显示 -->
  <transition name="fade-scale">
    <div
      v-if="isFinalTestPassed && !isInteractivePage"
      class="fixed bottom-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r from-cn-red via-cn-yellow to-cn-cyan text-white shadow-lg z-[998] flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
      title="你已通过古建筑知识最终测试，获得「古建筑知识小能手」称号"
    >
      <span>🏆</span>
      <span class="font-bold text-sm">古建筑知识小能手</span>
    </div>
  </transition>
  <!-- 答题弹窗 -->
  <transition name="fade">
    <div
      v-if="showQuizModal"
      class="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      @click.self="showQuizModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6 relative">
        <button
          @click="showQuizModal = false"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
        >
          ×
        </button>
        <h2 class="text-2xl font-bold text-cn-black mb-6 font-serif text-center">
          {{ isFinalTest ? '🏆 古建筑知识最终测试' : '古建筑知识测验' }}
        </h2>
        <div v-if="!showResult" class="space-y-6">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-600">第 {{ quizIndex + 1 }} 题 / 共 {{ quizQuestions.length }} 题</span>
            <span class="text-sm font-medium text-cn-red">得分: {{ score }}</span>
          </div>
          <div class="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-100">
            <h3 class="text-xl font-bold text-cn-black mb-4">{{ currentQuestion.question }}</h3>
            <div class="space-y-3">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                @click="selectAnswer(index)"
                class="w-full text-left p-4 rounded-lg border transition-all text-base"
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
        <div v-if="showResult" class="text-center py-8">
          <div class="text-5xl mb-4" v-if="!isFinalTestPassed">🎉</div>
          <div class="text-5xl mb-4" v-if="isFinalTestPassed">🏆</div>
          <h3 class="text-2xl font-bold text-cn-black mb-2" v-if="!isFinalTestPassed">测验完成!</h3>
          <h3 class="text-2xl font-bold text-cn-red mb-2" v-if="isFinalTestPassed">恭喜你获得「古建筑知识小能手」称号！</h3>
          <p class="text-gray-600 mb-6">你的得分是: {{ score }} / {{ quizQuestions.length }}</p>
          <p class="text-green-600 mb-6 text-lg font-medium" v-if="isFinalTestPassed">
            你已通过最终测试，答题按钮将不再出现
          </p>
          <div class="flex gap-3 justify-center">
            <button
              @click="resetQuiz"
              class="px-6 py-3 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient"
              v-if="!isFinalTestPassed"
            >
              重新测验
            </button>
            <button
              @click="closeQuiz"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
// 判断是否是互动体验页面
const isInteractivePage = computed(() => route.path === '/interactive')
const showFloatButton = ref(false)
const showQuizModal = ref(false)
// 状态变量
const quizAttemptCount = ref(Number(localStorage.getItem('quiz_attempt_count') || 0)) // 答题次数
const isFinalTestPassed = ref(Boolean(localStorage.getItem('quiz_final_passed') === 'true')) // 最终测试是否通过
const isFinalTest = computed(() => quizAttemptCount.value >= 2) // 第三次是最终测试
// 基础题库（5题）
const baseQuizQuestions = [
  { question: '中国现存最早的砖塔是？', options: ['应县木塔', '嵩岳寺塔', '赵州桥', '悬空寺'], answer: 1 },
  { question: '都江堰是哪个朝代修建的？', options: ['秦朝', '汉朝', '隋朝', '唐朝'], answer: 0 },
  { question: '以下哪个建筑是跨朝代修建的？', options: ['故宫', '赵州桥', '都江堰', '应县木塔'], answer: 0 },
  { question: '《营造法式》是哪个朝代颁布的？', options: ['唐朝', '宋朝', '元朝', '明朝'], answer: 1 },
  { question: '福建土楼的主要建筑材料是？', options: ['木材', '石头', '夯土', '砖'], answer: 2 }
]
// 扩展题库（追加20题，最终测试共25题，适配现有27座建筑数目）
const extendedQuizQuestions = [
  { question: '应县木塔是什么结构的建筑？', options: ['全木结构', '砖石结构', '石木结构', '混合结构'], answer: 0 },
  { question: '故宫的正门是？', options: ['天安门', '午门', '太和门', '神武门'], answer: 1 },
  { question: '被称为「天下第一桥」的是？', options: ['卢沟桥', '赵州桥', '广济桥', '洛阳桥'], answer: 1 },
  { question: '莫高窟位于哪个省份？', options: ['陕西', '甘肃', '青海', '新疆'], answer: 1 },
  { question: '布达拉宫最初是为谁修建的？', options: ['文成公主', '松赞干布', '达赖喇嘛', '班禅额尔德尼'], answer: 0 },
  { question: '苏州园林中最大的是？', options: ['留园', '拙政园', '网师园', '狮子林'], answer: 1 },
  { question: '悬空寺位于哪座山？', options: ['泰山', '衡山', '恒山', '华山'], answer: 2 },
  { question: '孔庙位于哪个城市？', options: ['济南', '曲阜', '泰安', '济宁'], answer: 1 },
  { question: '我国古代建筑主要使用的颜色不包括？', options: ['红色', '黄色', '蓝色', '紫色'], answer: 3 },
  { question: '以下哪个不是我国四大名亭？', options: ['醉翁亭', '陶然亭', '爱晚亭', '兰亭'], answer: 3 },
  // 新增建筑相关题目
  { question: '阿房宫是哪个朝代修建的宫殿？', options: ['秦朝', '汉朝', '隋朝', '唐朝'], answer: 0 },
  { question: '未央宫是哪个朝代的皇宫？', options: ['秦朝', '汉朝', '唐朝', '明朝'], answer: 1 },
  { question: '云冈石窟位于哪个省份？', options: ['山西', '河南', '河北', '陕西'], answer: 0 },
  { question: '佛光寺祖师塔是哪个朝代的建筑？', options: ['汉朝', '北魏', '唐朝', '宋朝'], answer: 1 },
  { question: '中国现存最早的木结构建筑是？', options: ['佛光寺', '南禅寺大殿', '应县木塔', '保国寺'], answer: 1 },
  { question: '小雁塔位于哪个城市？', options: ['洛阳', '开封', '西安', '北京'], answer: 2 },
  { question: '宁波保国寺是哪个朝代的建筑？', options: ['唐朝', '北宋', '南宋', '元朝'], answer: 1 },
  { question: '万安桥（洛阳桥）首创的加固技术是？', options: ['筏形基础', '种蛎固基', '浮运架梁', '以上都是'], answer: 3 },
  { question: '永乐宫以什么闻名于世？', options: ['壁画', '木雕', '石刻', '琉璃'], answer: 0 },
  { question: '与诗句「欲穷千里目，更上一层楼」相关的建筑是？', options: ['岳阳楼', '黄鹤楼', '鹳雀楼', '滕王阁'], answer: 2 },
  { question: '皇城相府是哪个朝代的官宦宅第？', options: ['宋朝', '元朝', '明朝', '清朝'], answer: 3 },
  { question: '雍和宫最初是什么性质的建筑？', options: ['皇家宫殿', '佛教寺庙', '道观', '王府'], answer: 3 },
  { question: '南响堂山石窟是哪个朝代的佛教建筑？', options: ['北魏', '北齐', '唐朝', '宋朝'], answer: 1 },
  { question: '以下哪个是我国现存最早的跨海梁式大石桥？', options: ['赵州桥', '卢沟桥', '万安桥', '广济桥'], answer: 2 },
  { question: '永乐宫是哪个朝代的道教宫观？', options: ['宋朝', '元朝', '明朝', '清朝'], answer: 1 }
]
// 当前使用的题库
const quizQuestions = computed(() => {
  return isFinalTest.value ? [...baseQuizQuestions, ...extendedQuizQuestions] : baseQuizQuestions
})
const quizIndex = ref(0)
const selectedAnswer = ref(null)
const answered = ref(false)
const score = ref(0)
const showResult = ref(false)
const currentQuestion = computed(() => quizQuestions.value[quizIndex.value])
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value?.answer)
// 获取当前触发阈值
const getTriggerThreshold = () => {
  switch(quizAttemptCount.value) {
    case 0: return 10 // 首次触发：10次点击
    case 1: return 20 // 第一次答题后：20次点击
    case 2: return 30 // 第二次答题后：30次操作（点击+滚动）
    default: return Infinity // 超过三次不显示
  }
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
  if (quizIndex.value < quizQuestions.value.length - 1) {
    quizIndex.value++
    selectedAnswer.value = null
    answered.value = false
  } else {
    showResult.value = true
    // 处理答题完成逻辑
    quizAttemptCount.value++
    localStorage.setItem('quiz_attempt_count', quizAttemptCount.value)
    // 重置操作计数
    localStorage.setItem('quiz_action_count', '0')
    showFloatButton.value = false
    // 最终测试判断（25题及格线15分，60%正确率）
    if (isFinalTest.value && score.value >= 15) {
      isFinalTestPassed.value = true
      localStorage.setItem('quiz_final_passed', 'true')
    }
  }
}
function resetQuiz() {
  quizIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  score.value = 0
  showResult.value = false
}
function closeQuiz() {
  showQuizModal.value = false
  resetQuiz()
}
// 操作计数处理
const handleActionCount = () => {
  // 最终测试通过后不再计数
  if (isFinalTestPassed.value) return
  // 已经显示按钮的不用再计数
  if (showFloatButton.value) return
  let count = Number(localStorage.getItem('quiz_action_count') || 0)
  count++
  localStorage.setItem('quiz_action_count', count)
  // 达到阈值显示按钮
  if (count >= getTriggerThreshold()) {
    showFloatButton.value = true
  }
}
// 监听点击事件
const handleGlobalClick = () => {
  handleActionCount()
}
// 监听滚动事件（第二次答题后生效）
const handleGlobalScroll = () => {
  if (quizAttemptCount.value >= 2) {
    handleActionCount()
  }
}
onMounted(() => {
  // 最终测试通过后永远不显示按钮
  if (isFinalTestPassed.value) return
  // 初始化检查是否已经达到触发条件
  const count = Number(localStorage.getItem('quiz_action_count') || 0)
  if (count >= getTriggerThreshold()) {
    showFloatButton.value = true
  }
  // 全局监听事件
  document.addEventListener('click', handleGlobalClick)
  document.addEventListener('scroll', handleGlobalScroll)
})
// 页面卸载时移除监听
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
  document.removeEventListener('scroll', handleGlobalScroll)
})
</script>
<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
