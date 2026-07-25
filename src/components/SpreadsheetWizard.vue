<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
    <!-- Header Title -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase border border-emerald-200">
            Excel & Spreadsheet Engine
          </span>
          <h2 class="text-base font-extrabold text-slate-900">Ingin Gunakan Spreadsheet?</h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Generate template Excel otomatis dengan sheet terpisah per lomba, isi data secara offline, lalu upload kembali untuk pendaftaran massal instan!
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="downloadSpreadsheetTemplate"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2 border border-emerald-500"
        >
          <i class="bi bi-file-earmark-excel-fill text-lg"></i>
          <span>Download Template Excel Multi-Sheet</span>
        </button>
      </div>
    </div>

    <!-- Instructions & Options -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
        <div class="font-extrabold text-slate-900 flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
          <span>Download Template</span>
        </div>
        <p class="text-slate-500 text-[11px] leading-relaxed">
          Sistem akan membuat file Excel (.xlsx) dengan <strong>sheet khusus terpisah</strong> untuk setiap cabang perlombaan yang aktif.
        </p>
      </div>

      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
        <div class="font-extrabold text-slate-900 flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
          <span>Isi Data Peserta</span>
        </div>
        <p class="text-slate-500 text-[11px] leading-relaxed">
          Buka file di Microsoft Excel, Google Sheets, atau WPS Office. Isi kolom: Nama, Umur, Gender (L/P), Kontak, & Alamat.
        </p>
      </div>

      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
        <div class="font-extrabold text-slate-900 flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
          <span>Upload Kembali</span>
        </div>
        <p class="text-slate-500 text-[11px] leading-relaxed">
          Unggah file Excel yang telah diisi. Sistem akan membaca seluruh sheet secara otomatis dan mendaftarkan semua peserta sekaligus.
        </p>
      </div>
    </div>

    <!-- Target Competition Sheet Selection for Download -->
    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
      <div class="flex items-center justify-between">
        <label class="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
          <i class="bi bi-layers-fill text-emerald-600"></i>
          <span>Pilih Sheet Lomba Yang Ingin Dibuatkan Template:</span>
        </label>
        <button
          @click="toggleAllCompetitions"
          class="text-[11px] font-bold text-emerald-700 hover:underline"
        >
          {{ selectedCompIds.length === store.competitions.length ? 'Batal Pilih Semua' : 'Pilih Semua (' + store.competitions.length + ' Lomba)' }}
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <label
          v-for="comp in store.competitions"
          :key="comp.id"
          class="flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors"
          :class="selectedCompIds.includes(comp.id) ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-white border-slate-200 text-slate-600'"
        >
          <input
            type="checkbox"
            :value="comp.id"
            v-model="selectedCompIds"
            class="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span class="truncate">[{{ comp.prefix }}] {{ comp.name }}</span>
        </label>
      </div>
    </div>

    <!-- Upload Spreadsheet File Zone -->
    <div class="space-y-4">
      <h3 class="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-2">
        <i class="bi bi-cloud-arrow-up-fill text-emerald-600 text-sm"></i>
        <span>Upload Spreadsheet File (.xlsx / .xls / .csv)</span>
      </h3>

      <div
        class="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer relative"
        @dragover.prevent
        @drop.prevent="handleFileDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept=".xlsx, .xls, .csv"
          class="hidden"
          @change="handleFileSelect"
        />

        <div class="space-y-2">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shadow-xs">
            <i class="bi bi-file-spreadsheet-fill"></i>
          </div>
          <div>
            <p class="text-xs font-extrabold text-slate-800">
              Klik atau Seret (Drag & Drop) File Spreadsheet Excel Di Sini
            </p>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Mendukung file Excel (.xlsx, .xls) & CSV hasil unduhan template di atas
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Parsed Preview Data Section -->
    <div v-if="parsedData.length > 0" class="space-y-4 border-t border-slate-200 pt-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
        <div>
          <h3 class="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
            <i class="bi bi-check-circle-fill text-emerald-600"></i>
            <span>Preview Data Spreadsheet Terdeteksi ({{ parsedData.length }} Peserta)</span>
          </h3>
          <p class="text-xs text-emerald-700 mt-0.5">
            Data berhasil dibaca dari file Excel. Periksa data di bawah sebelum memproses pendaftaran.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="parsedData = []"
            class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-100"
          >
            Reset File
          </button>
          <button
            @click="commitImport"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs shadow-md flex items-center gap-1.5"
          >
            <i class="bi bi-box-arrow-in-right"></i>
            <span>Import Semua {{ parsedData.length }} Peserta</span>
          </button>
        </div>
      </div>

      <!-- Preview Table -->
      <div class="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 text-slate-700 uppercase font-extrabold sticky top-0 z-10">
            <tr>
              <th class="p-3 w-10">#</th>
              <th class="p-3">Nama Peserta</th>
              <th class="p-3 w-20">Umur</th>
              <th class="p-3 w-28">Gender</th>
              <th class="p-3">Kontak WA</th>
              <th class="p-3">Target Lomba (Sheet)</th>
              <th class="p-3 w-12 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(item, idx) in parsedData"
              :key="idx"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="p-3 font-mono text-slate-400 font-bold">{{ idx + 1 }}</td>
              <td class="p-3 font-bold text-slate-900">
                <input
                  v-model="item.name"
                  type="text"
                  class="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none"
                />
              </td>
              <td class="p-3">
                <input
                  v-model.number="item.age"
                  type="number"
                  min="1"
                  max="100"
                  class="w-16 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none font-bold"
                />
              </td>
              <td class="p-3">
                <select
                  v-model="item.gender"
                  class="px-2 py-1 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                  :class="item.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'"
                >
                  <option value="L">👨 Laki-Laki (L)</option>
                  <option value="P">👩 Perempuan (P)</option>
                </select>
              </td>
              <td class="p-3">
                <input
                  v-model="item.whatsapp"
                  type="text"
                  placeholder="0812..."
                  class="w-full px-2 py-1 border border-slate-200 rounded text-xs font-mono focus:outline-none"
                />
              </td>
              <td class="p-3">
                <select
                  v-model="item.competitionId"
                  class="w-full px-2 py-1 border border-slate-200 rounded text-xs font-bold focus:outline-none bg-slate-50"
                >
                  <option v-for="c in store.competitions" :key="c.id" :value="c.id">
                    [{{ c.prefix }}] {{ c.name }}
                  </option>
                </select>
              </td>
              <td class="p-3 text-center">
                <button
                  @click="removeParsedRow(idx)"
                  class="text-red-500 hover:text-red-700 p-1 font-bold"
                  title="Hapus baris ini"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCompIds = ref<string[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

interface ParsedRow {
  name: string;
  age: number;
  gender: 'L' | 'P';
  whatsapp: string;
  address: string;
  notes: string;
  competitionId: string;
  sheetName: string;
}

const parsedData = ref<ParsedRow[]>([]);

onMounted(() => {
  // Default select all competitions
  selectedCompIds.value = store.competitions.map(c => c.id);
});

function toggleAllCompetitions() {
  if (selectedCompIds.value.length === store.competitions.length) {
    selectedCompIds.value = [];
  } else {
    selectedCompIds.value = store.competitions.map(c => c.id);
  }
}

function downloadSpreadsheetTemplate() {
  if (selectedCompIds.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Minimal 1 Lomba',
      text: 'Harap centang cabang lomba yang ingin dibuatkan template spreadsheet.',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  const wb = XLSX.utils.book_new();

  selectedCompIds.value.forEach(compId => {
    const comp = store.getCompetitionById(compId);
    if (!comp) return;

    // Sheet Name capped at 31 chars (Excel limit)
    const rawSheetName = `${comp.name} [${comp.prefix}]`;
    const sheetName = rawSheetName.substring(0, 31).replace(/[:\\\/\?\*\[\]]/g, '');

    const headers = ['Nama Peserta*', 'Umur*', 'Gender (L/P)*', 'No. WhatsApp', 'Alamat / RT RW', 'Catatan / Regu'];
    const sampleRow1 = ['Ahmad Syahputra', 12, 'L', '081234567890', 'RT 01 RW 02', 'Regu Merah'];
    const sampleRow2 = ['Siti Nurhaliza', 11, 'P', '081987654321', 'RT 03 RW 02', 'Individu'];

    const sheetData = [headers, sampleRow1, sampleRow2];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // Nama
      { wch: 10 }, // Umur
      { wch: 15 }, // Gender
      { wch: 18 }, // WhatsApp
      { wch: 25 }, // Alamat
      { wch: 20 }  // Catatan
    ];

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, 'Template_Pendaftaran_17an_Arena_MultiSheet.xlsx');

  Swal.fire({
    icon: 'success',
    title: 'Template Spreadsheet Dibuat! 📄',
    text: `Berhasil mengunduh Excel dengan ${selectedCompIds.value.length} sheet lomba terpisah.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    parseExcelFile(files[0]);
  }
}

function handleFileDrop(e: DragEvent) {
  const files = e.dataTransfer?.files;
  if (files && files[0]) {
    parseExcelFile(files[0]);
  }
}

function parseExcelFile(file: File) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const collected: ParsedRow[] = [];

      workbook.SheetNames.forEach(sheetName => {
        const ws = workbook.Sheets[sheetName];
        const jsonRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!jsonRows || jsonRows.length <= 1) return;

        // Try to identify competition by sheetName or prefix match
        let targetComp = store.competitions.find(c =>
          sheetName.toLowerCase().includes(c.prefix.toLowerCase()) ||
          sheetName.toLowerCase().includes(c.name.toLowerCase())
        );

        // Fallback to first competition if not matched
        if (!targetComp && store.competitions.length > 0) {
          targetComp = store.competitions[0];
        }

        if (!targetComp) return;

        // Skip header row (index 0)
        for (let i = 1; i < jsonRows.length; i++) {
          const row = jsonRows[i];
          if (!row || !row[0] || String(row[0]).trim() === '') continue;

          const rawName = String(row[0]).trim();
          const rawAge = parseInt(String(row[1] || '12'), 10) || 12;
          const rawGender = String(row[2] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L';
          const rawWa = String(row[3] || '').trim();
          const rawAddress = String(row[4] || '').trim();
          const rawNotes = String(row[5] || '').trim();

          collected.push({
            name: rawName,
            age: rawAge,
            gender: rawGender,
            whatsapp: rawWa,
            address: rawAddress,
            notes: rawNotes,
            competitionId: targetComp.id,
            sheetName
          });
        }
      });

      if (collected.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Data Peserta Kosong',
          text: 'Tidak ditemukan baris data peserta yang valid di dalam file spreadsheet tersebut.',
          confirmButtonColor: '#dc2626'
        });
        return;
      }

      parsedData.value = collected;

      Swal.fire({
        icon: 'success',
        title: 'Spreadsheet Berhasil Dibaca! 📊',
        text: `Ditemukan ${collected.length} peserta di seluruh sheet. Silakan periksa data sebelum import.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Failed to parse spreadsheet:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membaca File',
        text: 'Format file tidak didukung atau terjadi kesalahan saat membaca spreadsheet.',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  reader.readAsArrayBuffer(file);
}

function removeParsedRow(idx: number) {
  parsedData.value.splice(idx, 1);
}

function commitImport() {
  if (parsedData.value.length === 0) return;

  let totalRegistered = 0;
  const compGroupMap = new Map<string, ParsedRow[]>();

  parsedData.value.forEach(item => {
    if (!compGroupMap.has(item.competitionId)) {
      compGroupMap.set(item.competitionId, []);
    }
    compGroupMap.get(item.competitionId)!.push(item);
  });

  compGroupMap.forEach((rows, compId) => {
    const results = store.registerBulkParticipants(compId, rows);
    totalRegistered += results.length;
  });

  parsedData.value = [];

  Swal.fire({
    icon: 'success',
    title: 'Import Massal Berhasil! 🎉',
    html: `
      <p class="text-xs text-slate-600 mb-2">
        Berhasil mengimpor total <strong>${totalRegistered} peserta</strong> ke dalam sistem arena lomba.
      </p>
    `,
    confirmButtonColor: '#dc2626'
  });
}
</script>
