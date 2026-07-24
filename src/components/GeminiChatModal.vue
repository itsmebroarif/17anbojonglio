<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    @click.self="$emit('close')"
  >
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[600px] max-h-[90vh]">
      <!-- Header -->
      <div class="p-4 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl">
            <i class="bi bi-stars"></i>
          </div>
          <div>
            <h2 class="font-bold text-base leading-tight">Asisten Panitia 17an AI</h2>
            <p class="text-xs text-red-100">Siap bantu draf WA, aturan lomba, rundown, & bracket</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <!-- Quick Preset Prompt Chips -->
      <div class="p-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
        <span class="text-slate-400 font-medium whitespace-nowrap"><i class="bi bi-lightning-fill text-amber-500"></i> Saran:</span>
        <button
          v-for="(preset, idx) in presets"
          :key="idx"
          @click="usePreset(preset)"
          class="px-2.5 py-1 bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 rounded-lg whitespace-nowrap transition-colors"
        >
          {{ preset }}
        </button>
      </div>

      <!-- Chat Thread Messages -->
      <div ref="chatThread" class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex flex-col"
          :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-2xs"
            :class="[
              msg.sender === 'user'
                ? 'bg-red-600 text-white rounded-br-none'
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
            ]"
          >
            {{ msg.text }}
          </div>
          <span class="text-[10px] text-slate-400 mt-1 px-1">
            {{ msg.timestamp }}
          </span>
        </div>

        <div v-if="loading" class="flex items-center space-x-2 text-slate-500 text-sm p-2 bg-white rounded-xl border border-slate-200 w-fit">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          <span>Panitia AI sedang berpikir...</span>
        </div>
      </div>

      <!-- Chat Input Area -->
      <div class="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <input
          v-model="inputQuery"
          type="text"
          placeholder="Tanyakan sesuatu pada AI Panitia (e.g. Buatkan teks pengumuman pemenang...)"
          class="flex-1 px-4 py-2.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
          @keydown.enter="sendMessage"
          :disabled="loading"
        />
        <button
          @click="sendMessage"
          :disabled="loading || !inputQuery.trim()"
          class="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-colors flex items-center gap-1.5"
        >
          <i class="bi bi-send-fill"></i>
          <span class="hidden sm:inline">Kirim</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

const props = defineProps<{ isOpen: boolean }>();
defineEmits(['close']);

const inputQuery = ref('');
const loading = ref(false);
const chatThread = ref<HTMLElement | null>(null);

const presets = [
  'Buatkan draf WA panggilan peserta',
  'Buatkan draf WA pengumuman juara',
  'Aturan lomba Balap Karung Helm',
  'Susunan Acara Rundown 17 Agustus',
  'Sistem bracket turnamen Mobile Legends'
];

const messages = ref<ChatMessage[]>([
  {
    id: uuidv4(),
    sender: 'assistant',
    text: 'Halo Panitia Kemerdekaan! 🇮🇩\nSaya siap membantu menyusun pengumuman WhatsApp, merancang aturan perlombaan, menyusun rundown acara, atau menghitung bracket pertandingan. Ada yang bisa dibantu?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);

watch(() => messages.value.length, () => {
  nextTick(() => {
    if (chatThread.value) {
      chatThread.value.scrollTop = chatThread.value.scrollHeight;
    }
  });
});

function usePreset(text: string) {
  inputQuery.value = text;
  sendMessage();
}

async function sendMessage() {
  const query = inputQuery.value.trim();
  if (!query || loading.value) return;

  const userMsg: ChatMessage = {
    id: uuidv4(),
    sender: 'user',
    text: query,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  messages.value.push(userMsg);
  inputQuery.value = '';
  loading.value = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value
      })
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    const aiMsg: ChatMessage = {
      id: uuidv4(),
      sender: 'assistant',
      text: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages.value.push(aiMsg);
  } catch (err: any) {
    console.error('Chat error:', err);
    messages.value.push({
      id: uuidv4(),
      sender: 'assistant',
      text: `⚠️ Maaf, terjadi kesalahan atau API Key Gemini belum dikonfigurasi: ${err.message}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } finally {
    loading.value = false;
  }
}
</script>
