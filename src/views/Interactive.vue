<template>
  <div class="min-h-screen bg-gradient-to-br from-cn-yellow/5 via-cn-white to-cn-cyan/5 relative overflow-hidden">
    <!-- 动态云纹底纹 -->
    <svg class="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none cloud-bg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <pattern id="cloudPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25,10 Q40,0 50,10 Q60,0 75,10 Q85,20 75,30 Q85,40 75,50 Q60,60 50,50 Q40,60 25,50 Q15,40 25,30 Q15,20 25,10 Z" fill="currentColor" class="text-cn-black"/>
      </pattern>
      <rect x="0" y="0" width="200" height="200" fill="url(#cloudPattern)" />
    </svg>

    <!-- 漂浮粒子 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 墨韵转场遮罩 -->
    <div v-if="switching" ref="inkMask" class="fixed inset-0 bg-cn-black z-[100] opacity-0 pointer-events-none"></div>

    <GlobalMenu />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold mb-2 text-center text-cn-black font-serif title-animate">古建筑互动体验</h1>
      <p class="text-gray-600 text-center mb-8 subtitle-animate">探索中国古代建筑的奥秘</p>

      <!-- 功能分屏布局 -->
      <div class="flex gap-6 mb-12 min-h-[600px] flex-col md:flex-row">
        <!-- 左侧功能卡片：知识测验 -->
        <div 
          @click="switchFeature('quiz')"
          class="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-gray-100/50 cursor-pointer relative group overflow-hidden feature-card transition-all duration-500 ease-in-out"
          :class="[
            activeFeature === 'quiz' ? 'w-full md:w-3/4 active-feature' : 'w-full md:w-1/4 inactive-feature',
            activeFeature === 'panorama' || activeFeature === '3d' ? 'opacity-70 scale-95' : ''
          ]"
        >
          <!-- 边角回纹装饰 -->
          <svg class="absolute top-0 left-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H8V2H2V8H0V0Z" fill="currentColor"/>
            <path d="M4 4H6V6H4V4Z" fill="currentColor"/>
          </svg>
          <svg class="absolute top-0 right-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0H16V2H22V8H24V0Z" fill="currentColor"/>
            <path d="M20 4H18V6H20V4Z" fill="currentColor"/>
          </svg>
          <svg class="absolute bottom-0 left-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 24H8V22H2V16H0V24Z" fill="currentColor"/>
            <path d="M4 20H6V18H4V20Z" fill="currentColor"/>
          </svg>
          <svg class="absolute bottom-0 right-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 24H16V22H22V16H24V0Z" fill="currentColor"/>
            <path d="M20 20H18V18H20V20Z" fill="currentColor"/>
          </svg>
          
          <!-- hover墨韵扩散效果 -->
          <div class="absolute inset-0 bg-cn-red/0 group-hover:bg-cn-red/8 transition-all duration-700 rounded-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 ink-spread"></div>
        
          <!-- 卡片头部 -->
          <div class="p-8 text-center">
            <div class="text-6xl mb-4 relative z-10 group-hover:scale-120 transition-all duration-500 feature-icon">🧠</div>
            <h3 class="text-2xl font-bold text-cn-black mb-3 relative z-10 font-serif group-hover:text-cn-red transition-colors">知识测验</h3>
            <p v-if="activeFeature !== 'quiz'" class="text-gray-600 text-base relative z-10 group-hover:text-gray-800 transition-colors">测试你的古建筑知识</p>
            
            <!-- 模块装饰线 -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-transparent via-cn-red to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            
            <!-- 已选标记 -->
            <div v-if="activeFeature === 'quiz'" class="absolute top-4 right-4 bg-cn-red text-white text-xs font-bold px-3 py-1 rounded-full rotate-3 shadow-lg selected-badge">
              已选择
            </div>
          </div>

          <!-- 展开内容：知识测验 -->
          <transition name="fade-up" mode="out-in">
            <div v-if="activeFeature === 'quiz'" class="px-4 md:px-8 pb-8 pt-0 quiz-container">
              <h2 class="text-3xl font-bold text-cn-black mb-8 font-serif text-center quiz-title">🏯 古建筑知识测验</h2>
              <transition name="fade-up" mode="out-in">
                <div :key="quizState" class="quiz-content">
                  <div v-if="!showQuiz" class="text-center py-16 start-screen">
                    <div class="text-8xl mb-6 animate-bounce">📚</div>
                    <p class="text-gray-600 mb-8 text-lg">测试你对中国古代建筑知识的了解程度</p>
                    <button @click="startQuiz" class="px-8 py-4 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                      开始测验
                    </button>
                  </div>

                  <div v-if="showQuiz && !showResult" class="max-w-3xl mx-auto question-screen">
                    <div class="flex justify-between items-center mb-8 flex-wrap gap-4">
                      <div class="progress-container">
                        <div class="text-sm text-gray-600 mb-2">进度：第 {{ quizIndex + 1 }} 题 / 共 {{ quizQuestions.length }} 题</div>
                        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div class="h-full bg-cn-red rounded-full progress-bar" :style="{ width: `${(quizIndex + 1) / quizQuestions.length * 100}%` }"></div>
                        </div>
                       </div>
                        <div class="score-display">
                          <span class="text-sm font-medium text-cn-red text-lg">得分：<span class="count-up">{{ score }}</span> / {{ quizQuestions.length }}</span>
                        </div>
                      </div>
                      <transition name="fade-slide" mode="out-in">
                      <div :key="quizIndex" class="bg-white/50 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8 shadow-lg question-card">
                        <h3 class="text-xl md:text-2xl font-bold text-cn-black mb-6 font-serif">{{ currentQuestion.question }}</h3>
                        <div class="space-y-4">
                          <button 
                            v-for="(option, index) in currentQuestion.options" 
                            :key="index"
                            @click="selectAnswer(index)"
                            class="w-full text-left p-4 md:p-5 rounded-xl border transition-all text-base md:text-lg option-btn"
                            :class="getAnswerClass(index)"
                          >
                            <span class="inline-block w-8 h-8 rounded-full border border-gray-300 text-center mr-3 leading-8 option-index">{{ String.fromCharCode(65 + index) }}</span>
                            {{ option }}
                            <span v-if="answered.value && index === currentQuestion.value.answer" class="float-right text-green-500 text-xl">✅</span>
                            <span v-if="answered.value && index === selectedAnswer.value && index !== currentQuestion.value.answer" class="float-right text-red-500 text-xl">❌</span>
                          </button>
                        </div>
                      </div>
                    </transition>
                    <div class="flex justify-end">
                      <button 
                        @click="nextQuestion"
                        :disabled="!answered"
                        class="px-6 md:px-8 py-3 md:py-4 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all disabled:bg-gray-300 btn-ancient text-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
                      >
                        {{ quizIndex < quizQuestions.length - 1 ? '下一题 →' : '查看结果 →' }}
                      </button>
                    </div>
                  </div>

                  <div v-if="showResult" class="max-w-md mx-auto text-center py-16 result-screen">
                    <transition name="bounce-in">
                      <div class="result-card">
                        <div class="text-8xl mb-6">{{ score >= quizQuestions.length * 0.8 ? '🏆' : score >= quizQuestions.length * 0.6 ? '🎉' : '💪' }}</div>
                        <h3 class="text-3xl font-bold text-cn-black mb-4 font-serif">测验完成!</h3>
                        <p class="text-gray-600 mb-2 text-lg">你的得分是:</p>
                        <p class="text-5xl font-bold text-cn-red mb-8 final-score">{{ score }} / {{ quizQuestions.length }}</p>
                        <p class="text-gray-500 mb-8">
                          {{ score >= quizQuestions.length * 0.8 ? '太棒了！你是古建筑知识大师！' : score >= quizQuestions.length * 0.6 ? '不错哦！继续加油了解更多古建筑知识！' : '没关系，多学习一下就会更好的！' }}
                        </p>
                        <button @click="resetQuiz" class="px-8 py-4 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
                          重新测验
                        </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</div>

         <!-- 右侧功能卡片：全景浏览 -->
        <div 
          @click="switchFeature('panorama')"
          class="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-gray-100/50 cursor-pointer relative group overflow-hidden feature-card transition-all duration-500 ease-in-out"
          :class="[
            activeFeature === 'panorama' ? 'w-full md:w-3/4 active-feature' : 'w-full md:w-1/4 inactive-feature',
            activeFeature === 'quiz' || activeFeature === '3d' ? 'opacity-70 scale-95' : ''
          ]"
        >
          <!-- 边角回纹装饰 -->
          <svg class="absolute top-0 left-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H8V2H2V8H0V0Z" fill="currentColor"/>
            <path d="M4 4H6V6H4V4Z" fill="currentColor"/>
          </svg>
          <svg class="absolute top-0 right-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0H16V2H22V8H24V0Z" fill="currentColor"/>
            <path d="M20 4H18V6H20V4Z" fill="currentColor"/>
          </svg>
          <svg class="absolute bottom-0 left-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 24H8V22H2V16H0V24Z" fill="currentColor"/>
            <path d="M4 20H6V18H4V20Z" fill="currentColor"/>
          </svg>
          <svg class="absolute bottom-0 right-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 24H16V22H22V16H24V0Z" fill="currentColor"/>
            <path d="M20 20H18V18H20V20Z" fill="currentColor"/>
          </svg>
          
          <!-- hover墨韵扩散效果 -->
          <div class="absolute inset-0 bg-cn-red/0 group-hover:bg-cn-red/8 transition-all duration-700 rounded-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 ink-spread"></div>
        
          <!-- 卡片头部 -->
          <div class="p-8 text-center">
            <div class="text-6xl mb-4 relative z-10 group-hover:scale-120 transition-all duration-500 feature-icon">🌍</div>
            <h3 class="text-2xl font-bold text-cn-black mb-3 relative z-10 font-serif group-hover:text-cn-red transition-colors">全屏浏览</h3>
            <p v-if="activeFeature !== 'panorama'" class="text-gray-600 text-base relative z-10 group-hover:text-gray-800 transition-colors">360度全屏查看建筑</p>
            
            <!-- 模块装饰线 -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-transparent via-cn-red to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            
            <!-- 已选标记 -->
            <div v-if="activeFeature === 'panorama'" class="absolute top-4 right-4 bg-cn-red text-white text-xs font-bold px-3 py-1 rounded-full rotate-3 shadow-lg selected-badge">
              已选择
            </div>
          </div>

          <!-- 展开内容：全景浏览 -->
          <transition name="fade-up" mode="out-in">
            <div v-if="activeFeature === 'panorama'" class="px-4 md:px-8 pb-8 pt-0 panorama-container">
              <h2 class="text-3xl font-bold text-cn-black mb-6 font-serif text-center">🌍 360°全屏浏览</h2>
              <p class="text-gray-600 mb-8 text-center">选择建筑进行全屏浏览</p>
              
              <!-- 全景查看模式 -->
              <div v-if="showPanorama" class="mb-8">
                <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
                  <h3 class="text-lg md:text-xl font-bold text-cn-black">{{ currentPanorama?.name }} - 全屏浏览</h3>
                  <button @click="closePanorama" class="px-4 py-2 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient shadow-lg">
                    × 关闭全屏
                  </button>
                </div>
                <div 
                  class="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-gray-100"
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
                    class="w-full h-full object-cover select-none panorama-image"
                    :style="{ transform: `translateX(${panoramaOffset}px)`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' }"
                    draggable="false"
                    @error="handleImageError($event)"
                  >
                </div>
              </div>

              <!-- 建筑列表 -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 panorama-grid">
                <div 
                  v-for="building in allBuildings" 
                  :key="building.id"
                  @click="openPanorama(building)"
                  class="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group panorama-card hover:-translate-y-2"
                >
                  <div class="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
                    <img :src="building.images[0]" :alt="building.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" @error="handleImageError($event)">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span class="text-white px-4 py-2 rounded-full bg-cn-red/70 backdrop-blur-sm text-sm font-medium">点击查看全屏</span>
                    </div>
                    <div class="absolute inset-0 border-2 border-transparent group-hover:border-cn-red/50 rounded-lg transition-all duration-300"></div>
                  </div>
                  <h3 class="text-xl font-bold text-cn-black mb-1 group-hover:text-cn-red transition-colors">{{ building.name }}</h3>
                  <p class="text-sm text-gray-600">{{ building.dynasty }} · {{ building.type }}</p>
               </div>
              </div>
            </div>
            </transition>
          </div>
        </div>
      </div>

     <!-- 3D模型功能卡片（独立布局） -->
     <div class="mt-12">
       <div 
         @click="switchFeature('3d')"
         class="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-gray-100/50 cursor-pointer relative group overflow-hidden feature-card transition-all duration-500 ease-in-out"
         :class="[
           activeFeature === '3d' ? 'w-full active-feature' : 'w-full',
         ]"
         >
           <!-- 边角回纹装饰 -->
           <svg class="absolute top-0 left-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 0H8V2H2V8H0V0Z" fill="currentColor"/>
             <path d="M4 4H6V6H4V4Z" fill="currentColor"/>
           </svg>
           <svg class="absolute top-0 right-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M24 0H16V2H22V8H24V0Z" fill="currentColor"/>
             <path d="M20 4H18V6H20V4Z" fill="currentColor"/>
           </svg>
           <svg class="absolute bottom-0 left-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 24H8V22H2V16H0V24Z" fill="currentColor"/>
             <path d="M4 20H6V18H4V20Z" fill="currentColor"/>
           </svg>
           <svg class="absolute bottom-0 right-0 w-10 h-10 text-cn-red/30 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M24 24H16V22H22V16H24V0Z" fill="currentColor"/>
             <path d="M20 20H18V18H20V20Z" fill="currentColor"/>
           </svg>
           
           <!-- hover墨韵扩散效果 -->
           <div class="absolute inset-0 bg-cn-red/0 group-hover:bg-cn-red/8 transition-all duration-700 rounded-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 ink-spread"></div>
         
           <!-- 卡片头部 -->
           <div class="p-8 text-center">
             <div class="text-6xl mb-4 relative z-10 group-hover:scale-120 transition-all duration-500 feature-icon">🏗️</div>
             <h3 class="text-2xl font-bold text-cn-black mb-3 relative z-10 font-serif group-hover:text-cn-red transition-colors">3D模型</h3>
             <p v-if="activeFeature !== '3d'" class="text-gray-600 text-base relative z-10 group-hover:text-gray-800 transition-colors">3D交互探索古建筑</p>
             
             <!-- 模块装饰线 -->
             <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-transparent via-cn-red to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             
             <!-- 已选标记 -->
             <div v-if="activeFeature === '3d'" class="absolute top-4 right-4 bg-cn-red text-white text-xs font-bold px-3 py-1 rounded-full rotate-3 shadow-lg selected-badge">
               已选择
             </div>
           </div>

           <!-- 展开内容：3D模型预览 -->
           <transition name="fade-up" mode="out-in">
             <div v-if="activeFeature === '3d'" class="px-4 md:px-8 pb-8 pt-0 3d-container">
               <h2 class="text-3xl font-bold text-cn-black mb-6 font-serif text-center">🏗️ 3D模型探索</h2>
   <p class="text-gray-600 mb-4 text-center">当前展示：{{ allBuildings.find(b => b.id === selectedBuildingFor3D)?.name || '应县木塔' }}</p>
  
   <!-- 模型选择卡片 -->
   <div class="mb-6">
     <div class="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide justify-start md:justify-center">
       <div 
         v-for="building in allBuildings.filter(b => b.model)" 
         :key="building.id"
         @click="!modelSwitching && (selectedBuildingFor3D = building.id)"
         class="flex-shrink-0 w-36 md:w-48 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative"
         :class="[
           selectedBuildingFor3D === building.id ? 'border-cn-red shadow-lg shadow-cn-red/10' : '',
           modelSwitching && selectedBuildingFor3D === building.id ? 'opacity-70 pointer-events-none' : '',
           modelSwitching && selectedBuildingFor3D !== building.id ? 'opacity-50 pointer-events-none' : ''
         ]"
       >
         <div class="w-full h-24 rounded-lg overflow-hidden mb-3 relative">
           <img :src="building.images[0]" :alt="building.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" @error="handleImageError($event)">
           <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <div v-if="selectedBuildingFor3D === building.id" class="absolute inset-0 border-2 border-cn-red rounded-lg transition-all duration-300 flex items-center justify-center bg-cn-red/10">
             <span class="text-white text-xs font-bold px-2 py-1 rounded-full bg-cn-red/70 backdrop-blur-sm">当前选中</span>
           </div>
         </div>
         <h3 class="text-sm font-bold text-cn-black mb-1 group-hover:text-cn-red transition-colors">{{ building.name }}</h3>
         <p class="text-xs text-gray-600">{{ building.dynasty }}</p>
       </div>
     </div>
   </div>
  
  <!-- 操作工具栏 -->
  <div class="flex flex-wrap gap-3 mb-4 justify-center">
                 <button @click="toggleAutoRotate" class="px-4 py-2 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient shadow-sm">
                   {{ autoRotate ? '⏸️ 停止自动旋转' : '▶️ 开启自动旋转' }}
                 </button>
                 <button @click="resetView" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-sm">
                   🔄 重置视角
                 </button>
               </div>
               
               <!-- 3D画布容器 -->
               <div 
                 ref="canvasContainer"
                 class="w-full h-[500px] rounded-xl overflow-hidden bg-gray-100 relative"
               >
                 <!-- 加载状态 -->
                 <div v-if="modelLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                   <div class="w-16 h-16 border-4 border-cn-red border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p class="text-gray-600">3D模型加载中...</p>
                 </div>
                 <!-- 错误提示 -->
                 <div v-if="modelError" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                   <div class="text-4xl mb-4">❌</div>
                   <p class="text-gray-600 mb-2">模型加载失败</p>
                    <button @click="loadModel" class="px-4 py-2 bg-cn-red text-white rounded-lg hover:bg-cn-red/90 transition-all btn-ancient">
                      重新加载
                    </button>
                 </div>
                 <!-- 操作提示 -->
                 <div class="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm z-10">
                   操作提示：拖拽旋转 | 滚轮缩放 | 右键平移
                 </div>
                 <!-- 知识点弹窗 -->
                 <div v-if="showHotspotInfo" class="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs z-10 border border-gray-200">
                   <div class="flex justify-between items-start mb-2">
                     <h4 class="font-bold text-cn-red text-lg">{{ currentHotspot.title }}</h4>
                     <button @click="showHotspotInfo = false" class="text-gray-500 hover:text-gray-700">×</button>
                   </div>
                   <p class="text-gray-700 text-sm">{{ currentHotspot.content }}</p>
                 </div>
               </div>
               
               <!-- 应县木塔简介 -->
               <div class="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                 <h3 class="text-xl font-bold text-cn-black mb-2 font-serif">应县木塔</h3>
                 <p class="text-gray-700">
                   应县木塔全称佛宫寺释迦塔，是中国现存最高最古的木结构塔式建筑，也是世界上现存最高的木结构古建筑，
                   与意大利比萨斜塔、巴黎埃菲尔铁塔并称"世界三大奇塔"。塔高67.31米，底层直径30.27米，
                   呈平面八角形，全塔耗材红松木料3000立方米，2600多吨，纯木结构、无钉无铆，
                   历经近千年风雨、多次地震仍完好无损。
                 </p>
               </div>
             </div>
           </transition>
       </div>
     </div>
   </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import GlobalMenu from '../components/GlobalMenu.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const router = useRouter()
