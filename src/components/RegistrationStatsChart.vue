<template>
  <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
    <!-- Chart Header & Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <i class="bi bi-bar-chart-line-fill text-red-600"></i>
            <span>Grafik Statistik Pendaftaran Lomba</span>
          </h2>
          <span class="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-extrabold text-[10px] border border-red-200">
            Powered by Recharts
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          Visualisasi interaktif jumlah peserta terdaftar per cabang perlombaan untuk evaluasi panitia.
        </p>
      </div>

      <!-- Mode Toggle & Filter Category -->
      <div class="flex items-center space-x-2">
        <div class="bg-slate-100 p-0.5 rounded-xl flex items-center gap-1 text-[11px] font-bold">
          <button
            @click="chartMode = 'recharts'"
            class="px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            :class="chartMode === 'recharts' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <i class="bi bi-pie-chart-fill"></i>
            <span>Recharts Bar</span>
          </button>
          <button
            @click="chartMode = 'custom'"
            class="px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            :class="chartMode === 'custom' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <i class="bi bi-bar-chart-fill"></i>
            <span>Grafik Kartu</span>
          </button>
        </div>

        <select
          v-if="chartMode === 'custom'"
          v-model="selectedCategory"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="Anak-anak">Anak-anak</option>
          <option value="Remaja">Remaja</option>
          <option value="Dewasa">Dewasa</option>
          <option value="Umum">Umum</option>
        </select>
      </div>
    </div>

    <!-- Quick Insight Badges -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
          <i class="bi bi-trophy-fill"></i>
        </div>
        <div>
          <span class="text-slate-400 text-[10px] uppercase font-bold block">Terfavorit:</span>
          <span class="font-extrabold text-slate-900 block truncate max-w-[150px]">
            {{ topCompetition ? topCompetition.name : 'Belum Ada' }}
          </span>
        </div>
      </div>

      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
          <i class="bi bi-people-fill"></i>
        </div>
        <div>
          <span class="text-slate-400 text-[10px] uppercase font-bold block">Total Registrasi:</span>
          <span class="font-extrabold text-slate-900 block">
            {{ totalRegistrationsCount }} Peserta
          </span>
        </div>
      </div>

      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
          <i class="bi bi-calculator-fill"></i>
        </div>
        <div>
          <span class="text-slate-400 text-[10px] uppercase font-bold block">Rata-Rata / Lomba:</span>
          <span class="font-extrabold text-slate-900 block">
            {{ avgParticipantsPerComp }} Peserta
          </span>
        </div>
      </div>
    </div>

    <!-- Recharts View Mode -->
    <div v-if="chartMode === 'recharts'">
      <RechartsRegistrationContainer :data="rechartsData" />
    </div>

    <!-- Custom SVG Bar Chart Container -->
    <div v-else class="relative pt-2">
      <div v-if="chartData.length > 0" class="space-y-3">
        <!-- SVG Canvas Area -->
        <div class="w-full h-64 sm:h-72 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <!-- Y-Axis Grid Lines & Values -->
          <div class="absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
            <div class="border-b border-slate-400 w-full flex justify-between">
              <span class="text-[9px] font-mono text-slate-600 -mt-2">{{ maxScale }}</span>
            </div>
            <div class="border-b border-slate-400 w-full flex justify-between">
              <span class="text-[9px] font-mono text-slate-600 -mt-2">{{ Math.round(maxScale * 0.75) }}</span>
            </div>
            <div class="border-b border-slate-400 w-full flex justify-between">
              <span class="text-[9px] font-mono text-slate-600 -mt-2">{{ Math.round(maxScale * 0.5) }}</span>
            </div>
            <div class="border-b border-slate-400 w-full flex justify-between">
              <span class="text-[9px] font-mono text-slate-600 -mt-2">{{ Math.round(maxScale * 0.25) }}</span>
            </div>
            <div class="border-b border-slate-400 w-full"></div>
          </div>

          <!-- Bars Render Container -->
          <div class="relative z-10 flex items-end justify-around h-full pt-6 pb-2 px-2 gap-2 sm:gap-4 overflow-x-auto">
            <div
              v-for="item in chartData"
              :key="item.id"
              class="flex-1 min-w-[36px] max-w-[64px] h-full flex flex-col items-center justify-end group cursor-pointer"
              @mouseenter="activeHoverId = item.id"
              @mouseleave="activeHoverId = null"
            >
              <!-- Number Value Label on top of bar -->
              <span class="text-[10px] font-black text-slate-700 mb-1 transition-all group-hover:scale-110">
                {{ item.count }}
              </span>

              <!-- Animated Gradient Bar -->
              <div class="w-full bg-slate-200 rounded-t-xl overflow-hidden relative flex items-end" :style="{ height: item.heightPercent + '%' }">
                <div
                  class="w-full h-full transition-all duration-500 rounded-t-xl shadow-xs"
                  :class="item.colorClass"
                ></div>
              </div>

              <!-- X-Axis Label -->
              <span class="text-[10px] font-bold text-slate-600 mt-2 truncate max-w-[56px] text-center" :title="item.name">
                {{ item.prefix || item.name }}
              </span>

              <!-- Hover Tooltip Popup -->
              <div
                v-if="activeHoverId === item.id"
                class="absolute bottom-16 z-30 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 min-w-[180px] pointer-events-none animate-fade-in border border-slate-700"
              >
                <div class="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span class="font-extrabold text-amber-400">{{ item.name }}</span>
                  <span class="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-mono text-slate-300">
                    {{ item.prefix }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-300 flex justify-between pt-0.5">
                  <span>Total Peserta:</span>
                  <strong class="text-white font-extrabold">{{ item.count }} Orang</strong>
                </div>
                <div class="text-[10px] text-slate-400 flex justify-between">
                  <span>👨 Laki-Laki:</span>
                  <span>{{ item.maleCount }}</span>
                </div>
                <div class="text-[10px] text-slate-400 flex justify-between">
                  <span>👩 Perempuan:</span>
                  <span>{{ item.femaleCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend Footer -->
        <div class="flex flex-wrap items-center justify-center gap-4 text-[11px] pt-1 text-slate-600 font-semibold">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-amber-500"></span>
            <span>Anak-anak</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-indigo-500"></span>
            <span>Remaja</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-emerald-500"></span>
            <span>Dewasa</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-slate-700"></span>
            <span>Umum</span>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center text-slate-400 text-xs">
        Belum ada data pendaftaran untuk kategori yang dipilih.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import RechartsRegistrationContainer from './RechartsRegistrationContainer.vue';

const store = useArenaStore();
const chartMode = ref<'recharts' | 'custom'>('recharts');
const selectedCategory = ref('ALL');
const activeHoverId = ref<string | null>(null);

const filteredComps = computed(() => {
  if (selectedCategory.value === 'ALL') return store.competitions;
  return store.competitions.filter(c => c.category === selectedCategory.value);
});

const rechartsData = computed(() => {
  return store.competitions.map(comp => {
    const regs = store.getRegistrationsByCompetition(comp.id);
    let maleCount = 0;
    let femaleCount = 0;

    regs.forEach(r => {
      const p = store.getParticipantById(r.participantId);
      if (p?.gender === 'L') maleCount++;
      if (p?.gender === 'P') femaleCount++;
    });

    return {
      id: comp.id,
      name: comp.name,
      prefix: comp.prefix,
      category: comp.category,
      count: regs.length,
      maleCount,
      femaleCount
    };
  });
});

const categoryColors: Record<string, string> = {
  'Anak-anak': 'bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500',
  'Remaja': 'bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500',
  'Dewasa': 'bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500',
  'Umum': 'bg-gradient-to-t from-slate-700 to-slate-500 hover:from-slate-800 hover:to-slate-600'
};

const rawChartData = computed(() => {
  return filteredComps.value.map(comp => {
    const regs = store.getRegistrationsByCompetition(comp.id);
    const count = regs.length;

    let maleCount = 0;
    let femaleCount = 0;

    regs.forEach(r => {
      const p = store.getParticipantById(r.participantId);
      if (p?.gender === 'L') maleCount++;
      if (p?.gender === 'P') femaleCount++;
    });

    return {
      id: comp.id,
      name: comp.name,
      prefix: comp.prefix,
      category: comp.category,
      count,
      maleCount,
      femaleCount,
      colorClass: categoryColors[comp.category] || categoryColors['Umum']
    };
  });
});

const maxScale = computed(() => {
  const max = Math.max(...rawChartData.value.map(d => d.count), 5);
  return Math.ceil(max / 5) * 5;
});

const chartData = computed(() => {
  const scale = maxScale.value;
  return rawChartData.value.map(item => ({
    ...item,
    heightPercent: scale > 0 ? Math.max(Math.round((item.count / scale) * 100), 4) : 4
  }));
});

const totalRegistrationsCount = computed(() => {
  return rawChartData.value.reduce((sum, item) => sum + item.count, 0);
});

const avgParticipantsPerComp = computed(() => {
  if (rawChartData.value.length === 0) return 0;
  return Math.round((totalRegistrationsCount.value / rawChartData.value.length) * 10) / 10;
});

const topCompetition = computed(() => {
  if (rawChartData.value.length === 0) return null;
  const sorted = [...rawChartData.value].sort((a, b) => b.count - a.count);
  return sorted[0].count > 0 ? sorted[0] : null;
});
</script>
