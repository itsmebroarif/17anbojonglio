<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-calculator-fill text-red-600"></i>
          <span>Penilaian Lomba (Scoring Panel)</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Input nilai juri secara realtime, rekap otomatis, dan atur urutan pemenang dengan Drag & Drop.</p>
      </div>

      <!-- Select Competition -->
      <select
        v-model="selectedCompId"
        class="w-full sm:w-auto px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-2xs"
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
            <div class="flex items-center mb-1">
              <label class="block text-[11px] font-bold text-slate-700">Pilih Peserta *</label>
              <QuickHelpTooltip
                title="Pilih Peserta"
                content="Pilih nomor atau nama peserta yang sedang dinilai di panggung."
                position="top"
              />
            </div>
            <select
              v-model="scoreForm.participantId"
              required
              class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:outline-none"
            >
              <option value="">-- Pilih Peserta --</option>
              <option v-for="reg in compRegistrations" :key="reg.id" :value="reg.participantId">
                {{ reg.participantNumber }} - {{ store.getParticipantById(reg.participantId)?.name }}
              </option>
            </select>
          </div>

          <div>
            <div class="flex items-center mb-1">
              <label class="block text-[11px] font-bold text-slate-700">Nama Juri *</label>
              <QuickHelpTooltip
                title="Identitas Juri"
                content="Gunakan nama unik juri penilai untuk transparansi rekap poin (misal: Juri 1, Pak RW, Bu RT)."
                example="Juri 1 (Bpk. Mulyadi)"
                position="top"
              />
            </div>
            <input
              v-model="scoreForm.judgeName"
              required
              type="text"
              placeholder="e.g. Juri 1 (Pak RT)"
              class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <div class="flex items-center mb-1">
              <label class="block text-[11px] font-bold text-slate-700">Nilai / Poin *</label>
              <QuickHelpTooltip
                title="Skala Nilai"
                content="Input angka bulat (misal 50 - 100). Sistem akan secara otomatis menghitung total & rata-rata nilai seluruh juri."
                example="88"
                position="top"
              />
            </div>
            <input
              v-model.number="scoreForm.score"
              required
              type="number"
              min="0"
              max="1000"
              placeholder="e.g. 95"
              class="w-full px-3 py-2 border border-slate-300 bg-white text-red-600 rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>

          <div class="flex items-end">
            <button
              type="submit"
              class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              Catat Nilai
            </button>
          </div>
        </form>
      </div>

      <!-- Recapped Score Leaderboard Table with Drag & Drop Manual Ordering -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-900 text-sm">Rekapitulasi Nilai & Urutan Juara</h3>
              <span
                v-if="isManualOrder"
                class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1"
              >
                <i class="bi bi-hand-index-thumb-fill"></i> Urutan Manual (Drag & Drop)
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Geser baris (Drag & Drop) atau gunakan tombol panah <i class="bi bi-arrow-up-down"></i> untuk mengubah urutan juara secara manual.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="isManualOrder"
              @click="resetToAutoCalculated"
              class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
              title="Kembalikan urutan berdasarkan kalkulasi total poin terbanyak"
            >
              <i class="bi bi-arrow-counterclockwise"></i>
              <span>Reset Auto-Order</span>
            </button>

            <button
              @click="autoSaveWinners"
              class="w-full md:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <i class="bi bi-trophy-fill text-amber-300"></i>
              <span>Tetapkan Juara 1, 2, 3</span>
            </button>
          </div>
        </div>

        <!-- Desktop Table with Drag & Drop (sm and up) -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-500 uppercase font-bold select-none">
              <tr>
                <th class="p-3.5 w-12 text-center">Atur</th>
                <th class="p-3.5 w-28">Peringkat</th>
                <th class="p-3.5 w-24">No. Reg</th>
                <th class="p-3.5">Nama Peserta</th>
                <th class="p-3.5">Rincian Nilai Juri</th>
                <th class="p-3.5 text-right w-24">Total Nilai</th>
                <th class="p-3.5 text-right w-24">Rata-Rata</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(row, idx) in manualStandings"
                :key="row.participant.id"
                draggable="true"
                @dragstart="onDragStart(idx, $event)"
                @dragover.prevent="onDragOver(idx)"
                @drop.prevent="onDrop(idx)"
                @dragend="onDragEnd"
                class="hover:bg-slate-50 transition-colors cursor-grab active:cursor-grabbing select-none"
                :class="[
                  draggedIndex === idx ? 'opacity-40 bg-amber-50' : '',
                  dragOverIndex === idx && draggedIndex !== idx ? 'bg-amber-100/60 border-t-2 border-amber-500' : ''
                ]"
              >
                <!-- Drag Handle & Controls -->
                <td class="p-3.5 text-center">
                  <div class="flex items-center justify-center space-x-1 text-slate-400 hover:text-slate-700">
                    <i class="bi bi-grip-vertical text-lg cursor-grab"></i>
                    <div class="flex flex-col">
                      <button
                        type="button"
                        @click.stop="moveUp(idx)"
                        :disabled="idx === 0"
                        class="p-0.5 hover:text-red-600 disabled:opacity-20 transition-colors"
                        title="Naikkan Posisi"
                      >
                        <i class="bi bi-chevron-up text-[10px]"></i>
                      </button>
                      <button
                        type="button"
                        @click.stop="moveDown(idx)"
                        :disabled="idx === manualStandings.length - 1"
                        class="p-0.5 hover:text-red-600 disabled:opacity-20 transition-colors"
                        title="Turunkan Posisi"
                      >
                        <i class="bi bi-chevron-down text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </td>

                <!-- Rank Badge -->
                <td class="p-3.5 font-bold">
                  <div class="flex items-center space-x-2">
                    <span
                      class="px-2.5 py-1 rounded-lg font-black text-xs inline-flex items-center gap-1 shadow-2xs"
                      :class="[
                        idx === 0 ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300' :
                        idx === 1 ? 'bg-slate-300 text-slate-900' :
                        idx === 2 ? 'bg-amber-800 text-amber-100' :
                        'bg-slate-100 text-slate-600'
                      ]"
                    >
                      <span v-if="idx === 0">🥇 Juara 1</span>
                      <span v-else-if="idx === 1">🥈 Juara 2</span>
                      <span v-else-if="idx === 2">🥉 Juara 3</span>
                      <span v-else>#{{ idx + 1 }}</span>
                    </span>
                  </div>
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
                    <span v-if="row.scores.length === 0" class="text-[10px] text-slate-400 italic">Belum ada nilai</span>
                  </div>
                </td>

                <td class="p-3.5 text-right font-extrabold text-slate-900 text-sm">
                  {{ row.totalScore }}
                </td>

                <td class="p-3.5 text-right font-bold text-red-600 text-sm">
                  {{ row.avgScore }}
                </td>
              </tr>

              <tr v-if="manualStandings.length === 0">
                <td colspan="7" class="p-8 text-center text-slate-400">
                  Belum ada peserta terdaftar atau nilai juri yang dimasukkan untuk cabang lomba ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards View (< sm) with Drag/Up-Down Controls -->
        <div class="block sm:hidden divide-y divide-slate-100 p-3 space-y-3 bg-slate-50/50">
          <div
            v-for="(row, idx) in manualStandings"
            :key="'mob-sc-' + row.participant.id"
            class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
            :class="{ 'ring-2 ring-amber-400': idx < 3 }"
          >
            <!-- Header: Rank, Controls & Reg Number -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span
                  class="px-2.5 py-1 rounded-lg font-black text-xs inline-flex items-center gap-1 shadow-2xs"
                  :class="[
                    idx === 0 ? 'bg-amber-400 text-slate-900' :
                    idx === 1 ? 'bg-slate-300 text-slate-900' :
                    idx === 2 ? 'bg-amber-800 text-amber-100' :
                    'bg-slate-100 text-slate-600'
                  ]"
                >
                  <span v-if="idx === 0">🥇 Juara 1</span>
                  <span v-else-if="idx === 1">🥈 Juara 2</span>
                  <span v-else-if="idx === 2">🥉 Juara 3</span>
                  <span v-else>#{{ idx + 1 }}</span>
                </span>

                <span class="font-bold text-slate-900 text-sm">
                  {{ row.participant.name }}
                </span>
              </div>

              <!-- Reorder Up/Down Mobile Buttons -->
              <div class="flex items-center space-x-1">
                <button
                  type="button"
                  @click="moveUp(idx)"
                  :disabled="idx === 0"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 rounded-lg text-xs"
                  title="Naikkan Urutan Juara"
                >
                  <i class="bi bi-arrow-up"></i>
                </button>
                <button
                  type="button"
                  @click="moveDown(idx)"
                  :disabled="idx === manualStandings.length - 1"
                  class="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-700 rounded-lg text-xs"
                  title="Turunkan Urutan Juara"
                >
                  <i class="bi bi-arrow-down"></i>
                </button>
              </div>
            </div>

            <!-- Scores Breakdown -->
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rincian Nilai Juri:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="s in row.scores"
                  :key="s.id"
                  class="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700"
                >
                  {{ s.judgeName }}: <strong>{{ s.score }}</strong>
                </span>
                <span v-if="row.scores.length === 0" class="text-xs text-slate-400 italic">Belum ada nilai</span>
              </div>
            </div>

            <!-- Footer: Total & Avg -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span class="text-slate-500 font-medium">Total Nilai: </span>
                <span class="font-black text-slate-900 text-sm">{{ row.totalScore }}</span>
              </div>
              <div>
                <span class="text-slate-500 font-medium">Rata-Rata: </span>
                <span class="font-extrabold text-red-600 text-sm">{{ row.avgScore }}</span>
              </div>
            </div>
          </div>

          <div v-if="manualStandings.length === 0" class="p-6 text-center text-slate-400 text-xs">
            Belum ada peserta terdaftar atau nilai juri yang dimasukkan untuk cabang lomba ini.
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State Select Competition -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <i class="bi bi-calculator text-5xl text-slate-300 block mb-3"></i>
      <h2 class="text-lg font-bold text-slate-800">Pilih Perlombaan Terlebih Dahulu</h2>
      <p class="text-xs text-slate-500 mt-1">Pilih cabang perlombaan pada dropdown di kanan atas untuk mulai menginput nilai juri dan mengatur urutan juara.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import QuickHelpTooltip from '../components/QuickHelpTooltip.vue';
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