const inkMask = ref(null)

const allBuildings = ref([])
const activeFeature = ref('quiz')
const switching = ref(false)

// 3D模型相关变量
const canvasContainer = ref(null)
let scene = null
let camera = null
let renderer = null
let controls = null
let model = null
const modelLoading = ref(false)
const modelError = ref(false)
const autoRotate = ref(true)
const modelSwitching = ref(false)
let currentLoadId = 0 // 解决模型加载竞态问题
const showHotspotInfo = ref(false)
const currentHotspot = ref({ title: '', content: '' })
const selectedBuildingFor3D = ref('yingxian-wooden-pagoda')
let abortController = null // 用于取消未完成的模型加载请求

// 监听选中模型变化，自动加载
watch(selectedBuildingFor3D, (newId) => {
  if (newId && activeFeature.value === '3d') {
    loadModel(newId)
  }
})
let animationId = null

const featureList = [
  { id: 'quiz', icon: '🧠', title: '知识测验', description: '测试你的古建筑知识' },
  { id: 'panorama', icon: '🌍', title: '全屏浏览', description: '360度全屏查看建筑' },
  { id: '3d', icon: '🏗️', title: '3D模型', description: '3D交互探索古建筑' }
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

// 粒子样式生成
function getParticleStyle(index) {
  const size = Math.random() * 6 + 2
  const left = Math.random() * 100
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 10
  const opacity = Math.random() * 0.3 + 0.1
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: opacity,
    background: index % 3 === 0 ? '#c41e3a' : index % 3 === 1 ? '#e6b800' : '#008b8b'
  }
}

