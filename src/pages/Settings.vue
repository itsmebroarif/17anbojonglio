<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-gear-fill text-slate-700"></i>
          <span>Pengaturan Sistem 17an Arena</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Sesuaikan identitas acara, ketua panitia, dan konfigurasi cetak sertifikat.</p>
      </div>
    </div>

    <!-- Settings Form -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Acara Kemerdekaan *</label>
          <input
            v-model="form.eventName"
            required
            type="text"
            placeholder="e.g. Pesta Kemerdekaan RI ke-81 RT 05 / RW 02"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50 font-bold"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Tahun Acara</label>
            <input
              v-model.number="form.eventYear"
              type="number"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Ketua Panitia *</label>
            <input
              v-model="form.headOfCommittee"
              required
              type="text"
              placeholder="e.g. Ahmad Subardjo, S.T."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Lokasi Utama Kegiatan</label>
          <input
            v-model="form.location"
            type="text"
            placeholder="e.g. Lapangan Warga RT 05"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Teks Template Sertifikat</label>
          <textarea
            v-model="form.certificateTemplateText"
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
          ></textarea>
        </div>

        <div class="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>

    <!-- Reset / Re-seed Data Card -->
    <div class="bg-rose-50 border border-rose-200 rounded-3xl p-6 space-y-3">
      <h3 class="font-bold text-rose-900 text-sm flex items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>Reset & Initializer Data Contoh Demo</span>
      </h3>
      <p class="text-xs text-rose-700 leading-relaxed">
        Tombol ini akan mereset seluruh database LocalStorage kembali ke data contoh bawaan (lomba, peserta demo, registrasi awal). Gunakan untuk uji coba aplikasi.
      </p>
      <button
        @click="confirmResetDemo"
        class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
      >
        Reset & Muat Ulang Data Contoh Demo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import Swal from 'sweetalert2';

const store = useArenaStore();

const form = reactive({
  eventName: '',
  eventYear: 2026,
  headOfCommittee: '',
  location: '',
  certificateTemplateText: ''
});

onMounted(() => {
  form.eventName = store.settings.eventName;
  form.eventYear = store.settings.eventYear;
  form.headOfCommittee = store.settings.headOfCommittee;
  form.location = store.settings.location;
  form.certificateTemplateText = store.settings.certificateTemplateText;
});

function saveSettings() {
  store.updateSettings({ ...form });
  Swal.fire({ icon: 'success', title: 'Pengaturan Disimpan!', timer: 1500, showConfirmButton: false });
}

function confirmResetDemo() {
  Swal.fire({
    title: 'Reset ke Data Contoh?',
    text: 'Seluruh data saat ini akan diganti dengan data demo awal!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Ya, Reset Data'
  }).then(res => {
    if (res.isConfirmed) {
      store.resetToDefault();
      form.eventName = store.settings.eventName;
      form.eventYear = store.settings.eventYear;
      form.headOfCommittee = store.settings.headOfCommittee;
      form.location = store.settings.location;
      form.certificateTemplateText = store.settings.certificateTemplateText;
      Swal.fire('Ter-reset!', 'Data contoh berhasil dimuat.', 'success');
    }
  });
}
</script>
