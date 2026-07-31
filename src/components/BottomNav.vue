<template>
  <div>
    <!-- Bottom Navigation Bar for Mobile / Android Viewport -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1.5 py-1 flex items-center justify-around select-none">
      
      <!-- 1. Beranda -->
      <router-link
        to="/"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="route.path === '/' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-grid-1x2-fill text-lg"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5">Beranda</span>
        <span v-if="route.path === '/'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 2. Pendaftaran Peserta -->
      <router-link
        to="/registration"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/registration' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="route.path === '/registration' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-person-plus-fill text-lg"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5">Daftar</span>
        <span v-if="route.path === '/registration'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 3. Pemanggilan / Lounge (Crucial for Field Officers with Live Badge) -->
      <router-link
        to="/waiting-lounge"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/waiting-lounge' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all relative"
          :class="route.path === '/waiting-lounge' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-hourglass-split text-lg"></i>
          <!-- Live Waiting Count Badge -->
          <span
            v-if="store.dashboardStats.waiting > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white font-mono font-black text-[9px] rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse"
          >
            {{ store.dashboardStats.waiting > 99 ? '99+' : store.dashboardStats.waiting }}
          </span>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5">Lounge</span>
        <span v-if="route.path === '/waiting-lounge'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 4. Input Skor -->
      <router-link
        to="/scoring"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="route.path === '/scoring' ? 'text-red-600 font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="route.path === '/scoring' ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-trophy-fill text-lg"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5">Skor</span>
        <span v-if="route.path === '/scoring'" class="absolute bottom-0 w-4 h-1 bg-red-600 rounded-full"></span>
      </router-link>

      <!-- 5. Menu Lainnya (Triggers Mobile Android Bottom Sheet Drawer) -->
      <button
        type="button"
        @click="isMenuOpen = true"
        class="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-h-[48px] relative"
        :class="isMenuOpen ? 'text-red-600 font-black' : 'text-slate-500 hover:text-slate-800 font-semibold'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          :class="isMenuOpen ? 'bg-red-50 text-red-600 shadow-2xs' : 'bg-transparent'"
        >
          <i class="bi bi-grid-3x3-gap-fill text-lg"></i>
        </div>
        <span class="text-[10px] tracking-tight mt-0.5">Menu</span>
      </button>

    </nav>

    <!-- Android Slide-Up Bottom Sheet Drawer -->
    <div
      v-if="isMenuOpen"
      class="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in"
      @click.self="isMenuOpen = false"
    >
      <div class="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
        
        <!-- Bottom Sheet Drag Handle Bar -->
        <div class="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-2"></div>

        <!-- Header Sheet -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              17
            </div>
            <div>
              <h3 class="font-extrabold text-sm text-slate-900">Menu & Alat Panitia</h3>
              <p class="text-[10px] text-slate-500">Akses cepat ke seluruh fitur pendukung 17an Arena.</p>
            </div>
          </div>
          <button
            @click="isMenuOpen = false"
            class="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <i class="bi bi-x-lg text-xs"></i>
          </button>
        </div>

        <!-- Quick Search & AI Trigger Bar -->
        <div class="grid grid-cols-2 gap-2">
          <button
            @click="openSearchModal"
            class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-200"
          >
            <i class="bi bi-search text-red-600"></i>
            <span>Cari Peserta</span>
          </button>

          <button
            @click="openBulkWaModal"
            class="p-2.5 bg-emerald-600 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <i class="bi bi-whatsapp"></i>
            <span>Broadcast WA</span>
          </button>
        </div>

        <!-- All Navigation Grid (Android Native Icon Grid) -->
        <div class="space-y-2 pt-1">
          <h4 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Modul Kompetisi & Panitia</h4>
          
          <div class="grid grid-cols-3 gap-2.5 text-center text-xs">
            
            <router-link
              v-for="item in otherMenuItems"
              :key="item.path"
              :to="item.path"
              @click="isMenuOpen = false"
              class="flex flex-col items-center p-3 rounded-2xl border transition-all active:scale-95"
              :class="route.path === item.path ? 'bg-red-50 border-red-300 text-red-700 font-extrabold shadow-2xs' : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100 font-bold'"
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-1.5 shadow-2xs"
                :class="item.bgColor"
              >
                <i :class="item.icon"></i>
              </div>
              <span class="text-[10px] leading-tight font-extrabold">{{ item.title }}</span>
            </router-link>

          </div>
        </div>

        <!-- Quick System Stats Footer -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[11px] font-bold">{{ store.settings.location || 'Lokasi Panitia' }}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">Offline-First OK</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useArenaStore } from '../stores/arenaStore';

const emit = defineEmits(['openSearch', 'openBulkWa']);

const route = useRoute();
const store = useArenaStore();
const isMenuOpen = ref(false);

function openSearchModal() {
  isMenuOpen.value = false;
  emit('openSearch');
}

function openBulkWaModal() {
  isMenuOpen.value = false;
  emit('openBulkWa');
}

const otherMenuItems = [
  { title: 'Daftar Lomba', path: '/competitions', icon: 'bi bi-flag-fill', bgColor: 'bg-red-100 text-red-700' },
  { title: 'Hasil & Juara', path: '/results', icon: 'bi bi-award-fill', bgColor: 'bg-amber-100 text-amber-800' },
  { title: 'Sertifikat', path: '/certificates', icon: 'bi bi-patch-check-fill', bgColor: 'bg-emerald-100 text-emerald-800' },
  { title: 'Kartu Panitia', path: '/committee', icon: 'bi bi-person-badge-fill', bgColor: 'bg-purple-100 text-purple-800' },
  { title: 'Klasemen Umum', path: '/resulting-point', icon: 'bi bi-bar-chart-line-fill', bgColor: 'bg-blue-100 text-blue-800' },
  { title: 'Undian Spin', path: '/lucky-spin', icon: 'bi bi-gift-fill', bgColor: 'bg-rose-100 text-rose-800' },
  { title: 'Competition Board', path: '/competition-board', icon: 'bi bi-display-fill', bgColor: 'bg-slate-900 text-amber-400' },
  { title: 'Studio SQL', path: '/superuser', icon: 'bi bi-terminal-fill', bgColor: 'bg-indigo-100 text-indigo-800' },
  { title: 'Setelan App', path: '/settings', icon: 'bi bi-gear-fill', bgColor: 'bg-slate-200 text-slate-800' },
];
</script>
