<template>
  <header class="sticky top-0 z-30 bg-white border-b border-slate-200 h-20 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
    <!-- Left: Mobile Toggle & Header Title / Badge -->
    <div class="flex items-center space-x-3 sm:space-x-4">
      <button
        @click="$emit('toggleSidebar')"
        class="lg:hidden p-2 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
        title="Toggle Navigation Menu"
      >
        <i class="bi bi-list text-2xl"></i>
      </button>

      <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
        <h2 class="text-base sm:text-xl font-black text-slate-900 leading-tight tracking-tight uppercase">
          CHAMPIONSHIP ALL IN ONE
        </h2>
        <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 w-fit border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ store.settings.location || 'Lapangan Warga Depok' }}</span>
        </span>
      </div>
    </div>

    <!-- Right: Quick Live Lounge Status Pill & Action Buttons -->
    <div class="flex items-center space-x-2 sm:space-x-3">
      <!-- Waiting / Bertanding Badge -->
      <div class="hidden xl:flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Antrean: <strong class="text-amber-800 font-bold">{{ store.dashboardStats.waiting }}</strong></span>
        </span>
        <span class="text-slate-300">|</span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Tampil: <strong class="text-emerald-800 font-bold">{{ store.dashboardStats.playing }}</strong></span>
        </span>
      </div>

      <!-- Search Button -->
      <button
        @click="$emit('openSearch')"
        class="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
      >
        <i class="bi bi-search text-slate-400"></i>
        <span class="hidden sm:inline">Cari Peserta...</span>
        <kbd class="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-500">
          /
        </kbd>
      </button>

      <!-- TV Board Link -->
      <router-link
        to="/competition-board"
        class="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
        title="Tampilan Layar TV Proyektor"
      >
        <i class="bi bi-display text-sm"></i>
        <span>TV Board</span>
      </router-link>

      <!-- Gemini AI Panitia Assistant Button -->
      <button
        @click="$emit('openGemini')"
        class="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-200 transition-all"
      >
        <i class="bi bi-stars"></i>
        <span>AI Panitia</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useArenaStore } from '../stores/arenaStore';

const store = useArenaStore();

defineEmits(['toggleSidebar', 'openSearch', 'openGemini']);
</script>
