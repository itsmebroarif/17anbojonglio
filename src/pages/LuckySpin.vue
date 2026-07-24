<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-arrow-clockwise text-amber-500"></i>
          <span>Lucky Spin Doorprize Wheel</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">
          Undian doorprize acak transparan dengan aturan eksklusi pemenang ganda.
        </p>
      </div>

      <button
        @click="openAddModal"
        class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Tambah Hadiah Doorprize</span>
      </button>
    </div>

    <!-- Spinner Arena Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Interactive Lucky Wheel Canvas / Wheel Display -->
      <div class="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
        <div class="w-full flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <div class="flex items-center space-x-2">
            <i class="bi bi-gift-fill text-amber-400 text-xl"></i>
            <span class="font-extrabold text-sm uppercase text-slate-200">
              Pilih Doorprize:
            </span>
          </div>

          <select
            v-model="selectedDoorprizeId"
            class="bg-slate-900 border border-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs focus:outline-none"
          >
            <option v-for="d in store.doorprizes" :key="d.id" :value="d.id">
              {{ d.name }} (Filter: {{ d.categoryFilter }}) {{ d.winnerParticipantId ? '✅ Ada Pemenang' : '' }}
            </option>
          </select>
        </div>

        <!-- Wheel / Slot Box Display -->
        <div class="my-8 space-y-4 w-full max-w-md">
          <div class="p-8 bg-gradient-to-tr from-slate-900 to-slate-800 border-4 border-amber-400 rounded-3xl shadow-2xl relative overflow-hidden">
            <div class="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block mb-2">
              {{ isSpinning ? 'LUCKY WHEEL ROTATING...' : winnerParticipant ? 'PEMENANG DOORPRIZE 🎉' : 'READY TO SPIN' }}
            </div>

            <div class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white min-h-[60px] flex items-center justify-center font-mono">
              {{ currentDisplayCandidate }}
            </div>

            <p v-if="winnerParticipant && !isSpinning" class="text-xs text-amber-300 font-bold mt-2">
              Nomor WA: {{ winnerParticipant.whatsapp }} • {{ winnerParticipant.address || 'Warga RT/RW' }}
            </p>
          </div>

          <!-- Spin Button -->
          <button
            @click="startSpin"
            :disabled="isSpinning || candidatePool.length === 0"
            class="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black text-lg rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <i class="bi bi-arrow-clockwise text-xl" :class="{ 'animate-spin': isSpinning }"></i>
            <span>{{ isSpinning ? 'MEMUTAR UNDIAN...' : 'PUTAR WHEEL DOORPRIZE' }}</span>
          </button>
        </div>

        <!-- Candidate Pool Counter Info -->
        <div class="text-xs text-slate-400 border-t border-slate-800/80 pt-4 w-full flex justify-between items-center">
          <span>Kandidat Undian: <strong class="text-white">{{ candidatePool.length }} Peserta</strong></span>
          <span>Aturan: Pemenang sebelumnya otomatis dieksklusi</span>
        </div>
      </div>

      <!-- Right Col: List of Doorprizes & Winners -->
      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 class="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <i class="bi bi-trophy-fill text-amber-500"></i>
          <span>Daftar Hadiah Doorprize</span>
        </h2>

        <div class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          <div
            v-for="dp in store.doorprizes"
            :key="dp.id"
            class="p-4 rounded-2xl border transition-all"
            :class="[
              dp.id === selectedDoorprizeId
                ? 'border-amber-400 bg-amber-50/50 shadow-xs'
                : 'border-slate-200 bg-slate-50/50'
            ]"
          >
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {{ dp.categoryFilter }}
                </span>
                <h3 class="font-bold text-slate-900 text-sm mt-1">{{ dp.name }}</h3>
                <p v-if="dp.sponsor" class="text-xs text-slate-500">Sponsor: {{ dp.sponsor }}</p>
              </div>

              <span
                v-if="dp.winnerParticipantId"
                class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300"
              >
                Sudah Ada Pemenang
              </span>
            </div>

            <!-- Winner Detail Box -->
            <div v-if="dp.winnerParticipantId" class="mt-3 pt-2 border-t border-slate-200 text-xs flex items-center justify-between">
              <span class="font-extrabold text-slate-800">
                🏆 {{ store.getParticipantById(dp.winnerParticipantId)?.name }}
              </span>
              <button
                @click="resetWinner(dp.id)"
                class="text-[10px] text-rose-600 hover:underline font-bold"
              >
                Reset Pemenang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