// 功能切换带墨韵动效
async function switchFeature(id) {
  if (id === activeFeature.value || switching.value) return
  switching.value = true
  
  // 等待DOM渲染墨韵遮罩
  await nextTick()
  
  // 墨韵扩散动画
  if (inkMask.value) {
    gsap.to(inkMask.value, {
      opacity: 0.9,
      duration: 0.3,
      ease: 'power2.in'
    })
  }
  
  await nextTick()
  activeFeature.value = id
  
  // 切换到3D功能时自动加载当前选中的模型
  if (id === '3d') {
    nextTick(() => loadModel())
  }
  
  setTimeout(() => {
    if (inkMask.value) {
      gsap.to(inkMask.value, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
    switching.value = false
  }, 200)
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
const quizState = computed(() => {
  if (showResult.value) return 'result'
  if (showQuiz.value) return 'question'
  return 'start'
})

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
    // 正确答案动效
    gsap.fromTo('.count-up', { scale: 1.5, color: '#10b981' }, { scale: 1, color: '#c41e3a', duration: 0.5, ease: 'back.out' })
  } else {
    // 错误答案震动效果
    gsap.to('.question-card', { x: [0, -10, 10, -10, 10, 0], duration: 0.4, ease: 'power2.inOut' })
  }
}

function getAnswerClass(index) {
  if (!answered.value) return 'border-gray-200 hover:border-cn-red hover:bg-cn-red/5 hover:scale-105 hover:shadow-lg'
  if (index === currentQuestion.value.answer) return 'border-green-500 bg-green-50 shadow-lg scale-105'
  if (index === selectedAnswer.value) return 'border-red-500 bg-red-50 shadow-lg scale-105'
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
let momentumId = null

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
  if (momentumId) clearTimeout(momentumId)
}

function onDrag(e) {
  if (!isDragging) return
  const x = e.clientX || e.touches?.[0]?.clientX
  panoramaOffset.value = x - startX
}

function stopDrag() {
  isDragging = false
  // 添加惯性滑动效果
  const velocity = panoramaOffset.value / 10
  gsap.to(panoramaOffset, {
    value: panoramaOffset.value + velocity * 5,
    duration: 1,
    ease: 'power2.out'
  })
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

// 3D场景初始化
function init3DScene() {
  if (!canvasContainer.value || scene) return
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)
  
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)
  
  // 添加方向光
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
  directionalLight1.position.set(10, 10, 5)
  scene.add(directionalLight1)
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
  directionalLight2.position.set(-10, 10, 10)
  scene.add(directionalLight2)
  
  // 创建相机
  const containerWidth = canvasContainer.value.clientWidth
  const containerHeight = canvasContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 1000)
  camera.position.set(0, 10, 20)
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(containerWidth, containerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  canvasContainer.value.appendChild(renderer.domElement)
  
  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = autoRotate.value
  controls.autoRotateSpeed = 0.5
  controls.minDistance = 5
  controls.maxDistance = 50
  
  // 加载模型
  loadModel()
  
  // 渲染循环
  animate()
  
  // 窗口大小监听
  window.addEventListener('resize', onWindowResize)
}

