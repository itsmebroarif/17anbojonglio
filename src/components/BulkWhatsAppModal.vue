<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Modal Header -->
      <div class="p-5 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-600/20">
            <i class="bi bi-whatsapp"></i>
          </div>
          <div>
            <h2 class="text-base font-extrabold flex items-center gap-2 text-slate-900">
              <span>Broadcast WhatsApp Peserta</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold border border-emerald-200">
                Bulk Message
              </span>
            </h2>
            <p class="text-xs text-slate-500">
              Kirim pesan masal langsung ke WhatsApp peserta berdasarkan kriteria lomba atau status arena.
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-5 space-y-6 overflow-y-auto flex-1">
        
        <!-- SECTION 1: TARGET SELECTION & FILTERS -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <i class="bi bi-funnel-fill text-red-600"></i>
            <span>1. Filter Target Penerima Pesan</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Competition Filter -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Kategori Lomba</label>
              <select
                v-model="selectedCompId"
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">-- Semua Lomba --</option>
                <option v-for="comp in store.competitions" :key="comp.id" :value="comp.id">
                  [{{ comp.prefix }}] {{ comp.name }}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Status Peserta</label>
              <select
                v-model="selectedStatus"
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">-- Semua Status --</option>
                <option value="Waiting">Menunggu (Waiting)</option>
                <option value="Called">Dipanggil (Called)</option>
                <option value="Ready">Siap Bertanding (Ready)</option>
                <option value="Playing">Sedang Bertanding (Playing)</option>
                <option value="Finished">Selesai (Finished)</option>
              </select>
            </div>

            <!-- Search Filter -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Cari Nama / No Peserta</label>
              <div class="relative">
                <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Ketik kata kunci..."
                  class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: TEMPLATE EDITOR -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <i class="bi bi-chat-left-text-fill text-emerald-600"></i>
              <span>2. Template & Isi Pesan WhatsApp</span>
            </h3>

            <!-- Template Preset Selector & Save Button -->
            <div class="flex flex-wrap items-center gap-2">
              <select
                v-model="selectedTemplateId"
                @change="onSelectTemplate"
                class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Pilih Template Tersimpan ({{ store.waTemplates.length }}) --</option>
                <option v-for="tpl in store.waTemplates" :key="tpl.id" :value="tpl.id">
                  [{{ tpl.category.toUpperCase() }}] {{ tpl.title }}
                </option>
              </select>

              <button
                @click="saveCurrentAsTemplate"
                class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-colors"
                title="Simpan template ini ke Pengaturan Settings"
              >
                <i class="bi bi-bookmark-plus-fill text-emerald-600"></i>
                <span>Simpan Template</span>
              </button>
            </div>
          </div>

          <!-- Variable Tags Helpers -->
          <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span class="text-slate-400 font-bold">Sisipkan Variabel:</span>
            <button @click="insertVariable('{nama}')" class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              {nama}
            </button>
            <button @click="insertVariable('{nomor}')" class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              {nomor}
            </button>
            <button @click="insertVariable('{lomba}')" class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              {lomba}
            </button>
            <button @click="insertVariable('{lokasi}')" class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              {lokasi}
            </button>
            <button @click="insertVariable('{waktu}')" class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              {waktu}
            </button>
            <button @click="insertVariable('{status}')" class="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold">
              {status}
            </button>
          </div>

          <!-- Textarea Input -->
          <textarea
            v-model="messageTemplate"
            rows="4"
            class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            placeholder="Tulis pesan template WhatsApp di sini..."
          ></textarea>

          <!-- Live Sample Preview -->
          <div v-if="samplePreviewData" class="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl space-y-1">
            <span class="text-[10px] font-extrabold uppercase text-emerald-800 flex items-center gap-1">
              <i class="bi bi-eye-fill"></i> Preview Pesan untuk: {{ samplePreviewData.participantName }} ({{ samplePreviewData.phone }})
            </span>
            <p class="text-xs text-emerald-950 font-sans whitespace-pre-wrap leading-relaxed bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              {{ renderedSampleMessage }}
            </p>
          </div>
        </div>

        <!-- SECTION 3: RECIPIENTS TABLE -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <i class="bi bi-people-fill text-blue-600"></i>
                <span>3. Daftar Penerima Broadcast ({{ selectedRecipientsCount }} / {{ targetParticipants.length }} Terpilih)</span>
              </h3>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <button
                @click="selectAll"
                class="text-blue-600 hover:underline font-bold text-[11px]"
              >
                Pilih Semua
              </button>
              <span class="text-slate-300">|</span>
              <button
                @click="deselectAll"
                class="text-slate-500 hover:underline font-bold text-[11px]"
              >
                Hapus Pilihan
              </button>
            </div>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold sticky top-0 z-10">
                <tr>
                  <th class="p-2.5 text-center w-10">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th class="p-2.5">Peserta & Nomor</th>
                  <th class="p-2.5">Lomba</th>
                  <th class="p-2.5">No. HP / WA</th>
                  <th class="p-2.5 text-center">Status</th>
                  <th class="p-2.5 text-right">Aksi Singkat</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="item in targetParticipants"
                  :key="item.id"
                  class="hover:bg-slate-50 transition-colors"
                  :class="selectedIds.includes(item.id) ? 'bg-emerald-50/30' : ''"
                >
                  <td class="p-2.5 text-center">
                    <input
                      type="checkbox"
                      :value="item.id"
                      v-model="selectedIds"
                      class="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td class="p-2.5 font-bold text-slate-900">
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono text-red-600 text-[11px]">[{{ item.participantNumber }}]</span>
                      <span>{{ item.participantName }}</span>
                    </div>
                  </td>
                  <td class="p-2.5 text-slate-600 text-[11px]">
                    {{ item.competitionName }}
                  </td>
                  <td class="p-2.5 font-mono text-slate-700 text-[11px]">
                    <span v-if="item.phone" class="flex items-center gap-1 text-emerald-700 font-bold">
                      <i class="bi bi-whatsapp"></i> {{ item.phone }}
                    </span>
                    <span v-else class="text-amber-600 font-bold italic text-[10px]">
                      (Tanpa HP)
                    </span>
                  </td>
                  <td class="p-2.5 text-center">
                    <span
                      class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border"
                      :class="[
                        item.status === 'Playing' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        item.status === 'Called' ? 'bg-red-100 text-red-800 border-red-300' :
                        item.status === 'Ready' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-amber-100 text-amber-800 border-amber-300'
                      ]"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="p-2.5 text-right">
                    <a
                      v-if="item.phone"
                      :href="getIndividualWaLink(item)"
                      target="_blank"
                      class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <i class="bi bi-whatsapp"></i> Kirim WA
                    </a>
                  </td>
                </tr>
                <tr v-if="targetParticipants.length === 0">
                  <td colspan="6" class="p-6 text-center text-slate-400 italic">
                    Tidak ada peserta yang sesuai dengan filter lokasi / status saat ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SECTION 4: SEQUENTIAL WA BROADCAST DISPATCHER QUEUE -->
        <div v-if="isDispatching" class="bg-emerald-900 text-white p-4 rounded-xl space-y-3 shadow-lg border border-emerald-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h4 class="font-extrabold text-xs uppercase tracking-wider text-emerald-300">
                Mode Pengiriman Antrean Masal WA ({{ currentQueueIndex + 1 }} dari {{ queueList.length }})
              </h4>
            </div>
            <button @click="stopDispatch" class="text-emerald-300 hover:text-white text-xs font-bold underline">
              Batal / Hentikan
            </button>
          </div>

          <div v-if="currentQueueParticipant" class="bg-emerald-950/80 p-3 rounded-lg border border-emerald-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-emerald-200">Peserta Saat Ini:</span>
                <span class="font-extrabold text-white ml-1.5">{{ currentQueueParticipant.participantName }}</span>
                <span class="font-mono text-amber-300 ml-1">({{ currentQueueParticipant.phone }})</span>
              </div>
              <span class="text-[11px] text-emerald-400 font-mono">
                {{ currentQueueParticipant.competitionName }}
              </span>
            </div>

            <p class="text-xs font-sans text-slate-200 bg-black/40 p-2.5 rounded border border-emerald-900/50 whitespace-pre-wrap">
              {{ currentQueueRenderedMessage }}
            </p>

            <div class="flex items-center justify-between pt-1">
              <button
                @click="sendAndNext"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <i class="bi bi-whatsapp text-lg"></i>
                <span>Buka Chat WA & Lanjut Ke Berikutnya</span>
              </button>

              <button
                @click="skipNext"
                class="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl text-xs font-bold"
              >
                Lewati Peserta Ini »
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer Controls -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Copy Phone Numbers List -->
          <button
            @click="copyPhoneNumbers"
            class="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <i class="bi bi-clipboard-fill text-slate-500"></i>
            <span>Salin Daftar No. HP</span>
          </button>

          <!-- Export CSV Broadcast List -->
          <button
            @click="exportCsvBroadcast"
            class="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <i class="bi bi-file-earmark-spreadsheet-fill text-emerald-600"></i>
            <span>Export CSV / WA Gateway</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>

          <!-- Start Queue Dispatch Button -->
          <button
            @click="startDispatchQueue"
            :disabled="selectedRecipientsCount === 0"
            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <i class="bi bi-send-fill"></i>
            <span>Mulai Antrean Kirim ({{ selectedRecipientsCount }} Peserta)</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { renderBulkTemplate, generateWaLink } from '../services/whatsapp';
