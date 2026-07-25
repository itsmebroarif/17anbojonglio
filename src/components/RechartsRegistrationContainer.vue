<template>
  <div class="w-full">
    <div ref="chartContainer" class="w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import RechartsRegistrationChart, { ChartItem } from './RechartsRegistrationChart';

const props = defineProps<{
  data: ChartItem[];
}>();

const chartContainer = ref<HTMLDivElement | null>(null);
let reactRoot: Root | null = null;

function renderReactChart() {
  if (!chartContainer.value) return;
  if (!reactRoot) {
    reactRoot = createRoot(chartContainer.value);
  }
  reactRoot.render(
    React.createElement(RechartsRegistrationChart, { data: props.data })
  );
}

onMounted(() => {
  renderReactChart();
});

watch(
  () => props.data,
  () => {
    renderReactChart();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
});
</script>
