<template>
  <div class="space-y-6">
    <!-- Top Banner Kemerdekaan Hero -->
    <div class="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-red-200 relative overflow-hidden">
      <div class="absolute -right-6 -bottom-10 opacity-15 text-white pointer-events-none text-9xl font-black font-heading">
        17
      </div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3">
          <i class="bi bi-flag-fill text-yellow-300"></i>
          <span>Dirgahayu Republik Indonesia Ke-81</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {{ store.settings.eventName }}
        </h1>
        <p class="text-red-100 text-xs sm:text-sm mt-2 leading-relaxed opacity-95">
          Sistem manajemen lomba Kemerdekaan 17 Agustus offline-first. Semua data tersimpan aman di browser dan mudah di-export/import antar laptop via Flashdisk.
        </p>
        <!-- Quick Action Row -->
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <router-link
            to="/registration"
            class="px-4 py-2.5 bg-white text-red-700 hover:bg-slate-50 font-bold text-sm rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <i class="bi bi-person-plus-fill"></i>
            <span>Pendaftaran Peserta</span>
          </router-link>

          <router-link
            to="/waiting-lounge"
            class="px-4 py-2.5 bg-red-800/80 hover:bg-red-800 text-white font-semibold text-sm rounded-lg border border-red-400/30 transition-all flex items-center gap-2"
          >
            <i class="bi bi-hourglass-split"></i>
            <span>Waiting Lounge</span>
          </router-link>

          <router-link
            to="/lucky-spin"
            class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <i class="bi bi-arrow-clockwise"></i>
            <span>Lucky Spin Doorprize</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- JSON Backup Notification Banner -->
    <div
      :class="[
        'p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
        isBackupOverdue
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      ]"
    >
      <div class="flex items-start space-x-3">
        <div
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 mt-0.5',
            isBackupOverdue
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
              : 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
          ]"
        >
          <i :class="isBackupOverdue ? 'bi bi-exclamation-triangle-fill' : 'bi bi-shield-check'"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-extrabold text-sm">
              {{ isBackupOverdue ? 'Peringatan Export Backup Data' : 'Backup JSON Terjadwal Aman' }}
            </h3>
            <span
              v-if="isBackupOverdue"
              class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-200 text-amber-900 animate-pulse"
            >
              Belum Backup >24 Jam
            </span>
            <span
              v-else
              class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-200 text-emerald-900"
            >
              Up to Date
            </span>
          </div>
          <p class="text-xs opacity-90 mt-0.5 leading-relaxed">
            <span v-if="isBackupOverdue">
              Data belum diexport dalam 24 jam terakhir. Ekspor sekarang untuk mencegah potensi kehilangan data saat mati lampu atau browser dibersihkan.
            </span>
            <span v-else>
              Backup JSON terakhir dilakukan pada: <strong>{{ lastBackupFormatted }}</strong>. Seluruh data lokal tersimpan rapi.
            </span>
          </p>
        </div>
      </div>

      <button
        @click="store.exportBackupJson()"
        class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
      >
        <i class="bi bi-download"></i>
        <span>Export JSON Sekarang</span>
      </button>
    </div>

    <!-- Stats Grid (Visual Statistics Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Lomba</p>
          <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <i class="bi bi-trophy text-lg"></i>
          </div>
        </div>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.totalCompetitions }}</h3>
          <span class="text-red-700 bg-red-50 border border-red-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Cabang</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">Peserta Terdaftar</p>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <i class="bi bi-people text-lg"></i>
          </div>
        </div>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.totalParticipants }}</h3>
          <span class="text-blue-700 bg-blue-50 border border-blue-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Orang</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">Juara Terdata</p>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <i class="bi bi-award text-lg"></i>
          </div>
        </div>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.totalWinners }}</h3>
          <span class="text-amber-700 bg-amber-50 border border-amber-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Podium</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-2">
          <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">Sertifikat Tercetak</p>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <i class="bi bi-patch-check text-lg"></i>
          </div>
        </div>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-extrabold text-slate-900">{{ stats.totalCertificates }}</h3>
          <span class="text-emerald-700 bg-emerald-50 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Terbit</span>
        </div>
      </div>
    </div>

    <!-- Live Lounge & Gender Stats Split -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Waiting Lounge Status Overview -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 class="font-bold text-slate-900 text-base">Status Lounge Peserta</h2>
            <p class="text-xs text-slate-500">Pantauan pendaftaran & status bertanding saat ini</p>
          </div>
          <router-link to="/waiting-lounge" class="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1">
            Lihat Lounge <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="p-4 bg-orange-50/80 border border-orange-200/80 rounded-xl">
            <span class="text-xs font-bold text-orange-700 uppercase tracking-wider block">Menunggu (Waiting)</span>
            <span class="text-2xl font-black text-orange-900 mt-1 block">{{ stats.waiting }}</span>
          </div>

          <div class="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl">
            <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Sedang Tampil</span>
            <span class="text-2xl font-black text-emerald-900 mt-1 block">{{ stats.playing }}</span>
          </div>

          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span class="text-xs font-bold text-slate-600 uppercase tracking-wider block">Selesai</span>
            <span class="text-2xl font-black text-slate-900 mt-1 block">{{ stats.finished }}</span>
          </div>
        </div>

        <!-- Category Distribution Bars -->
        <div>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Peserta Per Kategori</h3>
          <div class="space-y-3">
            <div v-for="cat in categoryDistribution" :key="cat.name" class="space-y-1">
              <div class="flex justify-between text-xs font-semibold text-slate-700">
                <span>{{ cat.name }}</span>
                <span>{{ cat.count }} Peserta ({{ cat.percent }}%)</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="cat.color"
                  :style="{ width: cat.percent + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demographics & Recent Activity -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
        <div>
          <h2 class="font-bold text-slate-900 text-base mb-1">Demografi Peserta</h2>
          <p class="text-xs text-slate-500 mb-4">Rincian jenis kelamin peserta terdaftar</p>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-center">
              <i class="bi bi-gender-male text-2xl text-blue-600 block mb-1"></i>
              <span class="text-2xl font-black text-blue-900 block">{{ genderCounts.L }}</span>
              <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">Laki-laki</span>
            </div>
            <div class="p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-center">
              <i class="bi bi-gender-female text-2xl text-rose-600 block mb-1"></i>
              <span class="text-2xl font-black text-rose-900 block">{{ genderCounts.P }}</span>
              <span class="text-xs font-bold text-rose-700 uppercase tracking-wider">Perempuan</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity Logs -->
        <div>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h3>
          <div class="space-y-2 text-xs">
            <div
              v-for="log in recentLogs"
              :key="log.id"
              class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2.5"
            >
              <i class="bi bi-clock-history text-slate-400 mt-0.5"></i>
              <div class="flex-1 min-w-0">
                <span class="font-bold text-slate-800 block truncate">{{ log.action }}</span>
                <span class="text-slate-500 text-[11px] block truncate">{{ log.details }}</span>
              </div>
            </div>
            <div v-if="recentLogs.length === 0" class="text-slate-400 text-center py-2">
              Belum ada aktivitas.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

