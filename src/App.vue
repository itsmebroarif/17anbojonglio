<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
    <!-- Navbar (Hidden in full-screen competition board mode) -->
    <Navbar
      v-if="$route.path !== '/competition-board'"
      @toggleSidebar="isSidebarOpen = !isSidebarOpen"
      @openSearch="isSearchOpen = true"
      @openBulkWa="isBulkWaOpen = true"
      @openSqlConsole="isSqlConsoleOpen = true"
    />

    <div class="flex-1 flex">
      <!-- Sidebar (Hidden in competition board mode) -->
      <Sidebar
        v-if="$route.path !== '/competition-board'"
        :isOpen="isSidebarOpen"
        @close="isSidebarOpen = false"
      />

      <!-- Main Content Stage -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <router-view />
      </main>
    </div>

    <!-- Modals -->
    <GlobalSearchModal
      :isOpen="isSearchOpen"
      @close="isSearchOpen = false"
    />

    <GeminiChatModal
      :isOpen="isGeminiOpen"
      @close="isGeminiOpen = false"
    />

    <BulkWhatsAppModal
      :isOpen="isBulkWaOpen"
      @close="isBulkWaOpen = false"
    />

    <SqlKeywordConsoleModal
      :isOpen="isSqlConsoleOpen"
      @close="isSqlConsoleOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useArenaStore } from './stores/arenaStore';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import GlobalSearchModal from './components/GlobalSearchModal.vue';
import GeminiChatModal from './components/GeminiChatModal.vue';
import BulkWhatsAppModal from './components/BulkWhatsAppModal.vue';
import SqlKeywordConsoleModal from './components/SqlKeywordConsoleModal.vue';

const store = useArenaStore();
const isSidebarOpen = ref(false);
const isSearchOpen = ref(false);
const isGeminiOpen = ref(false);
const isBulkWaOpen = ref(false);
const isSqlConsoleOpen = ref(false);

onMounted(() => {
  store.init();
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === '/' && !isSearchOpen.value && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
    e.preventDefault();
    isSearchOpen.value = true;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
    e.preventDefault();
    isSqlConsoleOpen.value = !isSqlConsoleOpen.value;
  }
}
</script>
