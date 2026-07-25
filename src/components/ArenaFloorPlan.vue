<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold uppercase border border-red-200">
            Interactive Venue Map
          </span>
          <h2 class="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <i class="bi bi-map-fill text-red-600"></i>
            <span>Denah & Peta Lokasi Arena Lomba</span>
          </h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Peta interaktif lokasi panggung & lapangan lomba untuk membantu panitia mengarahkan peserta secara efisien.
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
          class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
        >
          <option value="ALL">-- Semua Zona Arena --</option>
          <option value="A">Zone A: Lapangan Lomba</option>
          <option value="B">Zone B: Panggung Panitia</option>
          <option value="C">Zone C: Area Registrasi</option>
        </select>

        <!-- Toggle View Mode -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            @click="viewMode = 'map'"
            class="px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1"
            :class="viewMode === 'map' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            <i class="bi bi-geo-alt-fill"></i>
            <span>Denah SVG</span>
          </button>
          <button
            @click="viewMode = 'grid'"
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

    <!-- MAIN VIEW 1: INTERACTIVE SVG FLOOR PLAN MAP -->
    <div v-if="viewMode === 'map'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- SVG Canvas Interactive Floor Plan (8 Cols) -->
      <div class="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
        <!-- Floorplan Header Title -->
        <div class="flex items-center justify-between z-10 text-white border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span class="font-bold text-xs tracking-wider uppercase text-slate-300">PETA ARENA LAPANGAN (LIVE LAYOUT)</span>
          </div>
          <span class="text-[11px] text-slate-400 italic">Klik pin/area untuk detail panitia</span>
        </div>

        <!-- SVG Map Blueprint Container -->
        <div class="relative my-4 w-full h-[360px] bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <!-- SVG Background Blueprint -->
          <svg class="w-full h-full absolute inset-0 select-none" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            <!-- Grid Lines -->
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#grid)" />

            <!-- ZONE A: Lapangan Lomba -->
            <g
              @click="selectZone('A')"
              class="cursor-pointer transition-all duration-300 hover:opacity-90"
            >
              <rect
                x="30" y="40" width="460" height="380" rx="16"
                fill="rgba(16, 185, 129, 0.12)"
                stroke="rgba(16, 185, 129, 0.4)"
                stroke-width="2"
                stroke-dasharray="6,4"
              />
              <text x="45" y="68" fill="#34d399" font-size="13" font-weight="bold" font-family="sans-serif">
                ZONE A: LAPANGAN LOMBA
              </text>
              <text x="45" y="88" fill="#a7f3d0" font-size="10" font-family="sans-serif">
                (Area Utama Pertandingan Lomba Kemerdekaan)
              </text>
            </g>

            <!-- ZONE B: Panggung Panitia & Utama -->
            <g
              @click="selectZone('B')"
              class="cursor-pointer transition-all duration-300 hover:opacity-90"
            >
              <rect
                x="520" y="40" width="250" height="180" rx="16"
                fill="rgba(239, 68, 68, 0.12)"
                stroke="rgba(239, 68, 68, 0.4)"
                stroke-width="2"
              />
              <text x="535" y="68" fill="#f87171" font-size="12" font-weight="bold" font-family="sans-serif">
                ZONE B: PANGGUNG PANITIA
              </text>
              <text x="535" y="88" fill="#fca5a5" font-size="10" font-family="sans-serif">
                (Panggung Utama & Podium Juri)
              </text>
            </g>

            <!-- ZONE C: Area Registrasi & Informasi -->
            <g
              @click="selectZone('C')"
              class="cursor-pointer transition-all duration-300 hover:opacity-90"
            >
              <rect
                x="520" y="240" width="250" height="180" rx="16"
                fill="rgba(59, 130, 246, 0.12)"
                stroke="rgba(59, 130, 246, 0.4)"
                stroke-width="2"
              />
              <text x="535" y="268" fill="#60a5fa" font-size="12" font-weight="bold" font-family="sans-serif">
                ZONE C: AREA REGISTRASI
              </text>
              <text x="535" y="288" fill="#93c5fd" font-size="10" font-family="sans-serif">
                (Meja Pendaftaran & Informasi)
              </text>
            </g>

            <!-- Walking Paths / Connectors -->
            <path d="M 490 230 L 520 230" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4" />
            <path d="M 645 220 L 645 240" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4" />
          </svg>

          <!-- DYNAMIC HOTSPOT PIN MARKERS FOR COMPETITIONS -->
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
                comp.status === 'Upcoming' ? 'bg-slate-800 text-slate-100 border-slate-600' :
                'bg-slate-700 text-slate-300 border-slate-600 opacity-80'
              ]"
            >
              <!-- Indicator Status Dot -->
              <span
                class="w-2 h-2 rounded-full"
                :class="[
                  comp.status === 'Ongoing' ? 'bg-emerald-400 animate-ping' :
                  comp.status === 'Upcoming' ? 'bg-blue-400' : 'bg-slate-400'
                ]"
              ></span>

              <span class="font-mono text-[11px]">[{{ comp.prefix }}]</span>
              <span class="hidden sm:inline max-w-[90px] truncate text-[11px]">{{ comp.name }}</span>

              <!-- Pin Tooltip on Hover -->
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-lg border border-slate-700 shadow-xl whitespace-nowrap z-40 pointer-events-none">
                <p class="font-extrabold text-amber-300">{{ comp.name }}</p>
                <p class="text-slate-300">📍 {{ comp.location }}</p>
                <p class="text-emerald-400 font-bold">🎮 {{ getPlayingCount(comp.id) }} Sedang Main</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend Footer -->
        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3 z-10">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Zone A (Lapangan Lomba)
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span> Zone B (Panggung Panitia)
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Zone C (Area Registrasi)
            </span>
          </div>
          <span class="text-slate-500">Klik pin lomba untuk petunjuk jalan panitia</span>
        </div>
      </div>

      <!-- Detail Info Panel for Selected Competition / Zone (4 Cols) -->
      <div class="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
        <div v-if="selectedComp" class="space-y-4">
          <!-- Competition Header -->
          <div class="border-b border-slate-200 pb-3">
            <div class="flex items-center justify-between gap-2">
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
            <h3 class="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <span>[{{ selectedComp.prefix }}]</span>
              <span>{{ selectedComp.name }}</span>
            </h3>
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

            <div v-if="getArenaParticipants(selectedComp.id).length > 0" class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
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

        <!-- Placeholder when no competition selected -->
        <div v-else class="text-center py-12 space-y-3 my-auto">
          <div class="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-xl">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div>
            <h4 class="font-extrabold text-xs text-slate-800">Pilih Pin Lomba Di Denah</h4>
            <p class="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
              Klik salah satu titik arena lomba di peta untuk melihat petunjuk jalan panitia dan daftar peserta bertanding.
            </p>
          </div>
        </div>

        <!-- Direct Navigation Buttons -->
        <div v-if="selectedComp" class="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
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

    <!-- MAIN VIEW 2: GRID OF ZONE CARDS -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <span
              class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border"
              :class="[
                comp.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                comp.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                'bg-slate-200 text-slate-700 border-slate-300'
              ]"
            >
              {{ comp.status }}
            </span>
          </div>

          <h3 class="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <span>[{{ comp.prefix }}]</span>
            <span>{{ comp.name }}</span>
          </h3>

          <p class="text-xs text-slate-600 mt-2 flex items-center gap-1.5 font-bold">
            <i class="bi bi-geo-alt-fill text-red-600"></i>
            <span>{{ comp.location }}</span>
          </p>

          <p class="text-[11px] text-slate-500 mt-1 bg-white p-2 rounded-lg border border-slate-200">
            {{ getPanitiaRoutingInstruction(comp) }}
          </p>
        </div>

        <div class="border-t border-slate-200 pt-3 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs">
            <span class="font-extrabold text-emerald-700">🎮 {{ getPlayingCount(comp.id) }} Main</span>
            <span class="text-slate-300">|</span>
            <span class="font-bold text-slate-500">{{ getWaitingCount(comp.id) }} Menunggu</span>
          </div>

          <button
            @click="openLocationEditModal(comp)"
            class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors"
          >
            Ubah Lokasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import type { Competition } from '../types';
