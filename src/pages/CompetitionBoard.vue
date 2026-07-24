<template>
  <div class="min-h-screen bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between font-sans relative overflow-hidden select-none">
    <!-- Top Header Bar -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-6">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-red-600/50">
          17
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-slate-100">
            {{ store.settings.eventName }}
          </h1>
          <p class="text-xs text-red-400 font-mono tracking-widest uppercase">
            LIVE ARENA COMPETITION BOARD • {{ currentTime }}
          </p>
        </div>
      </div>

      <!-- Select Active Competition for Board -->
      <div class="no-print flex items-center space-x-3">
        <select
          v-model="activeCompId"
          class="bg-slate-900 border border-slate-700 text-white font-bold px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-red-500"
        >
          <option value="">-- Pilih Cabang Lomba Tampil --</option>
          <option v-for="c in store.competitions" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.category }})
          </option>
        </select>

        <router-link
          to="/"
          class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-sm border border-slate-800"
        >
          <i class="bi bi-x-lg"></i>
        </router-link>
      </div>
    </div>

    <!-- Main Live Screen Area -->
    <div v-if="activeComp" class="my-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left 2 Cols: NOW PLAYING / VS MATCH -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 rounded-3xl border border-red-600/40 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            NOW PLAYING
          </div>

          <span class="text-xs font-bold text-red-400 uppercase tracking-widest block mb-2">
            {{ activeComp.category }} • {{ activeComp.location }}
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
            {{ activeComp.name }}
          </h2>

          <!-- Current Performers / Playing List -->
          <div class="mt-8">
            <div v-if="playingParticipants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="p in playingParticipants"
                :key="p.reg.id"
                class="bg-slate-800/80 border-2 border-red-500/50 p-6 rounded-2xl flex items-center space-x-4 shadow-lg animate-pulse-subtle"
              >
                <div class="w-14 h-14 rounded-2xl bg-red-600 text-white font-extrabold font-mono text-xl flex items-center justify-center shadow-md">
                  {{ p.reg.participantNumber }}
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white leading-tight">{{ p.part?.name }}</h3>
                  <p class="text-xs text-slate-400 mt-1">Umur {{ p.part?.age }} Thn • {{ p.part?.address || 'Warga RT/RW' }}</p>
                </div>
              </div>
            </div>

            <div v-else class="py-12 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
              <i class="bi bi-display text-4xl block mb-2 text-slate-700"></i>
              <p class="text-sm font-medium">Belum ada peserta yang berstatus <strong>PLAYING</strong>.</p>
              <p class="text-xs text-slate-600 mt-1">Ubah status peserta di Waiting Lounge untuk menampilkan arena live.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Col: NEXT QUEUE -->
      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 class="font-extrabold text-base uppercase text-amber-400 flex items-center gap-2">
              <i class="bi bi-hourglass-split"></i>
              <span>ANTREAN NEXT QUEUE</span>
            </h3>
            <span class="text-xs font-mono text-slate-500">{{ nextQueueParticipants.length }} Peserta</span>
          </div>

          <div class="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <div
              v-for="p in nextQueueParticipants"
              :key="p.reg.id"
              class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="font-mono font-bold text-sm bg-slate-800 text-amber-400 px-2.5 py-1 rounded-lg">
                  {{ p.reg.participantNumber }}
                </span>
                <span class="font-bold text-sm text-slate-200">{{ p.part?.name }}</span>
              </div>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                :class="p.reg.status === 'Called' ? 'bg-blue-900/80 text-blue-300' : 'bg-slate-800 text-slate-400'"
              >
                {{ p.reg.status }}
              </span>
            </div>

            <div v-if="nextQueueParticipants.length === 0" class="py-8 text-center text-slate-600 text-xs">
              Antrean berikutnya kosong.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State Select Competition -->
    <div v-else class="my-20 text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 max-w-xl mx-auto">
      <i class="bi bi-display text-6xl text-slate-700 block mb-3"></i>
      <h2 class="text-xl font-bold text-slate-300">Silakan Pilih Cabang Lomba</h2>
      <p class="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
        Pilih cabang perlombaan di menu bagian atas untuk menampilkan papan skor arena langsung ke layar TV / LCD.
      </p>
    </div>

    <!-- Bottom Ticker Bar -->
    <div class="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
      <span class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Panitia Kemerdekaan RI • Arena Tampilan Proyektor Offline
      </span>
      <span>Tekan F11 untuk mode Layar Penuh (Fullscreen)</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

const store = useArenaStore();
const activeCompId = ref('');
const currentTime = ref('');

let timer: any = null;

onMounted(() => {
  if (store.competitions.length > 0) {
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

const activeComp = computed(() => {
  return store.getCompetitionById(activeCompId.value);
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
</script>
