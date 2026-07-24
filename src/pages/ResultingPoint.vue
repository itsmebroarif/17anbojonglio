<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-bar-chart-line-fill text-red-600"></i>
          <span>Klasemen Poin Keseluruhan (Resulting Point)</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">
          Akumulasi total poin dari seluruh perlombaan untuk menentukan Juara Umum Kemerdekaan.
        </p>
      </div>
    </div>

    <!-- Overall Leaderboard Podium Top 3 -->
    <div v-if="leaderboard.length >= 3" class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
      <!-- Rank 2 -->
      <div class="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-sm text-center relative overflow-hidden order-2 md:order-1">
        <span class="text-3xl block mb-2">🥈</span>
        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest block">PERINGKAT 2 (RUNNER UP)</span>
        <h2 class="text-xl font-extrabold text-slate-900 mt-1">{{ leaderboard[1].participant.name }}</h2>
        <span class="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-800 font-extrabold text-sm rounded-full">
          {{ leaderboard[1].totalPoints }} Total Poin
        </span>
      </div>

      <!-- Rank 1 Grand Champion -->
      <div class="bg-gradient-to-b from-amber-50 to-amber-100/60 p-6 rounded-2xl border-2 border-amber-400 shadow-md text-center relative overflow-hidden order-1 md:order-2 scale-105 z-10">
        <div class="absolute top-0 right-0 bg-amber-500 text-slate-900 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-widest">
          JUARA UMUM 👑
        </div>
        <span class="text-4xl block mb-2">🥇</span>
        <span class="text-xs font-extrabold text-amber-800 uppercase tracking-widest block">PERINGKAT 1 (JUARA UMUM)</span>
        <h2 class="text-2xl font-black text-slate-900 mt-1">{{ leaderboard[0].participant.name }}</h2>
        <span class="inline-block mt-3 px-4 py-1.5 bg-amber-400 text-slate-900 font-black text-base rounded-full shadow-xs">
          {{ leaderboard[0].totalPoints }} Total Poin
        </span>
      </div>

      <!-- Rank 3 -->
      <div class="bg-white p-6 rounded-2xl border-2 border-amber-800/30 shadow-sm text-center relative overflow-hidden order-3">
        <span class="text-3xl block mb-2">🥉</span>
        <span class="text-xs font-bold text-amber-900 uppercase tracking-widest block">PERINGKAT 3</span>
        <h2 class="text-xl font-extrabold text-slate-900 mt-1">{{ leaderboard[2].participant.name }}</h2>
        <span class="inline-block mt-3 px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-sm rounded-full">
          {{ leaderboard[2].totalPoints }} Total Poin
        </span>
      </div>
    </div>

    <!-- Overall Leaderboard Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div class="p-4 bg-slate-50 border-b border-slate-200">
        <h3 class="font-bold text-slate-900 text-sm">Klasemen Poin Peserta</h3>
        <p class="text-xs text-slate-500">Data poin diperbarui otomatis setiap kali pemenang lomba ditetapkan</p>
      </div>

      <!-- Desktop Table (sm and up) -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 text-slate-500 uppercase font-bold">
            <tr>
              <th class="p-3.5">Peringkat</th>
              <th class="p-3.5">Nama Peserta</th>
              <th class="p-3.5">Umur & Alamat</th>
              <th class="p-3.5">Rincian Perolehan Poin Lomba</th>
              <th class="p-3.5 text-right">Total Poin</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(item, idx) in leaderboard"
              :key="item.participant.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="p-3.5 font-bold">
                <span
                  class="w-7 h-7 rounded-full inline-flex items-center justify-center font-extrabold text-xs"
                  :class="[
                    idx === 0 ? 'bg-amber-400 text-slate-900' :
                    idx === 1 ? 'bg-slate-300 text-slate-900' :
                    idx === 2 ? 'bg-amber-800 text-amber-100' :
                    'bg-slate-100 text-slate-600'
                  ]"
                >
                  {{ idx + 1 }}
                </span>
              </td>

              <td class="p-3.5 font-extrabold text-slate-900 text-sm">
                {{ item.participant.name }}
              </td>

              <td class="p-3.5 text-slate-500">
                {{ item.participant.age }} Thn • {{ item.participant.address || 'Peserta RT/RW' }}
              </td>

              <td class="p-3.5">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(b, bIdx) in item.breakdown"
                    :key="bIdx"
                    class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-800 rounded font-medium text-[10px]"
                  >
                    {{ b.competitionName }} ({{ b.rankName }}: +{{ b.points }}pt)
                  </span>
                </div>
              </td>

              <td class="p-3.5 text-right font-black text-red-600 text-base">
                {{ item.totalPoints }} Poin
              </td>
            </tr>

            <tr v-if="leaderboard.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400">
                Belum ada perolehan poin. Tetapkan juara di menu Penilaian untuk mengisi klasemen poin.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards View (< sm) -->
      <div class="block sm:hidden divide-y divide-slate-100 p-3 space-y-3 bg-slate-50/50">
        <div
          v-for="(item, idx) in leaderboard"
          :key="'mob-rp-' + item.participant.id"
          class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
        >
          <!-- Card Header: Rank + Name -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span
                class="w-7 h-7 rounded-full inline-flex items-center justify-center font-extrabold text-xs"
                :class="[
                  idx === 0 ? 'bg-amber-400 text-slate-900' :
                  idx === 1 ? 'bg-slate-300 text-slate-900' :
                  idx === 2 ? 'bg-amber-800 text-amber-100' :
                  'bg-slate-100 text-slate-600'
                ]"
              >
                #{{ idx + 1 }}
              </span>
              <div>
                <h3 class="font-extrabold text-slate-900 text-sm">
                  {{ item.participant.name }}
                </h3>
                <p class="text-[11px] text-slate-500">
                  {{ item.participant.age }} Thn • {{ item.participant.address || 'Peserta RT/RW' }}
                </p>
              </div>
            </div>
            <span class="font-black text-red-600 text-base">
              {{ item.totalPoints }} pt
            </span>
          </div>

          <!-- Points Breakdown Tags -->
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pencapaian Poin:</span>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(b, bIdx) in item.breakdown"
                :key="bIdx"
                class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-800 rounded font-medium text-[10px]"
              >
                {{ b.competitionName }} ({{ b.rankName }}: +{{ b.points }}pt)
              </span>
            </div>
          </div>
        </div>

        <div v-if="leaderboard.length === 0" class="p-6 text-center text-slate-400 text-xs">
          Belum ada perolehan poin. Tetapkan juara di menu Penilaian untuk mengisi klasemen poin.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

const store = useArenaStore();
const leaderboard = computed(() => store.participantLeaderboard);
</script>
