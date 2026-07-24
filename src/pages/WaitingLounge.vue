<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-hourglass-split text-amber-500"></i>
          <span>Waiting Lounge & Pemanggilan</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Panggil peserta, ubah status pertandingan, dan atur antrean arena secara realtime.</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center space-x-2">
        <button
          @click="callNextParticipant"
          class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <i class="bi bi-megaphone-fill"></i>
          <span>Panggil Peserta Berikutnya (Next Call)</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Competition Selector -->
        <select
          v-model="selectedCompetitionId"
          class="px-3 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="ALL">-- Semua Perlombaan --</option>
          <option v-for="c in store.competitions" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.category }})
          </option>
        </select>

        <!-- Status Selector -->
        <select
          v-model="selectedStatus"
          class="px-3 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="ALL">-- Semua Status --</option>
          <option value="Waiting">Waiting (Menunggu)</option>
          <option value="Called">Called (Dipanggil)</option>
          <option value="Ready">Ready (Siap)</option>
          <option value="Playing">Playing (Bertanding)</option>
          <option value="Finished">Finished (Selesai)</option>
          <option value="Disqualified">Disqualified (Gugur)</option>
        </select>
      </div>

      <!-- Search Box -->
      <div class="relative w-full md:w-64">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama / no. reg..."
          class="w-full pl-8 pr-3 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none"
        />
      </div>
    </div>

    <!-- Lounge Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th class="p-3.5 font-bold">No. Peserta</th>
              <th class="p-3.5 font-bold">Nama Peserta</th>
              <th class="p-3.5 font-bold">Cabang Lomba</th>
              <th class="p-3.5 font-bold">Status Arena</th>
              <th class="p-3.5 font-bold text-center">Aksi Pemanggilan & Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="reg in filteredRegistrations"
              :key="reg.id"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="p-3.5 font-mono font-bold text-slate-900">
                <span class="px-2 py-1 rounded bg-slate-100 text-red-700 border border-slate-200">
                  {{ reg.participantNumber }}
                </span>
              </td>

              <td class="p-3.5">
                <div class="font-bold text-slate-900">
                  {{ store.getParticipantById(reg.participantId)?.name }}
                </div>
                <div class="text-[11px] text-slate-500">
                  <i class="bi bi-whatsapp text-emerald-600"></i>
                  {{ store.getParticipantById(reg.participantId)?.whatsapp }}
                </div>
              </td>

              <td class="p-3.5">
                <div class="font-medium text-slate-800">
                  {{ store.getCompetitionById(reg.competitionId)?.name }}
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ store.getCompetitionById(reg.competitionId)?.category }}
                </div>
              </td>

              <td class="p-3.5">
                <span
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1"
                  :class="statusBadgeClass(reg.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ reg.status }}
                </span>
              </td>

              <td class="p-3.5 text-center">
                <div class="flex items-center justify-center space-x-1.5">
                  <!-- Quick Change Status Dropdown -->
                  <select
                    :value="reg.status"
                    @change="changeStatus(reg.id, ($event.target as HTMLSelectElement).value as any)"
                    class="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="Called">Called</option>
                    <option value="Ready">Ready</option>
                    <option value="Playing">Playing</option>
                    <option value="Finished">Finished</option>
                    <option value="Disqualified">Disqualified</option>
                  </select>

                  <!-- WhatsApp Generator Call Button -->
                  <a
                    :href="getWaCallUrl(reg)"
                    target="_blank"
                    class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                    title="Kirim Pesan Pemanggilan via WhatsApp"
                  >
                    <i class="bi bi-whatsapp"></i> WA
                  </a>
                </div>
              </td>
            </tr>

            <tr v-if="filteredRegistrations.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400">
                Tidak ada data peserta yang memenuhi kriteria pencarian / filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { RegistrationStatus } from '../types';
import { generateWaitingLoungeCallMessage } from '../services/whatsapp';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCompetitionId = ref('ALL');
const selectedStatus = ref('ALL');
const searchQuery = ref('');

const filteredRegistrations = computed(() => {
  return store.registrations.filter(r => {
    const matchComp = selectedCompetitionId.value === 'ALL' || r.competitionId === selectedCompetitionId.value;
    const matchStatus = selectedStatus.value === 'ALL' || r.status === selectedStatus.value;

    const participant = store.getParticipantById(r.participantId);
    const matchSearch =
      r.participantNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (participant?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false);

    return matchComp && matchStatus && matchSearch;
  });
});

function statusBadgeClass(status: RegistrationStatus) {
  switch (status) {
    case 'Waiting': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Called': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Ready': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Playing': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Finished': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Disqualified': return 'bg-rose-50 text-rose-700 border-rose-200';
  }
}

function changeStatus(id: string, status: RegistrationStatus) {
  store.updateRegistrationStatus(id, status);
}

function callNextParticipant() {
  const waitingReg = store.registrations.find(r => r.status === 'Waiting');
  if (!waitingReg) {
    Swal.fire({ icon: 'info', title: 'Tidak Ada Antrean Waiting', text: 'Semua peserta telah dipanggil atau bertanding.' });
    return;
  }

  store.updateRegistrationStatus(waitingReg.id, 'Called');
  const part = store.getParticipantById(waitingReg.participantId);
  const comp = store.getCompetitionById(waitingReg.competitionId);

  Swal.fire({
    icon: 'success',
    title: `Panggilan: ${waitingReg.participantNumber}`,
    text: `${part?.name || 'Peserta'} disilakan menuju area ${comp?.name || 'lomba'}.`,
    confirmButtonText: 'Buka WhatsApp Pemanggilan',
    showCancelButton: true
  }).then(res => {
    if (res.isConfirmed && part) {
      const url = generateWaitingLoungeCallMessage({
        phone: part.whatsapp,
        participantName: part.name,
        participantNumber: waitingReg.participantNumber,
        competitionName: comp?.name || 'Lomba Kemerdekaan',
        location: comp?.location,
        time: comp?.time
      });
      window.open(url, '_blank');
    }
  });
}

function getWaCallUrl(reg: any) {
  const part = store.getParticipantById(reg.participantId);
  const comp = store.getCompetitionById(reg.competitionId);
  return generateWaitingLoungeCallMessage({
    phone: part?.whatsapp || '',
    participantName: part?.name || 'Peserta',
    participantNumber: reg.participantNumber,
    competitionName: comp?.name || 'Lomba Kemerdekaan',
    location: comp?.location,
    time: comp?.time
  });
}
</script>
