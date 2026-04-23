<script setup>
import AIChat from './components/AIChat.vue'
import QuizFloatButton from './components/QuizFloatButton.vue'
</script>
<template>
  <div class="min-h-screen">
    <!-- AI对话窗口 -->
    <AIChat />
    <!-- 全局知识测验悬浮按钮 -->
    <QuizFloatButton />
    <!-- 主内容区域 -->
    <main>
      <router-view />
    </main>
  </div>
</template>
