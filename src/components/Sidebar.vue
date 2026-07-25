<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden transition-opacity"
    ></div>

    <aside
      :class="[
        'fixed lg:sticky top-0 lg:top-20 inset-y-0 left-0 z-40 lg:z-20 w-64 h-screen lg:h-[calc(100vh-5rem)] bg-white text-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between border-r border-slate-200 shadow-xl lg:shadow-none flex-shrink-0 transition-colors',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Navigation Menu Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-200 text-white font-black text-lg">
            17
          </div>
          <div>
            <h1 class="font-extrabold text-slate-900 leading-tight text-sm tracking-tight">CHAMPIONSHIP</h1>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ALL IN ONE</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

    <!-- Nav Links List -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="$emit('close')"
        class="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors group"
        :class="[
          $route.path === item.path
            ? 'bg-red-50 text-red-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <i :class="[item.icon, 'text-lg group-hover:scale-105 transition-transform', $route.path === item.path ? 'text-red-600' : 'text-slate-500']"></i>
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto px-2 py-0.5 text-xs font-bold rounded-full"
          :class="item.badgeClass || 'bg-slate-100 text-slate-600'"
        >
          {{ item.badge }}
        </span>
      </router-link>
    </nav>

    <!-- Dedicated TV Board / Public Stage Launcher (Separated from Admin Navigation) -->
    <div class="px-4 py-2.5 border-t border-slate-100">
      <router-link
        to="/competition-board"
        target="_blank"
        @click="$emit('close')"
        class="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all group border border-slate-700"
        title="Buka Layar Panggung Proyektor / TV Board di Tab/Window Terpisah"
      >
        <div class="flex items-center gap-2">
          <i class="bi bi-display-fill text-amber-400 text-sm group-hover:scale-110 transition-transform"></i>
          <span>Layar Panggung (TV)</span>
        </div>
        <span class="flex items-center gap-1 text-[10px] text-amber-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-600 font-mono">
          <span>Proyektor</span>
          <i class="bi bi-box-arrow-up-right text-[9px]"></i>
        </span>
      </router-link>
    </div>

    <!-- Footer System Status Card -->
    <div class="p-4 border-t border-slate-100">
      <div class="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-transparent">
        <div class="flex justify-between text-[10px] uppercase font-bold opacity-60 tracking-wider">
          <span>Offline Mode</span>
          <span class="text-emerald-400">Active</span>
        </div>
        <div class="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
          <div class="h-full w-full bg-emerald-400"></div>
        </div>
        <p class="text-[11px] opacity-80 flex items-center justify-between">
          <span>Local Sync Ready</span>
          <span class="font-mono text-[10px] text-slate-400">v1.0</span>
        </p>
      </div>
    </div>
  </aside>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

defineProps<{ isOpen: boolean }>();
defineEmits(['close']);

const store = useArenaStore();

const navItems = computed(() => [
  { path: '/', label: 'Dashboard', icon: 'bi bi-grid-1x2-fill' },
  { path: '/competitions', label: 'Daftar Lomba', icon: 'bi bi-trophy-fill', badge: store.competitions.length },
  { path: '/registration', label: 'Registrasi Wizard', icon: 'bi bi-person-plus-fill' },
  { path: '/waiting-lounge', label: 'Waiting Lounge', icon: 'bi bi-hourglass-split', badge: store.dashboardStats.waiting, badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  { path: '/scoring', label: 'Penilaian (Scoring)', icon: 'bi bi-calculator-fill' },
  { path: '/results', label: 'Hasil Lomba', icon: 'bi bi-award-fill' },
  { path: '/resulting-point', label: 'Resulting Point', icon: 'bi bi-bar-chart-line-fill' },
  { path: '/hall-of-fame', label: 'Hall of Fame', icon: 'bi bi-stars' },
  { path: '/certificates', label: 'Cetak Sertifikat', icon: 'bi bi-patch-check-fill' },
  { path: '/lucky-spin', label: 'Lucky Spin', icon: 'bi bi-arrow-clockwise' },
  { path: '/import-export', label: 'Import / Export', icon: 'bi bi-arrow-down-up' },
  { path: '/settings', label: 'Pengaturan', icon: 'bi bi-gear-fill' }
]);
</script>