// Auto calculated score standings
const autoScoreStandings = computed(() => {
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

// Drag & drop reactive ordering state
const manualStandings = ref<any[]>([]);
const isManualOrder = ref(false);
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Synchronize manual standings when active competition changes or when auto scores change (if not manually altered)
watch([selectedCompId, autoScoreStandings], () => {
  if (!isManualOrder.value) {
    manualStandings.value = [...autoScoreStandings.value];
  } else {
    // Merge new participants/scores into existing manual order without losing manual arrangement
    const currentIds = manualStandings.value.map(row => row.participant.id);
    const updatedMap = new Map(autoScoreStandings.value.map(row => [row.participant.id, row]));

    const reordered = currentIds
      .map(id => updatedMap.get(id))
      .filter(Boolean) as any[];

    // Add any newly added participants to bottom
    autoScoreStandings.value.forEach(row => {
      if (!currentIds.includes(row.participant.id)) {
        reordered.push(row);
      }
    });

    manualStandings.value = reordered;
  }
}, { immediate: true });

function resetToAutoCalculated() {
  isManualOrder.value = false;
  manualStandings.value = [...autoScoreStandings.value];
  Swal.fire({
    icon: 'info',
    title: 'Urutan Direset',
    text: 'Peringkat dikembalikan ke urutan kalkulasi otomatis total nilai.',
    timer: 1200,
    showConfirmButton: false
  });
}

// Drag and drop handlers
function onDragStart(index: number, e: DragEvent) {
  draggedIndex.value = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
  }
}

function onDragOver(index: number) {
  dragOverIndex.value = index;
}

function onDrop(targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    onDragEnd();
    return;
  }

  const list = [...manualStandings.value];
  const [movedItem] = list.splice(draggedIndex.value, 1);
  list.splice(targetIndex, 0, movedItem);

  manualStandings.value = list;
  isManualOrder.value = true;
  onDragEnd();
}

