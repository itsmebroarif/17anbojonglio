<template>
  <div class="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4">
    
    <!-- Top Header Bar -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div class="flex items-center space-x-2">
        <div class="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs">
          <i class="bi bi-camera-fill"></i>
        </div>
        <div>
          <h4 class="font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
            <span>Foto Langsung (Webcam Laptop / HP)</span>
            <span v-if="streamActive" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </h4>
          <p class="text-[10px] text-slate-400">Pengenal visual peserta untuk panitia saat pemanggilan & verifikasi ID.</p>
        </div>
      </div>

      <!-- Mode Switcher: Camera vs Upload -->
      <div class="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-[11px]">
        <button
          type="button"
          @click="setSourceMode('webcam')"
          class="px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1"
          :class="sourceMode === 'webcam' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'"
        >
          <i class="bi bi-webcam-fill"></i> Webcam
        </button>
        <button
          type="button"
          @click="setSourceMode('upload')"
          class="px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1"
          :class="sourceMode === 'upload' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'"
        >
          <i class="bi bi-upload"></i> Upload
        </button>
      </div>
    </div>

    <!-- WEBCAM MODE -->
    <div v-if="sourceMode === 'webcam'" class="space-y-3">
      <!-- Live Video / Captured Canvas Display -->
      <div class="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] max-w-sm mx-auto border-2 border-slate-800 shadow-inner flex items-center justify-center group">
        
        <!-- Flash Effect Overlay -->
        <div
          v-if="isFlashing"
          class="absolute inset-0 bg-white z-30 animate-ping opacity-90"
        ></div>

        <!-- Video Stream -->
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          v-show="streamActive && !capturedImage"
          class="w-full h-full object-cover transition-transform duration-300"
          :class="{ '-scale-x-100': isMirrored }"
        ></video>

        <!-- Face Frame Overlay Guide when streaming -->
        <div
          v-if="streamActive && !capturedImage"
          class="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center p-6 opacity-60 group-hover:opacity-90 transition-opacity"
        >
          <!-- Face Oval Outline -->
          <div class="w-44 h-56 rounded-[50%] border-2 border-dashed border-red-400/80 shadow-[0_0_20px_rgba(239,68,68,0.3)] relative">
            <span class="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-red-300 bg-black/60 px-2 py-0.5 rounded-full font-bold">
              Posisikan Wajah Di Sini
            </span>
          </div>
        </div>

        <!-- Captured Image Preview -->
        <img
          v-if="capturedImage"
          :src="capturedImage"
          alt="Foto Peserta"
          class="w-full h-full object-cover z-20"
        />

        <!-- Camera Off / Idle State -->
        <div
          v-if="!streamActive && !capturedImage && !cameraError"
          class="text-center p-6 space-y-3 z-10"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 text-2xl border border-slate-700">
            <i class="bi bi-camera-video-off-fill"></i>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-200">Kamera Belum Aktif</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Klik tombol di bawah untuk mengaktifkan webcam laptop/HP Anda.</p>
          </div>
          <button
            type="button"
            @click="startCamera"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-1.5"
          >
            <i class="bi bi-power"></i> Aktifkan Kamera
          </button>
        </div>

        <!-- Camera Error State -->
        <div
          v-if="cameraError"
          class="text-center p-6 space-y-3 z-10 text-rose-300"
        >
          <i class="bi bi-exclamation-triangle-fill text-3xl text-rose-500"></i>
          <p class="text-xs font-bold">{{ cameraError }}</p>
          <button
            type="button"
            @click="setSourceMode('upload')"
            class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700"
          >
            Gunakan Upload File Saja
          </button>
        </div>

        <!-- Hidden Canvas for Capture -->
        <canvas ref="canvasRef" class="hidden"></canvas>
      </div>

      <!-- Live Controls Bar -->
      <div v-if="streamActive && !capturedImage" class="flex items-center justify-center gap-3 pt-1">
        <button
          type="button"
          @click="toggleMirror"
          class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
          title="Balikkan Tampilan (Mirror)"
        >
          <i class="bi bi-arrow-repeat text-base"></i>
        </button>

        <button
          type="button"
          @click="takeSnap"
          class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-red-600/40 ring-4 ring-red-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <i class="bi bi-camera-fill text-base"></i>
          <span>AMBIL FOTO</span>
        </button>

        <button
          type="button"
          @click="stopCamera"
          class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold border border-slate-700 transition-colors"
          title="Matikan Kamera"
        >
          <i class="bi bi-power text-base"></i>
        </button>
      </div>

      <!-- Captured Image Actions -->
      <div v-if="capturedImage" class="flex items-center justify-center gap-2 pt-1 animate-fade-in">
        <button
          type="button"
          @click="retakeSnap"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <i class="bi bi-arrow-counterclockwise text-amber-400"></i>
          <span>Foto Ulang</span>
        </button>

        <button
          type="button"
          @click="removePhoto"
          class="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-800 transition-colors flex items-center gap-1"
          title="Hapus Foto"
        >
          <i class="bi bi-trash-fill"></i>
        </button>

        <div class="flex items-center space-x-1 px-3 py-1.5 bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 rounded-xl text-[11px] font-bold">
          <i class="bi bi-check-circle-fill"></i>
          <span>Foto Siap Ditautkan</span>
        </div>
      </div>
    </div>

    <!-- UPLOAD FILE MODE -->
    <div v-else class="space-y-3">
      <div
        class="border-2 border-dashed border-slate-700 hover:border-red-500/80 bg-slate-950/60 rounded-2xl p-6 text-center space-y-3 transition-colors cursor-pointer relative"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileSelected"
        />

        <div v-if="!capturedImage" class="space-y-2">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-red-600/10 text-red-400 border border-red-500/20 flex items-center justify-center text-xl">
            <i class="bi bi-cloud-arrow-up-fill"></i>
          </div>
          <p class="text-xs font-bold text-slate-200">Klik untuk Upload Foto Peserta</p>
          <p class="text-[10px] text-slate-400">Mendukung format JPG, PNG, WEBP (Maks 5MB)</p>
        </div>

        <div v-else class="relative max-w-xs mx-auto">
          <img
            :src="capturedImage"
            alt="Preview Foto Upload"
            class="w-36 h-36 mx-auto object-cover rounded-2xl border-2 border-slate-700 shadow-md"
          />
          <button
            type="button"
            @click.stop="removePhoto"
            class="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-lg text-xs"
            title="Hapus Foto"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue';

