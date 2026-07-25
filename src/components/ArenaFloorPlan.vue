<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase border border-red-200">
            Interactive 3D Miniature
          </span>
          <h2 class="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <i class="bi bi-box-seam-fill text-red-600"></i>
            <span>Peta Arena Lapangan 3D (Live Layout)</span>
          </h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Visualisasi denah 3D miniatur interaktif menggunakan Three.js & GSAP untuk mengarahkan alur peserta & panitia.
        </p>
      </div>

      <!-- Controls & Toggle -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative w-full sm:w-48">
          <i class="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari lomba/lokasi..."
            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 text-slate-800 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        <!-- Filter Zone -->
        <select
          v-model="selectedZoneFilter"
          @change="onZoneFilterChange"
          class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
        >
          <option value="ALL">-- Semua Zona Arena --</option>
          <option value="A">Zone A: Lapangan Utama</option>
          <option value="B">Zone B: Panggung Panitia</option>
          <option value="C">Zone C: Area Registrasi</option>
        </select>

        <!-- Toggle View Mode -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            @click="switchViewMode('3d')"
            class="px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1"
            :class="viewMode === '3d' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <i class="bi bi-cube-fill"></i>
            <span>Miniatur 3D</span>
          </button>
          <button
            @click="switchViewMode('map')"
            class="px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1"
            :class="viewMode === 'map' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <i class="bi bi-geo-alt-fill"></i>
            <span>Denah 2D</span>
          </button>
          <button
            @click="switchViewMode('grid')"
            class="px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1"
            :class="viewMode === 'grid' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <i class="bi bi-grid-fill"></i>
            <span>Kartu Zona</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <i class="bi bi-play-circle-fill"></i>
          </div>
          <div>
            <span class="block text-[10px] text-slate-400 uppercase font-bold">Sedang Bertanding</span>
            <span class="font-extrabold text-slate-900 text-sm">{{ ongoingCount }} Lomba</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <i class="bi bi-clock-history"></i>
          </div>
          <div>
            <span class="block text-[10px] text-slate-400 uppercase font-bold">Akan Datang</span>
            <span class="font-extrabold text-slate-900 text-sm">{{ upcomingCount }} Lomba</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div>
            <span class="block text-[10px] text-slate-400 uppercase font-bold">Selesai</span>
            <span class="font-extrabold text-slate-900 text-sm">{{ finishedCount }} Lomba</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <i class="bi bi-people-fill"></i>
          </div>
          <div>
            <span class="block text-[10px] text-slate-400 uppercase font-bold">Peserta Bertanding</span>
            <span class="font-extrabold text-slate-900 text-sm">{{ activePlayingParticipantsCount }} Orang</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN VIEW 1: INTERACTIVE 3D MINIATURE ARENA (THREE.JS + GSAP) -->
    <div v-show="viewMode === '3d'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
        <!-- 3D Header overlay -->
        <div class="flex items-center justify-between z-10 text-white border-b border-slate-800/80 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span class="font-bold text-xs tracking-wider uppercase text-slate-200">
              MINIATURE 3D ARENA LAPANGAN (GSAP INTERACTIVE)
            </span>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <button
              @click="focusZone3D('A')"
              class="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 rounded-lg text-[10px] font-bold border border-emerald-700/50"
            >
              Zone A
            </button>
            <button
              @click="focusZone3D('B')"
              class="px-2 py-1 bg-red-900/60 hover:bg-red-800 text-red-300 rounded-lg text-[10px] font-bold border border-red-700/50"
            >
              Zone B
            </button>
            <button
              @click="focusZone3D('C')"
              class="px-2 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-300 rounded-lg text-[10px] font-bold border border-blue-700/50"
            >
              Zone C
            </button>
            <button
              @click="resetCamera3D"
              class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold border border-slate-700"
              title="Reset Tampilan Kamera"
            >
              <i class="bi bi-aspect-ratio-fill"></i> Reset
            </button>
          </div>
        </div>

        <!-- ThreeJS Canvas Container -->
        <div
          ref="canvasContainer"
          class="relative my-3 w-full h-[400px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-slate-900/90"
        >
          <!-- Canvas element -->
          <canvas ref="threeCanvas" class="w-full h-full block outline-none"></canvas>

          <!-- Floating HTML Hotspots Projected from 3D World Positions -->
          <div
            v-for="comp in filteredCompetitions"
            :key="comp.id"
            v-show="pinPositions[comp.id]?.visible"
            @click.stop="selectCompetition(comp)"
            class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-150 hover:scale-110 z-20"
            :style="{
              left: (pinPositions[comp.id]?.x || 0) + 'px',
              top: (pinPositions[comp.id]?.y || 0) + 'px'
            }"
          >
            <div
              class="group relative flex items-center gap-1 px-2.5 py-1 rounded-full shadow-2xl border text-[10px] font-black transition-all backdrop-blur-xs"
              :class="[
                selectedCompId === comp.id ? 'ring-4 ring-amber-400 scale-110 z-30 bg-red-600 text-white border-amber-300' :
                comp.status === 'Ongoing' ? 'bg-red-600/95 text-white border-red-400' :
                'bg-slate-900/90 text-slate-200 border-slate-700'
              ]"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="comp.status === 'Ongoing' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'"
              ></span>
              <span class="font-mono text-[10px]">[{{ comp.prefix }}]</span>
              <span class="max-w-[80px] truncate">{{ comp.name }}</span>

              <!-- Hover Tooltip -->
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[10px] p-2 rounded-xl border border-slate-700 shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                <p class="font-extrabold text-amber-300">{{ comp.name }}</p>
                <p class="text-slate-300">📍 {{ comp.location }}</p>
                <p class="text-emerald-400 font-bold">🎮 {{ getPlayingCount(comp.id) }} Sedang Bertanding</p>
              </div>
            </div>
          </div>

          <!-- Helper guide overlay -->
          <div class="absolute bottom-2 left-3 text-[10px] text-slate-400/80 bg-slate-950/70 px-2.5 py-1 rounded-lg pointer-events-none backdrop-blur-xs border border-slate-800">
            <i class="bi bi-hand-index-thumb"></i> Putar & geser mouse untuk rotasi 3D. Klik zona/pin untuk efek kamera GSAP.
          </div>
        </div>

        <!-- 3D Legend Footer -->
        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3 z-10">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span> Zone A (Lapangan Hijau)
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-red-600 border border-red-300"></span> Zone B (Panggung Utama & Podium)
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-blue-500 border border-blue-300"></span> Zone C (Tenda Registrasi)
            </span>
          </div>
          <span class="text-slate-500">GSAP Smooth Camera Orbit Enabled</span>
        </div>
      </div>

        <!-- Detail Info Panel (4 Cols) -->
        <div class="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
          <div v-if="selectedComp" class="space-y-4">
            <!-- Competition Header -->
            <div class="border-b border-slate-200 pb-3 flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-extrabold uppercase">
                    {{ selectedComp.category }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border"
                    :class="[
                      selectedComp.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      selectedComp.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      'bg-slate-200 text-slate-700 border-slate-300'
                    ]"
                  >
                    {{ selectedComp.status }}
                  </span>
                </div>
                <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>[{{ selectedComp.prefix }}]</span>
                  <span>{{ selectedComp.name }}</span>
                </h3>
              </div>
              <button
                @click="selectedCompId = ''"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 text-xs font-bold transition-colors"
                title="Tutup & Lihat Peta 2D Portrait"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- Location & Inline Edit -->
            <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-400 uppercase">Lokasi Arena Saat Ini:</span>
                <button
                  @click="openLocationEditModal(selectedComp)"
                  class="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <i class="bi bi-pencil-square"></i> Ubah Lokasi
                </button>
              </div>
              <p class="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <i class="bi bi-geo-alt-fill text-red-600"></i>
                <span>{{ selectedComp.location || 'Belum ditentukan' }}</span>
              </p>
            </div>

            <!-- Panitia Routing Direction Helper -->
            <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1 text-amber-900">
              <div class="font-extrabold flex items-center gap-1 text-[11px] uppercase text-amber-800">
                <i class="bi bi-compass-fill text-amber-600"></i>
                <span>Petunjuk Arah Panitia:</span>
              </div>
              <p class="text-[11px] leading-relaxed">
                {{ getPanitiaRoutingInstruction(selectedComp) }}
              </p>
            </div>

            <!-- Participants Status Summary -->
            <div class="space-y-2">
              <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Status Peserta Arena:
              </h4>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                  <span class="block text-[10px] text-emerald-700 font-bold">Bertanding</span>
                  <span class="font-extrabold text-emerald-900 text-sm">{{ getPlayingCount(selectedComp.id) }}</span>
                </div>
                <div class="bg-blue-50 border border-blue-200 p-2 rounded-xl">
                  <span class="block text-[10px] text-blue-700 font-bold">Siap / Panggil</span>
                  <span class="font-extrabold text-blue-900 text-sm">{{ getReadyCount(selectedComp.id) }}</span>
                </div>
                <div class="bg-amber-50 border border-amber-200 p-2 rounded-xl">
                  <span class="block text-[10px] text-amber-700 font-bold">Menunggu</span>
                  <span class="font-extrabold text-amber-900 text-sm">{{ getWaitingCount(selectedComp.id) }}</span>
                </div>
              </div>
            </div>

            <!-- Playing Participants List -->
            <div class="space-y-2">
              <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Peserta Di Arena:</span>
                <span class="text-[10px] text-slate-400 font-normal">Live Queue</span>
              </h4>

              <div v-if="getArenaParticipants(selectedComp.id).length > 0" class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                <div
                  v-for="item in getArenaParticipants(selectedComp.id)"
                  :key="item.id"
                  class="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span class="font-mono font-bold text-red-600 mr-1.5">[{{ item.participantNumber }}]</span>
                    <span class="font-extrabold text-slate-900">{{ store.getParticipantById(item.participantId)?.name }}</span>
                  </div>
                  <span
                    class="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border"
                    :class="[
                      item.status === 'Playing' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      item.status === 'Ready' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      'bg-amber-100 text-amber-800 border-amber-300'
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </div>
              </div>
              <p v-else class="text-[11px] text-slate-400 italic py-2 text-center bg-white rounded-xl border border-dashed border-slate-200">
                Belum ada peserta yang dipanggil ke arena.
              </p>
            </div>
          </div>

          <!-- 2D PORTRAIT MAP BLUEPRINT WHEN NO COMPETITION IS SELECTED -->
          <div v-else class="space-y-3 my-auto">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <div class="flex items-center gap-1.5">
                <i class="bi bi-map-fill text-red-600"></i>
                <h4 class="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Denah 2D Portrait Arena</h4>
              </div>
              <span class="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold border border-red-200">2D Portrait View</span>
            </div>

            <!-- Portrait SVG Container -->
            <div class="relative w-full h-[360px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner p-2">
              <svg class="w-full h-full select-none" viewBox="0 0 280 420" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <pattern id="grid-portrait" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                  </pattern>
                </defs>
                <rect width="280" height="420" fill="url(#grid-portrait)" rx="12" />

                <!-- ZONE B: PANGGUNG PANITIA (TOP) -->
                <g @click="selectZone('B')" class="cursor-pointer transition-all hover:opacity-90">
                  <rect x="15" y="15" width="250" height="90" rx="12" fill="rgba(239, 68, 68, 0.18)" stroke="#f87171" stroke-width="2" />
                  <text x="28" y="42" fill="#f87171" font-size="11" font-weight="bold" font-family="sans-serif">ZONE B: PANGGUNG PANITIA</text>
                  <text x="28" y="58" fill="#fca5a5" font-size="9" font-family="sans-serif">(Panggung Utama & Podium Juri)</text>
                </g>

                <!-- Connector -->
                <path d="M 140 105 L 140 125" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4" />

                <!-- ZONE A: LAPANGAN LOMBA (MIDDLE) -->
                <g @click="selectZone('A')" class="cursor-pointer transition-all hover:opacity-90">
                  <rect x="15" y="125" width="250" height="170" rx="12" fill="rgba(16, 185, 129, 0.18)" stroke="#34d399" stroke-width="2" stroke-dasharray="6,4" />
                  <text x="28" y="152" fill="#34d399" font-size="11" font-weight="bold" font-family="sans-serif">ZONE A: LAPANGAN LOMBA</text>
                  <text x="28" y="168" fill="#a7f3d0" font-size="9" font-family="sans-serif">(Area Utama Pertandingan Lomba)</text>
                </g>

                <!-- Connector -->
                <path d="M 140 295 L 140 315" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4" />

                <!-- ZONE C: AREA REGISTRASI (BOTTOM) -->
                <g @click="selectZone('C')" class="cursor-pointer transition-all hover:opacity-90">
                  <rect x="15" y="315" width="250" height="90" rx="12" fill="rgba(59, 130, 246, 0.18)" stroke="#60a5fa" stroke-width="2" />
                  <text x="28" y="342" fill="#60a5fa" font-size="11" font-weight="bold" font-family="sans-serif">ZONE C: AREA REGISTRASI</text>
                  <text x="28" y="358" fill="#93c5fd" font-size="9" font-family="sans-serif">(Meja Informasi & Pendaftaran)</text>
                </g>
              </svg>

              <!-- HOTSPOT PINS ON PORTRAIT MAP -->
              <div
                v-for="comp in filteredCompetitions"
                :key="comp.id"
                @click.stop="selectCompetition(comp)"
                class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 z-20"
                :style="getPortraitPinPositionStyle(comp)"
              >
                <div
                  class="flex items-center gap-1 px-2 py-0.5 rounded-full shadow-md border text-[10px] font-black backdrop-blur-xs"
                  :class="[
                    selectedCompId === comp.id ? 'bg-red-600 text-white border-yellow-300 ring-2 ring-yellow-400 z-30' :
                    comp.status === 'Ongoing' ? 'bg-red-600 text-white border-red-400' :
                    'bg-slate-900/90 text-slate-200 border-slate-700'
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="comp.status === 'Ongoing' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'"></span>
                  <span class="font-mono">[{{ comp.prefix }}]</span>
                  <span class="max-w-[65px] truncate">{{ comp.name }}</span>
                </div>
              </div>
            </div>

            <p class="text-[10px] text-slate-400 text-center italic">
              Klik salah satu zona / pin diatas untuk rincian alur perlombaan.
            </p>
          </div>

          <!-- Direct Navigation Buttons -->
          <div class="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            <router-link
              to="/waiting-lounge"
              class="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] text-center transition-colors flex items-center justify-center gap-1"
            >
              <i class="bi bi-megaphone-fill text-amber-400"></i>
              <span>Waiting Lounge</span>
            </router-link>

            <router-link
              to="/scoring"
              class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[11px] text-center transition-colors flex items-center justify-center gap-1"
            >
              <i class="bi bi-trophy-fill"></i>
              <span>Penilaian Juri</span>
            </router-link>
          </div>
        </div>
    </div>

    <!-- MAIN VIEW 2: 2D SVG BLUEPRINT -->
    <div v-show="viewMode === 'map'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
        <div class="flex items-center justify-between z-10 text-white border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span class="font-bold text-xs tracking-wider uppercase text-slate-300">PETA ARENA LAPANGAN (2D BLUEPRINT)</span>
          </div>
          <span class="text-[11px] text-slate-400 italic">Klik area untuk detail panitia</span>
        </div>

        <div class="relative my-4 w-full h-[360px] bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <svg class="w-full h-full absolute inset-0 select-none" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#grid)" />

            <!-- ZONE A -->
            <g @click="selectZone('A')" class="cursor-pointer transition-all duration-300 hover:opacity-90">
              <rect x="30" y="40" width="460" height="380" rx="16" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2" stroke-dasharray="6,4" />
              <text x="45" y="68" fill="#34d399" font-size="13" font-weight="bold" font-family="sans-serif">ZONE A: LAPANGAN LOMBA</text>
              <text x="45" y="88" fill="#a7f3d0" font-size="10" font-family="sans-serif">(Area Utama Pertandingan Lomba Kemerdekaan)</text>
            </g>

            <!-- ZONE B -->
            <g @click="selectZone('B')" class="cursor-pointer transition-all duration-300 hover:opacity-90">
              <rect x="520" y="40" width="250" height="180" rx="16" fill="rgba(239, 68, 68, 0.12)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="2" />
              <text x="535" y="68" fill="#f87171" font-size="12" font-weight="bold" font-family="sans-serif">ZONE B: PANGGUNG PANITIA</text>
              <text x="535" y="88" fill="#fca5a5" font-size="10" font-family="sans-serif">(Panggung Utama & Podium Juri)</text>
            </g>

            <!-- ZONE C -->
            <g @click="selectZone('C')" class="cursor-pointer transition-all duration-300 hover:opacity-90">
              <rect x="520" y="240" width="250" height="180" rx="16" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="2" />
              <text x="535" y="268" fill="#60a5fa" font-size="12" font-weight="bold" font-family="sans-serif">ZONE C: AREA REGISTRASI</text>
              <text x="535" y="288" fill="#93c5fd" font-size="10" font-family="sans-serif">(Meja Pendaftaran & Informasi)</text>
            </g>

            <path d="M 490 230 L 520 230" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4" />
            <path d="M 645 220 L 645 240" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4" />
          </svg>

          <!-- Hotspot Pins -->
          <div
            v-for="comp in filteredCompetitions"
            :key="comp.id"
            @click.stop="selectCompetition(comp)"
            class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 z-20"
            :style="getPinPositionStyle(comp)"
          >
            <div
              class="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border text-xs font-extrabold transition-all"
              :class="[
                selectedCompId === comp.id ? 'ring-4 ring-yellow-400 scale-110 z-30' : '',
                comp.status === 'Ongoing' ? 'bg-red-600 text-white border-red-400' :
                'bg-slate-800 text-slate-100 border-slate-600'
              ]"
            >
              <span class="w-2 h-2 rounded-full" :class="comp.status === 'Ongoing' ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'"></span>
              <span class="font-mono text-[11px]">[{{ comp.prefix }}]</span>
              <span class="hidden sm:inline max-w-[90px] truncate text-[11px]">{{ comp.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
        <!-- Reuse details for 2D mode -->
        <div v-if="selectedComp" class="space-y-4">
          <div class="border-b border-slate-200 pb-3">
            <h3 class="text-base font-extrabold text-slate-900">[{{ selectedComp.prefix }}] {{ selectedComp.name }}</h3>
            <p class="text-xs text-slate-500 mt-1">📍 {{ selectedComp.location }}</p>
          </div>
          <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
            <p class="font-bold">Petunjuk Panitia:</p>
            <p class="mt-1">{{ getPanitiaRoutingInstruction(selectedComp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN VIEW 3: GRID OF CARDS -->
    <div v-show="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="comp in filteredCompetitions"
        :key="comp.id"
        class="bg-slate-50 rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
      >
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-extrabold uppercase">
              {{ comp.category }}
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border" :class="comp.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-700'">
              {{ comp.status }}
            </span>
          </div>

          <h3 class="font-extrabold text-sm text-slate-900">[{{ comp.prefix }}] {{ comp.name }}</h3>
          <p class="text-xs text-slate-600 mt-2 font-bold"><i class="bi bi-geo-alt-fill text-red-600"></i> {{ comp.location }}</p>
        </div>

        <div class="border-t border-slate-200 pt-3 flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-700">🎮 {{ getPlayingCount(comp.id) }} Bertanding</span>
          <button @click="openLocationEditModal(comp)" class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold">
            Ubah Lokasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useArenaStore } from '../stores/arenaStore';
import type { Competition } from '../types';
import Swal from 'sweetalert2';

const store = useArenaStore();

const viewMode = ref<'3d' | 'map' | 'grid'>('3d');
const searchQuery = ref('');
const selectedZoneFilter = ref('ALL');
const selectedCompId = ref<string>('');

// Three.js References
const canvasContainer = ref<HTMLDivElement | null>(null);
const threeCanvas = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationFrameId: number;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;

// Camera default settings for miniature isometric view
const defaultCameraPos = { x: 18, y: 16, z: 22 };
const defaultTarget = { x: 0, y: 0, z: 0 };
let currentTarget = { ...defaultTarget };

// Store projected 2D coordinates for floating HTML pins in 3D canvas
const pinPositions = ref<Record<string, { x: number; y: number; visible: boolean }>>({});

// 3D Objects mapping
const zoneObjects: Record<string, THREE.Object3D> = {};
const competitionMeshes: Record<string, THREE.Mesh> = {};
let flagMesh: THREE.Mesh | null = null;
let characterGroup: THREE.Group | null = null;

const selectedComp = computed(() => {
  if (!selectedCompId.value) {
    return null;
  }
  return store.competitions.find(c => c.id === selectedCompId.value);
});

const filteredCompetitions = computed(() => {
  return store.competitions.filter(comp => {
    const q = searchQuery.value.trim().toLowerCase();
    const matchSearch = !q || comp.name.toLowerCase().includes(q) || comp.location.toLowerCase().includes(q) || comp.prefix.toLowerCase().includes(q);

    let matchZone = true;
    const locLower = comp.location.toLowerCase();
    if (selectedZoneFilter.value === 'A') matchZone = locLower.includes('lapangan') || locLower.includes('rumput') || locLower.includes('utama');
    else if (selectedZoneFilter.value === 'B') matchZone = locLower.includes('panggung') || locLower.includes('panitia') || locLower.includes('stage');
    else if (selectedZoneFilter.value === 'C') matchZone = locLower.includes('registrasi') || locLower.includes('meja') || locLower.includes('informasi');

    return matchSearch && matchZone;
  });
});

const ongoingCount = computed(() => store.competitions.filter(c => c.status === 'Ongoing').length);
const upcomingCount = computed(() => store.competitions.filter(c => c.status === 'Upcoming').length);
const finishedCount = computed(() => store.competitions.filter(c => c.status === 'Finished').length);

const activePlayingParticipantsCount = computed(() => {
  return store.registrations.filter(r => r.status === 'Playing').length;
});

function switchViewMode(mode: '3d' | 'map' | 'grid') {
  viewMode.value = mode;
  if (mode === '3d') {
    nextTick(() => {
      onWindowResize();
    });
  }
}

function selectCompetition(comp: Competition) {
  selectedCompId.value = comp.id;
  // Animate camera to competition position if in 3D mode
  if (viewMode.value === '3d') {
    const loc = comp.location.toLowerCase();
    if (loc.includes('panggung') || loc.includes('panitia')) {
      focusZone3D('B');
    } else if (loc.includes('registrasi') || loc.includes('meja')) {
      focusZone3D('C');
    } else {
      focusZone3D('A');
    }
  }
}

function selectZone(zoneKey: string) {
  selectedZoneFilter.value = zoneKey;
  onZoneFilterChange();
}

function onZoneFilterChange() {
  if (viewMode.value === '3d') {
    if (selectedZoneFilter.value !== 'ALL') {
      focusZone3D(selectedZoneFilter.value);
    } else {
      resetCamera3D();
    }
  }
}

function getPlayingCount(compId: string) {
  return store.registrations.filter(r => r.competitionId === compId && r.status === 'Playing').length;
}

function getReadyCount(compId: string) {
  return store.registrations.filter(r => r.competitionId === compId && (r.status === 'Ready' || r.status === 'Called')).length;
}

function getWaitingCount(compId: string) {
  return store.registrations.filter(r => r.competitionId === compId && r.status === 'Waiting').length;
}

function getArenaParticipants(compId: string) {
  return store.registrations.filter(r => r.competitionId === compId && (r.status === 'Playing' || r.status === 'Ready' || r.status === 'Called'));
}

function getPinPositionStyle(comp: Competition) {
  const loc = comp.location.toLowerCase();
  const seed = comp.prefix ? (comp.prefix.charCodeAt(0) % 4) : 0;
  if (loc.includes('panggung') || loc.includes('panitia')) {
    return { left: `${66 + seed * 5}%`, top: `${22 + seed * 6}%` };
  }
  if (loc.includes('registrasi') || loc.includes('meja')) {
    return { left: `${66 + seed * 5}%`, top: `${66 + seed * 6}%` };
  }
  return { left: `${16 + (seed * 8)}%`, top: `${24 + (seed * 12)}%` };
}

function getPortraitPinPositionStyle(comp: Competition) {
  const loc = comp.location.toLowerCase();
  const seed = comp.prefix ? (comp.prefix.charCodeAt(0) % 3) : 0;
  if (loc.includes('panggung') || loc.includes('panitia')) {
    return { left: `${25 + seed * 25}%`, top: `${15 + seed * 5}%` };
  }
  if (loc.includes('registrasi') || loc.includes('meja')) {
    return { left: `${25 + seed * 25}%`, top: `${82 + seed * 4}%` };
  }
  return { left: `${20 + seed * 25}%`, top: `${45 + seed * 8}%` };
}

function getPanitiaRoutingInstruction(comp: Competition): string {
  const loc = comp.location.toLowerCase();
  if (loc.includes('panggung') || loc.includes('panitia')) {
    return 'Arahkan peserta dari Area Registrasi (Zone C) menuju Panggung Panitia (Zone B) di Sisi Timur Arena.';
  } else if (loc.includes('registrasi') || loc.includes('meja')) {
    return 'Peserta berada di Area Registrasi & Meja Informasi (Zone C) untuk pendaftaran dan verifikasi berkas.';
  }
  return 'Arahkan peserta dari Area Registrasi (Zone C) lurus menuju Area Lapangan Lomba (Zone A).';
}

function openLocationEditModal(comp: Competition) {
  Swal.fire({
    title: `Ubah Lokasi Arena Lomba`,
    text: `Pilih lokasi arena baru untuk ${comp.name}:`,
    input: 'select',
    inputOptions: {
      'Lapangan Lomba - Area Utama A1': 'Lapangan Lomba - Area Utama A1',
      'Lapangan Lomba - Area Utama A2': 'Lapangan Lomba - Area Utama A2',
      'Panggung Panitia - Central Stage': 'Panggung Panitia - Central Stage',
      'Panggung Panitia - Podium Utama': 'Panggung Panitia - Podium Utama',
      'Area Registrasi & Meja Informasi': 'Area Registrasi & Meja Informasi'
    },
    inputValue: comp.location,
    showCancelButton: true,
    confirmButtonText: 'Simpan Lokasi',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626'
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      store.updateCompetition(comp.id, { location: result.value });
      Swal.fire({
        icon: 'success',
        title: 'Lokasi Diperbarui!',
        text: `Lokasi ${comp.name} telah diubah.`,
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}

// THREE.JS 3D MINIATURE IMPLEMENTATION
function initThreeJS() {
  if (!threeCanvas.value || !canvasContainer.value) return;

  const width = canvasContainer.value.clientWidth || 600;
  const height = canvasContainer.value.clientHeight || 400;

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a); // Slate-900
  scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

  // 2. Camera (Isometric setup)
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);
  camera.lookAt(defaultTarget.x, defaultTarget.y, defaultTarget.z);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas.value,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.2); // Warm sunlight
  dirLight.position.set(20, 30, 15);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 80;
  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  scene.add(dirLight);

  // Spotlight over Zone B Stage
  const stageSpotlight = new THREE.SpotLight(0xef4444, 2);
  stageSpotlight.position.set(8, 12, -4);
  stageSpotlight.target.position.set(8, 0, -4);
  scene.add(stageSpotlight);
  scene.add(stageSpotlight.target);

  // 5. Build 3D Miniature Environment
  buildMiniatureWorld();

  // 6. Setup Mouse / Touch Controls
  setupEventListeners();

  // 7. Start Render Loop
  animate();
}

function buildMiniatureWorld() {
  // BASE GROUND PLATFORM
  const baseGeo = new THREE.BoxGeometry(32, 1, 24);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.5;
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  // ZONE A: LAPANGAN UTAMA (GREEN GRASS FIELD)
  const fieldGeo = new THREE.BoxGeometry(16, 0.2, 18);
  const fieldMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 }); // Emerald Green
  const fieldMesh = new THREE.Mesh(fieldGeo, fieldMat);
  fieldMesh.position.set(-6, 0.1, 0);
  fieldMesh.receiveShadow = true;
  fieldMesh.name = 'ZONE_A';
  scene.add(fieldMesh);
  zoneObjects['A'] = fieldMesh;

  // Field Boundary White Lines
  const lineGeo = new THREE.BoxGeometry(15, 0.22, 17);
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.4 });
  const lineMesh = new THREE.Mesh(lineGeo, lineMat);
  lineMesh.position.set(-6, 0.11, 0);
  scene.add(lineMesh);

  // Festive Merah Putih Bunting Posts around Zone A
  for (let i = -12; i <= 0; i += 4) {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(i, 1.25, -8.5);
    post.castShadow = true;
    scene.add(post);

    // Red flag top
    const flagTopGeo = new THREE.BoxGeometry(0.6, 0.4, 0.05);
    const flagTopMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const flagTop = new THREE.Mesh(flagTopGeo, flagTopMat);
    flagTop.position.set(i + 0.3, 2.2, -8.5);
    scene.add(flagTop);
  }

  // ZONE B: PANGGUNG UTAMA & PANITIA (RED CARPET ELEVATED STAGE)
  const stagePlatformGeo = new THREE.BoxGeometry(10, 0.8, 8);
  const stagePlatformMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 }); // Crimson Red Stage
  const stagePlatform = new THREE.Mesh(stagePlatformGeo, stagePlatformMat);
  stagePlatform.position.set(8, 0.4, -5);
  stagePlatform.castShadow = true;
  stagePlatform.receiveShadow = true;
  stagePlatform.name = 'ZONE_B';
  scene.add(stagePlatform);
  zoneObjects['B'] = stagePlatform;

  // Stage Backdrop Arch
  const backdropGeo = new THREE.BoxGeometry(9.5, 4, 0.3);
  const backdropMat = new THREE.MeshStandardMaterial({ color: 0xf87171, roughness: 0.3 });
  const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
  backdrop.position.set(8, 2.4, -8.8);
  backdrop.castShadow = true;
  scene.add(backdrop);

  // Speaker Stacks on sides
  const speakerGeo = new THREE.BoxGeometry(1.2, 2.2, 1);
  const speakerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  const leftSpeaker = new THREE.Mesh(speakerGeo, speakerMat);
  leftSpeaker.position.set(3.8, 1.9, -5);
  scene.add(leftSpeaker);

  const rightSpeaker = new THREE.Mesh(speakerGeo, speakerMat);
  rightSpeaker.position.set(12.2, 1.9, -5);
  scene.add(rightSpeaker);

  // Trophy Mesh on Podium
  const trophyBaseGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.6);
  const trophyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 }); // Gold
  const trophyBase = new THREE.Mesh(trophyBaseGeo, trophyMat);
  trophyBase.position.set(8, 1.1, -4);
  scene.add(trophyBase);

  // ZONE C: AREA REGISTRASI (BLUE MARQUEE TENTS)
  const tentRoofGeo = new THREE.ConeGeometry(4.5, 2, 4);
  const tentRoofMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 }); // Blue Tent
  const tentRoof = new THREE.Mesh(tentRoofGeo, tentRoofMat);
  tentRoof.rotation.y = Math.PI / 4;
  tentRoof.position.set(8, 2.5, 5);
  tentRoof.castShadow = true;
  tentRoof.name = 'ZONE_C';
  scene.add(tentRoof);

  const tentPillarGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
  const tentPillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
  const p1 = new THREE.Mesh(tentPillarGeo, tentPillarMat);
  p1.position.set(5.5, 1, 2.5);
  scene.add(p1);
  const p2 = new THREE.Mesh(tentPillarGeo, tentPillarMat);
  p2.position.set(10.5, 1, 2.5);
  scene.add(p2);

  // Registration Desk Table
  const tableGeo = new THREE.BoxGeometry(4, 0.7, 1.5);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const regTable = new THREE.Mesh(tableGeo, tableMat);
  regTable.position.set(8, 0.35, 4.5);
  regTable.castShadow = true;
  regTable.name = 'ZONE_C';
  scene.add(regTable);
  zoneObjects['C'] = regTable;

  // CENTRAL FLAGPOLE & INDONESIAN FLAG (SANG SAKA MERAH PUTIH)
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 9);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(-1, 4.5, 0);
  pole.castShadow = true;
  scene.add(pole);

  // Red Flag Half
  const redFlagGeo = new THREE.BoxGeometry(2, 0.7, 0.05);
  const redFlagMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
  const redFlag = new THREE.Mesh(redFlagGeo, redFlagMat);
  redFlag.position.set(0.1, 8.2, 0);

  // White Flag Half
  const whiteFlagGeo = new THREE.BoxGeometry(2, 0.7, 0.05);
  const whiteFlagMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const whiteFlag = new THREE.Mesh(whiteFlagGeo, whiteFlagMat);
  whiteFlag.position.set(0.1, 7.5, 0);

  const flagGroup = new THREE.Group();
  flagGroup.add(redFlag);
  flagGroup.add(whiteFlag);
  scene.add(flagGroup);

  // GSAP Waving animation for the flag
  gsap.to(flagGroup.rotation, {
    y: 0.15,
    z: 0.08,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // MINIATURE ANIMATED PARTICIPANT CHARACTERS
  characterGroup = new THREE.Group();

  // 3 Mini Avatars on Field
  for (let i = 0; i < 3; i++) {
    const charGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const charMat = new THREE.MeshStandardMaterial({
      color: i === 0 ? 0xef4444 : i === 1 ? 0x3b82f6 : 0xf59e0b,
      roughness: 0.3
    });
    const charMesh = new THREE.Mesh(charGeo, charMat);
    charMesh.position.set(-8 + i * 2, 0.6, -1 + i * 2);
    charMesh.castShadow = true;

    // GSAP Bouncing animation for playing avatars
    gsap.to(charMesh.position, {
      y: 1.1,
      duration: 0.6 + i * 0.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    characterGroup.add(charMesh);
  }
  scene.add(characterGroup);

  // Create 3D Location Markers / Anchor Points for competitions
  updateCompetition3DAnchors();
}

function updateCompetition3DAnchors() {
  // Mapping competitions to 3D world coordinates
  store.competitions.forEach((comp) => {
    const loc = comp.location.toLowerCase();
    const seed = comp.prefix ? (comp.prefix.charCodeAt(0) % 3) : 0;
    let pos = new THREE.Vector3();

    if (loc.includes('panggung') || loc.includes('panitia')) {
      pos.set(6 + seed * 2, 1.8, -5 + seed);
    } else if (loc.includes('registrasi') || loc.includes('meja')) {
      pos.set(6 + seed * 2, 1.5, 4 + seed);
    } else {
      // Zone A Lapangan
      pos.set(-10 + seed * 4, 1.2, -4 + seed * 3);
    }

    if (!competitionMeshes[comp.id]) {
      // Create invisible 3D anchor mesh
      const anchorGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const anchorMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
      const anchorMesh = new THREE.Mesh(anchorGeo, anchorMat);
      anchorMesh.position.copy(pos);
      anchorMesh.userData = { competitionId: comp.id };
      scene.add(anchorMesh);
      competitionMeshes[comp.id] = anchorMesh;
    } else {
      competitionMeshes[comp.id].position.copy(pos);
    }
  });
}

function project3DTo2DScreen() {
  if (!camera || !renderer || !canvasContainer.value) return;

  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  store.competitions.forEach((comp) => {
    const mesh = competitionMeshes[comp.id];
    if (mesh) {
      const vector = mesh.position.clone();
      vector.project(camera);

      // Check if behind camera
      const isVisible = vector.z < 1;
      const x = (vector.x * 0.5 + 0.5) * width;
      const y = (-(vector.y * 0.5) + 0.5) * height;

      pinPositions.value[comp.id] = {
        x,
        y,
        visible: isVisible && x >= 0 && x <= width && y >= 0 && y <= height
      };
    }
  });
}

function focusZone3D(zoneKey: string) {
  let targetPos = { x: 0, y: 0, z: 0 };
  let camPos = { x: 0, y: 0, z: 0 };

  if (zoneKey === 'A') {
    targetPos = { x: -6, y: 0, z: 0 };
    camPos = { x: 4, y: 12, z: 14 };
  } else if (zoneKey === 'B') {
    targetPos = { x: 8, y: 1, z: -5 };
    camPos = { x: 16, y: 10, z: 6 };
  } else if (zoneKey === 'C') {
    targetPos = { x: 8, y: 1, z: 5 };
    camPos = { x: 16, y: 10, z: 16 };
  }

  // Smooth GSAP Camera Animation
  gsap.to(camera.position, {
    x: camPos.x,
    y: camPos.y,
    z: camPos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);
    }
  });

  gsap.to(currentTarget, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);
    }
  });
}

