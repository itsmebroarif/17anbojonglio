<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-patch-check-fill text-purple-600"></i>
          <span>Batch Certificate Generator</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Cetak & generate sertifikat masal lengkap dengan QR Code verifikasi unik.</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <button
          @click="generateAllCertificates"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <i class="bi bi-gear-wide-connected"></i>
          <span>Generate Massal Sertifikat</span>
        </button>

        <button
          @click="triggerPrint"
          class="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <i class="bi bi-printer-fill"></i>
          <span>Cetak (Print)</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
      <div class="flex items-center space-x-3 w-full sm:w-auto">
        <label class="text-xs font-bold text-slate-700">Filter Lomba:</label>
        <select
          v-model="selectedCompId"
          class="px-3 py-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
        >
          <option value="ALL">-- Semua Lomba --</option>
          <option v-for="c in store.competitions" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.category }})
          </option>
        </select>
      </div>
      <span class="text-xs font-mono font-bold text-slate-500">
        Total Sertifikat: {{ filteredCertificates.length }}
      </span>
    </div>

    <!-- Certificate Visual Preview Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cert in filteredCertificates"
        :key="cert.id"
        class="bg-white rounded-3xl border-4 border-amber-500/80 p-8 shadow-xl relative overflow-hidden text-slate-900 flex flex-col justify-between h-[360px]"
      >
        <!-- Background Flag Watermark Accent -->
        <div class="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-9xl font-black font-heading">
          RI
        </div>

        <!-- Top Header Certificate -->
        <div class="text-center border-b-2 border-red-600/30 pb-4">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              {{ cert.certificateNo }}
            </span>
            <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-red-100 text-red-800 rounded">
              VERIFIED QR
            </span>
          </div>

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
            {{ store.getParticipantById(cert.participantId)?.name }}
          </h3>
          <p class="text-xs font-semibold text-slate-700">
            Sebagai <span class="font-bold text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-200">{{ cert.title }}</span> pada cabang lomba
            <span class="font-extrabold">{{ store.getCompetitionById(cert.competitionId)?.name }}</span>
          </p>
        </div>

        <!-- Footer Signatures & QR Code Verification -->
        <div class="pt-3 border-t border-slate-200 flex items-end justify-between">
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
            <img v-if="cert.qrCodeUrl" :src="cert.qrCodeUrl" alt="QR Code" class="w-16 h-16 mx-auto border border-slate-200 rounded p-0.5 bg-white" />
            <span class="text-[8px] font-mono text-slate-400 mt-1 block font-bold">
              CODE: {{ cert.verificationCode }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredCertificates.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <i class="bi bi-patch-check text-5xl text-slate-300 block mb-3"></i>
      <h2 class="text-lg font-bold text-slate-800">Belum Ada Sertifikat Digenerate</h2>
      <p class="text-xs text-slate-500 mt-1">Klik tombol "Generate Massal Sertifikat" di atas untuk membuat sertifikat otomatis bagi seluruh peserta.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCompId = ref('ALL');

const filteredCertificates = computed(() => {
  return store.certificates.filter(c => selectedCompId.value === 'ALL' || c.competitionId === selectedCompId.value);
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

  Swal.fire({
    icon: 'success',
    title: 'Sertifikat Massal Selesai!',
    text: `Total ${store.certificates.length} sertifikat berhasil dibuat.`,
    confirmButtonColor: '#dc2626'
  });
}

function triggerPrint() {
  window.print();
}
</script>