const store = useArenaStore();
const selectedDoorprizeId = ref('');
const isSpinning = ref(false);
const currentDisplayCandidate = ref('Putar Undian');
const winnerParticipant = ref<any>(null);

onMounted(() => {
  if (store.doorprizes.length > 0) {
    selectedDoorprizeId.value = store.doorprizes[0].id;
  }
});

const selectedDoorprize = computed(() => {
  return store.doorprizes.find(d => d.id === selectedDoorprizeId.value);
});

// Filter candidates who haven't won any doorprize yet
const candidatePool = computed(() => {
  const wonParticipantIds = new Set(
    store.doorprizes.filter(d => d.winnerParticipantId).map(d => d.winnerParticipantId!)
  );

  const category = selectedDoorprize.value?.categoryFilter || 'Semua';

  return store.participants.filter(p => {
    if (wonParticipantIds.has(p.id)) return false; // exclude previous winners!
    if (category === 'Semua') return true;

    // Check if participant registered in competition of this category or age matches
    if (category === 'Anak-anak') return p.age <= 12;
    if (category === 'Remaja') return p.age >= 13 && p.age <= 18;
    if (category === 'Dewasa') return p.age >= 19;
    return true;
  });
});

function startSpin() {
  if (candidatePool.value.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Kandidat Kosong', text: 'Tidak ada peserta yang memenuhi kriteria undian ini.' });
    return;
  }

  isSpinning.value = true;
  winnerParticipant.value = null;

  let counter = 0;
  const maxIterations = 35;
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * candidatePool.value.length);
    currentDisplayCandidate.value = candidatePool.value[randomIndex].name;
    counter++;

    if (counter >= maxIterations) {
      clearInterval(interval);
      // Final winner selection
      const winner = candidatePool.value[Math.floor(Math.random() * candidatePool.value.length)];
      currentDisplayCandidate.value = winner.name;
      winnerParticipant.value = winner;
      isSpinning.value = false;

      if (selectedDoorprizeId.value) {
        store.setDoorprizeWinner(selectedDoorprizeId.value, winner.id);
      }

      // Fire confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      Swal.fire({
        icon: 'success',
        title: `Selamat! 🎉`,
        html: `<strong>${winner.name}</strong> memenangkan <strong>${selectedDoorprize.value?.name}</strong>!`,
        confirmButtonColor: '#d97706'
      });
    }
  }, 100);
}

function openAddModal() {
  Swal.fire({
    title: 'Tambah Doorprize Baru',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Nama Hadiah (e.g. Sepeda Polygon)">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Sponsor (e.g. Toko Jaya)">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
      const sponsor = (document.getElementById('swal-input2') as HTMLInputElement).value;
      if (!name) Swal.showValidationMessage('Nama hadiah wajib diisi');
      return { name, sponsor };
    }
  }).then(result => {
    if (result.isConfirmed) {
      store.addDoorprize({
        name: result.value.name,
        sponsor: result.value.sponsor,
        categoryFilter: 'Semua'
      });
      Swal.fire({ icon: 'success', title: 'Doorprize Ditambahkan!', timer: 1200, showConfirmButton: false });
    }
  });
}

function resetWinner(doorprizeId: string) {
  store.resetDoorprizeWinner(doorprizeId);
}
</script>