// 加载GLB模型
function loadModel(buildingId = selectedBuildingFor3D.value || 'yingxian-wooden-pagoda') {
  // 取消之前未完成的加载请求
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  // 创建新的取消控制器
  abortController = new AbortController()
  
  // 加载超时处理
  const timeoutId = setTimeout(() => {
    if (abortController && !abortController.signal.aborted) {
      abortController.abort('加载超时')
      if (loadId === currentLoadId) {
        modelLoading.value = false
        modelError.value = true
        modelSwitching.value = false
        abortController = null
      }
    }
  }, 30000) // 30秒超时
  
  modelLoading.value = true
  modelError.value = false
  modelSwitching.value = true
  currentLoadId++ // 每次加载递增ID，解决竞态问题
  const loadId = currentLoadId
  
   // 清理旧模型，添加淡出动画
   if (model) {
     // 淡出动画
     gsap.to(model.material || model.children[0]?.material, {
       opacity: 0,
       duration: 0.2,
       onComplete: () => {
         scene.remove(model)
         model.traverse((child) => {
           if (child.geometry) child.geometry.dispose()
           if (child.material) {
             Array.isArray(child.material) 
               ? child.material.forEach(m => m.dispose())
               : child.material.dispose()
           }
         })
         model = null
       }
     })
   }
  
  const building = allBuildings.value.find(b => b.id === buildingId)
  const modelFile = building?.model || 'yingzhoumuta.glb'
  
  const loader = new GLTFLoader()
  loader.load(
    `${import.meta.env.BASE_URL}models/${modelFile}`,
    (gltf) => {
      clearTimeout(timeoutId)
      // 已取消或不是最新请求直接忽略
      if (loadId !== currentLoadId || abortController?.signal.aborted) return
      
      model = gltf.scene
      // 调整模型大小和位置
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 10 / maxDim
      model.scale.setScalar(scale)
      
      // 居中模型
      const center = box.getCenter(new THREE.Vector3())
      model.position.x = -center.x * scale
      model.position.y = -center.y * scale
      model.position.z = -center.z * scale
      
      // 设置模型初始状态用于动画
      model.traverse((child) => {
        if (child.material) {
          child.material.transparent = true
          child.material.opacity = 0
        }
      })
      const originalScale = model.scale.clone()
      model.scale.setScalar(originalScale.x * 0.8)
      
      scene.add(model)
      
      // 模型淡入+缩放动画
      gsap.to(model.scale, {
        x: originalScale.x,
        y: originalScale.y,
        z: originalScale.z,
        duration: 0.4,
        ease: 'back.out(1.5)'
      })
      model.traverse((child) => {
        if (child.material) {
          gsap.to(child.material, {
            opacity: 1,
            duration: 0.4
          })
        }
      })
      
      modelLoading.value = false
      modelSwitching.value = false
      abortController = null
      
      // 添加热区（示例）
      addHotspots()
    },
    (xhr) => {
      if (abortController?.signal.aborted) return
      console.log(`模型加载进度: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`)
    },
    (error) => {
      clearTimeout(timeoutId)
      // 取消导致的错误不需要处理
      if (error.name === 'AbortError' || loadId !== currentLoadId || abortController?.signal.aborted) {
        if (loadId === currentLoadId) {
          modelSwitching.value = false
        }
        return
      }
      console.error('模型加载失败:', error)
      modelLoading.value = false
      modelError.value = true
      modelSwitching.value = false
      abortController = null
    },
    abortController.signal // 传递取消信号
  )
}

