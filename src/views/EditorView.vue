<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ComponentPalette from '../components/editor/ComponentPalette.vue';
import EditorCanvas from '../components/editor/EditorCanvas.vue';
import PropertiesPanel from '../components/editor/PropertiesPanel.vue';
import { useScreen } from '../composables/useScreen';
import { useTheme } from '../composables/useTheme';

const { 
    isPreview, togglePreview, generateShareUrl, loadFromCompressed, 
    selectedNodeId, exportJson, importJson, clearScreen,
    pages, activePageId, addPage, deletePage
} = useScreen();
const { isDark, toggleTheme, initTheme } = useTheme();
const route = useRoute();
const showClearConfirm = ref(false);

const copyShareLink = () => {
  const url = generateShareUrl();
  navigator.clipboard.writeText(url);
  alert('Link copied to clipboard!');
};

const confirmClear = () => {
    clearScreen();
    showClearConfirm.value = false;
};

onMounted(() => {
  initTheme();
  const data = route.query.data as string;
  if (data) {
    loadFromCompressed(data);
    isPreview.value = true;
  }
});
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-liquid-glass font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <!-- Header -->
    <header class="h-16 glass-panel m-4 mb-0 flex items-center justify-between px-6 flex-shrink-0 z-30">
      <div class="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
        </div>
        <span class="tracking-tight">Liquid Designer</span>
        <span v-if="isPreview" class="text-xs bg-blue-500/20 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full border border-blue-200/50 backdrop-blur-sm">Preview Mode</span>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Clear Button -->
        <button 
            @click="showClearConfirm = true"
            class="p-2 rounded-lg transition-all glass-button text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear Screen"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>

        <!-- Theme Toggle -->
        <button 
            @click="toggleTheme" 
            class="p-2 rounded-lg transition-all glass-button text-gray-700 dark:text-gray-200"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        </button>

        <div class="flex items-center bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-lg p-1 border border-white/40 dark:border-white/10 shadow-sm">
            <button 
                @click="togglePreview" 
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2"
                :class="isPreview ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10'"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
            </button>
            <div class="w-px h-4 bg-gray-400/30 dark:bg-white/20 mx-1"></div>
            <button @click="copyShareLink" class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-md transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
            </button>
            <div class="w-px h-4 bg-gray-400/30 dark:bg-white/20 mx-1"></div>
            <button @click="exportJson" class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-md transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
            </button>
            <div class="w-px h-4 bg-gray-400/30 dark:bg-white/20 mx-1"></div>
            <label class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 rounded-md transition-all flex items-center gap-2 cursor-pointer">
                <input type="file" class="hidden" accept=".json" @change="(e) => importJson((e.target as HTMLInputElement).files?.[0]!)" />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m-4 4v12" />
                </svg>
                Import
            </label>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden relative p-4 gap-4">
      <!-- Left Sidebar -->
      <transition name="slide-left">
        <div v-if="!isPreview" class="w-96 flex-shrink-0 h-full glass-panel z-20 overflow-hidden flex flex-col">
          <ComponentPalette />
        </div>
      </transition>

      <!-- Canvas Area -->
      <div class="flex-1 h-full overflow-hidden relative rounded-2xl flex flex-col gap-4">
        <!-- Pages Bar -->
        <div v-if="!isPreview" class="glass-panel p-2 flex items-center gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
            <div 
                v-for="page in pages" 
                :key="page.id"
                @click="activePageId = page.id"
                class="px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap group"
                :class="activePageId === page.id ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'"
            >
                <span v-if="activePageId === page.id" class="w-2 h-2 rounded-full bg-blue-500"></span>
                {{ page.title }}
                <button 
                    v-if="pages.length > 1"
                    @click.stop="deletePage(page.id)"
                    class="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-red-500 transition-opacity"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <button 
                @click="addPage"
                class="px-2 py-1.5 rounded-md hover:bg-white/50 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                title="Add Page"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        <div class="flex-1 overflow-hidden relative rounded-2xl">
            <EditorCanvas />
        </div>
      </div>

      <!-- Right Sidebar -->
      <transition name="slide-right">
        <div v-if="selectedNodeId && !isPreview" class="w-96 flex-shrink-0 h-full glass-panel z-20 overflow-hidden flex flex-col">
          <PropertiesPanel />
        </div>
      </transition>
    </div>

  <!-- Clear Confirmation Modal -->
  <div v-if="showClearConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div class="glass-panel p-6 max-w-sm w-full mx-4 shadow-2xl animate-fade-in-up">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Clear screen?</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6 text-sm">This will remove all components and pages. This action cannot be undone.</p>
          <div class="flex justify-end gap-3">
              <button 
                  @click="showClearConfirm = false"
                  class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                  Cancel
              </button>
              <button 
                  @click="confirmClear"
                  class="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all"
              >
                  Clear
              </button>
          </div>
      </div>
  </div>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>