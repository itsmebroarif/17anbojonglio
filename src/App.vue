<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
    <!-- Navbar (Hidden in full-screen competition board mode) -->
    <Navbar
      v-if="$route.path !== '/competition-board'"
      @toggleSidebar="isSidebarOpen = !isSidebarOpen"
      @openSearch="isSearchOpen = true"
      @openBulkWa="isBulkWaOpen = true"
      @openSqlConsole="isSqlConsoleOpen = true"
      @openShortcuts="isShortcutsOpen = true"
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

    <ShortcutsModal
      :isOpen="isShortcutsOpen"
      @close="isShortcutsOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useArenaStore } from './stores/arenaStore';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import GlobalSearchModal from './components/GlobalSearchModal.vue';
import GeminiChatModal from './components/GeminiChatModal.vue';
import BulkWhatsAppModal from './components/BulkWhatsAppModal.vue';
import SqlKeywordConsoleModal from './components/SqlKeywordConsoleModal.vue';
import ShortcutsModal from './components/ShortcutsModal.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const router = useRouter();

const isSidebarOpen = ref(false);
const isSearchOpen = ref(false);
const isGeminiOpen = ref(false);
const isBulkWaOpen = ref(false);
const isSqlConsoleOpen = ref(false);
const isShortcutsOpen = ref(false);

onMounted(() => {
  store.init();
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
});

function handleGlobalKeydown(e: KeyboardEvent) {
  const isInputTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

  // Ctrl+K or / for Search
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isSearchOpen.value = true;
    return;
  }
  if (e.key === '/' && !isSearchOpen.value && !isInputTarget) {
    e.preventDefault();
    isSearchOpen.value = true;
    return;
  }

  // Shift + ? or Ctrl + / for Shortcuts Help
  if ((e.key === '?' && e.shiftKey && !isInputTarget) || ((e.ctrlKey || e.metaKey) && e.key === '/')) {
    e.preventDefault();
    isShortcutsOpen.value = !isShortcutsOpen.value;
    return;
  }

  // Ctrl + S: Quick Save / Backup Local
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    store.saveAll();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Penyimpanan Cepat Disimpan!',
      text: 'Seluruh database lokal & log kegiatan panitia diperbarui.',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true
    });
    return;
  }

  // Ctrl + P: Quick Print
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
    // If not already in print modal, trigger window.print
    // Prevent default browser print if custom action handled or let window print fire cleanly
  }

  // Ctrl + G: AI Assistant Gemini
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
    e.preventDefault();
    isGeminiOpen.value = !isGeminiOpen.value;
    return;
  }

  // Ctrl + W: Bulk WhatsApp
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'w') {
    e.preventDefault();
    isBulkWaOpen.value = !isBulkWaOpen.value;
    return;
  }

  // Ctrl + Q: SQL Keyword Console
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
    e.preventDefault();
    isSqlConsoleOpen.value = !isSqlConsoleOpen.value;
    return;
  }

  // Alt + 1..8: Quick Page Navigation
  if (e.altKey) {
    const navRoutes: Record<string, string> = {
      '1': '/',
      '2': '/registration',
      '3': '/waiting-lounge',
      '4': '/scoring',
      '5': '/certificates',
      '6': '/competition-board',
      '7': '/arena-layout',
      '8': '/super-user-studio'
    };
    if (navRoutes[e.key]) {
      e.preventDefault();
      router.push(navRoutes[e.key]);
      return;
    }
  }
}
</script>

