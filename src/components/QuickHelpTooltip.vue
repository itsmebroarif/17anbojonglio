<template>
  <div class="relative inline-block ml-1 group">
    <button
      type="button"
      @click="toggle"
      @mouseenter="show = true"
      @mouseleave="show = false"
      class="text-amber-500 hover:text-amber-600 focus:outline-none focus:text-amber-600 transition-colors p-0.5 rounded-full inline-flex items-center justify-center"
      aria-label="Petunjuk Bantuan"
    >
      <i class="bi bi-question-circle-fill text-xs"></i>
    </button>

    <!-- Tooltip Card Popup -->
    <div
      v-if="show"
      class="absolute z-40 w-64 p-3 bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 shadow-2xl text-[11px] leading-relaxed transition-all duration-200 pointer-events-none"
      :class="[
        position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' :
        position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' :
        position === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' :
        'left-full ml-2 top-1/2 -translate-y-1/2'
      ]"
    >
      <div class="flex items-center space-x-1.5 text-amber-400 font-extrabold mb-1">
        <i class="bi bi-lightbulb-fill"></i>
        <span>{{ title || 'Petunjuk Pengisian' }}</span>
      </div>
      <p class="text-slate-300 font-medium">{{ content }}</p>

      <div v-if="example" class="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
        <span class="text-emerald-400 font-bold block mb-0.5">💡 Format / Contoh:</span>
        <code class="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono block w-full truncate border border-slate-800">
          {{ example }}
        </code>
      </div>

      <!-- Arrow -->
      <div
        class="absolute w-2.5 h-2.5 bg-slate-900 border-slate-700 rotate-45"
        :class="[
          position === 'top' ? 'top-full -mt-1.5 left-1/2 -translate-x-1/2 border-r border-b' :
          position === 'bottom' ? 'bottom-full -mb-1.5 left-1/2 -translate-x-1/2 border-l border-t' :
          position === 'left' ? 'left-full -ml-1.5 top-1/2 -translate-y-1/2 border-r border-t' :
          'right-full -mr-1.5 top-1/2 -translate-y-1/2 border-l border-b'
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title?: string;
  content: string;
  example?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}>();

const show = ref(false);

function toggle() {
  show.value = !show.value;
}
</script>
