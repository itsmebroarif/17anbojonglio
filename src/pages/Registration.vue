<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-red-200/50 relative overflow-hidden">
      <div class="absolute -right-6 -bottom-10 opacity-10 text-white pointer-events-none text-9xl font-black font-heading select-none">
        17
      </div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <i class="bi bi-ui-checks-grid"></i>
            <span>Wizard Pendaftaran Terpadu</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Form Pendaftaran Peserta Lomba</h1>
          <p class="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
            Sistem pendataan terpusat untuk pendaftaran peserta dalam 3 langkah terstruktur.
          </p>
        </div>

        <!-- Quick Metrics -->
        <div class="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/10 backdrop-blur-md self-start md:self-auto">
          <div class="text-center px-3 border-r border-white/20">
            <span class="block text-[10px] font-bold uppercase text-red-200">Lomba Aktif</span>
            <span class="text-xl font-black">{{ store.competitions.length }}</span>
          </div>
          <div class="text-center px-3">
            <span class="block text-[10px] font-bold uppercase text-red-200">Peserta Terdaftar</span>
            <span class="text-xl font-black">{{ store.participants.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Wizard Step Progress Bar -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
      <div class="grid grid-cols-3 gap-2 sm:gap-4 relative">
        <div
          v-for="s in [1, 2, 3]"
          :key="s"
          class="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left transition-all p-2 rounded-xl"
          :class="[
            step === s ? 'bg-red-50 border border-red-200' : ''
          ]"
        >
          <div
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center transition-all flex-shrink-0"
            :class="[
              step === s
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-4 ring-red-100'
                : step > s
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400'
            ]"
          >
            <i v-if="step > s" class="bi bi-check-lg text-lg"></i>
            <span v-else>{{ s }}</span>
          </div>

          <div class="mt-1 sm:mt-0">
            <span
              class="text-[11px] sm:text-xs font-extrabold block leading-tight"
              :class="step >= s ? 'text-slate-900' : 'text-slate-400'"
            >
              {{ s === 1 ? '1. Pilih Lomba' : s === 2 ? '2. Data Lengkap' : '3. Konfirmasi' }}
            </span>
            <span class="text-[10px] text-slate-400 hidden md:block">
              {{ s === 1 ? 'Pilih cabang lomba' : s === 2 ? 'Formulir peserta' : 'Ringkasan & nomor' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 1: Select Competition -->
    <div v-if="step === 1" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i class="bi bi-trophy-fill text-amber-500"></i>
            <span>Langkah 1: Pilih Cabang Perlombaan</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">Pilih satu atau lebih cabang lomba yang ingin diikuti oleh peserta.</p>
        </div>

        <!-- Search / Category Filter -->
        <div class="relative w-full sm:w-64">
          <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
          <input
            v-model="compSearch"
            type="text"
            placeholder="Cari nama lomba..."
            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>
      </div>

      <!-- Competition Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
        <div
          v-for="comp in filteredCompetitions"
          :key="comp.id"
          @click="toggleCompetition(comp.id)"
          class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 relative overflow-hidden group"
          :class="[
            selectedCompIds.includes(comp.id)
              ? 'border-red-600 bg-red-50/40 shadow-sm'
              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
          ]"
        >
          <div class="space-y-1.5 flex-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {{ comp.category }}
              </span>
              <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                Prefix: {{ comp.prefix }}
              </span>
            </div>

            <h3 class="font-extrabold text-slate-900 text-sm group-hover:text-red-700 transition-colors">
              {{ comp.name }}
            </h3>

            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
              <span class="flex items-center gap-1">
                <i class="bi bi-geo-alt-fill text-slate-400"></i> {{ comp.location || 'Lapangan Utama' }}
              </span>
              <span class="flex items-center gap-1">
                <i class="bi bi-clock-fill text-slate-400"></i> {{ comp.time || 'Sesuai Jadwal' }}
              </span>
            </div>
          </div>

          <!-- Selection Checkbox -->
          <div
            class="w-6 h-6 rounded-lg border-2 flex items-center justify-center text-sm text-white transition-all flex-shrink-0 mt-1"
            :class="selectedCompIds.includes(comp.id) ? 'bg-red-600 border-red-600 shadow-xs' : 'border-slate-300 bg-white'"
          >
            <i v-if="selectedCompIds.includes(comp.id)" class="bi bi-check-lg font-black"></i>
          </div>
        </div>

        <div v-if="filteredCompetitions.length === 0" class="col-span-full p-8 text-center text-slate-400 text-xs">
          Tidak ada cabang lomba yang sesuai dengan kata kunci pencarian.
        </div>
      </div>

      <!-- Footer Action -->
      <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-xs text-slate-600">
          Total Dipilih: <strong class="text-red-600 text-sm font-black">{{ selectedCompIds.length }}</strong> Lomba
        </div>

        <button
          @click="goToStep2"
          :disabled="selectedCompIds.length === 0"
          class="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Form Peserta</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>

    <!-- STEP 2: Fill Detailed Participant Info -->
    <div v-if="step === 2" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-fade-in">
      <div class="border-b border-slate-100 pb-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-person-lines-fill text-red-600"></i>
          <span>Langkah 2: Pengisian Data Lengkap Peserta</span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">Lengkapi identitas peserta. Kolom kontak dan alamat bersifat opsional.</p>
      </div>

      <form @submit.prevent="goToStep3" class="space-y-6">
        <!-- Section A: Identitas Utama (Mandatory) -->
        <div class="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span class="w-6 h-6 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <h3 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Identitas Utama (Wajib)</h3>
          </div>

          <div class="space-y-4">
            <!-- Nama Peserta -->
            <div>
              <div class="flex items-center mb-1">
                <label class="block text-xs font-bold text-slate-700">Nama Lengkap Peserta <span class="text-red-600">*</span></label>
                <QuickHelpTooltip
                  title="Petunjuk Nama"
                  content="Gunakan nama resmi peserta untuk pencetakan e-sertifikat juara dan bagan kompetisi."
                  example="Ahmad Subagyo"
                  position="top"
                />
              </div>
              <input
                v-model="participantForm.name"
                required
                type="text"
                placeholder="e.g. Budi Santoso"
                class="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500/50 focus:outline-none"
              />
            </div>

            <!-- Umur & Gender Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div class="flex items-center mb-1">
                  <label class="block text-xs font-bold text-slate-700">Umur (Tahun) <span class="text-red-600">*</span></label>
                  <QuickHelpTooltip
                    title="Petunjuk Umur"
                    content="Digunakan untuk memvalidasi kategori lomba (Anak <12, Remaja 12-17, Dewasa 18+)."
                    example="15"
                    position="top"
                  />
                </div>
                <input
                  v-model.number="participantForm.age"
                  required
                  type="number"
                  min="2"
                  max="100"
                  placeholder="e.g. 12"
                  class="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                />
              </div>

              <div>
                <div class="flex items-center mb-1">
                  <label class="block text-xs font-bold text-slate-700">Jenis Kelamin <span class="text-red-600">*</span></label>
                  <QuickHelpTooltip
                    title="Petunjuk Gender"
                    content="Memudahkan pembagian bagan pertandingan Putra / Putri."
                    position="top"
                  />
                </div>
                <div class="grid grid-cols-2 gap-2 mt-1">
                  <label
                    class="flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors"
                    :class="participantForm.gender === 'L' ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-2xs' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
                  >
                    <input type="radio" v-model="participantForm.gender" value="L" class="hidden" />
                    <span>👨 Laki-Laki</span>
                  </label>

                  <label
                    class="flex items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors"
                    :class="participantForm.gender === 'P' ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'"
                  >
                    <input type="radio" v-model="participantForm.gender" value="P" class="hidden" />
                    <span>👩 Perempuan</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section B: Kontak & Alamat (Opsional) -->
        <div class="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span class="w-6 h-6 rounded-lg bg-slate-700 text-white text-xs font-bold flex items-center justify-center">2</span>
            <h3 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Kontak & Alamat (Fully Opsional)</h3>
          </div>

          <div class="space-y-4">
            <!-- WhatsApp & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div class="flex items-center mb-1">
                  <label class="block text-xs font-bold text-slate-700">Nomor WhatsApp (Opsional)</label>
                  <QuickHelpTooltip
                    title="Format WhatsApp"
                    content="Boleh dikosongkan. Jika diisi, sistem menyediakan tombol kirim konfirmasi otomatis via WhatsApp."
                    example="081234567890"
                    position="top"
                  />
                </div>
                <input
                  v-model="participantForm.whatsapp"
                  type="tel"
                  placeholder="e.g. 081234567890 (Boleh Kosong)"
                  class="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                />
              </div>

              <div>
                <div class="flex items-center mb-1">
                  <label class="block text-xs font-bold text-slate-700">Email (Opsional)</label>
                  <QuickHelpTooltip
                    title="Petunjuk Email"
                    content="Boleh dikosongkan jika tidak ada."
                    example="peserta@gmail.com"
                    position="top"
                  />
                </div>
                <input
                  v-model="participantForm.email"
                  type="email"
                  placeholder="e.g. email@domain.com (Boleh Kosong)"
                  class="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                />
              </div>
            </div>

            <!-- Alamat / RT RW -->
            <div>
              <div class="flex items-center mb-1">
                <label class="block text-xs font-bold text-slate-700">Alamat / RT RW (Opsional)</label>
                <QuickHelpTooltip
                  title="Format Alamat"
                  content="Boleh dikosongkan. Bermanfaat untuk memetakan statistik perwakilan wilayah warga."
                  example="RT 05 / RW 02 Beji Depok"
                  position="top"
                />
              </div>
              <input
                v-model="participantForm.address"
                type="text"
                placeholder="e.g. RT 04 / RW 02 Komp. Warga (Boleh Kosong)"
                class="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500/50 focus:outline-none"
              />
            </div>

            <!-- Catatan Tambahan Textarea -->
            <div>
              <div class="flex items-center mb-1">
                <label class="block text-xs font-bold text-slate-700">Catatan Tambahan (Opsional)</label>
                <QuickHelpTooltip
                  title="Petunjuk Catatan"
                  content="Gunakan textarea ini untuk mencatat instruksi khusus, tim perwakilan, atau preferensi peserta."
                  position="top"
                />
              </div>
              <textarea
                v-model="participantForm.notes"
                rows="3"
                placeholder="Tuliskan catatan khusus bila ada (misal: Perwakilan Karang Taruna, permohonan tampil awal, dll.)..."
                class="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-slate-900 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500/50 focus:outline-none resize-y"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Wizard Navigation Buttons -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="step = 1"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <i class="bi bi-arrow-left"></i>
            <span>Kembali ke Pilih Lomba</span>
          </button>

          <button
            type="submit"
            class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>Lanjut ke Ringkasan</span>
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- STEP 3: Confirmation & Registration Result Card -->
    <div v-if="step === 3" class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6 animate-fade-in">
      <div v-if="!createdResult" class="space-y-5">
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i class="bi bi-check2-circle text-emerald-600 text-lg"></i>
            <span>Langkah 3: Konfirmasi Ringkasan Pendaftaran</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">Periksa ulang seluruh data peserta sebelum diproses ke sistem database.</p>
        </div>

        <!-- Detailed Summary Card -->
        <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Nama Lengkap Peserta:</span>
                <span class="font-extrabold text-slate-900 text-sm">{{ participantForm.name }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Umur & Gender:</span>
                <span class="font-bold text-slate-800">
                  {{ participantForm.age }} Tahun ({{ participantForm.gender === 'L' ? '👨 Laki-Laki' : '👩 Perempuan' }})
                </span>
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Kontak WhatsApp:</span>
                <span class="font-bold" :class="participantForm.whatsapp ? 'text-emerald-700' : 'text-slate-400 italic'">
                  {{ participantForm.whatsapp || 'Tidak Diisi (Opsional)' }}
                </span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px] uppercase font-bold">Alamat / RT RW:</span>
                <span class="font-bold text-slate-800">
                  {{ participantForm.address || 'Tidak Diisi (Opsional)' }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="participantForm.notes" class="pt-2 border-t border-slate-200">
            <span class="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Catatan Tambahan:</span>
            <p class="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 italic font-medium whitespace-pre-line">
              {{ participantForm.notes }}
            </p>
          </div>

          <div class="pt-2 border-t border-slate-200">
            <span class="text-slate-400 block text-[10px] uppercase font-bold mb-2">Cabang Lomba Terpilih:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="cId in selectedCompIds"
                :key="cId"
                class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h4 class="font-extrabold text-slate-900">{{ store.getCompetitionById(cId)?.name }}</h4>
                  <span class="text-[10px] text-slate-500">{{ store.getCompetitionById(cId)?.category }}</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono font-bold text-[10px]">
                  {{ store.getCompetitionById(cId)?.prefix }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-between gap-3">
          <button
            @click="step = 2"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <i class="bi bi-pencil-square"></i>
            <span>Edit Data Peserta</span>
          </button>

          <button
            @click="submitRegistration"
            class="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <i class="bi bi-check-circle-fill"></i>
            <span>Simpan Pendaftaran Sekarang</span>
          </button>
        </div>
      </div>

      <!-- Result View After Submission -->
      <div v-else class="text-center py-6 space-y-6 animate-fade-in">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xs">
          <i class="bi bi-check-lg font-black"></i>
        </div>

        <div>
          <h2 class="text-2xl font-black text-slate-900">Pendaftaran Berhasil Disimpan!</h2>
          <p class="text-xs text-slate-500 mt-1">Nomor urut registrasi telah otomatis diterbitkan oleh sistem.</p>
        </div>

        <!-- Generated Participant Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <div
            v-for="reg in createdResult.registrations"
            :key="reg.id"
            class="bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden"
          >
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-extrabold uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded border border-white/20">
                KARTU PESERTA
              </span>
              <span class="text-sm font-mono font-black bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/30">
                {{ reg.participantNumber }}
              </span>
            </div>

            <h3 class="font-black text-lg mt-3 leading-tight">{{ createdResult.participant.name }}</h3>
            <p class="text-xs text-red-100 mt-1 font-semibold">
              <i class="bi bi-flag-fill text-amber-300 mr-1"></i>
              {{ store.getCompetitionById(reg.competitionId)?.name }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
          <a
            v-for="reg in createdResult.registrations"
            :key="'wa-' + reg.id"
            v-if="participantForm.whatsapp"
            :href="getWaMessageUrl(reg)"
            target="_blank"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <i class="bi bi-whatsapp"></i>
            <span>Kirim Notifikasi WA ({{ reg.participantNumber }})</span>
          </a>

          <button
            @click="resetWizard"
            class="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <i class="bi bi-plus-circle-fill"></i>
            <span>Daftarkan Peserta Lain</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { generateRegistrationConfirmationMessage } from '../services/whatsapp';
import QuickHelpTooltip from '../components/QuickHelpTooltip.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();
const step = ref(1);
const compSearch = ref('');

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

const filteredCompetitions = computed(() => {
  if (!compSearch.value.trim()) return store.competitions;
  const q = compSearch.value.toLowerCase();
  return store.competitions.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.prefix.toLowerCase().includes(q)
  );
});

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
  if (!participantForm.name.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Nama Peserta Wajib Diisi',
      text: 'Harap masukkan nama lengkap peserta terlebih dahulu.',
      confirmButtonColor: '#dc2626'
    });
    return;
  }
  step.value = 3;
}

function submitRegistration() {
  const result = store.registerParticipant(participantForm, selectedCompIds.value);
  createdResult.value = result;
  Swal.fire({
    icon: 'success',
    title: 'Pendaftaran Berhasil!',
    text: `Peserta terdaftar pada ${result.registrations.length} cabang perlombaan.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function getWaMessageUrl(reg: any) {
  if (!participantForm.whatsapp) return '#';
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
  compSearch.value = '';
  selectedCompIds.value = [];
  participantForm.name = '';
  participantForm.age = 12;
  participantForm.gender = 'L';
  participantForm.whatsapp = '';
  participantForm.email = '';
  participantForm.address = '';
  participantForm.notes = '';
  createdResult.value = null;
}
</script>
