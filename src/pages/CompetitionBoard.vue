<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <i class="bi bi-display-fill text-red-600"></i>
            <span>Competition Board Arena</span>
          </h1>
          <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-extrabold text-[10px] border border-red-200 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            LIVE ARENA
          </span>
        </div>
        <p class="text-xs sm:text-sm text-slate-500">Papan skor & status panggil panggung realtime untuk penonton, peserta, dan juri.</p>
      </div>

      <!-- Action Controls -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <!-- Competition Selector -->
        <select
          v-model="activeCompId"
          class="px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-2xs w-full sm:w-auto"
        >
          <option value="">-- Pilih Cabang Lomba --</option>
          <option v-for="c in store.competitions" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.category }})
          </option>
        </select>

        <button
          @click="isPrintPreviewOpen = true"
          class="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          title="Cetak Rekap Papan Lomba"
        >
          <i class="bi bi-printer-fill"></i>
          <span>Cetak Papan</span>
        </button>

        <button
          @click="toggleFullscreen"
          class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
          title="Layar Penuh / Fullscreen"
        >
          <i :class="isFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen'"></i>
          <span class="hidden md:inline">{{ isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen' }}</span>
        </button>
      </div>
    </div>

    <!-- Active Competition Info Header Card -->
    <div v-if="activeComp" class="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white p-5 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-red-600/10 skew-x-12 pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              {{ activeComp.category }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-200 font-mono text-[10px]">
              PREFIX: [{{ activeComp.prefix }}]
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase"
              :class="activeComp.status === 'Ongoing' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-200'"
            >
              {{ activeComp.status }}
            </span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {{ activeComp.name }}
          </h2>
          <p class="text-xs text-slate-300 mt-1 flex items-center gap-4 flex-wrap">
            <span><i class="bi bi-geo-alt-fill text-red-400"></i> {{ activeComp.location }}</span>
            <span><i class="bi bi-clock-fill text-amber-400"></i> {{ activeComp.date }} @ {{ activeComp.time }}</span>
            <span><i class="bi bi-people-fill text-emerald-400"></i> {{ totalRegisteredCount }} Peserta Terdaftar</span>
          </p>
        </div>

        <!-- Live Digital Clock -->
        <div class="bg-slate-900/80 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-slate-700 text-right self-start md:self-auto min-w-[140px]">
          <span class="text-[10px] text-slate-400 font-mono uppercase block font-bold">LIVE TIME</span>
          <span class="text-xl font-mono font-black text-amber-400 tracking-wider">{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <!-- Main Live Screen Area -->
    <div v-if="activeComp" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: NOW PLAYING / SEDANG BERTANDING -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-3xl border-2 border-red-500/40 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
              <h2 class="font-black text-lg text-slate-900 tracking-tight uppercase">
                NOW PLAYING / TAMPIL DIPANGGUNG
              </h2>
            </div>
            <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              {{ playingParticipants.length }} Peserta Tampil
            </span>
          </div>

          <!-- Active Performers Grid -->
          <div v-if="playingParticipants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="p in playingParticipants"
              :key="p.reg.id"
              class="bg-gradient-to-br from-red-50/80 to-amber-50/50 border-2 border-red-500 p-5 rounded-2xl flex items-center justify-between shadow-xs relative overflow-hidden"
            >
              <div class="flex items-center space-x-4">
                <div class="w-14 h-14 rounded-2xl bg-red-600 text-white font-extrabold font-mono text-xl flex items-center justify-center shadow-md shadow-red-200 flex-shrink-0">
                  {{ p.reg.participantNumber }}
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900 leading-snug">{{ p.part?.name }}</h3>
                  <p class="text-xs text-slate-600 mt-0.5">
                    Usia {{ p.part?.age }} Thn • {{ p.part?.address || 'Warga RT/RW' }}
                  </p>
                  <span class="inline-block mt-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded uppercase tracking-wider">
                    {{ p.reg.status }}
                  </span>
                </div>
              </div>

              <!-- Quick Status Advance Button -->
              <button
                @click="advanceStatus(p.reg.id, 'Finished')"
                class="px-2.5 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                title="Tandai Selesai Tampil"
              >
                <i class="bi bi-check-circle-fill"></i>
                <span>Selesai</span>
              </button>
            </div>
          </div>

          <!-- Empty Playing State -->
          <div v-else class="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <i class="bi bi-display text-4xl block mb-2 text-slate-300"></i>
            <p class="text-sm font-bold text-slate-700">Belum ada peserta yang tampil (Playing).</p>
            <p class="text-xs text-slate-500 mt-1">
              Panggil peserta dari antrean di sebelah kanan untuk memulai giliran tampil.
            </p>
          </div>
        </div>

        <!-- Realtime Leaderboard / Perolehan Sementara -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-black text-base text-slate-900 flex items-center gap-2">
              <i class="bi bi-trophy-fill text-amber-500"></i>
              <span>Klasemen & Skor Sementara (Live Standings)</span>
            </h3>
            <span class="text-xs text-slate-500 font-bold">Total Nilai Juri</span>
          </div>

          <div v-if="liveStandings.length > 0" class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                  <th class="py-2.5 px-3">Peringkat</th>
                  <th class="py-2.5 px-3">No. Reg</th>
                  <th class="py-2.5 px-3">Nama Peserta</th>
                  <th class="py-2.5 px-3 text-center">Jumlah Nilai</th>
                  <th class="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(row, idx) in liveStandings"
                  :key="row.reg.id"
                  class="hover:bg-slate-50/80 transition-colors"
                  :class="idx === 0 ? 'bg-amber-50/40' : idx === 1 ? 'bg-slate-50/60' : idx === 2 ? 'bg-amber-900/5' : ''"
                >
                  <td class="py-2.5 px-3 font-bold">
                    <span v-if="idx === 0" class="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      🏆 #1 Juara
                    </span>
                    <span v-else-if="idx === 1" class="px-2 py-0.5 rounded-full bg-slate-300 text-slate-900 font-black text-[10px]">
                      🥈 #2
                    </span>
                    <span v-else-if="idx === 2" class="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black text-[10px]">
                      🥉 #3
                    </span>
                    <span v-else class="text-slate-500 font-mono pl-2">#{{ idx + 1 }}</span>
                  </td>
                  <td class="py-2.5 px-3 font-mono font-bold text-slate-700">
                    {{ row.reg.participantNumber }}
                  </td>
                  <td class="py-2.5 px-3 font-bold text-slate-900">
                    {{ row.part?.name }}
                  </td>
                  <td class="py-2.5 px-3 text-center font-extrabold text-red-600 text-sm">
                    {{ row.totalScore }}
                  </td>
                  <td class="py-2.5 px-3 text-right">
                    <span
                      class="px-2 py-0.5 text-[10px] font-bold rounded uppercase"
                      :class="[
                        row.reg.status === 'Finished' ? 'bg-emerald-100 text-emerald-800' :
                        row.reg.status === 'Playing' ? 'bg-red-100 text-red-800 animate-pulse' :
                        'bg-slate-100 text-slate-600'
                      ]"
                    >
                      {{ row.reg.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="py-6 text-center text-slate-400 text-xs">
            Belum ada nilai juri dimasukkan untuk cabang lomba ini.
          </div>
        </div>
      </div>

      <!-- Right Col: NEXT QUEUE / ANTREAN PANGGIL -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 class="font-extrabold text-base text-amber-700 flex items-center gap-2">
              <i class="bi bi-hourglass-split"></i>
              <span>ANTREAN PESERTA</span>
            </h3>
            <span class="text-xs font-mono font-bold text-slate-500">
              {{ nextQueueParticipants.length }} Peserta
            </span>
          </div>

          <div class="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            <div
              v-for="p in nextQueueParticipants"
              :key="p.reg.id"
              class="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between transition-colors"
            >
              <div class="flex items-center space-x-3">
                <span class="font-mono font-black text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-300">
                  {{ p.reg.participantNumber }}
                </span>
                <div>
                  <h4 class="font-bold text-xs text-slate-800">{{ p.part?.name }}</h4>
                  <span
                    class="text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase"
                    :class="p.reg.status === 'Called' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'"
                  >
                    {{ p.reg.status }}
                  </span>
                </div>
              </div>

              <!-- Action to call or set playing -->
              <div class="flex items-center space-x-1">
                <button
                  v-if="p.reg.status === 'Waiting'"
                  @click="advanceStatus(p.reg.id, 'Called')"
                  class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-extrabold shadow-2xs"
                  title="Panggil Ke Panggung"
                >
                  Panggil
                </button>
                <button
                  @click="advanceStatus(p.reg.id, 'Playing')"
                  class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-extrabold shadow-2xs"
                  title="Mulai Bertanding (Playing)"
                >
                  Tampil
                </button>
              </div>
            </div>

            <div v-if="nextQueueParticipants.length === 0" class="py-12 text-center text-slate-400 text-xs">
              Tidak ada antrean peserta berikutnya.
            </div>
          </div>
        </div>

        <!-- Quick Hint Footer -->
        <div class="pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center">
          Status otomatis tersinkronkan dengan <strong>Waiting Lounge</strong>.
        </div>
      </div>
    </div>

    <!-- Empty State Select Competition -->
    <div v-else class="my-16 text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-2xs max-w-xl mx-auto">
      <i class="bi bi-display text-5xl text-slate-300 block mb-3"></i>
      <h2 class="text-lg font-bold text-slate-800">Silakan Pilih Cabang Lomba</h2>
      <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Pilih salah satu cabang perlombaan pada menu dropdown di atas untuk menampilkan papan arena live panggung.
      </p>
    </div>

    <!-- Print Preview Overlay Modal -->
    <PrintPreviewModal
      :isOpen="isPrintPreviewOpen"
      title="Papan Lomba / Competition Board"
      :subtitle="activeComp ? `Cabang Lomba: ${activeComp.name} (${activeComp.category})` : 'Seluruh Cabang Lomba'"
      :columns="boardPrintColumns"
      :rows="boardPrintRows"
      @close="isPrintPreviewOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArenaStore } from '../stores/arenaStore';
import PrintPreviewModal from '../components/PrintPreviewModal.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const store = useArenaStore();
const activeCompId = ref('');
const currentTime = ref('');
const isPrintPreviewOpen = ref(false);
const isFullscreen = ref(false);

const boardPrintColumns = ref([
  { key: 'index', label: 'No.', visible: true },
  { key: 'participantNumber', label: 'No. Peserta', visible: true },
  { key: 'name', label: 'Nama Peserta', visible: true },
  { key: 'category', label: 'Kategori Lomba', visible: true },
  { key: 'status', label: 'Status Bertanding', visible: true },
  { key: 'age', label: 'Usia', visible: true },
  { key: 'whatsapp', label: 'No. WA / Kontak', visible: false },
  { key: 'address', label: 'Alamat Warga', visible: true }
]);

const boardPrintRows = computed(() => {
  const targetRegs = activeCompId.value
    ? store.registrations.filter(r => r.competitionId === activeCompId.value)
    : store.registrations;

  return targetRegs.map((r, i) => {
    const part = store.getParticipantById(r.participantId);
    const comp = store.getCompetitionById(r.competitionId);
    return {
      index: i + 1,
      participantNumber: r.participantNumber,
      name: part?.name || 'Unregistered',
      category: comp ? `${comp.name} (${comp.category})` : '-',
      status: r.status,
      age: part ? `${part.age} Tahun` : '-',
      whatsapp: part?.whatsapp || '-',
      address: part?.address || '-'
    };
  });
});

let timer: any = null;

onMounted(() => {
  if (route.query.compId && typeof route.query.compId === 'string') {
    activeCompId.value = route.query.compId;
  } else if (store.competitions.length > 0) {
    activeCompId.value = store.competitions[0].id;
  }
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(err);
    });
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    isFullscreen.value = false;
  }
}

function advanceStatus(regId: string, newStatus: any) {
  store.updateRegistrationStatus(regId, newStatus);
  Swal.fire({
    icon: 'success',
    title: `Status Diperbarui: ${newStatus}`,
    timer: 1000,
    showConfirmButton: false
  });
}

const activeComp = computed(() => {
  return store.getCompetitionById(activeCompId.value);
});

const totalRegisteredCount = computed(() => {
  if (!activeCompId.value) return 0;
  return store.registrations.filter(r => r.competitionId === activeCompId.value).length;
});

const playingParticipants = computed(() => {
  if (!activeCompId.value) return [];
  const regs = store.registrations.filter(r => r.competitionId === activeCompId.value && (r.status === 'Playing' || r.status === 'Ready'));
  return regs.map(reg => ({
    reg,
    part: store.getParticipantById(reg.participantId)
  }));
});

const nextQueueParticipants = computed(() => {
  if (!activeCompId.value) return [];
  const regs = store.registrations.filter(r => r.competitionId === activeCompId.value && (r.status === 'Waiting' || r.status === 'Called'));
  return regs.map(reg => ({
    reg,
    part: store.getParticipantById(reg.participantId)
  }));
});

const liveStandings = computed(() => {
  if (!activeCompId.value) return [];
  const regs = store.registrations.filter(r => r.competitionId === activeCompId.value);
  return regs.map(reg => {
    const part = store.getParticipantById(reg.participantId);
    const scores = store.getScoresByRegistration(reg.id);
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    return { reg, part, totalScore };
  }).sort((a, b) => b.totalScore - a.totalScore);
});
</script>