const props = defineProps<{
  initialPhoto?: string;
}>();

const emit = defineEmits<{
  (e: 'captured', photoDataUrl: string): void;
  (e: 'cleared'): void;
}>();

const sourceMode = ref<'webcam' | 'upload'>('webcam');
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const streamActive = ref(false);
const cameraError = ref<string | null>(null);
const capturedImage = ref<string | null>(props.initialPhoto || null);
const isMirrored = ref(true);
const isFlashing = ref(false);

let mediaStream: MediaStream | null = null;

watch(() => props.initialPhoto, (newVal) => {
  if (newVal) {
    capturedImage.value = newVal;
  }
});

function setSourceMode(mode: 'webcam' | 'upload') {
  sourceMode.value = mode;
  if (mode === 'upload' && streamActive.value) {
    stopCamera();
  }
}

async function startCamera() {
  cameraError.value = null;
  try {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    };

    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      await videoRef.value.play();
    }
    streamActive.value = true;
  } catch (err: any) {
    console.error('Camera Access Error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      cameraError.value = 'Akses kamera ditolak oleh browser. Silakan berikan izin di alamat browser.';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      cameraError.value = 'Tidak ada perangkat kamera / webcam yang terdeteksi pada perangkat ini.';
    } else {
      cameraError.value = 'Gagal membuka kamera: ' + (err.message || 'Error tidak diketahui');
    }
    streamActive.value = false;
  }
}

function stopCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  streamActive.value = false;
}

function toggleMirror() {
  isMirrored.value = !isMirrored.value;
}

function playShutterSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    // Audio Context optional fallback
  }
}

function takeSnap() {
  if (!videoRef.value || !canvasRef.value) return;

  playShutterSound();
  isFlashing.value = true;
  setTimeout(() => {
    isFlashing.value = false;
  }, 150);

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  // Make square crop or crisp 4:3 image
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (isMirrored.value) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(video, 0, 0, width, height);

  // Convert to optimized compressed Data URL
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  capturedImage.value = dataUrl;
  stopCamera();

  emit('captured', dataUrl);
}

function retakeSnap() {
  capturedImage.value = null;
  startCamera();
}

function removePhoto() {
  capturedImage.value = null;
  emit('cleared');
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      capturedImage.value = dataUrl;
      emit('captured', dataUrl);
    };
    reader.readAsDataURL(file);
  }
}

onUnmounted(() => {
  stopCamera();
});
</script>
