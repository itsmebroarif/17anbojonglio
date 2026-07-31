<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-4 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-mono font-black text-sm shadow-sm">
            SQL
          </div>
          <div>
            <h3 class="font-extrabold text-sm flex items-center gap-2 text-slate-900">
              <span>Console Query SQL & Keyword Search</span>
              <span class="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono border border-red-200 font-bold">v2.0 Light Engine</span>
            </h3>
            <p class="text-[11px] text-slate-500">
              Query data peserta, lomba, panitia, & registrasi menggunakan SQL atau Keyword shorthand
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Quick Preset Chips -->
      <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
        <span class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
          <i class="bi bi-lightning-charge-fill text-amber-500"></i> Preset SQL:
        </span>
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="applyPreset(preset.query)"
          class="px-2.5 py-1 rounded-lg bg-white hover:bg-red-600 text-slate-700 hover:text-white text-[11px] font-mono font-bold transition-all border border-slate-200 hover:border-red-600 shadow-2xs flex items-center gap-1 whitespace-nowrap"
        >
          <span>{{ preset.icon }}</span>
          <span>{{ preset.label }}</span>
        </button>
      </div>

      <!-- Query Input Editor -->
      <div class="p-4 bg-slate-50/80 border-b border-slate-200 relative">
        <div class="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-mono">
          <span class="flex items-center gap-1 font-bold text-slate-800">
            <i class="bi bi-terminal-fill text-red-600"></i>
            <span>SQL Query Terminal:</span>
          </span>
          <span class="text-[10px] text-slate-500 font-sans">Contoh: SELECT * FROM peserta WHERE umur >= 17 OR nama LIKE '%budi%'</span>
        </div>
        <div class="relative flex items-center">
          <textarea
            v-model="rawQuery"
            rows="2"
            placeholder="Tulis query SQL (SELECT * FROM peserta WHERE...) atau Keyword (e.g. umur > 15, gender:L, lomba:kerupuk)..."
            class="w-full bg-white border border-slate-300 focus:border-red-500 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-100 transition-all resize-none shadow-inner"
            @keydown.ctrl.enter="executeQuery"
          ></textarea>
          <button
            @click="executeQuery"
            class="absolute right-3 bottom-3 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center gap-1 font-mono hover:scale-105"
          >
            <i class="bi bi-play-fill text-sm"></i>
            <span>RUN (Ctrl+Enter)</span>
          </button>
        </div>
      </div>

      <!-- Output Results Section -->
      <div class="flex-1 overflow-y-auto p-4 bg-slate-100/50 min-h-[220px]">
        <!-- Query Meta info bar -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-slate-800 flex items-center gap-1">
              <i class="bi bi-table text-red-600"></i>
              <span>Hasil Query: {{ queryResults.length }} Data Ditemukan</span>
            </span>
            <span v-if="executionTimeMs >= 0" class="text-[10px] font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md font-bold">
              {{ executionTimeMs }}ms
            </span>
          </div>

          <!-- Action buttons -->
          <div v-if="queryResults.length > 0" class="flex items-center gap-2">
            <button
              @click="copyResultsCsv"
              class="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1 transition-colors"
              title="Salin sebagai CSV"
            >
              <i class="bi bi-file-earmark-spreadsheet text-emerald-600"></i>
              <span>Copy CSV</span>
            </button>
            <button
              @click="copyResultsJson"
              class="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1 transition-colors"
              title="Salin JSON"
            >
              <i class="bi bi-filetype-json text-blue-600"></i>
              <span>JSON</span>
            </button>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="queryError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-mono mb-3 flex items-start gap-2">
          <i class="bi bi-exclamation-triangle-fill text-red-600 text-sm mt-0.5"></i>
          <div>
            <strong>Syntax Error:</strong> {{ queryError }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="queryResults.length === 0 && !queryError" class="text-center py-12 text-slate-400">
          <i class="bi bi-terminal text-4xl block mb-2 opacity-40"></i>
          <p class="text-xs font-medium">Jalankan query SQL atau keyword filter untuk menampilkan data.</p>
        </div>

        <!-- Data Table -->
        <div v-else-if="queryResults.length > 0" class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                <th class="p-2.5 text-center w-10">#</th>
                <th v-for="col in resultColumns" :key="col" class="p-2.5 font-mono">
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-800 font-sans">
              <tr
                v-for="(row, idx) in queryResults"
                :key="idx"
                class="hover:bg-red-50/50 transition-colors"
              >
                <td class="p-2.5 text-center font-mono text-slate-400 text-[11px] font-bold">
                  {{ idx + 1 }}
                </td>
                <td v-for="col in resultColumns" :key="col" class="p-2.5 max-w-xs truncate font-mono text-[11px]">
                  <span v-if="typeof row[col] === 'boolean'" class="px-1.5 py-0.5 rounded text-[10px] font-bold" :class="row[col] ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'">
                    {{ row[col] }}
                  </span>
                  <span v-else-if="col.toLowerCase().includes('status')" class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {{ row[col] }}
                  </span>
                  <span v-else>
                    {{ row[col] ?? '-' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer Help Bar -->
      <div class="p-3 bg-white border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="bi bi-info-circle-fill text-blue-600"></i>
          <span>Support tabel: <code class="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">peserta</code>, <code class="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">lomba</code>, <code class="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">panitia</code>, <code class="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">registrasi</code></span>
        </div>
        <button
          @click="resetQuery"
          class="text-xs text-slate-600 hover:text-red-600 font-bold hover:underline"
        >
          Reset Query
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useArenaStore } from '../stores/arenaStore';

const props = defineProps<{ isOpen: boolean }>();
defineEmits(['close']);

const store = useArenaStore();

const rawQuery = ref('SELECT * FROM peserta WHERE umur >= 17');
const queryError = ref('');
const executionTimeMs = ref(-1);
const queryResults = ref<any[]>([]);
const resultColumns = ref<string[]>([]);

const presets = [
  { label: 'Peserta >= 17 Thn', query: 'SELECT * FROM peserta WHERE umur >= 17', icon: '👤' },
  { label: 'Lomba Ongoing', query: 'SELECT * FROM lomba WHERE status = "Ongoing"', icon: '🚩' },
  { label: 'Panitia Juri', query: 'SELECT * FROM panitia WHERE peran LIKE "%Juri%"', icon: '🆔' },
  { label: 'Peserta Bertanding', query: 'SELECT * FROM registrasi WHERE status = "Playing"', icon: '⚽' },
  { label: 'Pemenang Lomba', query: 'SELECT * FROM pemenang', icon: '🏆' }
];

watch(() => props.isOpen, (open) => {
  if (open) {
    executeQuery();
  }
});

function applyPreset(q: string) {
  rawQuery.value = q;
  executeQuery();
}

function resetQuery() {
  rawQuery.value = 'SELECT * FROM peserta';
  executeQuery();
}

function executeQuery() {
  queryError.value = '';
  const startTime = performance.now();
  const input = rawQuery.value.trim();

  if (!input) {
    queryResults.value = [];
    resultColumns.value = [];
    executionTimeMs.value = 0;
    return;
  }

  try {
    let datasetName = 'peserta';
    let rawTableData: any[] = [];

    // Table Mapping
    const lower = input.toLowerCase();
    if (lower.includes('from lomba') || lower.includes('from competition') || lower.includes('lomba:')) {
      datasetName = 'lomba';
      rawTableData = store.competitions.map(c => ({
        id: c.id,
        prefix: c.prefix,
        nama: c.name,
        kategori: c.category,
        lokasi: c.location,
        tanggal: c.date,
        waktu: c.time,
        status: c.status
      }));
    } else if (lower.includes('from panitia') || lower.includes('from committee') || lower.includes('panitia:')) {
      datasetName = 'panitia';
      rawTableData = store.committees.map(p => ({
        idCardNumber: p.idCardNumber,
        nama: p.name,
        peran: p.role,
        seksi: p.section,
        rtRw: p.rtRw || '-',
        phone: p.phone
      }));
    } else if (lower.includes('from registrasi') || lower.includes('from registration') || lower.includes('status:')) {
      datasetName = 'registrasi';
      rawTableData = store.registrations.map(r => {
        const p = store.getParticipantById(r.participantId);
        const c = store.getCompetitionById(r.competitionId);
        return {
          nomorPeserta: r.participantNumber,
          namaPeserta: p?.name || '-',
          namaLomba: c?.name || '-',
          status: r.status,
          waktuDaftar: new Date(r.registeredAt).toLocaleTimeString('id-ID')
        };
      });
    } else if (lower.includes('from pemenang') || lower.includes('from winner')) {
      datasetName = 'pemenang';
      rawTableData = store.winners.map(w => {
        const c = store.getCompetitionById(w.competitionId);
        const p1 = w.firstPlaceId ? store.getParticipantById(w.firstPlaceId)?.name : '-';
        const p2 = w.secondPlaceId ? store.getParticipantById(w.secondPlaceId)?.name : '-';
        const p3 = w.thirdPlaceId ? store.getParticipantById(w.thirdPlaceId)?.name : '-';
        return {
          lomba: c?.name || w.competitionId,
          juara1: p1,
          juara2: p2,
          juara3: p3
        };
      });
    } else {
      // Default: Peserta
      datasetName = 'peserta';
      rawTableData = store.participants.map(p => ({
        id: p.id,
        nama: p.name,
        umur: p.age,
        gender: p.gender,
        whatsapp: p.whatsapp,
        email: p.email || '-',
        alamat: p.address || '-'
      }));
    }

    // Process WHERE conditions or Shorthand filtering
    let filtered = [...rawTableData];

    // If query contains WHERE or operators
    if (lower.includes('where')) {
      const wherePart = input.substring(lower.indexOf('where') + 5).trim();
      filtered = filterByWhereClause(filtered, wherePart);
    } else if (input.includes('>') || input.includes('<') || input.includes('=') || input.includes(':')) {
      filtered = filterByWhereClause(filtered, input);
    } else if (!lower.startsWith('select')) {
      // Plain text search across fields
      const q = input.toLowerCase();
      filtered = filtered.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(q))
      );
    }

    queryResults.value = filtered;
    if (filtered.length > 0) {
      resultColumns.value = Object.keys(filtered[0]);
    } else if (rawTableData.length > 0) {
      resultColumns.value = Object.keys(rawTableData[0]);
    } else {
      resultColumns.value = [];
    }

  } catch (err: any) {
    queryError.value = err.message || 'Gagal memproses query SQL.';
    queryResults.value = [];
    resultColumns.value = [];
  } finally {
    executionTimeMs.value = Math.round((performance.now() - startTime) * 10) / 10;
  }
}