// 添加知识点热区
function addHotspots() {
  // 这里可以根据模型实际结构添加热区，示例添加几个热区
  const hotspots = [
    { position: new THREE.Vector3(0, 8, 0), title: '塔刹', content: '应县木塔塔刹由铁铸成，高10米，由基座、仰莲、相轮、圆光、仰月、宝盖、宝珠组成，制作精巧，造型优美。' },
    { position: new THREE.Vector3(0, 3, 0), title: '斗拱结构', content: '全塔采用54种斗拱结构，不用一根铁钉，通过榫卯连接实现结构稳固，具有极强的抗震性能。' },
    { position: new THREE.Vector3(0, 0, 0), title: '双层套筒结构', content: '采用内外双层套筒结构设计，类似现代高层建筑的剪力墙结构，极大增强了塔身的整体稳定性。' }
  ]
  
  // 点击事件监听
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  
  renderer.domElement.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    
    // 检测点击热区
    hotspots.forEach(hotspot => {
      const distance = raycaster.ray.origin.distanceTo(hotspot.position)
      if (distance < 2) {
        currentHotspot.value = { title: hotspot.title, content: hotspot.content }
        showHotspotInfo.value = true
      }
    })
  })
}

// 渲染动画
function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// 窗口大小调整
function onWindowResize() {
  if (!canvasContainer.value || !camera || !renderer) return
  
  const containerWidth = canvasContainer.value.clientWidth
  const containerHeight = canvasContainer.value.clientHeight
  
  camera.aspect = containerWidth / containerHeight
  camera.updateProjectionMatrix()
  
  renderer.setSize(containerWidth, containerHeight)
}

