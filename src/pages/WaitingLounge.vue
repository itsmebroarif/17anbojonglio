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
      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <button
          @click="isBulkWaOpen = true"
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-whatsapp"></i>
          <span>Broadcast WA Peserta</span>
        </button>

        <button
          @click="callNextParticipant"
          class="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-megaphone-fill"></i>
          <span>Panggil Peserta Berikutnya (Next Call)</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <!-- Competition Selector -->
        <select
          v-model="selectedCompetitionId"
          class="w-full sm:w-auto px-3 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="ALL">-- Semua Perlombaan --</option>
          <option v-for="c in store.competitions" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.category }})
          </option>
        </select>

        <!-- Status Selector -->
        <select
          v-model="selectedStatus"
          class="w-full sm:w-auto px-3 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="ALL">-- Semua Status --</option>
          <option value="Waiting">Waiting (Menunggu)</option>
          <option value="Called">Called (Dipanggil)</option>
          <option value="Ready">Ready (Siap)</option>
          <option value="Playing">Playing (Bertanding)</option>
          <option value="Finished">Finished (Selesai)</option>
          <option value="Disqualified">Disqualified (Gugur)</option>
        </select>

        <!-- Gender Selector -->
        <select
          v-model="selectedGender"
          class="w-full sm:w-auto px-3 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="ALL">-- Semua Gender --</option>
          <option value="L">👨 Laki-Laki</option>
          <option value="P">👩 Perempuan</option>
        </select>
      </div>

      <!-- Search Box -->
      <div class="relative w-full sm:w-64">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama / no. reg..."
          class="w-full pl-8 pr-3 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none"
        />
      </div>
    </div>

    <!-- Bulk Action Toolbar (Floating or Prominent Bar when items selected or available) -->
    <div
      class="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
      :class="{ 'ring-2 ring-amber-400': selectedRegIds.length > 0 }"
    >
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm flex-shrink-0">
          <i class="bi bi-ui-checks"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-extrabold text-xs sm:text-sm text-white">Aksi Ubah Status Massal (Bulk Status)</h3>
            <span
              class="px-2 py-0.5 rounded-md font-mono font-bold text-[11px]"
              :class="selectedRegIds.length > 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-400'"
            >
              {{ selectedRegIds.length }} Terpilih
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">
            Pilih centang peserta pada tabel di bawah untuk merubah status pemanggilan sekaligus.
          </p>
        </div>
      </div>

      <!-- Bulk Actions Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="toggleSelectAll"
          class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-colors"
        >
          {{ isAllSelected ? 'Batal Pilih Semua' : 'Pilih Semua (' + filteredRegistrations.length + ')' }}
        </button>

        <!-- Dropdown & Apply Button -->
        <div class="flex items-center space-x-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <select
            v-model="targetBulkStatus"
            class="px-2.5 py-1 bg-slate-900 text-amber-300 font-bold text-xs rounded-lg border-0 focus:outline-none"
          >
            <option value="Waiting">Menunggu (Waiting)</option>
            <option value="Called">Dipanggil (Called)</option>
            <option value="Ready">Siap Arena (Ready)</option>
            <option value="Playing">Bertanding (Playing)</option>
            <option value="Finished">Selesai (Finished)</option>
            <option value="Disqualified">Gugur (Disqualified)</option>
          </select>

          <button
            @click="applyBulkStatus(targetBulkStatus)"
            :disabled="selectedRegIds.length === 0"
            class="px-3 py-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-30 text-slate-900 font-black text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1"
          >
            <i class="bi bi-check-all text-base"></i>
            <span>Ubah Status ({{ selectedRegIds.length }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Lounge Data View: Desktop Table + Mobile Cards -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <!-- Desktop Table (sm and up) -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider select-none">
            <tr>
              <th class="p-3.5 w-12 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected && filteredRegistrations.length > 0"
                  @change="toggleSelectAll"
                  class="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer w-4 h-4"
                  title="Pilih Semua Peserta"
                />
              </th>
              <th class="p-3.5 font-bold">No. Peserta</th>
              <th class="p-3.5 font-bold">Nama Peserta</th>
              <th class="p-3.5 font-bold">Gender & Umur</th>
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
              :class="selectedRegIds.includes(reg.id) ? 'bg-amber-50/60' : ''"
            >
              <!-- Checkbox -->
              <td class="p-3.5 text-center">
                <input
                  type="checkbox"
                  :value="reg.id"
                  v-model="selectedRegIds"
                  class="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer w-4 h-4"
                />
              </td>

              <td class="p-3.5 font-mono font-bold text-slate-900">
                <span class="px-2 py-1 rounded bg-slate-100 text-red-700 border border-slate-200">
                  {{ reg.participantNumber }}
                </span>
              </td>

              <td class="p-3.5">
                <div class="flex items-center space-x-2.5">
                  <div class="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-2xs">
                    <img
                      v-if="store.getParticipantById(reg.participantId)?.photoUrl"
                      :src="store.getParticipantById(reg.participantId)?.photoUrl"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                      <i class="bi bi-person-fill text-base"></i>
                    </div>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900">
                      {{ store.getParticipantById(reg.participantId)?.name }}
                    </div>
                    <div class="text-[11px] text-slate-500">
                      <i class="bi bi-whatsapp text-emerald-600"></i>
                      {{ store.getParticipantById(reg.participantId)?.whatsapp || '-' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Gender Column -->
              <td class="p-3.5">
                <span
                  class="px-2.5 py-1 rounded-lg text-xs font-extrabold inline-flex items-center gap-1 border"
                  :class="store.getParticipantById(reg.participantId)?.gender === 'L' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  <span>{{ store.getParticipantById(reg.participantId)?.gender === 'L' ? '👨 Laki-Laki' : '👩 Perempuan' }}</span>
                </span>
                <span class="text-[10px] text-slate-500 font-bold block mt-1">
                  {{ store.getParticipantById(reg.participantId)?.age || '-' }} Tahun
                </span>
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
              <td colspan="6" class="p-8 text-center text-slate-400">
                Tidak ada data peserta yang memenuhi kriteria pencarian / filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View (< sm) -->
      <div class="block sm:hidden divide-y divide-slate-100 p-3 space-y-3 bg-slate-50/50">
        <div
          v-for="reg in filteredRegistrations"
          :key="'mob-' + reg.id"
          class="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
          :class="selectedRegIds.includes(reg.id) ? 'ring-2 ring-amber-400 bg-amber-50/30' : ''"
        >
          <!-- Card Header: Checkbox + Participant Number + Status Badge -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                :value="reg.id"
                v-model="selectedRegIds"
                class="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer w-4 h-4"
              />
              <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-red-700 border border-slate-200 font-mono font-bold text-xs">
                #{{ reg.participantNumber }}
              </span>
            </div>

            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1"
              :class="statusBadgeClass(reg.status)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ reg.status }}
            </span>
          </div>

          <!-- Participant Info & Competition -->
          <div>
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-bold text-slate-900 text-sm">
                {{ store.getParticipantById(reg.participantId)?.name }}
              </h3>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-extrabold border"
                :class="store.getParticipantById(reg.participantId)?.gender === 'L' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
              >
                {{ store.getParticipantById(reg.participantId)?.gender === 'L' ? '👨 L' : '👩 P' }} ({{ store.getParticipantById(reg.participantId)?.age }} Thn)
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium mt-1">
              {{ store.getCompetitionById(reg.competitionId)?.name }}
              <span class="text-[10px] text-slate-400">({{ store.getCompetitionById(reg.competitionId)?.category }})</span>
            </p>
            <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <i class="bi bi-whatsapp text-emerald-600"></i>
              <span>{{ store.getParticipantById(reg.participantId)?.whatsapp || '-' }}</span>
            </p>
          </div>

          <!-- Card Actions: Dropdown & WA Button -->
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <select
              :value="reg.status"
              @change="changeStatus(reg.id, ($event.target as HTMLSelectElement).value as any)"
              class="flex-1 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="Waiting">Waiting</option>
              <option value="Called">Called</option>
              <option value="Ready">Ready</option>
              <option value="Playing">Playing</option>
              <option value="Finished">Finished</option>
              <option value="Disqualified">Disqualified</option>
            </select>

            <a
              :href="getWaCallUrl(reg)"
              target="_blank"
              class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              <i class="bi bi-whatsapp"></i> WA
            </a>
          </div>
        </div>

        <div v-if="filteredRegistrations.length === 0" class="p-6 text-center text-slate-400 text-xs">
          Tidak ada data peserta yang memenuhi kriteria pencarian / filter.
        </div>
      </div>
    </div>

    <!-- Arena Floor Plan Map Section -->
    <ArenaFloorPlan />

    <!-- Bulk WhatsApp Broadcast Modal -->
    <BulkWhatsAppModal
      :isOpen="isBulkWaOpen"
      :initialCompId="selectedCompetitionId"
      @close="isBulkWaOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { RegistrationStatus } from '../types';
import { generateWaitingLoungeCallMessage } from '../services/whatsapp';
import ArenaFloorPlan from '../components/ArenaFloorPlan.vue';
import BulkWhatsAppModal from '../components/BulkWhatsAppModal.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const isBulkWaOpen = ref(false);
const selectedCompetitionId = ref('ALL');
const selectedStatus = ref('ALL');
const selectedGender = ref('ALL');
const searchQuery = ref('');

// Bulk selection state
const selectedRegIds = ref<string[]>([]);
const targetBulkStatus = ref<RegistrationStatus>('Called');

const filteredRegistrations = computed(() => {
  return store.registrations.filter(r => {
    const matchComp = selectedCompetitionId.value === 'ALL' || r.competitionId === selectedCompetitionId.value;
    const matchStatus = selectedStatus.value === 'ALL' || r.status === selectedStatus.value;

    const participant = store.getParticipantById(r.participantId);
    const matchGender = selectedGender.value === 'ALL' || participant?.gender === selectedGender.value;

    const matchSearch =
      r.participantNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (participant?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false);

    return matchComp && matchStatus && matchGender && matchSearch;
  });
});

const isAllSelected = computed(() => {
  if (filteredRegistrations.value.length === 0) return false;
  return filteredRegistrations.value.every(r => selectedRegIds.value.includes(r.id));
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    // Deselect visible
    const visibleIds = filteredRegistrations.value.map(r => r.id);
    selectedRegIds.value = selectedRegIds.value.filter(id => !visibleIds.includes(id));
  } else {
    // Select visible
    const visibleIds = filteredRegistrations.value.map(r => r.id);
    const set = new Set([...selectedRegIds.value, ...visibleIds]);
    selectedRegIds.value = Array.from(set);
  }
}

function applyBulkStatus(status: RegistrationStatus) {
  if (selectedRegIds.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Peserta',
      text: 'Pilih minimal satu peserta untuk diubah statusnya secara bersamaan.',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  const count = selectedRegIds.value.length;
  store.bulkUpdateRegistrationStatus(selectedRegIds.value, status);

  Swal.fire({
    icon: 'success',
    title: 'Status Berhasil Diubah! ⚡',
    html: `
      <p class="text-xs text-slate-600">
        Sebanyak <strong>${count} peserta</strong> berhasil diubah statusnya menjadi:
      </p>
      <div class="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs">
        ${status}
      </div>
    `,
    timer: 1500,
    showConfirmButton: false
  });

  // Reset selection
  selectedRegIds.value = [];
}

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