function filterByWhereClause(data: any[], whereStr: string): any[] {
  // Parse conditions joined by AND / OR / comma
  const conditions = whereStr.split(/\s+and\s+|\s+or\s+|,/i);

  return data.filter(item => {
    return conditions.every(cond => {
      const trimmed = cond.trim();
      if (!trimmed) return true;

      // Check operators: >=, <=, >, <, =, LIKE, :
      if (trimmed.includes('>=')) {
        const [key, val] = trimmed.split('>=');
        return getFieldVal(item, key) >= Number(val.trim().replace(/['"]/g, ''));
      } else if (trimmed.includes('<=')) {
        const [key, val] = trimmed.split('<=');
        return getFieldVal(item, key) <= Number(val.trim().replace(/['"]/g, ''));
      } else if (trimmed.includes('>')) {
        const [key, val] = trimmed.split('>');
        return getFieldVal(item, key) > Number(val.trim().replace(/['"]/g, ''));
      } else if (trimmed.includes('<')) {
        const [key, val] = trimmed.split('<');
        return getFieldVal(item, key) < Number(val.trim().replace(/['"]/g, ''));
      } else if (trimmed.toLowerCase().includes('like')) {
        const parts = trimmed.split(/like/i);
        const key = parts[0].trim();
        const pattern = parts[1].trim().replace(/['"%]/g, '').toLowerCase();
        return String(getFieldVal(item, key)).toLowerCase().includes(pattern);
      } else if (trimmed.includes('=')) {
        const [key, val] = trimmed.split('=');
        const targetVal = val.trim().replace(/['"]/g, '').toLowerCase();
        return String(getFieldVal(item, key)).toLowerCase() === targetVal;
      } else if (trimmed.includes(':')) {
        const [key, val] = trimmed.split(':');
        const targetVal = val.trim().replace(/['"]/g, '').toLowerCase();
        return String(getFieldVal(item, key)).toLowerCase().includes(targetVal);
      } else {
        // Plain word match
        const target = trimmed.toLowerCase();
        return Object.values(item).some(v => String(v).toLowerCase().includes(target));
      }
    });
  });
}

function getFieldVal(item: any, key: string): any {
  const cleanKey = key.trim().toLowerCase();
  for (const k of Object.keys(item)) {
    if (k.toLowerCase() === cleanKey) return item[k];
  }
  return '';
}

function copyResultsCsv() {
  if (queryResults.value.length === 0) return;
  const cols = resultColumns.value;
  const header = cols.join(',');
  const rows = queryResults.value.map(row => cols.map(c => `"${row[c] ?? ''}"`).join(','));
  const csvStr = [header, ...rows].join('\n');
  navigator.clipboard.writeText(csvStr);
  alert('Hasil query berhasil disalin ke clipboard sebagai CSV!');
}

function copyResultsJson() {
  if (queryResults.value.length === 0) return;
  navigator.clipboard.writeText(JSON.stringify(queryResults.value, null, 2));
  alert('Hasil query berhasil disalin sebagai JSON!');
}
</script>
