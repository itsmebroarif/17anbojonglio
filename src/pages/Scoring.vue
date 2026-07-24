<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-calculator-fill text-red-600"></i>
          <span>Penilaian Lomba (Scoring Panel)</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Input nilai juri secara realtime, rekap otomatis, dan tentukan pemenang.</p>
      </div>

      <!-- Select Competition -->
      <select
        v-model="selectedCompId"
        class="px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-2xs"
      >
        <option value="">-- Pilih Perlombaan --</option>
        <option v-for="c in store.competitions" :key="c.id" :value="c.id">
          {{ c.name }} ({{ c.category }})
        </option>
      </select>
    </div>

    <!-- Active Competition Scoring Dashboard -->
    <div v-if="activeComp" class="space-y-6">
      <!-- Input Score Form Card -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-pen-fill text-amber-500"></i>
          <span>Form Input Nilai Juri ({{ activeComp.name }})</span>
        </h2>

        <form @submit.prevent="submitScore" class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Pilih Peserta *</label>
            <select
              v-model="scoreForm.participantId"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
            >
              <option value="">-- Pilih Peserta --</option>
              <option v-for="reg in compRegistrations" :key="reg.id" :value="reg.participantId">
                {{ reg.participantNumber }} - {{ store.getParticipantById(reg.participantId)?.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nama Juri *</label>
            <input
              v-model="scoreForm.judgeName"
              required
              type="text"
              placeholder="e.g. Juri 1 (Pak RT)"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nilai / Poin *</label>
            <input
              v-model.number="scoreForm.score"
              required
              type="number"
              min="0"
              max="1000"
              placeholder="e.g. 95"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-red-600 focus:outline-none"
            />
          </div>

          <div class="flex items-end">
            <button
              type="submit"
              class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Catat Nilai
            </button>
          </div>
        </form>
      </div>

      <!-- Recapped Score Leaderboard Table -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Rekapitulasi Nilai & Peringkat Sementara</h3>
            <p class="text-xs text-slate-500">Hitungan otomatis total & rata-rata nilai juri</p>
          </div>

          <button
            @click="autoSaveWinners"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-xs flex items-center gap-1.5"
          >
            <i class="bi bi-trophy-fill"></i>
            <span>Tetapkan Juara 1, 2, 3</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-500 uppercase font-bold">
              <tr>
                <th class="p-3.5">Rank</th>
                <th class="p-3.5">No. Reg</th>
                <th class="p-3.5">Nama Peserta</th>
                <th class="p-3.5">Rincian Nilai Juri</th>
                <th class="p-3.5 text-right">Total Nilai</th>
                <th class="p-3.5 text-right">Rata-Rata</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(row, idx) in scoreStandings"
                :key="row.participant.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="p-3.5 font-bold">
                  <span
                    class="w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs"
                    :class="[
                      idx === 0 ? 'bg-amber-400 text-slate-900 shadow-xs' :
                      idx === 1 ? 'bg-slate-300 text-slate-900' :
                      idx === 2 ? 'bg-amber-800 text-amber-100' :
                      'bg-slate-100 text-slate-600'
                    ]"
                  >
                    {{ idx + 1 }}
                  </span>
                </td>

                <td class="p-3.5 font-mono font-bold text-red-700">
                  {{ row.registration?.participantNumber }}
                </td>

                <td class="p-3.5 font-bold text-slate-900">
                  {{ row.participant.name }}
                </td>

                <td class="p-3.5">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="s in row.scores"
                      :key="s.id"
                      class="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700"
                    >
                      {{ s.judgeName }}: <strong>{{ s.score }}</strong>
                    </span>
                  </div>
                </td>

                <td class="p-3.5 text-right font-extrabold text-slate-900 text-sm">
                  {{ row.totalScore }}
                </td>

                <td class="p-3.5 text-right font-bold text-red-600 text-sm">
                  {{ row.avgScore }}
                </td>
              </tr>

              <tr v-if="scoreStandings.length === 0">
                <td colspan="6" class="p-8 text-center text-slate-400">
                  Belum ada peserta terdaftar atau nilai juri yang dimasukkan untuk cabang lomba ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State Select Competition -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <i class="bi bi-calculator text-5xl text-slate-300 block mb-3"></i>
      <h2 class="text-lg font-bold text-slate-800">Pilih Perlombaan Terlebih Dahulu</h2>
      <p class="text-xs text-slate-500 mt-1">Pilih cabang perlombaan pada dropdown di kanan atas untuk mulai menginput nilai juri.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCompId = ref('');

const scoreForm = reactive({
  participantId: '',
  judgeName: 'Juri 1',
  score: 90
});

const activeComp = computed(() => store.getCompetitionById(selectedCompId.value));

const compRegistrations = computed(() => {
  if (!selectedCompId.value) return [];
  return store.getRegistrationsByCompetition(selectedCompId.value);
});

const scoreStandings = computed(() => {
  if (!selectedCompId.value) return [];

  const map = new Map<string, { participant: any; registration: any; scores: any[]; totalScore: number; avgScore: number }>();

  compRegistrations.value.forEach(reg => {
    const part = store.getParticipantById(reg.participantId);
    if (!part) return;

    const scores = store.scores.filter(s => s.competitionId === selectedCompId.value && s.participantId === part.id);
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const avgScore = scores.length > 0 ? Math.round((totalScore / scores.length) * 10) / 10 : 0;

    map.set(part.id, {
      participant: part,
      registration: reg,
      scores,
      totalScore,
      avgScore
    });
  });

  return Array.from(map.values()).sort((a, b) => b.totalScore - a.totalScore);
});

function submitScore() {
  if (!selectedCompId.value || !scoreForm.participantId) return;

  store.addScore({
    competitionId: selectedCompId.value,
    participantId: scoreForm.participantId,
    judgeName: scoreForm.judgeName,
    score: scoreForm.score
  });

  Swal.fire({
    icon: 'success',
    title: 'Nilai Dicatat!',
    timer: 1200,
    showConfirmButton: false
  });

  scoreForm.score = 90;
}

function autoSaveWinners() {
  if (scoreStandings.value.length === 0) return;

  const first = scoreStandings.value[0]?.participant.id;
  const second = scoreStandings.value[1]?.participant.id;
  const third = scoreStandings.value[2]?.participant.id;

  store.saveCompetitionWinners(selectedCompId.value, first, second, third);

  Swal.fire({
    icon: 'success',
    title: 'Juara Ditetapkan! 🏆',
    text: 'Pemenang 1, 2, dan 3 telah disimpan ke database & Hall of Fame.',
    confirmButtonColor: '#dc2626'
  });
}
</script>