// 切换自动旋转
function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
  if (controls) {
    controls.autoRotate = autoRotate.value
  }
}

// 重置视角
function resetView() {
  if (controls) {
    controls.reset()
    camera.position.set(0, 10, 20)
    controls.update()
  }
}

// 销毁3D场景，释放资源
function destroy3DScene() {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && canvasContainer.value) {
      canvasContainer.value.removeChild(renderer.domElement)
    }
  }
  if (controls) {
    controls.dispose()
  }
  scene = null
  camera = null
  renderer = null
  controls = null
  model = null
  window.removeEventListener('resize', onWindowResize)
}

// 监听功能切换，进入3D模块时初始化场景，离开时销毁
watch(activeFeature, (newVal, oldVal) => {
  if (newVal === '3d') {
    nextTick(() => {
      init3DScene()
    })
  } else if (oldVal === '3d') {
    destroy3DScene()
  }
})

onUnmounted(() => {
  destroy3DScene()
})
</script>

<style scoped>
/* 动态云纹背景 */
.cloud-bg {
  animation: cloudMove 60s linear infinite;
}
@keyframes cloudMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-50%, -50%); }
}

/* 漂浮粒子 */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: floatUp linear infinite;
}
@keyframes floatUp {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity, 0.2);
    transform: translateY(90vh) scale(1);
  }
  90% {
    opacity: var(--opacity, 0.2);
  }
  100% {
    transform: translateY(-100px) scale(1.2);
    opacity: 0;
  }
}