function onDragEnd() {
  draggedIndex.value = null;
  dragOverIndex.value = null;
}

function moveUp(index: number) {
  if (index <= 0) return;
  const list = [...manualStandings.value];
  const temp = list[index];
  list[index] = list[index - 1];
  list[index - 1] = temp;
  manualStandings.value = list;
  isManualOrder.value = true;
}

function moveDown(index: number) {
  if (index >= manualStandings.value.length - 1) return;
  const list = [...manualStandings.value];
  const temp = list[index];
  list[index] = list[index + 1];
  list[index + 1] = temp;
  manualStandings.value = list;
  isManualOrder.value = true;
}

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
  if (manualStandings.value.length === 0) return;

  const first = manualStandings.value[0]?.participant.id;
  const second = manualStandings.value[1]?.participant.id;
  const third = manualStandings.value[2]?.participant.id;

  store.saveCompetitionWinners(selectedCompId.value, first, second, third);

  const firstName = manualStandings.value[0]?.participant.name || '-';
  const secondName = manualStandings.value[1]?.participant.name || '-';
  const thirdName = manualStandings.value[2]?.participant.name || '-';

  Swal.fire({
    icon: 'success',
    title: 'Juara Ditetapkan! 🏆',
    html: `
      <div class="text-left text-xs space-y-1.5 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <p>🥇 <strong>Juara 1:</strong> ${firstName}</p>
        <p>🥈 <strong>Juara 2:</strong> ${secondName}</p>
        <p>🥉 <strong>Juara 3:</strong> ${thirdName}</p>
      </div>
      <p class="text-xs text-slate-500 mt-3">Data juara telah disimpan ke database & Hall of Fame.</p>
    `,
    confirmButtonColor: '#dc2626'
  });
}
</script>
