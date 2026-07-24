<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <div class="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
        <i class="bi bi-magic"></i>
        <span>Registration Wizard 17an</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Pendaftaran Peserta Lomba</h1>
      <p class="text-xs sm:text-sm text-slate-500">Daftarkan peserta hanya dalam 3 langkah mudah & cepat.</p>
    </div>

    <!-- Wizard Step Progress Indicator -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
      <div
        v-for="s in [1, 2, 3]"
        :key="s"
        class="flex items-center space-x-2 flex-1"
        :class="{ 'justify-center': s === 2, 'justify-end': s === 3 }"
      >
        <div
          class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all"
          :class="[
            step === s
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-4 ring-red-100'
              : step > s
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-400'
          ]"
        >
          <i v-if="step > s" class="bi bi-check-lg"></i>
          <span v-else>{{ s }}</span>
        </div>
        <span
          class="text-xs font-bold hidden sm:inline"
          :class="step >= s ? 'text-slate-800' : 'text-slate-400'"
        >
          {{ s === 1 ? 'Pilih Lomba' : s === 2 ? 'Data Peserta' : 'Konfirmasi' }}
        </span>
      </div>
    </div>

    <!-- STEP 1: Select Competition -->
    <div v-if="step === 1" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 animate-fade-in">
      <div>
        <h2 class="text-base font-bold text-slate-900">Langkah 1: Pilih Perlombaan</h2>
        <p class="text-xs text-slate-500">Pilih satu atau beberapa cabang lomba yang ingin diikuti oleh peserta.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
        <div
          v-for="comp in store.competitions"
          :key="comp.id"
          @click="toggleCompetition(comp.id)"
          class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between"
          :class="[
            selectedCompIds.includes(comp.id)
              ? 'border-red-600 bg-red-50/50 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
          ]"
        >
          <div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              {{ comp.category }}
            </span>
            <h3 class="font-bold text-slate-900 text-sm mt-1">{{ comp.name }}</h3>
            <p class="text-xs text-slate-500 mt-0.5"><i class="bi bi-geo-alt"></i> {{ comp.location }}</p>
          </div>
          <div
            class="w-5 h-5 rounded-md border flex items-center justify-center text-xs text-white"
            :class="selectedCompIds.includes(comp.id) ? 'bg-red-600 border-red-600' : 'border-slate-300 bg-white'"
          >
            <i v-if="selectedCompIds.includes(comp.id)" class="bi bi-check-lg"></i>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
        <span class="text-xs font-medium text-slate-500">
          Dipilih: <strong>{{ selectedCompIds.length }}</strong> Lomba
        </span>
        <button
          @click="goToStep2"
          :disabled="selectedCompIds.length === 0"
          class="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
        >
          Lanjut ke Data Peserta <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>

    <!-- STEP 2: Fill Participant Info -->
    <div v-if="step === 2" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 animate-fade-in">
      <div>
        <h2 class="text-base font-bold text-slate-900">Langkah 2: Isi Informasi Peserta</h2>
        <p class="text-xs text-slate-500">Isi data lengkap peserta untuk pencatatan dan generasi nomor peserta.</p>
      </div>

      <form @submit.prevent="goToStep3" class="space-y-4">
        <div>
          <div class="flex items-center mb-1">
            <label class="block text-xs font-bold text-slate-700">Nama Lengkap Peserta *</label>
            <QuickHelpTooltip
              title="Petunjuk Nama"
              content="Gunakan nama resmi tanpa singkatan berlebihan agar penulisan di sertifikat juara dan pencetakan nomor pendaftaran akurat."
              example="Budi Santoso"
              position="top"
            />
          </div>
          <input
            v-model="participantForm.name"
            required
            type="text"
            placeholder="e.g. Arif Alexander"
            class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="flex items-center mb-1">
              <label class="block text-xs font-bold text-slate-700">Umur (Tahun) *</label>
              <QuickHelpTooltip
                title="Petunjuk Umur"
                content="Digunakan untuk memvalidasi kesesuaian kategori (Anak <12th, Remaja 12-17th, Dewasa 18+th)."
                example="14"
                position="top"
              />
            </div>
            <input
              v-model.number="participantForm.age"
              required
              type="number"
              min="3"
              max="100"
              class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div>
            <div class="flex items-center mb-1">
              <label class="block text-xs font-bold text-slate-700">Jenis Kelamin *</label>
              <QuickHelpTooltip
                title="Petunjuk Gender"
                content="Memudahkan panitia dalam memilah grup bagan / bagan pertandingan Putra dan Putri."
                position="top"
              />
            </div>
            <div class="grid grid-cols-2 gap-2 mt-0.5">
              <label
                class="flex items-center justify-center p-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors"
                :class="participantForm.gender === 'L' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'"
              >
                <input type="radio" v-model="participantForm.gender" value="L" class="hidden" />
                <span>👨 Laki-laki</span>
              </label>

              <label
                class="flex items-center justify-center p-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors"
                :class="participantForm.gender === 'P' ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' : 'border-slate-200 text-slate-600'"
              >
                <input type="radio" v-model="participantForm.gender" value="P" class="hidden" />
                <span>👩 Perempuan</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center mb-1">
            <label class="block text-xs font-bold text-slate-700">Nomor WhatsApp *</label>
            <QuickHelpTooltip
              title="Format WhatsApp"
              content="Masukkan nomor seluler aktif diawali '08' untuk pengiriman otomatis konfirmasi pendaftaran via WhatsApp."
              example="081234567890"
              position="top"
            />
          </div>
          <input
            v-model="participantForm.whatsapp"
            required
            type="tel"
            placeholder="e.g. 081234567890"
            class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="flex items-center mb-1">
              <label class="block text-xs font-bold text-slate-700">Email (Opsional)</label>
              <QuickHelpTooltip
                title="Petunjuk Email"
                content="Digunakan untuk pengiriman salinan e-sertifikat jika dibutuhkan."
                example="budi@gmail.com"
                position="top"
              />
            </div>
            <input
              v-model="participantForm.email"
              type="email"
              placeholder="e.g. arif@gmail.com"
              class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div>
            <div class="flex items-center mb-1">
              <label class="block text-xs font-bold text-slate-700">Alamat / RT RW (Opsional)</label>
              <QuickHelpTooltip
                title="Format Alamat"
                content="Sebutkan nomor RT/RW atau nama blok perumahan untuk statistik peserta per wilayah."
                example="RT 05 / RW 02 Depok"
                position="top"
              />
            </div>
            <input
              v-model="participantForm.address"
              type="text"
              placeholder="e.g. RT 05 / RW 02"
              class="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
          <input
            v-model="participantForm.notes"
            type="text"
            placeholder="e.g. Perwakilan Karang Taruna"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button
            type="button"
            @click="step = 1"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            <i class="bi bi-arrow-left"></i> Kembali
          </button>
          <button
            type="submit"
            class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Lanjut ke Konfirmasi <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- STEP 3: Confirmation & Registration Result -->
    <div v-if="step === 3" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-fade-in">
      <div v-if="!createdResult" class="space-y-4">
        <div>
          <h2 class="text-base font-bold text-slate-900">Langkah 3: Konfirmasi Pendaftaran</h2>
          <p class="text-xs text-slate-500">Periksa kembali ringkasan data sebelum disimpan ke sistem.</p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Nama Peserta:</span>
            <span class="font-bold text-slate-900">{{ participantForm.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Umur / Gender:</span>
            <span class="font-medium text-slate-800">{{ participantForm.age }} Thn ({{ participantForm.gender }})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">No. WhatsApp:</span>
            <span class="font-medium text-slate-800">{{ participantForm.whatsapp }}</span>
          </div>
          <div class="border-t border-slate-200 pt-2">
            <span class="text-slate-400 block mb-1">Lomba yang Diikuti:</span>
            <ul class="list-disc list-inside font-bold text-slate-800 space-y-1">
              <li v-for="cId in selectedCompIds" :key="cId">
                {{ store.getCompetitionById(cId)?.name }} ({{ store.getCompetitionById(cId)?.category }})
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-4 flex justify-between">
          <button
            @click="step = 2"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            <i class="bi bi-arrow-left"></i> Edit Data
          </button>

          <button
            @click="submitRegistration"
            class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md"
          >
            <i class="bi bi-check-circle-fill"></i> Simpan Pendaftaran!
          </button>
        </div>
      </div>

      <!-- Result Card After Submission -->
      <div v-else class="text-center py-6 space-y-6">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xs">
          <i class="bi bi-check-lg"></i>
        </div>

        <div>
          <h2 class="text-xl font-extrabold text-slate-900">Pendaftaran Berhasil!</h2>
          <p class="text-xs text-slate-500 mt-1">Nomor peserta telah otomatis digenerate.</p>
        </div>

        <!-- Generated Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          <div
            v-for="reg in createdResult.registrations"
            :key="reg.id"
            class="bg-gradient-to-tr from-red-600 to-rose-600 text-white p-4 rounded-2xl shadow-md text-left"
          >
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                KARTU PESERTA
              </span>
              <span class="text-xs font-mono font-bold">{{ reg.participantNumber }}</span>
            </div>
            <h3 class="font-extrabold text-base mt-2">{{ createdResult.participant.name }}</h3>
            <p class="text-xs text-red-100 mt-1">
              {{ store.getCompetitionById(reg.competitionId)?.name }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
          <a
            v-for="reg in createdResult.registrations"
            :key="reg.id"
            :href="getWaMessageUrl(reg)"
            target="_blank"
            class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <i class="bi bi-whatsapp"></i>
            <span>Kirim WA Confirmation ({{ reg.participantNumber }})</span>
          </a>

          <button
            @click="resetWizard"
            class="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Daftar Peserta Lain
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { generateRegistrationConfirmationMessage } from '../services/whatsapp';
import QuickHelpTooltip from '../components/QuickHelpTooltip.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const step = ref(1);

const selectedCompIds = ref<string[]>([]);
const participantForm = reactive({
  name: '',
  age: 12,
  gender: 'L' as 'L' | 'P',
  whatsapp: '',
  email: '',
  address: '',
  notes: ''
});

const createdResult = ref<{ participant: any; registrations: any[] } | null>(null);

function toggleCompetition(id: string) {
  if (selectedCompIds.value.includes(id)) {
    selectedCompIds.value = selectedCompIds.value.filter(i => i !== id);
  } else {
    selectedCompIds.value.push(id);
  }
}

function goToStep2() {
  if (selectedCompIds.value.length === 0) return;
  step.value = 2;
}

function goToStep3() {
  step.value = 3;
}

function submitRegistration() {
  const result = store.registerParticipant(participantForm, selectedCompIds.value);
  createdResult.value = result;
  Swal.fire({
    icon: 'success',
    title: 'Pendaftaran Berhasil!',
    text: `Terdaftar pada ${result.registrations.length} perlombaan.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function getWaMessageUrl(reg: any) {
  const comp = store.getCompetitionById(reg.competitionId);
  return generateRegistrationConfirmationMessage({
    phone: participantForm.whatsapp,
    participantName: participantForm.name,
    participantNumber: reg.participantNumber,
    competitionName: comp?.name || 'Lomba Kemerdekaan',
    location: comp?.location,
    time: comp?.time
  });
}

function resetWizard() {
  step.value = 1;
  selectedCompIds.value = [];
  participantForm.name = '';
  participantForm.age = 12;
  participantForm.whatsapp = '';
  participantForm.email = '';
  participantForm.address = '';
  participantForm.notes = '';
  createdResult.value = null;
}
</script>
