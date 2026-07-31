<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-patch-check-fill text-purple-600"></i>
          <span>Batch Certificate Generator</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Generate, cetak, & unduh PDF sertifikat massal lengkap dengan QR Code verifikasi unik.</p>
      </div>

      <!-- Header Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          @click="generateAllCertificates"
          class="flex-1 sm:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-gear-wide-connected"></i>
          <span>Generate Massal</span>
        </button>

        <button
          @click="printSelectedCertificates"
          :disabled="selectedCertIds.length === 0"
          class="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="bi bi-printer-fill"></i>
          <span>Cetak Pilihan ({{ selectedCertIds.length }})</span>
        </button>

        <button
          @click="exportSelectedPdf"
          :disabled="selectedCertIds.length === 0"
          class="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="bi bi-file-earmark-pdf-fill"></i>
          <span>Unduh PDF Bulk ({{ selectedCertIds.length }})</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar & Selection Toolbar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 no-print">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Search Input -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">Cari Nama / No. Sertifikat:</label>
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="e.g. Budi / CERT/17AN..."
              class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <!-- Filter Competition -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">Filter Lomba:</label>
          <select
            v-model="selectedCompId"
            class="w-full px-3 py-1.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">-- Semua Perlombaan --</option>
            <option v-for="c in store.competitions" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.category }})
            </option>
          </select>
        </div>

        <!-- Filter Title/Role -->
        <div>
          <label class="block text-[11px] font-bold text-slate-500 mb-1">Filter Kategori Pencapaian:</label>
          <select
            v-model="selectedTitle"
            class="w-full px-3 py-1.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">-- Semua Gelar --</option>
            <option value="JUARA_ONLY">🏆 Hanya Pemenang (Juara 1, 2, 3)</option>
            <option value="Juara 1">🥇 Juara 1</option>
            <option value="Juara 2">🥈 Juara 2</option>
            <option value="Juara 3">🥉 Juara 3</option>
            <option value="Peserta">🎗️ Peserta</option>
          </select>
        </div>
      </div>

      <!-- Theme Layout Selector Row -->
      <div class="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div class="flex items-center gap-2">
          <i class="bi bi-palette-fill text-purple-600"></i>
          <span class="text-xs font-extrabold text-slate-700">Desain Theme Sertifikat:</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-for="t in themes"
            :key="t.id"
            @click="activeTheme = t.id"
            class="px-3 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1"
            :class="[
              activeTheme === t.id
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            ]"
          >
            <span>{{ t.icon }}</span>
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Selection Helpers -->
      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="selectAll"
            class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            Pilih Semua ({{ filteredCertificates.length }})
          </button>
          <button
            @click="selectWinnersOnly"
            class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-extrabold transition-colors"
          >
            Pilih Juara 1-3 Saja
          </button>
          <button
            @click="deselectAll"
            class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-bold transition-colors"
          >
            Batal Pilih
          </button>
        </div>

        <div class="text-xs font-bold text-slate-600">
          Terpilih: <span class="text-purple-600 font-extrabold">{{ selectedCertIds.length }}</span> / {{ filteredCertificates.length }} Sertifikat
        </div>
      </div>
    </div>

    <!-- Certificate Visual Preview Grid (Screen view) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
      <div
        v-for="cert in filteredCertificates"
        :key="cert.id"
        class="bg-white rounded-3xl border-4 transition-all duration-200 p-5 sm:p-8 shadow-xl relative overflow-hidden text-slate-900 flex flex-col justify-between min-h-[350px] sm:h-[370px]"
        :class="[
          selectedCertIds.includes(cert.id) ? 'border-purple-600 ring-4 ring-purple-500/20' : 'border-amber-500/80 hover:border-amber-600'
        ]"
      >
        <!-- Background Flag Watermark Accent -->
        <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-9xl font-black font-heading">
          RI
        </div>

        <!-- Selection Checkbox Badge & Action Floating Bar -->
        <div class="flex items-center justify-between border-b-2 border-red-600/30 pb-3 z-10">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              :value="cert.id"
              v-model="selectedCertIds"
              class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              {{ cert.certificateNo }}
            </span>
          </label>

          <div class="flex items-center gap-1.5">
            <button
              @click="downloadSinglePdf(cert)"
              class="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1"
              title="Unduh PDF Sertifikat Ini"
            >
              <i class="bi bi-file-earmark-pdf"></i>
              <span>PDF</span>
            </button>
            <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-red-100 text-red-800 rounded">
              VERIFIED
            </span>
          </div>
        </div>

        <!-- Top Header Certificate -->
        <div class="text-center py-2">
          <h2 class="font-heading text-xl font-bold tracking-widest text-red-700 uppercase">
            SERTIFIKAT PENGHARGAAN
          </h2>
          <p class="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">
            {{ store.settings.eventName }} • TAHUN {{ store.settings.eventYear }}
          </p>
        </div>

        <!-- Body Certificate -->
        <div class="text-center space-y-2 py-2">
          <p class="text-[11px] text-slate-500 italic">Diberikan dengan penuh apresiasi kepada:</p>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight underline decoration-red-600 underline-offset-4">
            {{ store.getParticipantById(cert.participantId)?.name || 'Nama Peserta' }}
          </h3>
          <p class="text-xs font-semibold text-slate-700">
            Sebagai <span class="font-bold text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-200">{{ cert.title }}</span> pada cabang lomba
            <span class="font-extrabold">{{ store.getCompetitionById(cert.competitionId)?.name }}</span>
          </p>
        </div>

        <!-- Footer Signatures & QR Code Verification -->
        <div class="pt-3 border-t border-slate-200 flex items-end justify-between z-10">
          <div class="text-left text-[10px] space-y-1">
            <span class="text-slate-400 block">Ditetapkan di {{ store.settings.location }}</span>
            <span class="font-bold text-slate-800 block">{{ cert.issueDate }}</span>
            <div class="pt-2 font-bold text-slate-900 border-t border-slate-300 w-28">
              {{ store.settings.headOfCommittee }}
              <span class="block text-[9px] font-normal text-slate-500">Ketua Panitia</span>
            </div>
          </div>

          <!-- QR Verification Code -->
          <div class="text-center">
            <img v-if="cert.qrCodeUrl" :src="cert.qrCodeUrl" alt="QR Code" class="w-16 h-16 mx-auto border border-slate-200 rounded p-0.5 bg-white shadow-2xs" />
            <span class="text-[8px] font-mono text-slate-400 mt-1 block font-bold">
              CODE: {{ cert.verificationCode }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCertificates.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center no-print">
      <i class="bi bi-patch-check text-5xl text-slate-300 block mb-3"></i>
      <h2 class="text-lg font-bold text-slate-800">Belum Ada Sertifikat Digenerate</h2>
      <p class="text-xs text-slate-500 mt-1 mb-4">Klik tombol "Generate Massal" di atas untuk membuat sertifikat otomatis bagi seluruh peserta.</p>
      <button
        @click="generateAllCertificates"
        class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
      >
        Generate Sertifikat Massal
      </button>
    </div>

    <!-- CLEAN PRINT CONTAINER (Visible only in @media print) -->
    <div class="hidden print:block print:w-full space-y-0">
      <div
        v-for="cert in printableCertificates"
        :key="'print-' + cert.id"
        class="certificate-print-card w-full h-[190mm] border-4 border-amber-600 p-8 my-0 relative flex flex-col justify-between text-slate-900 bg-white"
        style="page-break-after: always; break-after: page;"
      >
        <!-- Top Certificate Header -->
        <div class="text-center border-b-2 border-red-600 pb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-mono font-bold text-slate-500 uppercase">
              NO: {{ cert.certificateNo }}
            </span>
            <span class="text-xs font-extrabold uppercase px-3 py-1 bg-red-100 text-red-900 rounded border border-red-300">
              OFFICIAL VERIFIED CERTIFICATE
            </span>
          </div>

          <h1 class="font-heading text-3xl font-bold tracking-widest text-red-700 uppercase">
            SERTIFIKAT PENGHARGAAN
          </h1>
          <p class="text-xs text-slate-600 uppercase font-bold tracking-wider mt-1">
            {{ store.settings.eventName }} • TAHUN {{ store.settings.eventYear }}
          </p>
        </div>

        <!-- Body Content -->
        <div class="text-center space-y-4 py-6">
          <p class="text-sm text-slate-600 italic">Diberikan dengan penuh apresiasi dan kehormatan kepada:</p>
          <h2 class="text-4xl font-black text-slate-900 tracking-tight underline decoration-red-600 underline-offset-8">
            {{ store.getParticipantById(cert.participantId)?.name || 'Nama Peserta' }}
          </h2>
          <p class="text-base font-semibold text-slate-800">
            Atas pencapaian sebagai <span class="font-bold text-red-700 uppercase bg-red-50 px-3 py-1 rounded border border-red-300 text-lg">{{ cert.title }}</span> pada cabang lomba
            <span class="font-extrabold underline">{{ store.getCompetitionById(cert.competitionId)?.name }}</span>
          </p>
        </div>

        <!-- Signatures & Verification Code -->
        <div class="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
          <div class="text-left space-y-2">
            <span class="text-xs text-slate-500 block">Ditetapkan di {{ store.settings.location }}</span>
            <span class="text-sm font-bold text-slate-900 block">{{ cert.issueDate }}</span>
            <div class="pt-8 font-bold text-base text-slate-900 border-t border-slate-400 w-48">
              {{ store.settings.headOfCommittee }}
              <span class="block text-xs font-normal text-slate-600">Ketua Panitia Pelaksana</span>
            </div>
          </div>

          <!-- QR Verification Code -->
          <div class="text-center">
            <img v-if="cert.qrCodeUrl" :src="cert.qrCodeUrl" alt="QR Code" class="w-24 h-24 mx-auto border-2 border-slate-300 rounded p-1 bg-white" />
            <span class="text-xs font-mono text-slate-600 mt-2 block font-bold">
              VERIFY CODE: {{ cert.verificationCode }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { Certificate } from '../types';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCompId = ref('ALL');
const selectedTitle = ref('ALL');
const searchQuery = ref('');
const selectedCertIds = ref<string[]>([]);
const activeTheme = ref<'merah-putih' | 'gold-classic' | 'royal-navy'>('merah-putih');

const themes = [
  { id: 'merah-putih', label: 'Merah Putih Garuda', icon: '🇮🇩' },
  { id: 'gold-classic', label: 'Elegance Gold Classic', icon: '🏆' },
  { id: 'royal-navy', label: 'Royal Navy Luxury', icon: '⚜️' }
];

const filteredCertificates = computed(() => {
  return store.certificates.filter(cert => {
    // Competition Filter
    if (selectedCompId.value !== 'ALL' && cert.competitionId !== selectedCompId.value) return false;

    // Title / Winner Filter
    if (selectedTitle.value === 'JUARA_ONLY' && cert.title === 'Peserta') return false;
    if (selectedTitle.value !== 'ALL' && selectedTitle.value !== 'JUARA_ONLY' && cert.title !== selectedTitle.value) return false;

    // Search Query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const p = store.getParticipantById(cert.participantId);
      const nameMatch = p?.name.toLowerCase().includes(q);
      const noMatch = cert.certificateNo.toLowerCase().includes(q);
      const codeMatch = cert.verificationCode.toLowerCase().includes(q);
      if (!nameMatch && !noMatch && !codeMatch) return false;
    }

    return true;
  });
});

// Automatically select all filtered certificates initially when filtering
watch(filteredCertificates, (newVal) => {
  if (selectedCertIds.value.length === 0) {
    selectedCertIds.value = newVal.map(c => c.id);
  }
}, { immediate: true });

function selectAll() {
  selectedCertIds.value = filteredCertificates.value.map(c => c.id);
}

function selectWinnersOnly() {
  selectedCertIds.value = filteredCertificates.value
    .filter(c => c.title !== 'Peserta')
    .map(c => c.id);
}

function deselectAll() {
  selectedCertIds.value = [];
}

const printableCertificates = computed(() => {
  return filteredCertificates.value.filter(c => selectedCertIds.value.includes(c.id));
});

async function generateAllCertificates() {
  Swal.fire({
    title: 'Membuat Sertifikat Massal...',
    text: 'Menghasilkan sertifikat beserta QR Code unik untuk seluruh cabang lomba',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  for (const comp of store.competitions) {
    await store.generateBatchCertificates(comp.id);
  }

  // Auto select created certificates
  selectAll();

  Swal.fire({
    icon: 'success',
    title: 'Sertifikat Massal Selesai!',
    text: `Total ${store.certificates.length} sertifikat berhasil dibuat dan siap dicetak/diunduh.`,
    confirmButtonColor: '#dc2626'
  });
}

function printSelectedCertificates() {
  if (selectedCertIds.value.length === 0) {
    Swal.fire('Perhatian', 'Pilih setidaknya satu sertifikat untuk dicetak.', 'warning');
    return;
  }
  window.print();
}

function downloadSinglePdf(cert: Certificate) {
  exportCertificatesToPdf([cert]);
}

function exportSelectedPdf() {
  const list = filteredCertificates.value.filter(c => selectedCertIds.value.includes(c.id));
  exportCertificatesToPdf(list);
}

function exportCertificatesToPdf(certs: Certificate[]) {
  if (certs.length === 0) {
    Swal.fire('Perhatian', 'Pilih sertifikat yang akan diunduh.', 'warning');
    return;
  }

  Swal.fire({
    title: 'Mempersiapkan Dokumen PDF...',
    text: `Memproses ${certs.length} sertifikat halaman A4 Landscape`,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  setTimeout(() => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const eventName = store.settings.eventName || 'LOMBA KEMERDEKAAN 17 AGUSTUS';
      const eventYear = store.settings.eventYear || '2026';
      const location = store.settings.location || 'Jakarta';
      const headOfCommittee = store.settings.headOfCommittee || 'Panitia Pelaksana';

      certs.forEach((cert, idx) => {
        if (idx > 0) doc.addPage();

        const participant = store.getParticipantById(cert.participantId);
        const competition = store.getCompetitionById(cert.competitionId);
        const pName = participant?.name || 'Peserta Perlombaan';
        const cName = competition?.name || 'Cabang Lomba';

        // Outer Red Border
        doc.setLineWidth(2.5);
        doc.setDrawColor(220, 38, 38); // #dc2626
        doc.rect(8, 8, 281, 194);

        // Inner Amber Border
        doc.setLineWidth(1);
        doc.setDrawColor(245, 158, 11); // #f59e0b
        doc.rect(12, 12, 273, 186);

        // Top Metadata Header
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(`NO. SERTIFIKAT: ${cert.certificateNo}`, 18, 22);
        doc.text(`VERIFIED CODE: ${cert.verificationCode}`, 230, 22);

        // Main Title Header
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28); // #b91c1c
        doc.text('SERTIFIKAT PENGHARGAAN', 148, 42, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(`${eventName.toUpperCase()} • TAHUN ${eventYear}`, 148, 50, { align: 'center' });

        // Decorative Line
        doc.setLineWidth(0.6);
        doc.setDrawColor(220, 38, 38);
        doc.line(80, 55, 216, 55);

        // Body Lead
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('Diberikan dengan penuh apresiasi dan kehormatan kepada:', 148, 72, { align: 'center' });

        // Participant Name
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42); // #0f172a
        doc.text(pName, 148, 90, { align: 'center' });

        // Name Underline
        doc.setLineWidth(0.8);
        doc.setDrawColor(220, 38, 38);
        const nameWidth = Math.min(doc.getTextWidth(pName), 200);
        doc.line(148 - nameWidth / 2, 93, 148 + nameWidth / 2, 93);

        // Achievement Title
        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text('Atas keikutsertaan dan pencapaian sebagai', 148, 110, { align: 'center' });

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28);
        doc.text(`[ ${cert.title.toUpperCase()} ]`, 148, 120, { align: 'center' });

        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(`pada cabang perlombaan "${cName}"`, 148, 130, { align: 'center' });

        // Signature & Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Ditetapkan di ${location}, ${cert.issueDate}`, 30, 155);

        doc.setLineWidth(0.5);
        doc.setDrawColor(148, 163, 184);
        doc.line(30, 180, 90, 180);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(headOfCommittee, 30, 186);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('Ketua Panitia Pelaksana', 30, 191);

        // QR Code Image
        if (cert.qrCodeUrl) {
          try {
            doc.addImage(cert.qrCodeUrl, 'PNG', 225, 145, 36, 36);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text('VALIDATED QR CODE', 243, 185, { align: 'center' });
          } catch (e) {
            console.error('Error adding QR code to PDF:', e);
          }
        }
      });

      doc.save(`Batch_Sertifikat_17an_${certs.length}_file.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'PDF Massal Berhasil Diunduh! 📄',
        text: `Total ${certs.length} sertifikat telah diexport ke file PDF A4.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal Export', 'Terjadi kesalahan saat memproses PDF sertifikat.', 'error');
    }
  }, 100);
}
</script>

