<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Perlombaan</h1>
        <p class="text-xs sm:text-sm text-slate-500">Kelola daftar cabang lomba, kategori, lokasi, dan alokasi poin juara.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          @click="loadTemplateComps"
          class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          title="Setel otomatis daftar lomba dengan 8 cabang template 17an"
        >
          <i class="bi bi-trophy-fill"></i>
          <span>Muat Template Lomba 17an</span>
        </button>

        <button
          @click="openBulkWaModal('ALL')"
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-whatsapp"></i>
          <span>Broadcast WA Peserta</span>
        </button>

        <button
          @click="openModal()"
          class="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <i class="bi bi-plus-lg"></i>
          <span>Tambah Lomba Baru</span>
        </button>
      </div>
    </div>

    <!-- Filters & Category Tabs & Keyword Query Engine -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto no-scrollbar text-xs">
          <button
            v-for="cat in ['Semua', 'Anak-anak', 'Remaja', 'Dewasa', 'Umum']"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-3 py-2 rounded-xl font-medium transition-colors whitespace-nowrap"
            :class="[
              selectedCategory === cat
                ? 'bg-red-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <div class="relative w-full md:w-96">
          <i class="bi bi-search absolute left-3 top-2.5 text-slate-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari atau ketik keyword query (e.g. status:ongoing, kat:anak, poin>50)..."
            class="w-full pl-9 pr-8 py-2 bg-slate-50 text-slate-800 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-medium"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 text-xs"
            title="Bersihkan Pencarian"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>

      <!-- Keyword Query Autofill Helper Chips -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span class="text-slate-400 font-extrabold flex items-center gap-1">
            <i class="bi bi-key-fill text-amber-500"></i> Keyword Query:
          </span>
          <button
            v-for="chip in keywordChips"
            :key="chip"
            @click="addKeywordToSearch(chip)"
            class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
          >
            + {{ chip }}
          </button>
        </div>

        <div class="text-slate-500 font-bold whitespace-nowrap ml-auto">
          Menampilkan <span class="text-red-600 font-extrabold">{{ filteredCompetitions.length }}</span> dari {{ store.competitions.length }} Lomba
        </div>
      </div>
    </div>

    <!-- Competition Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="comp in filteredCompetitions"
        :key="comp.id"
        class="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <!-- Header Card -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div>
              <span
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                :class="categoryBadgeClass(comp.category)"
              >
                {{ comp.category }}
              </span>
              <h2 class="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                {{ comp.name }}
              </h2>
            </div>
            <span
              class="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase"
              :class="[
                comp.status === 'Ongoing' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                comp.status === 'Finished' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                'bg-slate-100 text-slate-700 border border-slate-200'
              ]"
            >
              {{ comp.status }}
            </span>
          </div>

          <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {{ comp.description || 'Tidak ada deskripsi.' }}
          </p>

          <!-- Competition Details List -->
          <div class="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
            <div class="flex items-center justify-between">
              <span class="text-slate-400"><i class="bi bi-geo-alt-fill text-red-500"></i> Lokasi:</span>
              <span class="font-bold text-slate-800">{{ comp.location }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400"><i class="bi bi-clock-fill text-amber-500"></i> Waktu:</span>
              <span class="font-bold text-slate-800">{{ comp.date }} @ {{ comp.time }}</span>
            </div>
            
            <!-- Participant Progress Bar -->
            <div class="pt-1">
              <div class="flex items-center justify-between text-[11px] mb-1">
                <span class="text-slate-500 font-bold"><i class="bi bi-people-fill text-indigo-500"></i> Kuota Peserta:</span>
                <span class="font-extrabold text-red-600">
                  {{ store.getRegistrationsByCompetition(comp.id).length }} / {{ comp.maxParticipants }}
                </span>
              </div>
              <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-red-600 rounded-full transition-all"
                  :style="{ width: `${Math.min(100, (store.getRegistrationsByCompetition(comp.id).length / comp.maxParticipants) * 100)}%` }"
                ></div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span class="text-slate-400"><i class="bi bi-award-fill text-amber-500"></i> Alokasi Poin:</span>
              <span class="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                🥇{{ comp.pointFirst }} • 🥈{{ comp.pointSecond }} • 🥉{{ comp.pointThird }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-mono font-bold text-slate-400">
            PREFIX: [{{ comp.prefix }}]
          </span>

          <div class="flex items-center space-x-1.5">
            <router-link
              :to="{ path: '/competition-board', query: { compId: comp.id } }"
              class="p-1.5 text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1"
              title="Lihat Papan Skor Live"
            >
              <i class="bi bi-display-fill text-red-600"></i> Board
            </router-link>
            <button
              @click="openBulkWaModal(comp.id)"
              class="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1"
              title="Broadcast WA Peserta Lomba Ini"
            >
              <i class="bi bi-whatsapp"></i> WA
            </button>
            <button
              @click="openModal(comp)"
              class="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              title="Edit Lomba"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              @click="confirmDelete(comp)"
              class="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-sm transition-colors"
              title="Hapus Lomba"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Arena Interactive Floor Plan -->
    <ArenaFloorPlan />

    <!-- Bulk WhatsApp Modal -->
    <BulkWhatsAppModal
      :isOpen="isBulkWaOpen"
      :initialCompId="selectedCompForWa"
      @close="isBulkWaOpen = false"
    />

    <!-- Modal Form CRUD Lomba -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      @click.self="showModal = false"
    >
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 class="font-bold text-base flex items-center gap-2">
            <i class="bi bi-trophy text-red-500"></i>
            <span>{{ editingCompId ? 'Edit Perlombaan' : 'Tambah Perlombaan Baru' }}</span>
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-white">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveForm" class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <!-- Preset Selector -->
          <div v-if="!editingCompId" class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
            <label class="font-bold block mb-1">Gunakan Preset Lomba Khas 17an:</label>
            <select
              @change="applyPreset($event)"
              class="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="">-- Pilih Template Preset Lomba --</option>
              <optgroup label="a. Lomba Anak-anak">
                <option value="Lomba Pindahin Bendera">🚩 Lomba Pindahin Bendera</option>
                <option value="Lomba Makan Kerupuk">🍘 Lomba Makan Kerupuk</option>
                <option value="Lomba Voli Balon">🎈 Lomba Voli Balon</option>
                <option value="Lomba Balap Karung Pakai Helm">🪖 Lomba Balap Karung Pakai Helm</option>
                <option value="Lomba Kelereng">🔴 Lomba Kelereng</option>
              </optgroup>
              <optgroup label="b. Lomba Dewasa">
                <option value="Joget Bangku">🪑 Joget Bangku</option>
                <option value="Estafet Terigu">🥣 Estafet Terigu</option>
                <option value="Tarik Tambang">🪢 Tarik Tambang</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Perlombaan *</label>
            <input
              v-model="form.name"
              required
              type="text"
              placeholder="e.g. Balap Karung Helm"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Kategori *</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
              >
                <option value="Anak-anak">Anak-anak</option>
                <option value="Remaja">Remaja</option>
                <option value="Dewasa">Dewasa</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Prefix Nomor Reg. *</label>
              <input
                v-model="form.prefix"
                required
                type="text"
                placeholder="e.g. BK"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Aturan Singkat</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Jelaskan peraturan singkat perlombaan ini..."
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Lokasi Lomba</label>
              <input
                v-model="form.location"
                type="text"
                placeholder="e.g. Lapangan Utama"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Maks. Peserta</label>
              <input
                v-model.number="form.maxParticipants"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                v-model="form.date"
                type="date"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Jam Pelaksanaan</label>
              <input
                v-model="form.time"
                type="time"
                class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>

          <!-- Points Alocation -->
          <div class="border-t border-slate-200 pt-3">
            <label class="block text-xs font-bold text-slate-700 mb-2">Alokasi Poin Pemenang (Resulting Point)</label>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <span class="text-[10px] text-slate-500 font-bold block">🥇 Juara 1</span>
                <input
                  v-model.number="form.pointFirst"
                  type="number"
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-amber-700"
                />
              </div>

              <div>
                <span class="text-[10px] text-slate-500 font-bold block">🥈 Juara 2</span>
                <input
                  v-model.number="form.pointSecond"
                  type="number"
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
                />
              </div>

              <div>
                <span class="text-[10px] text-slate-500 font-bold block">🥉 Juara 3</span>
                <input
                  v-model.number="form.pointThird"
                  type="number"
                  class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-amber-900"
                />
              </div>
            </div>
          </div>

          <div class="pt-3 flex justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl text-xs hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Simpan Lomba
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { Competition, Category } from '../types';
import ArenaFloorPlan from '../components/ArenaFloorPlan.vue';
import BulkWhatsAppModal from '../components/BulkWhatsAppModal.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCategory = ref('Semua');
const searchQuery = ref('');

const isBulkWaOpen = ref(false);
const selectedCompForWa = ref('ALL');

function openBulkWaModal(compId: string = 'ALL') {
  selectedCompForWa.value = compId;
  isBulkWaOpen.value = true;
}

const showModal = ref(false);
const editingCompId = ref<string | null>(null);

const form = reactive({
  name: '',
  category: 'Anak-anak' as Category,
  description: '',
  location: 'Lapangan Utama',
  date: new Date().toISOString().substring(0, 10),
  time: '09:00',
  maxParticipants: 30,
  pointFirst: 100,
  pointSecond: 60,
  pointThird: 30,
  status: 'Upcoming' as const,
  prefix: 'LB'
});

const keywordChips = [
  'status:Ongoing',
  'status:Upcoming',
  'status:Finished',
  'kat:Anak-anak',
  'kat:Dewasa',
  'poin>50',
  'kuota:sisa'
];

function addKeywordToSearch(chip: string) {
  if (!searchQuery.value) {
    searchQuery.value = chip;
  } else if (!searchQuery.value.includes(chip)) {
    searchQuery.value = `${searchQuery.value.trim()} ${chip}`;
  }
}

const filteredCompetitions = computed(() => {
  const queryRaw = searchQuery.value.trim().toLowerCase();

  return store.competitions.filter(comp => {
    // Category Tab check
    const matchCatTab = selectedCategory.value === 'Semua' || comp.category === selectedCategory.value;
    if (!matchCatTab) return false;

    if (!queryRaw) return true;

    // Parse tokens (space separated)
    const tokens = queryRaw.split(/\s+/);

    return tokens.every(token => {
      if (token.startsWith('status:')) {
        const val = token.replace('status:', '');
        return comp.status.toLowerCase().includes(val);
      }
      if (token.startsWith('kat:') || token.startsWith('kategori:')) {
        const val = token.replace(/^(kat:|kategori:)/, '');
        return comp.category.toLowerCase().includes(val);
      }
      if (token.startsWith('lokasi:')) {
        const val = token.replace('lokasi:', '');
        return comp.location.toLowerCase().includes(val);
      }
      if (token.startsWith('prefix:')) {
        const val = token.replace('prefix:', '');
        return comp.prefix.toLowerCase().includes(val);
      }
      if (token.startsWith('poin>')) {
        const num = parseFloat(token.replace('poin>', ''));
        return !isNaN(num) && comp.pointFirst > num;
      }
      if (token.startsWith('poin>=')) {
        const num = parseFloat(token.replace('poin>=', ''));
        return !isNaN(num) && comp.pointFirst >= num;
      }
      if (token === 'kuota:penuh') {
        const registered = store.getRegistrationsByCompetition(comp.id).length;
        return registered >= comp.maxParticipants;
      }
      if (token === 'kuota:sisa') {
        const registered = store.getRegistrationsByCompetition(comp.id).length;
        return registered < comp.maxParticipants;
      }

      // Default string match
      return (
        comp.name.toLowerCase().includes(token) ||
        comp.description.toLowerCase().includes(token) ||
        comp.location.toLowerCase().includes(token) ||
        comp.prefix.toLowerCase().includes(token) ||
        comp.category.toLowerCase().includes(token)
      );
    });
  });
});

function categoryBadgeClass(category: Category) {
  switch (category) {
    case 'Anak-anak': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Remaja': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Dewasa': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

function openModal(comp?: Competition) {
  if (comp) {
    editingCompId.value = comp.id;
    form.name = comp.name;
    form.category = comp.category;
    form.description = comp.description;
    form.location = comp.location;
    form.date = comp.date;
    form.time = comp.time;
    form.maxParticipants = comp.maxParticipants;
    form.pointFirst = comp.pointFirst;
    form.pointSecond = comp.pointSecond;
    form.pointThird = comp.pointThird;
    form.status = comp.status;
    form.prefix = comp.prefix;
  } else {
    editingCompId.value = null;
    form.name = '';
    form.category = 'Anak-anak';
    form.description = '';
    form.location = 'Lapangan Utama';
    form.date = new Date().toISOString().substring(0, 10);
    form.time = '09:00';
    form.maxParticipants = 30;
    form.pointFirst = 100;
    form.pointSecond = 60;
    form.pointThird = 30;
    form.status = 'Upcoming';
    form.prefix = 'LB';
  }
  showModal.value = true;
}

function loadTemplateComps() {
  Swal.fire({
    title: 'Muat Template Lomba 17an?',
    text: 'Ini akan mengatur ulang/memuat 8 cabang lomba template resmi 17-an (5 Anak-anak, 3 Dewasa).',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: 'Ya, Muat Template Lomba',
    cancelButtonText: 'Batal'
  }).then(res => {
    if (res.isConfirmed) {
      store.applyCompetitionTemplate('replace');
      Swal.fire('Berhasil!', 'Daftar lomba diset dengan 8 cabang lomba 17-an.', 'success');
    }
  });
}

function applyPreset(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  if (!val) return;

  switch (val) {
    case 'Lomba Pindahin Bendera':
      form.name = 'Lomba Pindahin Bendera';
      form.category = 'Anak-anak';
      form.prefix = 'BNDR';
      form.description = 'Lomba adu kecepatan memindahkan bendera Merah Putih kecil ke dalam botol.';
      form.location = 'Lapangan Utama (Zone A)';
      break;
    case 'Lomba Makan Kerupuk':
      form.name = 'Lomba Makan Kerupuk';
      form.category = 'Anak-anak';
      form.prefix = 'KRPK';
      form.description = 'Lomba makan kerupuk putih yang digantung tali tanpa menyentuh dengan tangan.';
      form.location = 'Area Panggung Utama (Zone B)';
      break;
    case 'Lomba Voli Balon':
      form.name = 'Lomba Voli Balon';
      form.category = 'Anak-anak';
      form.prefix = 'VBLN';
      form.description = 'Permainan voli menggunakan balon air/udara antar tim anak-anak.';
      form.location = 'Lapangan Utama (Zone A)';
      break;
    case 'Lomba Balap Karung Pakai Helm':
      form.name = 'Lomba Balap Karung Pakai Helm';
      form.category = 'Anak-anak';
      form.prefix = 'BKR3';
      form.description = 'Balap karung unik anak-anak mengenakan helm keselamatan.';
      form.location = 'Lapangan Utama (Zone A)';
      break;
    case 'Lomba Kelereng':
      form.name = 'Lomba Kelereng';
      form.category = 'Anak-anak';
      form.prefix = 'KLRG';
      form.description = 'Lomba ketangkasan membawa kelereng di atas sendok yang digigit sambil berjalan.';
      form.location = 'Area Registrasi (Zone C)';
      break;
    case 'Joget Bangku':
      form.name = 'Joget Bangku';
      form.category = 'Dewasa';
      form.prefix = 'JBNK';
      form.description = 'Lomba berjoget mengelilingi kursi saat musik berputar dan berebut duduk saat musik berhenti.';
      form.location = 'Panggung Utama (Zone B)';
      break;
    case 'Estafet Terigu':
      form.name = 'Estafet Terigu';
      form.category = 'Dewasa';
      form.prefix = 'ESTG';
      form.description = 'Lomba estafet memindahkan tepung terigu ke belakang lewat atas kepala secara berregu.';
      form.location = 'Lapangan Utama (Zone A)';
      break;
    case 'Tarik Tambang':
      form.name = 'Tarik Tambang';
      form.category = 'Dewasa';
      form.prefix = 'TTMB';
      form.description = 'Adu kekuatan fisik dan semangat gotong royong antar tim warga dalam menarik tali tambang.';
      form.location = 'Lapangan Utama (Zone A)';
      break;
  }
}

function saveForm() {
  if (editingCompId.value) {
    store.updateCompetition(editingCompId.value, { ...form });
    Swal.fire({ icon: 'success', title: 'Perlombaan Diperbarui', timer: 1500, showConfirmButton: false });
  } else {
    store.addCompetition({ ...form });
    Swal.fire({ icon: 'success', title: 'Perlombaan Berhasil Dibuat', timer: 1500, showConfirmButton: false });
  }
  showModal.value = false;
}

function confirmDelete(comp: Competition) {
  Swal.fire({
    title: `Hapus ${comp.name}?`,
    text: 'Data registrasi & nilai terkait lomba ini juga akan terhapus!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Ya, Hapus'
  }).then(result => {
    if (result.isConfirmed) {
      store.deleteCompetition(comp.id);
      Swal.fire('Terhapus!', 'Perlombaan telah dihapus.', 'success');
    }
  });
}
</script>