import Swal from 'sweetalert2';

const props = defineProps<{
  isOpen: boolean;
  initialCompId?: string;
}>();

defineEmits(['close']);

const store = useArenaStore();

const selectedCompId = ref(props.initialCompId || 'ALL');
const selectedStatus = ref('ALL');
const searchQuery = ref('');
const selectedIds = ref<string[]>([]);
const selectedTemplateId = ref('');

watch(() => props.initialCompId, (newVal) => {
  if (newVal) selectedCompId.value = newVal;
});

const messageTemplate = ref(
  `Panggilan Peserta Lomba Kemerdekaan 🇮🇩\n\nHalo {nama} (No: {nomor}), Anda dijadwalkan bertanding pada lomba *{lomba}*.\n*Lokasi Arena:* {lokasi}\n\nHarap segera menuju area pertandingan. Terima kasih!`
);

function onSelectTemplate() {
  if (!selectedTemplateId.value) return;
  const tpl = store.waTemplates.find(t => t.id === selectedTemplateId.value);
  if (tpl) {
    messageTemplate.value = tpl.content;
  }
}

async function saveCurrentAsTemplate() {
  if (!messageTemplate.value.trim()) {
    Swal.fire('Perhatian', 'Isi template pesan tidak boleh kosong.', 'warning');
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: 'Simpan Template WhatsApp',
    html:
      '<input id="swal-input-title" class="swal2-input" placeholder="Judul Template (e.g. Panggilan Ulang)">' +
      '<select id="swal-input-cat" class="swal2-select">' +
      '<option value="panggilan">📢 Panggilan</option>' +
      '<option value="pengingat">⏰ Pengingat</option>' +
      '<option value="selesai">🏁 Selesai</option>' +
      '<option value="pengumuman">🏆 Pengumuman</option>' +
      '<option value="lainnya">💬 Lainnya</option>' +
      '</select>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    preConfirm: () => {
      const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;
      const category = (document.getElementById('swal-input-cat') as HTMLSelectElement).value;
      if (!title) {
        Swal.showValidationMessage('Judul template wajib diisi!');
        return false;
      }
      return { title, category };
    }
  });

  if (formValues) {
    const newTpl = store.addWaTemplate({
      title: formValues.title,
      category: formValues.category as any,
      content: messageTemplate.value
    });
    selectedTemplateId.value = newTpl.id;
    Swal.fire({
      icon: 'success',
      title: 'Tersimpan!',
      text: `Template "${newTpl.title}" berhasil disimpan ke Settings.`,
      timer: 1500,
      showConfirmButton: false
    });
  }
}

