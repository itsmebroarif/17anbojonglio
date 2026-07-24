<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-arrow-down-up text-red-600"></i>
          <span>Import / Export & Sinkronisasi Antar Laptop</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">
          Transfer data antar laptop panitia menggunakan Flashdisk via file JSON tanpa internet.
        </p>
      </div>
    </div>

    <!-- Sync Concept Banner -->
    <div class="bg-gradient-to-r from-slate-900 to-slate-950 p-6 rounded-3xl text-white border border-slate-800 shadow-xl space-y-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-xl">
          <i class="bi bi-usb-drive-fill"></i>
        </div>
        <div>
          <h2 class="font-extrabold text-base">Alur Sinkronisasi Offline (Flashdisk)</h2>
          <p class="text-xs text-slate-400">Laptop A (Export JSON) ➔ Simpan Flashdisk ➔ Laptop B (Import JSON)</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <!-- Export Box -->
        <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
          <h3 class="font-bold text-amber-400 text-sm flex items-center gap-2">
            <i class="bi bi-download"></i> 1. Export Backup JSON
          </h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Unduh seluruh data (lomba, peserta, pendaftaran, skor, juara, sertifikat, doorprize) menjadi satu file JSON backup.
          </p>
          <button
            @click="exportFullJSON"
            class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-colors w-full"
          >
            Export File JSON (17an_arena_backup.json)
          </button>
        </div>

        <!-- Import Box -->
        <div class="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
          <h3 class="font-bold text-emerald-400 text-sm flex items-center gap-2">
            <i class="bi bi-upload"></i> 2. Import Restore JSON
          </h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Pilih file JSON hasil export dari laptop lain untuk menimpa atau memulihkan data lokal.
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileImport"
          />
          <button
            @click="triggerFileImport"
            class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors w-full"
          >
            Pilih & Restore File JSON
          </button>
        </div>
      </div>
    </div>

    <!-- Format Exporters Grid -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
      <h2 class="font-bold text-slate-900 text-base">Ekspor Format Lain (Laporan)</h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          @click="exportXLSX"
          class="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all"
        >
          <i class="bi bi-file-earmark-excel-fill text-emerald-600 text-2xl block mb-2"></i>
          <span class="font-bold text-slate-900 text-sm block">Excel Workbook (.XLSX)</span>
          <span class="text-xs text-slate-500 block mt-0.5">Laporan rekap sheet terpisah</span>
        </button>

        <button
          @click="exportCSV"
          class="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition-all"
        >
          <i class="bi bi-filetype-csv text-blue-600 text-2xl block mb-2"></i>
          <span class="font-bold text-slate-900 text-sm block">CSV Table (.CSV)</span>
          <span class="text-xs text-slate-500 block mt-0.5">Format tabel terpisah koma</span>
        </button>

        <button
          @click="exportSQL"
          class="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all"
        >
          <i class="bi bi-database-fill-down text-indigo-600 text-2xl block mb-2"></i>
          <span class="font-bold text-slate-900 text-sm block">SQL Dump Script (.SQL)</span>
          <span class="text-xs text-slate-500 block mt-0.5">Skrip query database CREATE & INSERT</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { StorageService } from '../services/storage';
import { exportToJSON, exportToXLSX, exportToCSV, exportToSQL } from '../services/export';
import Swal from 'sweetalert2';

const store = useArenaStore();
const fileInput = ref<HTMLInputElement | null>(null);

function exportFullJSON() {
  const data = StorageService.getAllData();
  const dateStr = new Date().toISOString().substring(0, 10);
  exportToJSON(data, `17an_arena_backup_${dateStr}.json`);
  Swal.fire({ icon: 'success', title: 'Backup JSON Diunduh!', timer: 1500, showConfirmButton: false });
}

function triggerFileImport() {
  fileInput.value?.click();
}

function handleFileImport(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target?.result as string);
      const success = StorageService.restoreAllData(json);
      if (success) {
        store.init();
        Swal.fire({ icon: 'success', title: 'Data Berhasil Dipulihkan!', text: 'Seluruh data lokal telah diperbarui.' });
      } else {
        throw new Error('Format JSON tidak valid.');
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Gagal Import JSON', text: err.message });
    }
  };

  reader.readAsText(file);
}

function exportXLSX() {
  const data = StorageService.getAllData();
  exportToXLSX([
    { name: 'Lomba', data: data.competitions },
    { name: 'Peserta', data: data.participants },
    { name: 'Pendaftaran', data: data.registrations },
    { name: 'Juara', data: data.winners }
  ], '17an_Arena_Laporan_Lengkap.xlsx');
}

function exportCSV() {
  const data = StorageService.getAllData();
  exportToCSV(data.participants, '17an_Arena_Peserta.csv');
}

function exportSQL() {
  const data = StorageService.getAllData();
  exportToSQL('participants', data.participants, '17an_participants.sql');
}
</script>