import Swal from 'sweetalert2';

const store = useArenaStore();

const viewMode = ref<'map' | 'grid'>('map');
const searchQuery = ref('');
const selectedZoneFilter = ref('ALL');
const selectedCompId = ref<string>('');

const selectedComp = computed(() => {
  if (!selectedCompId.value && store.competitions.length > 0) {
    return store.competitions[0];
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

function selectCompetition(comp: Competition) {
  selectedCompId.value = comp.id;
}

function selectZone(zoneKey: string) {
  selectedZoneFilter.value = zoneKey;
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

  // Zone B: Panggung Panitia (X: 62-82%, Y: 18-38%)
  if (loc.includes('panggung') || loc.includes('panitia') || loc.includes('stage') || loc.includes('tribun')) {
    return { left: `${66 + seed * 5}%`, top: `${22 + seed * 6}%` };
  }

  // Zone C: Area Registrasi (X: 62-82%, Y: 58-78%)
  if (loc.includes('registrasi') || loc.includes('meja') || loc.includes('informasi')) {
    return { left: `${66 + seed * 5}%`, top: `${66 + seed * 6}%` };
  }

  // Zone A: Lapangan Lomba (Default) (X: 12-48%, Y: 18-78%)
  return { left: `${16 + (seed * 8)}%`, top: `${24 + (seed * 12)}%` };
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
    text: `Pilih atau ketik lokasi arena baru untuk ${comp.name}:`,
    input: 'select',
    inputOptions: {
      'Lapangan Lomba - Area Utama A1': 'Lapangan Lomba - Area Utama A1',
      'Lapangan Lomba - Area Utama A2': 'Lapangan Lomba - Area Utama A2',
      'Lapangan Lomba - Area Utama A3': 'Lapangan Lomba - Area Utama A3',
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
        text: `Lokasi ${comp.name} telah diubah menjadi: ${result.value}`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}
</script>
