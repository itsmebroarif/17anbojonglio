<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
    <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto print:hidden">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-red-500/30">
            <i class="bi bi-printer-fill"></i>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-slate-900 leading-tight">{{ title }}</h2>
            <p class="text-xs text-slate-500">Atur visibilitas kolom sebelum mencetak ke Kertas A4 atau PDF</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <!-- Controls & Column Toggles Bar -->
      <div class="p-5 bg-slate-50 border-b border-slate-200 space-y-4">
        <div>
          <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">
            <i class="bi bi-layout-three-columns"></i> Toggle Kolom Terlihat:
          </span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="col in localColumns"
              :key="col.key"
              @click="col.visible = !col.visible"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5',
                col.visible
                  ? 'bg-red-50 text-red-700 border-red-300 shadow-2xs'
                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
              ]"
            >
              <i :class="col.visible ? 'bi bi-check-square-fill text-red-600' : 'bi bi-square text-slate-400'"></i>
              <span>{{ col.label }}</span>
            </button>
          </div>
        </div>

        <!-- Layout Controls -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-slate-600 font-semibold">Orientasi:</span>
              <button
                @click="orientation = 'portrait'"
                :class="['px-2.5 py-1 rounded-md font-bold transition-colors', orientation === 'portrait' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200']"
              >
                Portrait (Tegak)
              </button>
              <button
                @click="orientation = 'landscape'"
                :class="['px-2.5 py-1 rounded-md font-bold transition-colors', orientation === 'landscape' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200']"
              >
                Landscape (Mendatar)
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-slate-600 font-semibold">Ukuran Teks:</span>
              <select
                v-model="fontSize"
                class="bg-white border border-slate-300 text-slate-800 px-2 py-1 rounded-md text-xs font-semibold focus:outline-none"
              >
                <option value="text-xs">Kecil (Kompak)</option>
                <option value="text-sm">Sedang (Standar)</option>
                <option value="text-base">Besar (Jelas)</option>
              </select>
            </div>
          </div>

          <div class="text-slate-500 font-semibold">
            Total Baris: <strong class="text-slate-900">{{ rows.length }}</strong>
          </div>
        </div>
      </div>

      <!-- Live Printable Preview Container -->
      <div class="flex-1 p-6 overflow-y-auto bg-slate-200/60">
        <div
          id="printable-preview-area"
          :class="[
            'bg-white text-slate-900 p-8 sm:p-10 shadow-2xl mx-auto border border-slate-200 font-sans transition-all',
            orientation === 'landscape' ? 'max-w-5xl' : 'max-w-3xl',
            fontSize
          ]"
        >
          <!-- Document Letterhead / Kop Surat -->
          <div class="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-3 mb-1">
                <div class="w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center font-black text-sm">
                  17
                </div>
                <div>
                  <h1 class="text-lg font-black uppercase tracking-tight text-slate-900">
                    {{ store.settings.eventName || 'CHAMPIONSHIP ALL IN ONE' }}
                  </h1>
                  <p class="text-[11px] text-slate-600 font-bold">
                    {{ store.settings.location }} — Tahun {{ store.settings.eventYear }}
                  </p>
                </div>
              </div>
            </div>
            <div class="text-right text-[11px] text-slate-600">
              <p class="font-bold uppercase tracking-wider text-red-700">{{ subtitle || 'DOKUMEN RESMI PANITIA' }}</p>
              <p>Dicetak: {{ printTimestamp }}</p>
            </div>
          </div>

          <!-- Document Header Title -->
          <div class="text-center mb-6">
            <h2 class="text-base font-black uppercase tracking-tight text-slate-900 border-b border-slate-200 inline-block pb-1">
              {{ title }}
            </h2>
          </div>

          <!-- Printable Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr class="bg-slate-100 text-slate-900 uppercase font-black tracking-wider text-[11px] border-b border-slate-300">
                  <th
                    v-for="col in visibleColumns"
                    :key="col.key"
                    class="p-2.5 border border-slate-300"
                  >
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in rows"
                  :key="idx"
                  :class="[idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70', 'border-b border-slate-200']"
                >
                  <td
                    v-for="col in visibleColumns"
                    :key="col.key"
                    class="p-2.5 border border-slate-300 font-medium text-slate-800"
                  >
                    <template v-if="col.key === 'index'">
                      {{ idx + 1 }}
                    </template>
                    <template v-else-if="col.key === 'badgeRank'">
                      <span v-if="row[col.key] === 1" class="font-extrabold text-amber-600">🥇 Juara 1</span>
                      <span v-else-if="row[col.key] === 2" class="font-extrabold text-slate-500">🥈 Juara 2</span>
                      <span v-else-if="row[col.key] === 3" class="font-extrabold text-amber-800">🥉 Juara 3</span>
                      <span v-else class="text-slate-600 font-bold">Peringkat {{ row[col.key] }}</span>
                    </template>
                    <template v-else>
                      {{ row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-' }}
                    </template>
                  </td>
                </tr>
                <tr v-if="rows.length === 0">
                  <td :colspan="visibleColumns.length" class="p-6 text-center text-slate-400">
                    Tidak ada data untuk ditampilkan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Document Signature Footer -->
          <div class="mt-10 pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <div>
              <p class="text-slate-500 text-[10px]">Dokumen ini digenerate secara otomatis oleh sistem 17an Arena.</p>
            </div>
            <div class="text-center w-48">
              <p class="text-slate-700 font-semibold mb-12">Ketua Panitia Pelaksana,</p>
              <p class="font-extrabold text-slate-900 border-b border-slate-900 inline-block px-4">
                {{ store.settings.headOfCommittee || '(Ketua Panitia)' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-5 border-t border-slate-200 flex items-center justify-between bg-slate-50 sticky bottom-0">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          Batal
        </button>

        <button
          @click="triggerPrint"
          class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <i class="bi bi-printer-fill"></i>
          <span>Cetak Dokumen Sekarang</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  subtitle?: string;
  columns: Array<{ key: string; label: string; visible: boolean }>;
  rows: Array<Record<string, any>>;
}>();

const emit = defineEmits(['close']);
const store = useArenaStore();

const orientation = ref<'portrait' | 'landscape'>('landscape');
const fontSize = ref<'text-xs' | 'text-sm' | 'text-base'>('text-xs');
const localColumns = ref<Array<{ key: string; label: string; visible: boolean }>>([]);

watch(
  () => props.columns,
  (newCols) => {
    localColumns.value = newCols.map(c => ({ ...c }));
  },
  { immediate: true, deep: true }
);

const visibleColumns = computed(() => {
  return localColumns.value.filter(c => c.visible);
});

const printTimestamp = computed(() => {
  return new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

function triggerPrint() {
  window.print();
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-preview-area,
  #printable-preview-area * {
    visibility: visible;
  }
  #printable-preview-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px !important;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