interface RecipientItem {
  id: string;
  participantId: string;
  participantName: string;
  participantNumber: string;
  competitionId: string;
  competitionName: string;
  location: string;
  phone: string;
  status: string;
}

const targetParticipants = computed<RecipientItem[]>(() => {
  return store.registrations
    .filter(reg => {
      // Filter by Competition
      if (selectedCompId.value !== 'ALL' && reg.competitionId !== selectedCompId.value) {
        return false;
      }
      // Filter by Status
      if (selectedStatus.value !== 'ALL' && reg.status !== selectedStatus.value) {
        return false;
      }

      const p = store.getParticipantById(reg.participantId);
      if (!p) return false;

      // Filter by Search Query
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchNumber = reg.participantNumber.toLowerCase().includes(q);
        if (!matchName && !matchNumber) return false;
      }

      return true;
    })
    .map(reg => {
      const p = store.getParticipantById(reg.participantId);
      const c = store.getCompetitionById(reg.competitionId);
      return {
        id: reg.id,
        participantId: reg.participantId,
        participantName: p?.name || 'Peserta',
        participantNumber: reg.participantNumber,
        competitionId: reg.competitionId,
        competitionName: c?.name || 'Lomba',
        location: c?.location || 'Area Utama',
        phone: p?.phone || '',
        status: reg.status
      };
    });
});