/* 功能卡片动效 */
.feature-card {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}
.feature-card:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
.feature-card.inactive-feature:hover {
  transform: scale(1.02);
}
.feature-card.active-feature {
  box-shadow: 0 15px 35px rgba(196, 30, 58, 0.2);
  border-color: rgba(196, 30, 58, 0.3);
  background: linear-gradient(135deg, #fff 0%, rgba(196, 30, 58, 0.1) 100%);
}
.feature-icon {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.feature-card:hover .feature-icon {
  transform: scale(1.2) rotateY(10deg);
}
.selected-badge {
  animation: pulseBadge 2s ease-in-out infinite;
}
@keyframes pulseBadge {
  0%, 100% { transform: rotate(3deg) scale(1); }
  50% { transform: rotate(3deg) scale(1.05); }
}
.ink-spread {
  border-radius: 50%;
}
.feature-card:hover .ink-spread {
  border-radius: 0;
}

/* 测验相关动画 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.bounce-in-enter-active {
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 进度条动画 */
.progress-bar {
  transition: width 0.5s ease;
}

/* 选项按钮动效 */
.option-btn {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.option-index {
  transition: all 0.3s ease;
}
.option-btn:hover .option-index {
  background: #c41e3a;
  color: white;
  border-color: #c41e3a;
}

/* 全景卡片动效 */
.panorama-card {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.panorama-card:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
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
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
}
.btn-ancient:hover::before {
  left: 100%;
}

/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .feature-card {
    padding: 0 !important;
  }
  .feature-card.inactive-feature {
    opacity: 1 !important;
    transform: scale(1) !important;
    min-height: 200px;
  }
  .feature-card.active-feature {
    transform: scale(1) !important;
  }
  .progress-container {
    width: 100%;
  }
  .progress-bar {
    width: 100%;
  }
  .option-btn {
    padding: 1rem;
    font-size: 1rem;
  }
  .panorama-container .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
