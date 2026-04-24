<script setup>
import { ref, onMounted } from 'vue'
import AIChat from './components/AIChat.vue'
import QuizFloatButton from './components/QuizFloatButton.vue'
import Welcome from './components/Welcome.vue'

const showWelcome = ref(false)

onMounted(() => {
  showWelcome.value = true
})

function handleWelcomeComplete() {
  showWelcome.value = false
}
</script>
<template>
  <div class="min-h-screen">
    <!-- 欢迎界面（仅首次访问显示） -->
    <Welcome v-if="showWelcome" @complete="handleWelcomeComplete" />
    
    <!-- 主内容（欢迎页隐藏时显示） -->
    <template v-else>
      <!-- AI对话窗口 -->
      <AIChat />
      <!-- 全局知识测验悬浮按钮 -->
      <QuizFloatButton />
      <!-- 主内容区域 -->
      <main>
        <router-view />
      </main>
    </template>
  </div>
</template>