// Auto select all valid targets when target list changes
watch(targetParticipants, (newList) => {
  selectedIds.value = newList.filter(item => item.phone).map(item => item.id);
}, { immediate: true });

const selectedRecipientsCount = computed(() => selectedIds.value.length);

const isAllSelected = computed(() => {
  if (targetParticipants.value.length === 0) return false;
  return targetParticipants.value.every(item => selectedIds.value.includes(item.id));
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = targetParticipants.value.filter(item => item.phone).map(item => item.id);
  }
}

function selectAll() {
  selectedIds.value = targetParticipants.value.filter(item => item.phone).map(item => item.id);
}

function deselectAll() {
  selectedIds.value = [];
}

function applyPreset(presetType: string) {
  if (presetType === 'panggilan') {
    messageTemplate.value = `Panggilan Peserta Lomba Kemerdekaan 🇮🇩\n\nHalo {nama} (No: {nomor}), Anda dijadwalkan bertanding pada lomba *{lomba}*.\n*Lokasi Arena:* {lokasi}\n\nHarap segera menuju area pertandingan. Terima kasih!`;
  } else if (presetType === 'pengingat') {
    messageTemplate.value = `Pengingat Lomba Kemerdekaan 🇮🇩\n\nHalo {nama}, diingatkan kembali bahwa lomba *{lomba}* (No: {nomor}) akan segera dimulai di *{lokasi}*.\n\nPersiapkan diri Anda dan datang tepat waktu! Merdeka! ✊`;
  } else if (presetType === 'selesai') {
    messageTemplate.value = `Terima Kasih Partisipasi Lomba! 🇮🇩\n\nHalo {nama}, terima kasih telah bertanding pada lomba *{lomba}* (No. Peserta: {nomor}). Hasil pertandingan dan penyerahan piala akan diumumkan di Panggung Utama.`;
  }
}

function insertVariable(varTag: string) {
  messageTemplate.value += ` ${varTag}`;
}

const samplePreviewData = computed(() => {
  const selected = targetParticipants.value.find(item => selectedIds.value.includes(item.id));
  return selected || targetParticipants.value[0] || null;
});

const renderedSampleMessage = computed(() => {
  if (!samplePreviewData.value) return '';
  return renderBulkTemplate(messageTemplate.value, {
    participantName: samplePreviewData.value.participantName,
    participantNumber: samplePreviewData.value.participantNumber,
    competitionName: samplePreviewData.value.competitionName,
    location: samplePreviewData.value.location,
    status: samplePreviewData.value.status,
    time: '09:00 WIB'
  });
});