function resetCamera3D() {
  gsap.to(camera.position, {
    x: defaultCameraPos.x,
    y: defaultCameraPos.y,
    z: defaultCameraPos.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);
    }
  });

  gsap.to(currentTarget, {
    x: defaultTarget.x,
    y: defaultTarget.y,
    z: defaultTarget.z,
    duration: 1.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);
    }
  });
}

function setupEventListeners() {
  if (!canvasContainer.value) return;

  const el = canvasContainer.value;

  el.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  el.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Orbit camera manually around currentTarget
      const radius = camera.position.distanceTo(new THREE.Vector3(currentTarget.x, currentTarget.y, currentTarget.z));
      let theta = Math.atan2(camera.position.x - currentTarget.x, camera.position.z - currentTarget.z);
      let phi = Math.acos((camera.position.y - currentTarget.y) / radius);

      theta -= deltaX * 0.008;
      phi -= deltaY * 0.008;
      phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, phi));

      camera.position.x = currentTarget.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = currentTarget.y + radius * Math.cos(phi);
      camera.position.z = currentTarget.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  // Mouse wheel zoom
  el.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.02;
    const dir = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(currentTarget.x, currentTarget.y, currentTarget.z)).normalize();
    camera.position.addScaledVector(dir, zoomFactor);
    camera.lookAt(currentTarget.x, currentTarget.y, currentTarget.z);
  }, { passive: false });

  // Raycasting Click on 3D Zone meshes
  el.addEventListener('click', (e) => {
    if (!threeCanvas.value) return;
    const rect = threeCanvas.value.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.name === 'ZONE_A') focusZone3D('A');
      else if (hit.name === 'ZONE_B') focusZone3D('B');
      else if (hit.name === 'ZONE_C') focusZone3D('C');
    }
  });

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  if (!canvasContainer.value || !renderer || !camera) return;
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;
  if (width > 0 && height > 0) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);

  // Render Scene
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
    project3DTo2DScreen();
  }
}

onMounted(() => {
  initThreeJS();
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  if (renderer) renderer.dispose();
});

watch(() => store.competitions, () => {
  updateCompetition3DAnchors();
}, { deep: true });
</script>
