<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <i class="bi bi-gear-fill text-slate-700"></i>
          <span>Pengaturan Sistem 17an Arena</span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">Sesuaikan identitas acara, ketua panitia, template WhatsApp, dan data sistem.</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-slate-200 gap-4 text-xs font-bold overflow-x-auto no-scrollbar">
      <button
        @click="activeTab = 'general'"
        class="pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'general' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
      >
        <i class="bi bi-sliders"></i>
        <span>Pengaturan Umum</span>
      </button>

      <button
        @click="activeTab = 'competition-template'"
        class="pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'competition-template' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
      >
        <i class="bi bi-trophy-fill text-amber-500"></i>
        <span>Template Lomba 17an (8 Cabang)</span>
      </button>

      <button
        @click="activeTab = 'wa-templates'"
        class="pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'wa-templates' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
      >
        <i class="bi bi-whatsapp"></i>
        <span>Template WhatsApp ({{ store.waTemplates.length }})</span>
      </button>

      <button
        @click="activeTab = 'danger'"
        class="pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        :class="activeTab === 'danger' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
      >
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>Reset & Backup</span>
      </button>
    </div>

    <!-- TAB 1: GENERAL SETTINGS -->
    <div v-if="activeTab === 'general'" class="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
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
              placeholder="Masukkan Nama Lengkap Ketua Panitia"
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
          <label class="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp MC Arena / Pemandu Acara</label>
          <input
            v-model="form.mcPhoneNumber"
            type="text"
            placeholder="e.g. 08123456789 (Untuk fitur Oper Roster panggil peserta ke MC)"
            class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/50"
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

        <!-- Dark Mode Toggle Card -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-lg font-bold shadow-xs">
              <i :class="store.isDarkMode ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill text-amber-500'"></i>
            </div>
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide">
                Mode Tampilan Dark Mode (Tema Gelap)
              </h3>
              <p class="text-[11px] text-slate-500">
                Aktifkan mode gelap untuk kenyamanan mata panitia saat malam hari & penggunaan panggung.
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="store.toggleDarkMode()"
            class="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="store.isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'"
          >
            <span
              class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[11px]"
              :class="store.isDarkMode ? 'translate-x-7 text-indigo-600' : 'translate-x-0 text-slate-400'"
            >
              <i :class="store.isDarkMode ? 'bi bi-moon-fill' : 'bi bi-sun-fill'"></i>
            </span>
          </button>
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

    <!-- TAB 2: COMPETITION TEMPLATE MANAGER -->
    <div v-if="activeTab === 'competition-template'" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase border border-amber-200">
                Preset Paket Kemerdekaan RI
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                {{ store.competitions.length }} Lomba Terdaftar di System
              </span>
            </div>
            <h2 class="text-lg font-black text-slate-900 flex items-center gap-2 mt-1">
              <i class="bi bi-trophy-fill text-amber-500"></i>
              <span>Template Lomba 17-an (8 Cabang Lomba Utama)</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Klik tombol di bawah untuk menyetel otomatis daftar perlombaan dengan template standar 17-an yang terdiri dari 5 cabang Anak-anak dan 3 cabang Dewasa.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="applyCompetitionTemplate('append')"
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <i class="bi bi-plus-circle-fill text-indigo-600"></i>
              <span>Tambahkan (Append)</span>
            </button>

            <button
              @click="applyCompetitionTemplate('replace')"
              class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <i class="bi bi-check2-circle"></i>
              <span>Set / Terapkan Template Lomba</span>
            </button>
          </div>
        </div>

        <!-- Template Categories Preview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- a. Lomba Anak-anak Card -->
          <div class="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  A
                </div>
                <div>
                  <h3 class="font-extrabold text-sm text-amber-950">a. Lomba Anak-Anak</h3>
                  <p class="text-[11px] text-amber-700">5 Cabang Perlombaan Ketangkasan & Kecepatan</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px]">
                5 Lomba
              </span>
            </div>

            <div class="space-y-2">
              <div class="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🚩</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">1. Lomba Pindahin Bendera</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">BNDR</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Lomba adu kecepatan memindahkan bendera Merah Putih kecil ke dalam botol.</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🍘</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">2. Lomba Makan Kerupuk</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">KRPK</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Lomba makan kerupuk putih yang digantung tali tanpa menggunakan tangan.</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🎈</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">3. Lomba Voli Balon</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">VBLN</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Permainan voli menggunakan balon air/udara antar tim anak-anak.</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🪖</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">4. Lomba Balap Karung Pakai Helm</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">BKR3</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Balap karung unik anak-anak mengenakan helm keselamatan yang meriah.</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-amber-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🔴</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">5. Lomba Kelereng</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">KLRG</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Lomba ketangkasan membawa kelereng di atas sendok yang digigit sambil berjalan.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- b. Lomba Dewasa Card -->
          <div class="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-blue-200/80 pb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  B
                </div>
                <div>
                  <h3 class="font-extrabold text-sm text-blue-950">b. Lomba Dewasa</h3>
                  <p class="text-[11px] text-blue-700">3 Cabang Perlombaan Kekompakan & Hiburan</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900 font-extrabold text-[10px]">
                3 Lomba
              </span>
            </div>

            <div class="space-y-2">
              <div class="bg-white p-3 rounded-xl border border-blue-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🪑</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">1. Joget Bangku</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">JBNK</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Lomba berjoget mengelilingi kursi saat musik berputar dan berebut duduk saat musik berhenti.</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-blue-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🥣</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">2. Estafet Terigu</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">ESTG</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Lomba estafet memindahkan tepung terigu ke belakang lewat atas kepala secara berregu.</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-xl border border-blue-200/70 shadow-2xs flex items-start gap-3">
                <span class="text-lg">🪢</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-xs text-slate-900">3. Tarik Tambang</h4>
                    <span class="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">TTMB</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Adu kekuatan fisik dan semangat gotong royong antar tim warga dalam menarik tali tambang.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: SAVED WHATSAPP TEMPLATE MANAGER -->
    <div v-if="activeTab === 'wa-templates'" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <i class="bi bi-whatsapp text-emerald-600"></i>
              <span>Manajer Template Pesan WhatsApp</span>
            </h2>
            <p class="text-xs text-slate-500">
              Kelola daftar pesan siap pakai dengan placeholder otomatis untuk pengiriman broadcast masal.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="confirmResetWaTemplates"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Reset Bawaan
            </button>
            <button
              @click="openTplModal()"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <i class="bi bi-plus-lg"></i>
              <span>Buat Template Baru</span>
            </button>
          </div>
        </div>

        <!-- Available Placeholder Tag Guide -->
        <div class="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-2xl space-y-1.5">
          <span class="text-[11px] font-extrabold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
            <i class="bi bi-info-circle-fill text-emerald-600"></i>
            <span>Daftar Placeholder Variabel Otomatis:</span>
          </span>
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-mono font-bold rounded-md">{nama}</span>
            <span class="text-slate-400">•</span>
            <span class="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-mono font-bold rounded-md">{nomor}</span>
            <span class="text-slate-400">•</span>
            <span class="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-mono font-bold rounded-md">{lomba}</span>
            <span class="text-slate-400">•</span>
            <span class="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-mono font-bold rounded-md">{lokasi}</span>
            <span class="text-slate-400">•</span>
            <span class="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-mono font-bold rounded-md">{waktu}</span>
            <span class="text-slate-400">•</span>
            <span class="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-mono font-bold rounded-md">{status}</span>
          </div>
        </div>

        <!-- Saved Templates Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="tpl in store.waTemplates"
            :key="tpl.id"
            class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all space-y-3 shadow-2xs"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border"
                  :class="[
                    tpl.category === 'panggilan' ? 'bg-red-100 text-red-800 border-red-300' :
                    tpl.category === 'pengingat' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    tpl.category === 'selesai' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    tpl.category === 'pengumuman' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    'bg-slate-200 text-slate-800 border-slate-300'
                  ]"
                >
                  {{ tpl.category }}
                </span>
                <span v-if="tpl.isDefault" class="text-[10px] text-slate-400 font-bold">Bawaan System</span>
              </div>

              <h3 class="font-extrabold text-sm text-slate-900">
                {{ tpl.title }}
              </h3>

              <div class="mt-2 bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                {{ tpl.content }}
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-slate-200 pt-2.5">
              <span class="text-[10px] text-slate-400 font-mono">
                ID: {{ tpl.id }}
              </span>

              <div class="flex items-center gap-1.5">
                <button
                  @click="openTplModal(tpl)"
                  class="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                  title="Edit Template"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button
                  @click="deleteTpl(tpl)"
                  class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors"
                  title="Hapus Template"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: DANGER ZONE & RESET -->
    <div v-if="activeTab === 'danger'" class="space-y-6">
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

    <!-- CREATE / EDIT TEMPLATE MODAL -->
    <div v-if="showTplModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <i class="bi bi-whatsapp text-emerald-600"></i>
            <span>{{ editingTplId ? 'Edit Template WhatsApp' : 'Buat Template WhatsApp' }}</span>
          </h3>
          <button @click="showTplModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="bi bi-x-lg text-base"></i>
          </button>
        </div>

        <form @submit.prevent="saveTpl" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Judul Template *</label>
            <input
              v-model="tplForm.title"
              required
              type="text"
              placeholder="e.g. Panggilan Lapangan Utama"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Kategori Pesan</label>
            <select
              v-model="tplForm.category"
              class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="panggilan">📢 Panggilan Lomba</option>
              <option value="pengingat">⏰ Pengingat Jadwal</option>
              <option value="selesai">🏁 Ucapan Selesai</option>
              <option value="pengumuman">🏆 Pengumuman Juara</option>
              <option value="lainnya">💬 Lainnya</option>
            </select>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-bold text-slate-700">Isi Pesan WhatsApp *</label>
              <div class="flex items-center gap-1 text-[10px]">
                <button type="button" @click="insertTag('{nama}')" class="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                  {nama}
                </button>
                <button type="button" @click="insertTag('{nomor}')" class="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                  {nomor}
                </button>
                <button type="button" @click="insertTag('{lomba}')" class="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                  {lomba}
                </button>
                <button type="button" @click="insertTag('{lokasi}')" class="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                  {lokasi}
                </button>
                <button type="button" @click="insertTag('{waktu}')" class="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                  {waktu}
                </button>
              </div>
            </div>

            <textarea
              v-model="tplForm.content"
              required
              rows="5"
              placeholder="Tulis template pesan dengan tag {nama}, {nomor}, {lomba}..."
              class="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            ></textarea>
          </div>

          <!-- Live Sample Preview -->
          <div class="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1">
            <span class="text-[10px] font-extrabold uppercase text-emerald-800">
              <i class="bi bi-eye-fill"></i> Sample Live Rendered Preview:
            </span>
            <p class="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed bg-white/90 p-2.5 rounded-lg border border-emerald-100">
              {{ renderedModalPreview }}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="showTplModal = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-xs"
            >
              Simpan Template
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { WaTemplate } from '../types';
import { renderBulkTemplate } from '../services/whatsapp';
import Swal from 'sweetalert2';