function getIndividualWaLink(item: RecipientItem): string {
  const msg = renderBulkTemplate(messageTemplate.value, {
    participantName: item.participantName,
    participantNumber: item.participantNumber,
    competitionName: item.competitionName,
    location: item.location,
    status: item.status,
    time: '09:00 WIB'
  });
  return generateWaLink(item.phone, msg);
}

// QUEUE DISPATCHER STATE
const isDispatching = ref(false);
const queueList = ref<RecipientItem[]>([]);
const currentQueueIndex = ref(0);

const currentQueueParticipant = computed(() => {
  return queueList.value[currentQueueIndex.value] || null;
});

const currentQueueRenderedMessage = computed(() => {
  if (!currentQueueParticipant.value) return '';
  return renderBulkTemplate(messageTemplate.value, {
    participantName: currentQueueParticipant.value.participantName,
    participantNumber: currentQueueParticipant.value.participantNumber,
    competitionName: currentQueueParticipant.value.competitionName,
    location: currentQueueParticipant.value.location,
    status: currentQueueParticipant.value.status
  });
});

function startDispatchQueue() {
  const selectedItems = targetParticipants.value.filter(item => selectedIds.value.includes(item.id) && item.phone);
  if (selectedItems.length === 0) {
    Swal.fire('Perhatian', 'Silakan pilih minimal 1 peserta yang memiliki nomor telepon.', 'warning');
    return;
  }
  queueList.value = selectedItems;
  currentQueueIndex.value = 0;
  isDispatching.value = true;
}

function stopDispatch() {
  isDispatching.value = false;
  queueList.value = [];
}

function sendAndNext() {
  if (!currentQueueParticipant.value) return;
  const link = getIndividualWaLink(currentQueueParticipant.value);
  window.open(link, '_blank');

  if (currentQueueIndex.value < queueList.value.length - 1) {
    currentQueueIndex.value++;
  } else {
    isDispatching.value = false;
    Swal.fire({
      icon: 'success',
      title: 'Broadcast Selesai!',
      text: 'Seluruh antrean pesan WhatsApp telah dikirimkan.',
      timer: 2000,
      showConfirmButton: false
    });
  }
}

function skipNext() {
  if (currentQueueIndex.value < queueList.value.length - 1) {
    currentQueueIndex.value++;
  } else {
    isDispatching.value = false;
  }
}

function copyPhoneNumbers() {
  const phones = targetParticipants.value
    .filter(item => selectedIds.value.includes(item.id) && item.phone)
    .map(item => item.phone);

  if (phones.length === 0) {
    Swal.fire('Info', 'Tidak ada nomor telepon yang terpilih.', 'info');
    return;
  }

  const phoneText = phones.join(', ');
  navigator.clipboard.writeText(phoneText);
  Swal.fire({
    icon: 'success',
    title: 'Nomor Berhasil Disalin!',
    text: `${phones.length} nomor WhatsApp berhasil disalin ke clipboard.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function exportCsvBroadcast() {
  const selectedItems = targetParticipants.value.filter(item => selectedIds.value.includes(item.id));
  if (selectedItems.length === 0) {
    Swal.fire('Info', 'Pilih minimal 1 peserta untuk diexport.', 'info');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,Nama Peserta,Nomor Peserta,Lomba,No HP,Lokasi,Isi Pesan\n';

  selectedItems.forEach(item => {
    const msg = renderBulkTemplate(messageTemplate.value, {
      participantName: item.participantName,
      participantNumber: item.participantNumber,
      competitionName: item.competitionName,
      location: item.location,
      status: item.status
    }).replace(/"/g, '""').replace(/\n/g, ' ');

    csvContent += `"${item.participantName}","${item.participantNumber}","${item.competitionName}","${item.phone}","${item.location}","${msg}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Broadcast_WA_Lomba_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
