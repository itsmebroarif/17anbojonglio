<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] flex flex-col">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-200 border border-red-400/40">
            <i class="bi bi-keyboard-fill"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>Pintasan Keyboard Panitia (Hotkey Manager)</span>
              <span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-mono font-bold">
                PRO SPEED
              </span>
            </h3>
            <p class="text-xs text-slate-500">
              Gunakan kombinasi tombol cepat di bawah untuk mempercepat navigasi dan operasional panitia di lapangan.
            </p>
          </div>
        </div>

        <button
          @click="close"
          class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors"
          title="Tutup Modal"
        >
          <i class="bi bi-x-lg text-sm"></i>
        </button>
      </div>

      <!-- Shortcuts Grid List (Scrollable) -->
      <div class="overflow-y-auto space-y-6 pr-1 flex-1 text-xs">
        
        <!-- Category 1: Navigasi Cepat Halaman (Quick Nav) -->
        <div class="space-y-2.5">
          <h4 class="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-red-600 border-b border-slate-100 pb-1">
            <i class="bi bi-compass-fill"></i>
            <span>Navigasi Cepat Modul</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="nav in navShortcuts"
              :key="nav.key"
              @click="navigateAndClose(nav.path)"
              class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-red-50/50 hover:border-red-200 transition-all cursor-pointer group"
            >
              <div class="flex items-center space-x-2.5">
                <i :class="nav.icon" class="text-slate-500 group-hover:text-red-600 text-sm"></i>
                <span class="font-bold text-slate-800 group-hover:text-red-700">{{ nav.label }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <kbd class="px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-[10px] font-bold text-slate-700 shadow-2xs">Alt</kbd>
                <span class="text-slate-400 font-bold text-[10px]">+</span>
                <kbd class="px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-[10px] font-bold text-red-600 shadow-2xs">{{ nav.key }}</kbd>
              </div>
            </div>
          </div>
        </div>

        <!-- Category 2: Aksi Operasional Panitia -->
        <div class="space-y-2.5">
          <h4 class="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-red-600 border-b border-slate-100 pb-1">
            <i class="bi bi-lightning-charge-fill"></i>
            <span>Aksi Cepat Sistem & Fitur Modal</span>
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="action in actionShortcuts"
              :key="action.title"
              class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100 transition-colors"
            >
              <div class="flex items-center space-x-2.5">
                <i :class="action.icon" class="text-slate-500 text-sm"></i>
                <div>
                  <div class="font-bold text-slate-800">{{ action.title }}</div>
                  <div class="text-[10px] text-slate-500">{{ action.desc }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-1 flex-shrink-0">
                <template v-for="(k, idx) in action.keys" :key="idx">
                  <span v-if="idx > 0" class="text-slate-400 font-bold text-[10px]">+</span>
                  <kbd class="px-2 py-1 bg-white border border-slate-300 rounded-md font-mono text-[10px] font-bold text-slate-800 shadow-2xs">
                    {{ k }}
                  </kbd>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Pro Tip Box -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start space-x-3 text-amber-900">
          <i class="bi bi-lightbulb-fill text-amber-600 text-lg flex-shrink-0 mt-0.5"></i>
          <div class="space-y-1">
            <p class="font-extrabold text-xs">Tips Efisiensi Lapangan:</p>
            <p class="text-[11px] text-amber-800 leading-relaxed">
              Pintasan dapat ditekan dari halaman mana saja tanpa harus mengeklik menu sidebar. Tekan <kbd class="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded font-mono font-bold text-[10px]">Shift + ?</kbd> atau <kbd class="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded font-mono font-bold text-[10px]">Ctrl + /</kbd> kapan pun untuk membuka petunjuk ini.
            </p>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div class="flex items-center justify-between border-t border-slate-100 pt-3 flex-shrink-0">
        <span class="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
          <i class="bi bi-info-circle-fill text-slate-400"></i>
          Semua pintasan aktif secara otomatis saat Anda menggunakan aplikasi.
        </span>
        <button
          @click="close"
          class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
        >
          Mengerti (Tutup)
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();

function close() {
  emit('close');
}

function navigateAndClose(path: string) {
  router.push(path);
  close();
}

const navShortcuts = [
  { key: '1', label: '1. Dashboard Utama', path: '/', icon: 'bi bi-grid-1x2-fill' },
  { key: '2', label: '2. Pendaftaran Peserta', path: '/registration', icon: 'bi bi-person-plus-fill' },
  { key: '3', label: '3. Ruang Tunggu Pemanggilan', path: '/waiting-lounge', icon: 'bi bi-hourglass-split' },
  { key: '4', label: '4. Input Skor & Penilaian', path: '/scoring', icon: 'bi bi-trophy-fill' },
  { key: '5', label: '5. Cetak E-Sertifikat', path: '/certificates', icon: 'bi bi-patch-check-fill' },
  { key: '6', label: '6. Papan Skor Live Arena', path: '/competition-board', icon: 'bi bi-display-fill' },
  { key: '7', label: '7. Layout Denah Arena', path: '/arena-layout', icon: 'bi bi-diagram-3-fill' },
  { key: '8', label: '8. Studio Olah Data SQL', path: '/super-user-studio', icon: 'bi bi-database-fill-gear' },
];

const actionShortcuts = [
  { title: 'Pencarian Global Data', desc: 'Cari cepat peserta & lomba', keys: ['Ctrl', 'K'], icon: 'bi bi-search' },
  { title: 'Pencarian Instan (Tombol Slash)', desc: 'Fokus langsung ke kotak pencarian', keys: ['/'], icon: 'bi bi-slash-square' },
  { title: 'Simpan / Backup Lokal', desc: 'Simpan otomatis data panitia', keys: ['Ctrl', 'S'], icon: 'bi bi-floppy-fill' },
  { title: 'Cetak / Print Dokumen', desc: 'Buka preview cetak sertifikat', keys: ['Ctrl', 'P'], icon: 'bi bi-printer-fill' },
  { title: 'Tanya AI Asisten Gemini', desc: 'Tanya strategi & regulasi lomba', keys: ['Ctrl', 'G'], icon: 'bi bi-stars' },
  { title: 'Kirim WhatsApp Massal', desc: 'Broadcast info ke peserta', keys: ['Ctrl', 'W'], icon: 'bi bi-whatsapp' },
  { title: 'Buka SQL Keyword Console', desc: 'Eksekusi query data cepat', keys: ['Ctrl', 'Q'], icon: 'bi bi-code-slash' },
  { title: 'Buka Petunjuk Pintasan ini', desc: 'Tampilkan modal hotkey manager', keys: ['Shift', '?'], icon: 'bi bi-keyboard' },
];
</script>
