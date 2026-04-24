<template>
  <div class="fixed top-0 left-0 right-0 z-[50]">
    <!-- 顶部触发条 -->
    <div 
      @click="toggleChat"
      class="w-full h-6 bg-gradient-to-r from-rose-600 via-amber-400 to-blue-500 hover:h-9 hover:translate-y-1.5 hover:animate-none transition-all duration-300 cursor-pointer flex items-center justify-center overflow-hidden shadow-xl animate-pulse"
    >
      <span class="text-white text-sm font-medium drop-shadow-md">
        🤖 AI建筑顾问 · 点击咨询中国古代建筑问题
      </span>
    </div>

    <!-- AI对话窗口 -->
    <transition name="chat">
      <div 
        v-if="isOpen"
        class="w-full bg-white shadow-xl border-b border-gray-200"
      >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-2xl font-bold font-serif text-cn-black">AI建筑顾问</h3>
            <p class="text-gray-500 text-sm mt-1">有任何关于中国古代建筑的问题都可以问我</p>
          </div>
          <button 
            @click="closeChat"
            class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-cn-red"
          >
            ↑
          </button>
        </div>

        <!-- 对话内容区域 -->
        <div ref="chatContainer" class="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto border border-gray-200">
          <div v-for="(message, index) in messages" :key="index" class="flex gap-3 mb-4" :class="message.role === 'user' ? 'justify-end' : ''">
            <div v-if="message.role === 'assistant'" class="w-8 h-8 rounded-full bg-cn-red/10 flex items-center justify-center text-cn-red flex-shrink-0">
              AI
            </div>
            <div :class="message.role === 'assistant' ? 'bg-white rounded-lg rounded-tl-none' : 'bg-cn-red text-white rounded-lg rounded-tr-none'" class="p-3 shadow-sm border border-gray-100 max-w-[80%]">
              <p class="whitespace-pre-wrap">{{ message.content }}</p>
            </div>
            <div v-if="message.role === 'user'" class="w-8 h-8 rounded-full bg-cn-blue/10 flex items-center justify-center text-cn-blue flex-shrink-0">
              你
            </div>
          </div>
          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex gap-3 mb-4">
            <div class="w-8 h-8 rounded-full bg-cn-red/10 flex items-center justify-center text-cn-red flex-shrink-0">
              AI
            </div>
            <div class="bg-white rounded-lg rounded-tl-none p-3 shadow-sm border border-gray-100 max-w-[80%]">
              <div class="flex gap-1">
                <span class="animate-bounce">●</span>
                <span class="animate-bounce" style="animation-delay: 0.2s">●</span>
                <span class="animate-bounce" style="animation-delay: 0.4s">●</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="flex gap-3">
          <input 
            v-model="inputValue"
            @keydown="handleKeydown"
            type="text" 
            placeholder="输入关于中国古代建筑的问题..."
            class="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cn-red/50 focus:border-cn-red transition-all duration-300"
            :disabled="isLoading"
          />
          <button 
            @click="sendMessage"
            :disabled="isLoading || !inputValue.trim()"
            class="px-6 py-3 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import buildingsData from '../../public/data/buildings.json'

const isOpen = ref(false)
const inputValue = ref('')
const messages = ref([
  { role: 'assistant', content: '你好！我是你的中国古代建筑AI顾问，请问有什么可以帮助你的？' }
])
const isLoading = ref(false)
const chatContainer = ref(null)
const route = useRoute()

// 建筑数据处理
const buildings = buildingsData
const buildingNameMap = new Map()
buildings.forEach(building => {
  buildingNameMap.set(building.name, building)
})

// 当前页面上下文
const currentBuilding = computed(() => {
  if (route.name === 'ArchitectureDetail' && route.params.id) {
    return buildings.find(b => b.id === route.params.id) || null
  }
  return null
})