const store = useArenaStore();
const activeTab = ref<'general' | 'competition-template' | 'wa-templates' | 'danger'>('general');

function applyCompetitionTemplate(mode: 'replace' | 'append') {
  const isReplace = mode === 'replace';
  Swal.fire({
    title: isReplace ? 'Set Daftar Lomba ke Template?' : 'Tambahkan Template Lomba?',
    text: isReplace
      ? 'Ini akan mengganti daftar lomba saat ini dengan 8 cabang lomba template resmi 17-an (5 Anak-anak, 3 Dewasa).'
      : 'Cabang lomba template yang belum ada akan ditambahkan ke daftar lomba Anda saat ini.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    confirmButtonText: isReplace ? 'Ya, Set Template Lomba' : 'Ya, Tambahkan Lomba',
    cancelButtonText: 'Batal'
  }).then(res => {
    if (res.isConfirmed) {
      store.applyCompetitionTemplate(mode);
      Swal.fire({
        icon: 'success',
        title: 'Template Lomba Berhasil Diset!',
        text: `Daftar lomba kini telah disesuaikan dengan 8 cabang lomba 17-an resmi. Total lomba aktif: ${store.competitions.length}.`,
        confirmButtonColor: '#059669'
      });
    }
  });
}

const form = reactive({
  eventName: '',
  eventYear: 2026,
  headOfCommittee: '',
  location: '',
  mcPhoneNumber: '',
  certificateTemplateText: ''
});

