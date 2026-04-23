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
import { ref, nextTick } from 'vue'
import axios from 'axios'

const isOpen = ref(false)
const inputValue = ref('')
const messages = ref([
  { role: 'assistant', content: '你好！我是你的中国古代建筑AI顾问，请问有什么可以帮助你的？' }
])
const isLoading = ref(false)
const chatContainer = ref(null)

// DeepSeek API配置
const DEEPSEEK_API_KEY = 'sk-6b1bdc72775f4eb39f13e31a2af2300b'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'
const SYSTEM_PROMPT = `你是一个专业的中国古代建筑顾问，只回答和中国古代建筑相关的问题。
如果用户问的问题和中国古代建筑无关，请礼貌地告诉用户你只擅长回答中国古代建筑相关的问题，请提问相关内容。
回答要准确、专业、通俗易懂，尽量使用简洁的语言，不要回答无关内容。
禁止使用任何markdown格式、标题、分隔符、特殊符号（包括*、#、·等），直接使用纯文本回答，段落之间用换行分隔即可。`

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
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
  
  try {
    const response = await axios.post(API_URL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.value
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      }
    })
    
    const aiReply = cleanResponse(response.data.choices[0].message.content)
    messages.value.push({ role: 'assistant', content: aiReply })
    
  } catch (error) {
    console.error('API调用失败:', error)
    messages.value.push({ role: 'assistant', content: '抱歉，我现在无法回答你的问题，请稍后再试。' })
  } finally {
    isLoading.value = false
    nextTick(scrollToBottom)
  }
}

// 清理AI返回的格式
function cleanResponse(text) {
  return text
    // 移除markdown标题
    .replace(/^#{1,6}\s+/gm, '')
    // 移除多余的*和·符号
    .replace(/[*·#]/g, '')
    // 移除多余的空行
    .replace(/\n{3,}/g, '\n\n')
    // 移除首尾空格
    .trim()
}

// 回车发送
function handleKeydown(e) {
  if (e.key === 'Enter') {
    sendMessage()
  }
}
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