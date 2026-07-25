<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900">Manajemen Perlombaan</h1>
        <p class="text-xs sm:text-sm text-slate-500">Kelola daftar cabang lomba, kategori, lokasi, dan alokasi poin juara.</p>
      </div>

      <div class="flex items-center space-x-2 w-full sm:w-auto">
        <button
          @click="openModal()"
          class="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <i class="bi bi-plus-lg"></i>
          <span>Tambah Lomba Baru</span>
        </button>
      </div>
    </div>

    <!-- Filters & Category Tabs -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
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

      <div class="relative w-full md:w-64">
        <i class="bi bi-search absolute left-3 top-2.5 text-slate-400"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama lomba..."
          class="w-full pl-9 pr-3 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        />
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
          <div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
            <div class="flex items-center justify-between">
              <span class="text-slate-400"><i class="bi bi-geo-alt"></i> Lokasi:</span>
              <span class="font-medium text-slate-800">{{ comp.location }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400"><i class="bi bi-calendar-event"></i> Waktu:</span>
              <span class="font-medium text-slate-800">{{ comp.date }} @ {{ comp.time }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400"><i class="bi bi-people"></i> Peserta Registered:</span>
              <span class="font-bold text-red-600">
                {{ store.getRegistrationsByCompetition(comp.id).length }} / {{ comp.maxParticipants }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400"><i class="bi bi-star"></i> Poin Juara (1/2/3):</span>
              <span class="font-semibold text-amber-700">
                {{ comp.pointFirst }} / {{ comp.pointSecond }} / {{ comp.pointThird }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-mono font-bold text-slate-400">
            PREFIX: {{ comp.prefix }}
          </span>

          <div class="flex items-center space-x-2">
            <button
              @click="openModal(comp)"
              class="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              title="Edit Lomba"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              @click="confirmDelete(comp)"
              class="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-sm transition-colors"
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
              class="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
            >
              <option value="">-- Pilih Template Preset --</option>
              <option value="Balap Karung">Balap Karung Helm (Anak-anak)</option>
              <option value="Makan Kerupuk">Makan Kerupuk (Anak-anak)</option>
              <option value="Tarik Tambang">Tarik Tambang (Dewasa)</option>
              <option value="Balon Joget">Balon Joget Pasangan (Remaja)</option>
              <option value="Estafet Air">Estafet Air Baskom (Remaja)</option>
              <option value="Memasukkan Paku">Memasukkan Paku dalam Botol (Anak-anak)</option>
              <option value="Mobile Legends">Mobile Legends e-Sport (Remaja/Dewasa)</option>
              <option value="Fashion Show">Fashion Show Busana Adat (Umum)</option>
              <option value="Karaoke">Lomba Karaoke Kemerdekaan (Dewasa)</option>
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
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedCategory = ref('Semua');
const searchQuery = ref('');

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

const filteredCompetitions = computed(() => {
  return store.competitions.filter(comp => {
    const matchCat = selectedCategory.value === 'Semua' || comp.category === selectedCategory.value;
    const matchSearch = comp.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCat && matchSearch;
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

function applyPreset(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  if (!val) return;

  switch (val) {
    case 'Balap Karung':
      form.name = 'Balap Karung Helm';
      form.category = 'Anak-anak';
      form.prefix = 'BK';
      form.description = 'Peserta menggunakan karung dan helm keselamatan melintasi lintasan 10 meter.';
      break;
    case 'Makan Kerupuk':
      form.name = 'Makan Kerupuk Raksasa';
      form.category = 'Anak-anak';
      form.prefix = 'MK';
      form.description = 'Lomba memakan kerupuk tanpa menyentuh tangan.';
      break;
    case 'Tarik Tambang':
      form.name = 'Tarik Tambang Kebangsaan';
      form.category = 'Dewasa';
      form.prefix = 'TT';
      form.description = 'Lomba kekuatan beregu 5v5 menarik tambang.';
      form.pointFirst = 150;
      break;
    case 'Balon Joget':
      form.name = 'Balon Joget Pasangan';
      form.category = 'Remaja';
      form.prefix = 'BJ';
      form.description = 'Berjoget berpasangan menjaga balon di dahi saat musik diputar.';
      break;
    case 'Mobile Legends':
      form.name = 'Mobile Legends MLBB';
      form.category = 'Remaja';
      form.prefix = 'ML';
      form.description = 'Turnamen e-sport kustom 5v5 mode draft pick.';
      form.pointFirst = 200;
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