onMounted(() => {
  form.eventName = store.settings.eventName;
  form.eventYear = store.settings.eventYear;
  form.headOfCommittee = store.settings.headOfCommittee;
  form.location = store.settings.location;
  form.mcPhoneNumber = store.settings.mcPhoneNumber || '';
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

// TEMPLATE MANAGER LOGIC
const showTplModal = ref(false);
const editingTplId = ref<string | null>(null);

const tplForm = reactive({
  title: '',
  category: 'panggilan' as WaTemplate['category'],
  content: ''
});

function openTplModal(tpl?: WaTemplate) {
  if (tpl) {
    editingTplId.value = tpl.id;
    tplForm.title = tpl.title;
    tplForm.category = tpl.category;
    tplForm.content = tpl.content;
  } else {
    editingTplId.value = null;
    tplForm.title = '';
    tplForm.category = 'panggilan';
    tplForm.content = `Panggilan Peserta Lomba Kemerdekaan 🇮🇩\n\nHalo {nama} (No: {nomor}), Anda dijadwalkan bertanding pada lomba *{lomba}*.\n*Lokasi:* {lokasi}\n\nHarap segera berkumpul!`;
  }
  showTplModal.value = true;
}

function insertTag(tag: string) {
  tplForm.content += ` ${tag}`;
}

const renderedModalPreview = computed(() => {
  return renderBulkTemplate(tplForm.content, {
    participantName: 'Agus Pratama',
    participantNumber: 'MK-001',
    competitionName: 'Lomba Makan Kerupuk',
    location: 'Lapangan Utama - Zone A',
    status: 'Ready',
    time: '09:00 WIB',
    category: 'Anak-anak'
  });
});

function saveTpl() {
  if (!tplForm.title || !tplForm.content) return;

  if (editingTplId.value) {
    store.updateWaTemplate(editingTplId.value, {
      title: tplForm.title,
      category: tplForm.category,
      content: tplForm.content
    });
    Swal.fire({ icon: 'success', title: 'Template Diperbarui!', timer: 1200, showConfirmButton: false });
  } else {
    store.addWaTemplate({
      title: tplForm.title,
      category: tplForm.category,
      content: tplForm.content
    });
    Swal.fire({ icon: 'success', title: 'Template Ditambahkan!', timer: 1200, showConfirmButton: false });
  }
  showTplModal.value = false;
}

function deleteTpl(tpl: WaTemplate) {
  Swal.fire({
    title: `Hapus Template "${tpl.title}"?`,
    text: 'Template yang dihapus tidak dapat dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Ya, Hapus'
  }).then(res => {
    if (res.isConfirmed) {
      store.deleteWaTemplate(tpl.id);
      Swal.fire('Terhapus!', 'Template berhasil dihapus.', 'success');
    }
  });
}

function confirmResetWaTemplates() {
  Swal.fire({
    title: 'Reset Template Ke Bawaan System?',
    text: 'Seluruh template WhatsApp buatan Anda akan dikembalikan ke daftar standar bawaan.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Reset'
  }).then(res => {
    if (res.isConfirmed) {
      store.resetWaTemplates();
      Swal.fire('Ter-reset!', 'Template dikembalikan ke bawaan.', 'success');
    }
  });
}
</script>