// DeepSeek API配置
const DEEPSEEK_API_KEY = 'sk-6b1bdc72775f4eb39f13e31a2af2300b'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 生成包含知识库的系统提示词
const getSystemPrompt = (contextBuilding = null) => {
  let knowledgeBase = '以下是平台收录的中国古代建筑知识库，回答问题时请优先使用以下信息，确保回答准确：\n'
  buildings.forEach(b => {
    knowledgeBase += `- ${b.name}：${b.description} 朝代：${b.dynasty}，位置：${b.location}，类型：${b.type}。\n`
  })
  
  let contextPrompt = ''
  if (contextBuilding) {
    contextPrompt = `\n用户当前正在浏览【${contextBuilding.name}】的详情页，相关信息：${contextBuilding.description}，朝代：${contextBuilding.dynasty}，位置：${contextBuilding.location}。回答用户问题时可以结合这些信息。`
  }
  
  return `${knowledgeBase}
你是一个专业的中国古代建筑顾问，只回答和中国古代建筑相关的问题。
如果用户问的问题和中国古代建筑无关，请礼貌地告诉用户你只擅长回答中国古代建筑相关的问题，请提问相关内容。
回答要准确、专业、通俗易懂，尽量使用简洁的语言，不要回答无关内容。
禁止使用任何markdown格式、标题、分隔符、特殊符号（包括*、#、·等），直接使用纯文本回答，段落之间用换行分隔即可。
当回答中提到平台收录的建筑名称时，不要修改建筑名称，保持原样即可。${contextPrompt}`
}

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // 如果在建筑详情页，添加上下文提示
    if (currentBuilding.value && messages.value.length === 1) {
      const welcomeMsg = `你正在浏览【${currentBuilding.value.name}】，有任何相关问题都可以问我。`
      messages.value.push({ role: 'assistant', content: welcomeMsg })
    }
    nextTick(scrollToBottom)
  }
}

function closeChat() {
  isOpen.value = false
}

// 滚动到对话底部
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 发送消息
async function sendMessage() {
  if (!inputValue.value.trim() || isLoading.value) return
  
  const userMessage = inputValue.value.trim()
  inputValue.value = ''
  
  // 添加用户消息到对话
  messages.value.push({ role: 'user', content: userMessage })
  nextTick(scrollToBottom)
  
  isLoading.value = true
  
  // 添加一个空的AI回复消息，用于流式填充内容
  const aiMessageIndex = messages.value.length
  messages.value.push({ role: 'assistant', content: '' })
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: getSystemPrompt(currentBuilding.value) },
          ...messages.value.slice(0, -1) // 排除刚刚添加的空AI消息
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullResponse = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0].delta.content || ''
            fullResponse += content
            // 更新AI回复消息的内容
            messages.value[aiMessageIndex].content = cleanResponse(fullResponse)
            nextTick(scrollToBottom)
          } catch (e) {
            console.error('解析响应失败:', e)
          }
        }
      }
    }
    
  } catch (error) {
    console.error('API调用失败:', error)
    messages.value[aiMessageIndex].content = '抱歉，我现在无法回答你的问题，请稍后再试。'
  } finally {
    isLoading.value = false
    nextTick(scrollToBottom)
  }
}

// 清理AI返回的格式并添加建筑跳转链接
function cleanResponse(text) {
  let cleaned = text
    // 移除markdown标题
    .replace(/^#{1,6}\s+/gm, '')
    // 移除多余的*和·符号
    .replace(/[*·#]/g, '')
    // 移除多余的空行
    .replace(/\n{3,}/g, '\n\n')
    // 移除首尾空格
    .trim()
  
  // 识别建筑名称并添加跳转链接
  const addedBuildings = new Set()
  for (const [name, building] of buildingNameMap.entries()) {
    if (cleaned.includes(name) && !addedBuildings.has(name)) {
      addedBuildings.add(name)
      // 在回答末尾添加跳转链接
      cleaned += `\n\n👉 点击查看平台内[${name}]详情页：/architecture/${building.id}`
    }
  }
  
  return cleaned
}

// 回车发送
function handleKeydown(e) {
  if (e.key === 'Enter') {
    sendMessage()
  }
}

// 暴露方法给外部组件调用
defineExpose({
  // 触发AI讲解题目知识点
  explainQuestion: (question, wrongAnswer, correctAnswer) => {
    isOpen.value = true
    const questionMsg = `用户答错了题目：${question}，用户选择的答案是${wrongAnswer}，正确答案是${correctAnswer}。请你详细讲解这道题相关的知识点，帮助用户理解。`
    messages.value.push({ role: 'user', content: questionMsg })
    // 自动发送这个请求
    inputValue.value = questionMsg
    sendMessage()
  },
  
  // 根据错题记录出题
  generateQuestionsFromWrongAnswers: (wrongQuestions) => {
    isOpen.value = true
    const questionMsg = `用户答错了以下题目：${wrongQuestions.map(q => q.question).join('、')}。请你根据这些错题相关的知识点，出5道类似的练习题，帮助用户巩固知识。`
    messages.value.push({ role: 'user', content: questionMsg })
    inputValue.value = questionMsg
    sendMessage()
  }
})
</script>

<style scoped>
/* 展开收起动画 */
.chat-enter-active,
.chat-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-enter-from,
.chat-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>