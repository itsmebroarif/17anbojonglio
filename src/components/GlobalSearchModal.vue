<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      <!-- Search Input Bar -->
      <div class="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
        <i class="bi bi-search text-xl text-slate-400"></i>
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="Cari nama peserta, nomor reg (e.g. BK-001), no. WA, atau nama lomba..."
          class="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-base"
          @keydown.esc="$emit('close')"
        />
        <button
          @click="$emit('close')"
          class="text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded-md text-slate-600 font-medium"
        >
          ESC
        </button>
      </div>

      <!-- Results List -->
      <div class="max-h-96 overflow-y-auto p-4 space-y-4">
        <!-- Empty Query Hint -->
        <div v-if="!query.trim()" class="text-center py-8 text-slate-400">
          <i class="bi bi-search text-3xl block mb-2 opacity-50"></i>
          <p class="text-sm">Ketik untuk mencari peserta, nomor peserta, atau nama perlombaan.</p>
        </div>

        <!-- No Match Found -->
        <div v-else-if="filteredParticipants.length === 0 && filteredCompetitions.length === 0" class="text-center py-8 text-slate-500">
          <i class="bi bi-emoji-frown text-3xl block mb-2 text-slate-400"></i>
          <p class="text-sm">Tidak ditemukan data yang sesuai dengan "<strong>{{ query }}</strong>"</p>
        </div>

        <!-- Participants Results -->
        <div v-if="filteredParticipants.length > 0">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i class="bi bi-people-fill"></i> Peserta ({{ filteredParticipants.length }})
          </h3>
          <div class="space-y-2">
            <div
              v-for="item in filteredParticipants"
              :key="item.participant.id + item.registration.id"
              class="p-3 bg-slate-50 hover:bg-red-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
            >
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-slate-900">{{ item.participant.name }}</span>
                  <span class="text-xs px-2 py-0.5 rounded font-mono font-bold bg-red-100 text-red-700">
                    {{ item.registration.participantNumber }}
                  </span>
                  <span class="text-xs text-slate-500">({{ item.participant.age }} thn, {{ item.participant.gender }})</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span><i class="bi bi-trophy"></i> {{ item.competition?.name }}</span>
                  <span>•</span>
                  <span><i class="bi bi-whatsapp text-emerald-600"></i> {{ item.participant.whatsapp }}</span>
                </p>
              </div>
              <a
                :href="getWaCallUrl(item)"
                target="_blank"
                class="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                <i class="bi bi-whatsapp"></i> WA
              </a>
            </div>
          </div>
        </div>

        <!-- Competitions Results -->
        <div v-if="filteredCompetitions.length > 0">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i class="bi bi-trophy"></i> Lomba ({{ filteredCompetitions.length }})
          </h3>
          <div class="space-y-2">
            <div
              v-for="comp in filteredCompetitions"
              :key="comp.id"
              class="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-slate-900">{{ comp.name }}</span>
                  <span class="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                    {{ comp.category }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ comp.location }} • {{ comp.date }} {{ comp.time }}
                </p>
              </div>
              <router-link
                to="/waiting-lounge"
                @click="$emit('close')"
                class="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg"
              >
                Ke Waiting Lounge
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { generateWaitingLoungeCallMessage } from '../services/whatsapp';

const props = defineProps<{ isOpen: boolean }>();
defineEmits(['close']);

const store = useArenaStore();
const query = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    query.value = '';
    nextTick(() => searchInput.value?.focus());
  }
});

const filteredParticipants = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];

  const results: { participant: any; registration: any; competition: any }[] = [];

  store.registrations.forEach(reg => {
    const participant = store.getParticipantById(reg.participantId);
    const competition = store.getCompetitionById(reg.competitionId);

    if (!participant) return;

    const matchName = participant.name.toLowerCase().includes(q);
    const matchNumber = reg.participantNumber.toLowerCase().includes(q);
    const matchWa = participant.whatsapp.includes(q);
    const matchComp = competition?.name.toLowerCase().includes(q) || false;

    if (matchName || matchNumber || matchWa || matchComp) {
      results.push({ participant, registration: reg, competition });
    }
  });

  return results.slice(0, 10);
});

const filteredCompetitions = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];

  return store.competitions.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  );
});

function getWaCallUrl(item: any) {
  return generateWaitingLoungeCallMessage({
    phone: item.participant.whatsapp,
    participantName: item.participant.name,
    participantNumber: item.registration.participantNumber,
    competitionName: item.competition?.name || 'Lomba Kemerdekaan',
    location: item.competition?.location,
    time: item.competition?.time
  });
}
</script>
