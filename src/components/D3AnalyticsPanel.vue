<template>
  <div class="space-y-6">
    <!-- Chart Mode Switcher & Stats Overview -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
      <div>
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <i class="bi bi-pie-chart-fill text-purple-600"></i>
          <span>D3.js Real-time Database Analytics Engine</span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Visualisasi grafis interaktif berbasis D3.js yang dirender secara realtime dari data tabel aktif.
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          v-for="mode in chartModes"
          :key="mode.id"
          @click="activeChartMode = mode.id"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          :class="[
            activeChartMode === mode.id
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          <i :class="mode.icon"></i>
          <span>{{ mode.label }}</span>
        </button>
      </div>
    </div>

    <!-- D3 CHARTS CONTAINER -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- MAIN D3 CHART CANVAS (8 COLS) -->
      <div class="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h4 class="font-bold text-xs text-slate-800 font-mono uppercase tracking-wider">
              {{ currentChartTitle }}
            </h4>
          </div>
          <span class="text-[11px] font-mono bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
            D3 v7 SVG Engine
          </span>
        </div>

        <!-- SVG Container for D3 -->
        <div class="relative min-h-[340px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 p-2 overflow-hidden">
          <svg ref="d3SvgRef" class="w-full h-[320px] overflow-visible"></svg>
          
          <!-- D3 Tooltip Overlay -->
          <div
            v-if="tooltip.show"
            class="absolute z-20 bg-slate-900/90 backdrop-blur-xs text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 pointer-events-none transition-all duration-75 space-y-1 font-sans"
            :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translate(-50%, -110%)' }"
          >
            <div class="font-extrabold text-amber-300 font-mono">{{ tooltip.title }}</div>
            <div class="text-[11px] text-slate-300">{{ tooltip.value }}</div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR D3 METRIC SUMMARY (4 COLS) -->
      <div class="lg:col-span-4 space-y-4">
        <!-- Quick Insight Card 1 -->
        <div class="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md border border-purple-800/50 space-y-3">
          <div class="flex items-center justify-between text-purple-200">
            <span class="text-xs font-bold uppercase tracking-wider">Total Perlombaan</span>
            <i class="bi bi-trophy-fill text-amber-400 text-lg"></i>
          </div>
          <div class="text-3xl font-black font-mono text-white">
            {{ store.competitions.length }}
          </div>
          <div class="text-xs text-purple-200 flex items-center justify-between pt-2 border-t border-purple-800/80 font-mono">
            <span>Ongoing: <strong class="text-amber-300">{{ ongoingCount }}</strong></span>
            <span>Upcoming: <strong class="text-emerald-300">{{ upcomingCount }}</strong></span>
          </div>
        </div>

        <!-- Quick Insight Card 2 -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div class="flex items-center justify-between text-slate-500">
            <span class="text-xs font-bold uppercase tracking-wider">Total Peserta & Tim</span>
            <i class="bi bi-people-fill text-purple-600 text-lg"></i>
          </div>
          <div class="text-3xl font-black text-slate-900 font-mono">
            {{ store.participants.length }}
          </div>
          <div class="space-y-1 pt-1 text-xs text-slate-600">
            <div class="flex justify-between font-mono">
              <span>Laki-Laki (L):</span>
              <strong class="text-indigo-600">{{ maleCount }} ({{ malePercentage }}%)</strong>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-600 rounded-full" :style="{ width: `${malePercentage}%` }"></div>
            </div>

            <div class="flex justify-between font-mono pt-1">
              <span>Perempuan (P):</span>
              <strong class="text-pink-600">{{ femaleCount }} ({{ femalePercentage }}%)</strong>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-pink-500 rounded-full" :style="{ width: `${femalePercentage}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Quick Insight Card 3: Top Competitions by Popularity -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Lomba Terpopuler (Top Registrasi)</span>
          <div class="space-y-2">
            <div
              v-for="top in topPopularCompetitions"
              :key="top.id"
              class="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl"
            >
              <div class="truncate max-w-[160px] font-bold text-slate-800">
                {{ top.name }}
              </div>
              <span class="px-2 py-0.5 bg-purple-100 text-purple-800 font-mono font-bold rounded-md text-[10px]">
                {{ top.count }} Peserta
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive, nextTick } from 'vue';
import { useArenaStore } from '../stores/arenaStore';
import * as d3 from 'd3';

const store = useArenaStore();
const d3SvgRef = ref<SVGSVGElement | null>(null);

const activeChartMode = ref<'bar' | 'donut' | 'horizontal'>('bar');

const tooltip = reactive({
  show: false,
  x: 0,
  y: 0,
  title: '',
  value: ''
});

const chartModes = [
  { id: 'bar', label: 'D3 Bar Chart (Peserta/Lomba)', icon: 'bi bi-bar-chart-fill' },
  { id: 'donut', label: 'D3 Donut Chart (Status Lomba)', icon: 'bi bi-pie-chart-fill' },
  { id: 'horizontal', label: 'D3 Demografi RT/RW', icon: 'bi bi-[#000] bi-bar-chart-steps' }
];

const currentChartTitle = computed(() => {
  switch (activeChartMode.value) {
    case 'bar': return 'Grafik Batang D3: Jumlah Registrasi per Cabang Perlombaan';
    case 'donut': return 'Grafik Lingkaran D3: Proporsi Status & Kategori Perlombaan';
    case 'horizontal': return 'Grafik Horisontal D3: Distribusi Peserta Berdasarkan RT / RW';
    default: return 'Visual Analytics D3.js';
  }
});

// Metrics
const ongoingCount = computed(() => store.competitions.filter(c => c.status === 'Ongoing').length);
const upcomingCount = computed(() => store.competitions.filter(c => c.status === 'Upcoming').length);

const maleCount = computed(() => store.participants.filter(p => p.gender === 'L').length);
const femaleCount = computed(() => store.participants.filter(p => p.gender === 'P').length);

const malePercentage = computed(() => {
  const total = store.participants.length;
  if (total === 0) return 0;
  return Math.round((maleCount.value / total) * 100);
});

const femalePercentage = computed(() => {
  const total = store.participants.length;
  if (total === 0) return 0;
  return Math.round((femaleCount.value / total) * 100);
});

const topPopularCompetitions = computed(() => {
  return store.competitions
    .map(c => ({
      id: c.id,
      name: c.name,
      count: store.getRegistrationsByCompetition(c.id).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
});

// Render D3 Chart
function renderD3Chart() {
  if (!d3SvgRef.value) return;

  const svg = d3.select(d3SvgRef.value);
  svg.selectAll('*').remove();

  const width = d3SvgRef.value.clientWidth || 560;
  const height = 300;
  const margin = { top: 30, right: 30, bottom: 60, left: 50 };

  if (activeChartMode.value === 'bar') {
    // ----------------------------------------------------------------
    // D3 VERTICAL BAR CHART: Registrations per Competition
    // ----------------------------------------------------------------
    const data = store.competitions.map(comp => ({
      label: comp.prefix || comp.name.substring(0, 10),
      fullName: comp.name,
      count: store.getRegistrationsByCompetition(comp.id).length,
      max: comp.maxParticipants
    }));

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const maxCount = Math.max(10, d3.max(data, d => d.count) || 10);
    const y = d3.scaleLinear()
      .domain([0, maxCount])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Gridlines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3,3');

    // Axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#475569')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#475569')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px');

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height - margin.bottom)
      .attr('height', 0)
      .attr('rx', 6)
      .attr('fill', '#9333ea')
      .on('mouseenter', (event, d) => {
        tooltip.show = true;
        tooltip.x = event.offsetX;
        tooltip.y = event.offsetY;
        tooltip.title = d.fullName;
        tooltip.value = `Jumlah Pendaftar: ${d.count} / Kuota ${d.max}`;
      })
      .on('mousemove', (event) => {
        tooltip.x = event.offsetX;
        tooltip.y = event.offsetY;
      })
      .on('mouseleave', () => {
        tooltip.show = false;
      })
      .transition()
      .duration(750)
      .attr('y', d => y(d.count))
      .attr('height', d => height - margin.bottom - y(d.count));

  } else if (activeChartMode.value === 'donut') {
    // ----------------------------------------------------------------
    // D3 DONUT CHART: Status Distribution
    // ----------------------------------------------------------------
    const statusMap: Record<string, number> = {};
    store.competitions.forEach(c => {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;
    });

    const data = Object.entries(statusMap).map(([key, val]) => ({
      label: key,
      value: val
    }));

    const radius = Math.min(width, height) / 2 - 20;
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']);

    const pie = d3.pie<{ label: string; value: number }>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', '3px')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        tooltip.show = true;
        tooltip.x = event.offsetX;
        tooltip.y = event.offsetY;
        tooltip.title = `Status: ${d.data.label}`;
        tooltip.value = `${d.data.value} Cabang Perlombaan`;
      })
      .on('mousemove', (event) => {
        tooltip.x = event.offsetX;
        tooltip.y = event.offsetY;
      })
      .on('mouseleave', () => {
        tooltip.show = false;
      });

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .text(d => `${d.data.label} (${d.data.value})`);

  } else if (activeChartMode.value === 'horizontal') {
    // ----------------------------------------------------------------
    // D3 HORIZONTAL BAR CHART: RT/RW Distribution of Participants
    // ----------------------------------------------------------------
    const rtMap: Record<string, number> = {};
    store.participants.forEach(p => {
      const rt = p.rtRw || 'Lainnya';
      rtMap[rt] = (rtMap[rt] || 0) + 1;
    });

    const data = Object.entries(rtMap).map(([key, val]) => ({
      label: key,
      value: val
    })).sort((a, b) => b.value - a.value);

    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    const maxVal = Math.max(5, d3.max(data, d => d.value) || 5);
    const x = d3.scaleLinear()
      .domain([0, maxVal])
      .range([margin.left, width - margin.right]);

    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x).ticks(5);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#334155')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#334155')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px');

    svg.selectAll('.hbar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'hbar')
      .attr('y', d => y(d.label) || 0)
      .attr('height', y.bandwidth())
      .attr('x', margin.left)
      .attr('width', 0)
      .attr('rx', 4)
      .attr('fill', '#4f46e5')
      .on('mouseenter', (event, d) => {
        tooltip.show = true;
        tooltip.x = event.offsetX;
        tooltip.y = event.offsetY;
        tooltip.title = d.label;
        tooltip.value = `${d.value} Peserta Terdaftar`;
      })
      .on('mousemove', (event) => {
        tooltip.x = event.offsetX;
        tooltip.y = event.offsetY;
      })
      .on('mouseleave', () => {
        tooltip.show = false;
      })
      .transition()
      .duration(750)
      .attr('width', d => x(d.value) - margin.left);
  }
}

watch([activeChartMode, () => store.competitions, () => store.participants], () => {
  nextTick(() => {
    renderD3Chart();
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    renderD3Chart();
  });
});
</script>
