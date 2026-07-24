<template>
  <div class="space-y-8">
    <!-- Header Hero -->
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3.5 py-1 rounded-full text-xs font-extrabold border border-amber-300">
        <i class="bi bi-stars"></i>
        <span>Panggung Kehormatan 17 Agustus</span>
      </div>
      <h1 class="text-3xl font-black text-slate-900 tracking-tight font-heading">
        HALL OF FAME PEMENANG
      </h1>
      <p class="text-xs sm:text-sm text-slate-500">
        Daftar pahlawan perlombaan Kemerdekaan RI yang berhasil meraih podium kejuaraan.
      </p>
    </div>

    <!-- Winners Grid per Competition -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="comp in store.competitions"
        :key="comp.id"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs p-6 space-y-5 hover:shadow-md transition-all"
      >
        <!-- Comp Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
              {{ comp.category }}
            </span>
            <h2 class="text-lg font-extrabold text-slate-900 mt-1">{{ comp.name }}</h2>
          </div>
          <span class="text-xs font-mono font-bold text-slate-400">
            {{ comp.location }}
          </span>
        </div>

        <!-- Podium Row -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Juara 1 -->
          <div class="bg-gradient-to-b from-amber-50 to-amber-100/50 p-3.5 rounded-2xl border border-amber-300 text-center flex flex-col justify-between">
            <div>
              <span class="text-2xl block mb-1">🥇</span>
              <span class="text-[10px] font-black text-amber-800 uppercase block">JUARA 1</span>
              <h3 class="font-extrabold text-slate-900 text-xs mt-1 line-clamp-1">
                {{ getWinnerName(comp.id, 1) }}
              </h3>
            </div>
            <span class="mt-2 text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full inline-block">
              +{{ comp.pointFirst }}pt
            </span>
          </div>

          <!-- Juara 2 -->
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center flex flex-col justify-between">
            <div>
              <span class="text-2xl block mb-1">🥈</span>
              <span class="text-[10px] font-black text-slate-600 uppercase block">JUARA 2</span>
              <h3 class="font-extrabold text-slate-900 text-xs mt-1 line-clamp-1">
                {{ getWinnerName(comp.id, 2) }}
              </h3>
            </div>
            <span class="mt-2 text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full inline-block">
              +{{ comp.pointSecond }}pt
            </span>
          </div>

          <!-- Juara 3 -->
          <div class="bg-amber-900/5 p-3.5 rounded-2xl border border-amber-800/20 text-center flex flex-col justify-between">
            <div>
              <span class="text-2xl block mb-1">🥉</span>
              <span class="text-[10px] font-black text-amber-900 uppercase block">JUARA 3</span>
              <h3 class="font-extrabold text-slate-900 text-xs mt-1 line-clamp-1">
                {{ getWinnerName(comp.id, 3) }}
              </h3>
            </div>
            <span class="mt-2 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
              +{{ comp.pointThird }}pt
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArenaStore } from '../stores/arenaStore';

const store = useArenaStore();

function getWinnerName(competitionId: string, rank: 1 | 2 | 3) {
  const winner = store.winners.find(w => w.competitionId === competitionId);
  if (!winner) return '-';

  let participantId = '';
  if (rank === 1) participantId = winner.firstPlaceId || '';
  if (rank === 2) participantId = winner.secondPlaceId || '';
  if (rank === 3) participantId = winner.thirdPlaceId || '';

  if (!participantId) return '-';
  const participant = store.getParticipantById(participantId);
  return participant ? participant.name : '-';
}
</script>
