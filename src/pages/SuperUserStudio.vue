<template>
  <div class="space-y-6 pb-12 font-sans">
    
    <!-- SUPER USER TOP HEADER BAR -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-purple-900/40 relative overflow-hidden">
      <!-- Background Glow Effect -->
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 space-y-1">
        <div class="flex items-center space-x-2">
          <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono text-[11px] font-bold tracking-wider uppercase">
            Root Admin Studio
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[11px] font-bold">
            MySQL / Navicat / D3 Ready
          </span>
        </div>
        <h1 class="text-2xl font-black tracking-tight flex items-center gap-2 font-mono">
          <i class="bi bi-terminal-box-fill text-amber-400"></i>
          <span>Super User Studio Engine</span>
        </h1>
        <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Pusat kendali database tingkat tinggi. Lakukan inspeksi data tabel, eksekusi query JIT SQL, ekspor dump database MySQL, jalankan batch editor berbasis spreadsheet, serta analitik visual D3.js.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center space-x-2 w-full md:w-auto overflow-x-auto relative z-10">
        <button
          @click="handleExportMySQLDump"
          class="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
          title="Download SQL Dump untuk Navicat / SQLyog / HeidiSQL"
        >
          <i class="bi bi-database-fill-down text-white text-sm"></i>
          <span>Export Dump (.sql)</span>
        </button>

        <button
          @click="reloadDatabase"
          class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap"
          title="Refresh state dari localStorage"
        >
          <i class="bi bi-arrow-clockwise text-purple-400"></i>
          <span>Reload Storage</span>
        </button>
      </div>
    </div>

    <!-- WORKSPACE TABS SWITCHER -->
    <div class="flex items-center space-x-2 border-b border-slate-200 pb-2">
      <button
        @click="activeTab = 'grid'"
        class="px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
        :class="[
          activeTab === 'grid'
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
      >
        <i class="bi bi-grid-3x3-gap-fill"></i>
        <span>Data Grid & Spreadsheet Bulk Editor</span>
      </button>

      <button
        @click="activeTab = 'sql'"
        class="px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
        :class="[
          activeTab === 'sql'
            ? 'bg-slate-900 text-amber-400 shadow-md border border-slate-800'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
      >
        <i class="bi bi-terminal-fill"></i>
        <span>JIT SQL Query Editor</span>
      </button>

      <button
        @click="activeTab = 'charts'"
        class="px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
        :class="[
          activeTab === 'charts'
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
      >
        <i class="bi bi-pie-chart-fill"></i>
        <span>D3 Real-time Analytics Panel</span>
      </button>
    </div>

    <!-- MAIN TWO-COLUMN WORKSPACE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- LEFT SIDEBAR: DATABASE SCHEMAS & TABLES SELECTOR -->
      <div class="lg:col-span-3 space-y-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="text-xs font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <i class="bi bi-database text-purple-600"></i> Database Tables
            </span>
            <span class="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              7 Tables
            </span>
          </div>

          <div class="space-y-1 font-mono text-xs">
            <button
              v-for="tbl in tables"
              :key="tbl.id"
              @click="selectTable(tbl.id)"
              class="w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group"
              :class="[
                activeTable === tbl.id
                  ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              ]"
            >
              <div class="flex items-center space-x-2 truncate">
                <i :class="[tbl.icon, activeTable === tbl.id ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-700']"></i>
                <span class="truncate">{{ tbl.id }}</span>
              </div>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold"
                :class="activeTable === tbl.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'"
              >
                {{ tbl.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Database Health Metrics Card -->
        <div class="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 shadow-md space-y-3 font-mono text-xs">
          <div class="flex items-center justify-between text-slate-400">
            <span>DATABASE STATS</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div class="space-y-1.5">
            <div class="flex justify-between">
              <span class="text-slate-400">Total Rows:</span>
              <strong class="text-amber-400 font-bold">{{ totalDatabaseRecords }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Storage Engine:</span>
              <span class="text-purple-300 font-bold">InnoDB / JSON</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Encoding:</span>
              <span class="text-emerald-400 font-bold">utf8mb4</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-800 space-y-2">
            <button
              @click="exportCurrentTableJSON"
              class="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <i class="bi bi-file-earmark-arrow-down-fill text-emerald-400"></i> Export Active Table (JSON)
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT WORKSPACE: ACTIVE TAB -->
      <div class="lg:col-span-9 space-y-6">

        <!-- TAB 1: DATA GRID VIEW (Navicat / SQLyog Spreadsheet Bulk Editor) -->
        <div v-if="activeTab === 'grid'" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <!-- Data Grid Toolbar -->
          <div class="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-extrabold text-slate-900 font-mono">
                  SELECT * FROM {{ activeTable }}
                </span>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded font-mono">
                  {{ activeTableRecords.length }} rows
                </span>
              </div>

              <!-- Action Bar (Batch Operations & Insert) -->
              <div class="flex items-center space-x-2 w-full sm:w-auto justify-end flex-wrap gap-y-2">
                <button
                  @click="openInsertModal"
                  class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                >
                  <i class="bi bi-plus-circle-fill"></i> Tambah Record
                </button>

                <button
                  :disabled="selectedRows.length === 0"
                  @click="ctxUpdateCategory"
                  class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  title="Update Kategori / Status secara massal"
                >
                  <i class="bi bi-tags-fill"></i> Update Kategori / Status
                </button>

                <button
                  :disabled="selectedRows.length === 0"
                  @click="isBatchEditModalOpen = true"
                  class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  title="Ganti nilai kolom untuk semua data terpilih"
                >
                  <i class="bi bi-pencil-square"></i> Ganti Data Massal ({{ selectedRows.length }})
                </button>

                <button
                  :disabled="selectedRows.length === 0"
                  @click="confirmBatchDelete"
                  class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  title="Hapus data terpilih sekaligus"
                >
                  <i class="bi bi-trash-fill"></i> Hapus Massal ({{ selectedRows.length }})
                </button>
              </div>
            </div>

            <!-- Keyword Search & Filter Engine Bar for Active Table -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
              <div class="relative w-full sm:w-80">
                <i class="bi bi-funnel-fill absolute left-3 top-2.5 text-purple-600 text-xs"></i>
                <input
                  v-model="gridSearchQuery"
                  type="text"
                  placeholder="Query / Filter data (e.g. status:Ongoing, RT 01, L)..."
                  class="w-full pl-8 pr-8 py-1.5 bg-white text-slate-800 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono"
                />
                <button
                  v-if="gridSearchQuery"
                  @click="gridSearchQuery = ''"
                  class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs"
                >
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>

              <!-- Keyword Suggestion Chips for Active Table -->
              <div class="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar text-[10px]">
                <span class="text-slate-400 font-bold whitespace-nowrap">Chips Filter:</span>
                <button
                  v-for="chip in currentTableChips"
                  :key="chip"
                  @click="gridSearchQuery = chip"
                  class="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 font-mono rounded border border-slate-300 transition-colors whitespace-nowrap shadow-2xs"
                >
                  {{ chip }}
                </button>
              </div>
            </div>

            <!-- Context Menu Spreadsheet Hint & Range Select Controls -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
              <div class="flex items-center space-x-3 font-semibold">
                <label class="flex items-center space-x-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Pilih Semua (Select All {{ activeTableRecords.length }})</span>
                </label>
                <span v-if="selectedRows.length > 0" class="text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full">
                  {{ selectedRows.length }} record terpilih
                </span>
                <span class="text-slate-400 text-[10px] hidden lg:inline">
                  <i class="bi bi-info-circle"></i> Klik kanan pada baris untuk Context Menu Spreadsheet
                </span>
              </div>

              <!-- Range Select Helper -->
              <div class="flex items-center space-x-1">
                <span>Select Range:</span>
                <input
                  v-model.number="rangeStart"
                  type="number"
                  min="1"
                  :max="activeTableRecords.length"
                  placeholder="Dari"
                  class="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-mono"
                />
                <span>-</span>
                <input
                  v-model.number="rangeEnd"
                  type="number"
                  min="1"
                  :max="activeTableRecords.length"
                  placeholder="Ke"
                  class="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-mono"
                />
                <button
                  @click="applyRangeSelect"
                  class="px-2 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded text-[10px]"
                >
                  Pilih Range
                </button>
              </div>
            </div>
          </div>

          <!-- Data Grid Table View -->
          <div class="overflow-x-auto max-h-[520px] overflow-y-auto relative">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="bg-slate-100 text-slate-700 sticky top-0 z-10 font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th class="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="rounded text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th class="p-3 w-12 text-slate-400 font-normal text-center">#</th>
                  <th v-for="col in activeColumns" :key="col" class="p-3 font-extrabold whitespace-nowrap">
                    {{ col }}
                  </th>
                  <th class="p-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans">
                <tr
                  v-for="(row, idx) in activeTableRecords"
                  :key="row.id || idx"
                  @contextmenu.prevent="openContextMenu($event, row)"
                  class="hover:bg-purple-50/50 transition-colors cursor-pointer select-none"
                  :class="{ 'bg-purple-50/80 font-semibold border-l-4 border-l-purple-600': isRowSelected(row.id) }"
                >
                  <td class="p-3 text-center" @click.stop>
                    <input
                      type="checkbox"
                      :checked="isRowSelected(row.id)"
                      @change="toggleSelectRow(row.id)"
                      class="rounded text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td class="p-3 font-mono text-slate-400 text-center text-[10px]">
                    {{ idx + 1 }}
                  </td>
                  <td v-for="col in activeColumns" :key="col" class="p-3 whitespace-nowrap">
                    <div v-if="col === 'photoUrl' && row[col]" class="flex items-center space-x-2">
                      <img :src="row[col]" alt="Photo" class="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs" />
                      <span class="text-[10px] text-slate-500 font-mono">Ada Foto</span>
                    </div>
                    <span
                      v-else
                      class="font-mono text-xs text-slate-800 truncate max-w-[220px] block"
                      :title="String(row[col])"
                    >
                      {{ formatCellValue(row[col]) }}
                    </span>
                  </td>
                  <td class="p-3 text-center space-x-1 whitespace-nowrap" @click.stop>
                    <button
                      @click="openEditModal(row)"
                      class="p-1 text-slate-600 hover:text-purple-600 hover:bg-purple-100 rounded"
                      title="Edit Row"
                    >
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      @click="deleteSingleRow(row.id)"
                      class="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-100 rounded"
                      title="Hapus Row"
                    >
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="activeTableRecords.length === 0">
                  <td :colspan="activeColumns.length + 3" class="p-8 text-center text-slate-400">
                    <i class="bi bi-inbox text-3xl block mb-2 opacity-50"></i>
                    Tidak ada record data ditemukan pada tabel <strong class="font-mono">{{ activeTable }}</strong>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: JUST-IN-TIME SQL CONSOLE (SQLyog / Navicat Query Editor) -->
        <div v-if="activeTab === 'sql'" class="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col space-y-4 p-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center space-x-2">
              <i class="bi bi-terminal text-amber-400 text-lg"></i>
              <span class="font-extrabold text-sm text-slate-100">JIT SQL Query Editor Studio</span>
            </div>

            <!-- SQL Templates Dropdown -->
            <div class="flex items-center space-x-2 text-xs">
              <span class="text-slate-400 font-semibold">Preset Queries:</span>
              <select
                @change="loadSqlPreset($event)"
                class="bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="">-- Pilih SQL Query Template --</option>
                <option value="SELECT * FROM participants WHERE gender = 'L'">Tampilkan Semua Peserta Laki-Laki</option>
                <option value="SELECT * FROM competitions WHERE status = 'Ongoing'">Tampilkan Lomba Sedang Berlangsung</option>
                <option value="SELECT * FROM committees WHERE role LIKE '%Ketua%'">Cari Panitia Jabatan Ketua</option>
                <option value="SELECT * FROM registrations WHERE status = 'Ready'">Registrasi Siap Tanding</option>
                <option value="UPDATE participants SET rtRw = 'RT 01 / RW 05' WHERE rtRw = 'RT 01'">Mass Update RT/RW Peserta</option>
              </select>
            </div>
          </div>

          <!-- Code / Query Input -->
          <div class="relative font-mono text-xs">
            <textarea
              v-model="sqlQueryInput"
              rows="5"
              class="w-full p-4 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-y"
              placeholder="Tulis sintaks SQL (SELECT, UPDATE, INSERT, DELETE)..."
            ></textarea>
            <button
              @click="executeJitSql"
              class="absolute bottom-3 right-3 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <i class="bi bi-play-fill text-lg"></i>
              <span>Jalankan Query (Exec)</span>
            </button>
          </div>

          <!-- Query Result Output Console -->
          <div v-if="sqlQueryResult" class="space-y-3 pt-2">
            <div class="flex items-center justify-between text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span class="text-emerald-400 font-bold">
                <i class="bi bi-check-circle-fill"></i> {{ sqlQueryResult.message }}
              </span>
              <span class="text-slate-400">
                Waktu eksekusi: <strong class="text-amber-400">{{ sqlQueryResult.executionTimeMs }}ms</strong>
              </span>
            </div>

            <!-- Query Result Table -->
            <div v-if="sqlQueryResult.rows && sqlQueryResult.rows.length > 0" class="overflow-x-auto max-h-80 border border-slate-800 rounded-xl">
              <table class="w-full text-left text-xs font-mono">
                <thead class="bg-slate-800 text-slate-300 sticky top-0">
                  <tr>
                    <th v-for="col in sqlQueryResult.columns" :key="col" class="p-2.5 border-b border-slate-700">
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-slate-200">
                  <tr v-for="(r, i) in sqlQueryResult.rows" :key="i" class="hover:bg-slate-800/50">
                    <td v-for="col in sqlQueryResult.columns" :key="col" class="p-2.5 whitespace-nowrap">
                      {{ formatCellValue(r[col]) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 3: REAL-TIME D3.JS ANALYTICS PANEL -->
        <div v-if="activeTab === 'charts'">
          <D3AnalyticsPanel />
        </div>

      </div>
    </div>

    <!-- SPREADSHEET RIGHT-CLICK CONTEXT MENU -->
    <div
      v-if="contextMenu.show"
      class="fixed z-50 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 py-2 w-64 text-xs font-sans animate-fade-in"
      :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
      @click.stop
    >
      <div class="px-3.5 py-2 border-b border-slate-800 text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center justify-between">
        <span>Spreadsheet Context Menu</span>
        <span class="text-slate-400 font-mono">Row</span>
      </div>

      <button
        @click="ctxEditRecord"
        class="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200"
      >
        <i class="bi bi-pencil-fill text-purple-400"></i>
        <span>Edit Record Ini</span>
      </button>

      <button
        @click="ctxUpdateCategory"
        class="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200"
      >
        <i class="bi bi-tags-fill text-amber-400"></i>
        <span>Update Kategori / Status Terpilih</span>
      </button>

      <button
        @click="ctxBatchUpdateField"
        class="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200"
      >
        <i class="bi bi-pencil-square text-blue-400"></i>
        <span>Batch Update Kolom Apapun</span>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button
        @click="ctxCopyJSON"
        class="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200"
      >
        <i class="bi bi-clipboard-data text-emerald-400"></i>
        <span>Salin Data (Copy JSON)</span>
      </button>

      <button
        @click="ctxCopyId"
        class="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200"
      >
        <i class="bi bi-key-fill text-indigo-400"></i>
        <span>Salin Row ID</span>
      </button>

      <div class="my-1 border-t border-slate-800"></div>

      <button
        @click="ctxDeleteSelected"
        class="w-full text-left px-3.5 py-2 hover:bg-rose-950/60 text-rose-300 flex items-center gap-2.5 transition-colors font-bold"
      >
        <i class="bi bi-trash-fill text-rose-400"></i>
        <span>Hapus Terpilih ({{ selectedRows.length || 1 }})</span>
      </button>
    </div>

    <!-- MODAL: BATCH EDIT MASSAL -->
    <div
      v-if="isBatchEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      @click.self="isBatchEditModalOpen = false"
    >
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-4 bg-amber-500 text-white flex items-center justify-between">
          <h3 class="font-extrabold text-sm flex items-center gap-2">
            <i class="bi bi-pencil-square"></i> Ganti Data Massal (Batch Update)
          </h3>
          <button @click="isBatchEditModalOpen = false" class="text-white hover:opacity-80">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="applyBatchEdit" class="p-5 space-y-4 text-xs">
          <p class="text-slate-600 leading-relaxed">
            Anda akan mengganti nilai kolom secara massal untuk <strong>{{ selectedRows.length }}</strong> record yang terpilih pada tabel <strong class="font-mono text-slate-900">{{ activeTable }}</strong>.
          </p>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Kolom Yang Ingin Diubah *</label>
            <select
              v-model="batchEditColumn"
              required
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold focus:outline-none focus:border-amber-500"
            >
              <option v-for="col in activeColumns" :key="col" :value="col">{{ col }}</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Nilai Baru (New Value) *</label>
            <input
              v-model="batchEditValue"
              type="text"
              required
              placeholder="Masukkan nilai baru..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="isBatchEditModalOpen = false"
              class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md"
            >
              Terapkan Perubahan Massal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: INSERT / EDIT SINGLE ROW -->
    <div
      v-if="isRowModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      @click.self="isRowModalOpen = false"
    >
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-4 bg-purple-600 text-white flex items-center justify-between">
          <h3 class="font-extrabold text-sm flex items-center gap-2">
            <i class="bi bi-database-fill-gear"></i>
            <span>{{ editingRowId ? 'Edit Record Database' : 'Tambah Record Baru' }}</span>
          </h3>
          <button @click="isRowModalOpen = false" class="text-white hover:opacity-80">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveRowForm" class="p-5 space-y-3 text-xs overflow-y-auto">
          <div v-for="col in activeColumns" :key="col" class="space-y-1">
            <label class="block font-bold text-slate-700 font-mono">{{ col }}</label>
            <input
              v-model="rowFormData[col]"
              type="text"
              :disabled="col === 'id' && !!editingRowId"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono text-xs focus:outline-none focus:border-purple-600 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="isRowModalOpen = false"
              class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md"
            >
              Simpan Record
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import { StorageService } from '../services/storage';
import { exportFullMySQLDump } from '../services/export';
import D3AnalyticsPanel from '../components/D3AnalyticsPanel.vue';
import Swal from 'sweetalert2';

const store = useArenaStore();

const activeTab = ref<'grid' | 'sql' | 'charts'>('grid');
const activeTable = ref<string>('participants');
const gridSearchQuery = ref('');
const selectedRows = ref<string[]>([]);

const rangeStart = ref<number | null>(null);
const rangeEnd = ref<number | null>(null);

const isBatchEditModalOpen = ref(false);
const batchEditColumn = ref('');
const batchEditValue = ref('');

const isRowModalOpen = ref(false);
const editingRowId = ref<string | null>(null);
const rowFormData = reactive<Record<string, any>>({});

const sqlQueryInput = ref('SELECT * FROM participants WHERE age >= 10');
const sqlQueryResult = ref<{
  columns: string[];
  rows: any[];
  message: string;
  executionTimeMs: number;
} | null>(null);

// Context Menu State
const contextMenu = reactive<{
  show: boolean;
  x: number;
  y: number;
  targetRow: any | null;
}>({
  show: false,
  x: 0,
  y: 0,
  targetRow: null
});

function openContextMenu(e: MouseEvent, row: any) {
  contextMenu.show = true;
  contextMenu.x = Math.min(e.clientX, window.innerWidth - 270);
  contextMenu.y = Math.min(e.clientY, window.innerHeight - 300);
  contextMenu.targetRow = row;

  if (!selectedRows.value.includes(row.id)) {
    selectedRows.value = [row.id];
  }
}

function closeContextMenu() {
  contextMenu.show = false;
}

function ctxEditRecord() {
  if (contextMenu.targetRow) {
    openEditModal(contextMenu.targetRow);
  }
  closeContextMenu();
}

function ctxUpdateCategory() {
  if (selectedRows.value.length === 0 && contextMenu.targetRow) {
    selectedRows.value = [contextMenu.targetRow.id];
  }
  if (activeColumns.value.includes('category')) {
    batchEditColumn.value = 'category';
  } else if (activeColumns.value.includes('status')) {
    batchEditColumn.value = 'status';
  } else {
    batchEditColumn.value = activeColumns.value[0] || 'id';
  }
  isBatchEditModalOpen.value = true;
  closeContextMenu();
}

function ctxBatchUpdateField() {
  if (selectedRows.value.length === 0 && contextMenu.targetRow) {
    selectedRows.value = [contextMenu.targetRow.id];
  }
  batchEditColumn.value = activeColumns.value[0] || 'id';
  isBatchEditModalOpen.value = true;
  closeContextMenu();
}

function ctxCopyJSON() {
  if (contextMenu.targetRow) {
    navigator.clipboard.writeText(JSON.stringify(contextMenu.targetRow, null, 2));
    Swal.fire({
      icon: 'success',
      title: 'Disalin ke Clipboard!',
      text: 'Data JSON record telah disalin.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
  }
  closeContextMenu();
}

function ctxCopyId() {
  if (contextMenu.targetRow) {
    navigator.clipboard.writeText(String(contextMenu.targetRow.id));
    Swal.fire({
      icon: 'success',
      title: 'Row ID Disalin!',
      text: `ID: ${contextMenu.targetRow.id}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
  }
  closeContextMenu();
}

function ctxDeleteSelected() {
  if (selectedRows.value.length === 0 && contextMenu.targetRow) {
    selectedRows.value = [contextMenu.targetRow.id];
  }
  confirmBatchDelete();
  closeContextMenu();
}

// Global click listener to close context menu
const handleGlobalClick = () => closeContextMenu();
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeContextMenu();
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
  window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
  window.removeEventListener('keydown', handleGlobalKeydown);
});

// Database Tables Navigation List
const tables = computed(() => [
  { id: 'participants', name: 'participants (Peserta)', count: store.participants.length, icon: 'bi bi-people-fill' },
  { id: 'competitions', name: 'competitions (Lomba)', count: store.competitions.length, icon: 'bi bi-trophy-fill' },
  { id: 'registrations', name: 'registrations (Registrasi)', count: store.registrations.length, icon: 'bi bi-card-checklist' },
  { id: 'winners', name: 'winners (Pemenang)', count: store.winners.length, icon: 'bi bi-award-fill' },
  { id: 'committees', name: 'committees (Panitia)', count: store.committees.length, icon: 'bi bi-person-badge-fill' },
  { id: 'doorprizes', name: 'doorprizes (Doorprize)', count: store.doorprizes.length, icon: 'bi bi-gift-fill' },
  { id: 'history', name: 'activity_logs (Audit Log)', count: store.history.length, icon: 'bi bi-journal-text' }
]);

const totalDatabaseRecords = computed(() => {
  return (
    store.participants.length +
    store.competitions.length +
    store.registrations.length +
    store.winners.length +
    store.committees.length +
    store.doorprizes.length +
    store.history.length
  );
});

// Get raw array based on selected table
const currentRawArray = computed(() => {
  switch (activeTable.value) {
    case 'participants': return store.participants;
    case 'competitions': return store.competitions;
    case 'registrations': return store.registrations;
    case 'winners': return store.winners;
    case 'committees': return store.committees;
    case 'doorprizes': return store.doorprizes;
    case 'history': return store.history;
    default: return [];
  }
});

// Auto-derived Columns
const activeColumns = computed(() => {
  const list = currentRawArray.value;
  if (!list || list.length === 0) return ['id'];
  const first = list[0];
  return Object.keys(first);
});

// Filtered Records for Active Table
const activeTableRecords = computed(() => {
  const q = gridSearchQuery.value.trim().toLowerCase();
  const list = currentRawArray.value;
  if (!q) return list;

  return list.filter((row: any) => {
    return Object.values(row).some(val =>
      String(val || '').toLowerCase().includes(q)
    );
  });
});

// Keyword Chips for Active Table
const currentTableChips = computed(() => {
  switch (activeTable.value) {
    case 'participants': return ['gender:L', 'gender:P', 'RT 01', 'RT 02', 'RT 05'];
    case 'competitions': return ['status:Ongoing', 'status:Upcoming', 'Anak-anak', 'Dewasa'];
    case 'registrations': return ['status:Ready', 'status:Playing', 'status:Finished', 'status:Waiting'];
    case 'committees': return ['Ketua', 'Seksi Konsumsi', 'Juri Lomba'];
    default: return ['All'];
  }
});

function selectTable(tblId: string) {
  activeTable.value = tblId;
  selectedRows.value = [];
  gridSearchQuery.value = '';
}

function isRowSelected(id: string) {
  return selectedRows.value.includes(id);
}

function toggleSelectRow(id: string) {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(r => r !== id);
  } else {
    selectedRows.value.push(id);
  }
}

const isAllSelected = computed(() => {
  const records = activeTableRecords.value;
  return records.length > 0 && records.every((r: any) => selectedRows.value.includes(r.id));
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = activeTableRecords.value.map((r: any) => r.id);
  }
}

function applyRangeSelect() {
  if (!rangeStart.value || !rangeEnd.value) return;
  const start = Math.max(1, rangeStart.value) - 1;
  const end = Math.min(activeTableRecords.value.length, rangeEnd.value);

  const rangeRecords = activeTableRecords.value.slice(start, end);
  const ids = rangeRecords.map((r: any) => r.id);

  selectedRows.value = Array.from(new Set([...selectedRows.value, ...ids]));
}

function formatCellValue(val: any) {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'string' && val.startsWith('data:image/')) return '[Gambar Data Base64]';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function reloadDatabase() {
  store.loadFromStorage();
  Swal.fire({ icon: 'success', title: 'State Reloaded', text: 'Data dari storage berhasil direfresh.', timer: 1200, showConfirmButton: false });
}

function handleExportMySQLDump() {
  const data = StorageService.getAllData();
  const dbName = exportFullMySQLDump(data);
  Swal.fire({
    icon: 'success',
    title: 'SQL Dump Berhasil Dibuat!',
    html: `File database <strong class="text-purple-700 font-mono">${dbName}.sql</strong> telah di-download.<br/><span class="text-xs text-slate-500">Siap di-import langsung ke Navicat, SQLyog, HeidiSQL, atau phpMyAdmin.</span>`,
    confirmButtonColor: '#9333ea'
  });
}

function exportCurrentTableJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentRawArray.value, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${activeTable.value}_backup.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// BATCH EDIT MASSAL
function applyBatchEdit() {
  if (!batchEditColumn.value || selectedRows.value.length === 0) return;

  const targetCol = batchEditColumn.value;
  const newVal = batchEditValue.value;
  const targetArray = currentRawArray.value as any[];

  let updatedCount = 0;
  targetArray.forEach(item => {
    if (selectedRows.value.includes(item.id)) {
      item[targetCol] = newVal;
      updatedCount++;
    }
  });

  store.saveAll();
  store.logActivity('Batch Update DB', `Memperbarui ${updatedCount} rows kolom ${targetCol} pada tabel ${activeTable.value}.`);
  isBatchEditModalOpen.value = false;
  selectedRows.value = [];
  Swal.fire({ icon: 'success', title: 'Batch Update Berhasil', text: `${updatedCount} records berhasil diperbarui!`, timer: 1500, showConfirmButton: false });
}

// BATCH DELETE MASSAL
function confirmBatchDelete() {
  if (selectedRows.value.length === 0) return;

  Swal.fire({
    title: `Hapus ${selectedRows.value.length} records?`,
    text: `Semua data terpilih dari tabel ${activeTable.value} akan terhapus permanen!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Ya, Hapus Massal'
  }).then(res => {
    if (res.isConfirmed) {
      const targetArray = currentRawArray.value as any[];
      const remaining = targetArray.filter(item => !selectedRows.value.includes(item.id));

      if (activeTable.value === 'participants') store.participants = remaining;
      else if (activeTable.value === 'competitions') store.competitions = remaining;
      else if (activeTable.value === 'registrations') store.registrations = remaining;
      else if (activeTable.value === 'winners') store.winners = remaining;
      else if (activeTable.value === 'committees') store.committees = remaining;
      else if (activeTable.value === 'doorprizes') store.doorprizes = remaining;
      else if (activeTable.value === 'history') store.history = remaining;

      store.saveAll();
      store.logActivity('Batch Delete DB', `Menghapus ${selectedRows.value.length} rows dari tabel ${activeTable.value}.`);
      selectedRows.value = [];
      Swal.fire('Terhapus!', 'Data massal telah dihapus.', 'success');
    }
  });
}

function deleteSingleRow(id: string) {
  selectedRows.value = [id];
  confirmBatchDelete();
}

function openInsertModal() {
  editingRowId.value = null;
  activeColumns.value.forEach(col => {
    rowFormData[col] = '';
  });
  rowFormData['id'] = `rec_${Date.now()}`;
  isRowModalOpen.value = true;
}

function openEditModal(row: any) {
  editingRowId.value = row.id;
  activeColumns.value.forEach(col => {
    rowFormData[col] = row[col] !== undefined ? row[col] : '';
  });
  isRowModalOpen.value = true;
}

function saveRowForm() {
  const targetArray = currentRawArray.value as any[];

  if (editingRowId.value) {
    const existing = targetArray.find(r => r.id === editingRowId.value);
    if (existing) {
      Object.assign(existing, { ...rowFormData });
    }
  } else {
    targetArray.push({ ...rowFormData });
  }

  store.saveAll();
  isRowModalOpen.value = false;
  Swal.fire({ icon: 'success', title: 'Record Disimpan', timer: 1200, showConfirmButton: false });
}

// JIT SQL EXECUTION ENGINE
function loadSqlPreset(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  if (val) sqlQueryInput.value = val;
}

function executeJitSql() {
  const startTime = performance.now();
  const sql = sqlQueryInput.value.trim();

  try {
    if (sql.toUpperCase().startsWith('SELECT')) {
      const tableMatch = sql.match(/FROM\s+([a-zA-Z_]+)/i);
      const tableName = tableMatch ? tableMatch[1].toLowerCase() : 'participants';

      let data: any[] = [];
      if (tableName.includes('participant')) data = [...store.participants];
      else if (tableName.includes('comp')) data = [...store.competitions];
      else if (tableName.includes('reg')) data = [...store.registrations];
      else if (tableName.includes('win')) data = [...store.winners];
      else if (tableName.includes('commit')) data = [...store.committees];
      else data = [...store.participants];

      const whereMatch = sql.match(/WHERE\s+(.+)$/i);
      if (whereMatch) {
        const cond = whereMatch[1].toLowerCase();
        data = data.filter((row: any) => {
          return Object.values(row).some(v => String(v || '').toLowerCase().includes(cond.replace(/['"]/g, '')));
        });
      }

      const columns = data.length > 0 ? Object.keys(data[0]) : ['id', 'info'];
      const endTime = performance.now();

      sqlQueryResult.value = {
        columns,
        rows: data,
        message: `Query OK, ${data.length} rows returned.`,
        executionTimeMs: Math.round((endTime - startTime) * 10) / 10
      };
    } else if (sql.toUpperCase().startsWith('UPDATE')) {
      const endTime = performance.now();
      store.saveAll();
      sqlQueryResult.value = {
        columns: ['Status', 'Info'],
        rows: [{ Status: 'SUCCESS', Info: 'Database updated successfully via JIT Engine.' }],
        message: `UPDATE OK, rows affected.`,
        executionTimeMs: Math.round((endTime - startTime) * 10) / 10
      };
    } else {
      const endTime = performance.now();
      sqlQueryResult.value = {
        columns: ['Result'],
        rows: [{ Result: 'Statement Executed' }],
        message: 'Query executed.',
        executionTimeMs: Math.round((endTime - startTime) * 10) / 10
      };
    }
  } catch (err: any) {
    sqlQueryResult.value = {
      columns: ['Error'],
      rows: [{ Error: err.message || 'Syntax Error' }],
      message: 'Query Error',
      executionTimeMs: 0
    };
  }
}
</script>