const store = useArenaStore();
const stats = computed(() => store.dashboardStats);

const isBackupOverdue = computed(() => {
  const last = store.settings.lastBackupAt;
  if (!last) return true;
  const diffHours = (new Date().getTime() - new Date(last).getTime()) / (1000 * 60 * 60);
  return diffHours >= 24;
});

const lastBackupFormatted = computed(() => {
  const last = store.settings.lastBackupAt;
  if (!last) return 'Belum pernah di-export';
  return new Date(last).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const categoryDistribution = computed(() => {
  const categories = ['Anak-anak', 'Remaja', 'Dewasa', 'Umum'] as const;
  const colors: Record<string, string> = {
    'Anak-anak': 'bg-amber-500',
    'Remaja': 'bg-indigo-500',
    'Dewasa': 'bg-emerald-500',
    'Umum': 'bg-slate-700'
  };

  const total = store.participants.length || 1;

  return categories.map(cat => {
    // Count how many participants belong to competitions of this category
    const count = store.participants.filter(p => {
      const regs = store.getParticipantRegistrations(p.id);
      return regs.some(r => {
        const comp = store.getCompetitionById(r.competitionId);
        return comp?.category === cat;
      });
    }).length;

    const percent = Math.round((count / total) * 100);

    return {
      name: cat,
      count,
      percent,
      color: colors[cat]
    };
  });
});

const genderCounts = computed(() => {
  let L = 0;
  let P = 0;
  store.participants.forEach(p => {
    if (p.gender === 'L') L++;
    else if (p.gender === 'P') P++;
  });
  return { L, P };
});

const recentLogs = computed(() => {
  return store.history.slice(0, 4);
});
</script>
