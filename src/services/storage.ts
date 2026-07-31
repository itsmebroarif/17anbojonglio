import {
  Competition,
  Participant,
  Registration,
  Score,
  Winner,
  Certificate,
  Doorprize,
  AppSettings,
  ActivityLog,
  WaTemplate,
  CommitteeMember
} from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  COMPETITIONS: '17an_competitions',
  PARTICIPANTS: '17an_participants',
  REGISTRATIONS: '17an_registrations',
  SCORES: '17an_scores',
  WINNERS: '17an_winners',
  CERTIFICATES: '17an_certificates',
  DOORPRIZES: '17an_doorprizes',
  SETTINGS: '17an_settings',
  HISTORY: '17an_history',
  WA_TEMPLATES: '17an_wa_templates',
  COMMITTEES: '17an_committees'
};

export const DEFAULT_SETTINGS: AppSettings = {
  eventName: 'CHAMPIONSHIP ALL IN ONE',
  eventYear: 2026,
  theme: 'merah-putih',
  logoUrl: '',
  headOfCommittee: '',
  location: '',
  prefixRule: 'AUTO',
  certificateTemplateText: 'Diberikan sebagai bentuk penghargaan atas prestasi dan partisipasi aktif dalam menyemarakkan HUT Kemerdekaan Republik Indonesia.',
  autoBackup: true,
  colorTheme: '#dc2626'
};

export const DEFAULT_WA_TEMPLATES: WaTemplate[] = [
  {
    id: 'tpl-panggilan-1',
    title: 'Panggilan Lomba Standard',
    category: 'panggilan',
    content: 'Panggilan Peserta Lomba Kemerdekaan 🇮🇩\n\nHalo {nama} (No: {nomor}), Anda dijadwalkan bertanding pada lomba *{lomba}*.\n*Lokasi Arena:* {lokasi}\n*Waktu:* {waktu}\n\nHarap segera menuju area pertandingan. Terima kasih!',
    isDefault: true
  },
  {
    id: 'tpl-pengingat-1',
    title: 'Pengingat Jadwal Lomba',
    category: 'pengingat',
    content: 'Pengingat Lomba Kemerdekaan 🇮🇩\n\nHalo {nama}, diingatkan kembali bahwa lomba *{lomba}* (No: {nomor}) akan segera dimulai di *{lokasi}* pada pukul *{waktu}*.\n\nPersiapkan diri Anda dan datang tepat waktu! Merdeka! ✊',
    isDefault: true
  },
  {
    id: 'tpl-selesai-1',
    title: 'Ucapan Selesai Lomba',
    category: 'selesai',
    content: 'Terima Kasih Partisipasi Lomba! 🇮🇩\n\nHalo {nama}, terima kasih telah bertanding pada lomba *{lomba}* (No. Peserta: {nomor}). Hasil pertandingan dan penyerahan piala akan diumumkan di Panggung Utama.',
    isDefault: true
  },
  {
    id: 'tpl-pengumuman-1',
    title: 'Pengumuman Juara Lomba',
    category: 'pengumuman',
    content: 'Selamat {nama}! 🏆\n\nAnda dinyatakan sebagai pemenang pada lomba *{lomba}* (No. Peserta: {nomor}) di lokasi *{lokasi}*.\n\nPenyerahan piala dan sertifikat akan dilaksanakan saat Malam Puncak Kemerdekaan. Terima kasih atas partisipasi luar biasa Anda! 🇮🇩',
    isDefault: true
  }
];

export const SEED_COMPETITIONS: Competition[] = [];
export const SEED_PARTICIPANTS: Participant[] = [];
export const SEED_REGISTRATIONS: Registration[] = [];
export const SEED_WINNERS: Winner[] = [];
export const SEED_DOORPRIZES: Doorprize[] = [];

// LocalStorage Helper Utilities
export class StorageService {
  static get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading key ${key} from LocalStorage:`, e);
      return fallback;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error setting key ${key} in LocalStorage:`, e);
    }
  }

  static initializeDefaults(force = false): void {
    const isCleared = localStorage.getItem('17an_cleared_empty_fresh');
    if (force || !isCleared || !localStorage.getItem(STORAGE_KEYS.COMPETITIONS)) {
      this.set(STORAGE_KEYS.COMPETITIONS, []);
      this.set(STORAGE_KEYS.PARTICIPANTS, []);
      this.set(STORAGE_KEYS.REGISTRATIONS, []);
      this.set(STORAGE_KEYS.SCORES, []);
      this.set(STORAGE_KEYS.WINNERS, []);
      this.set(STORAGE_KEYS.CERTIFICATES, []);
      this.set(STORAGE_KEYS.DOORPRIZES, []);
      this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.set(STORAGE_KEYS.HISTORY, []);
      this.set(STORAGE_KEYS.WA_TEMPLATES, DEFAULT_WA_TEMPLATES);
      this.set(STORAGE_KEYS.COMMITTEES, []);
      localStorage.setItem('17an_cleared_empty_fresh', 'true');
    } else {
      if (!localStorage.getItem(STORAGE_KEYS.WA_TEMPLATES)) {
        this.set(STORAGE_KEYS.WA_TEMPLATES, DEFAULT_WA_TEMPLATES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.COMMITTEES)) {
        this.set(STORAGE_KEYS.COMMITTEES, []);
      }
    }
  }

  static getAllData() {
    return {
      competitions: this.get<Competition[]>(STORAGE_KEYS.COMPETITIONS, []),
      participants: this.get<Participant[]>(STORAGE_KEYS.PARTICIPANTS, []),
      registrations: this.get<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []),
      scores: this.get<Score[]>(STORAGE_KEYS.SCORES, []),
      winners: this.get<Winner[]>(STORAGE_KEYS.WINNERS, []),
      certificates: this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []),
      doorprizes: this.get<Doorprize[]>(STORAGE_KEYS.DOORPRIZES, []),
      settings: this.get<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
      history: this.get<ActivityLog[]>(STORAGE_KEYS.HISTORY, []),
      waTemplates: this.get<WaTemplate[]>(STORAGE_KEYS.WA_TEMPLATES, DEFAULT_WA_TEMPLATES),
      committees: this.get<CommitteeMember[]>(STORAGE_KEYS.COMMITTEES, [])
    };
  }

  static restoreAllData(data: any) {
    if (!data) return false;
    if (data.competitions) this.set(STORAGE_KEYS.COMPETITIONS, data.competitions);
    if (data.participants) this.set(STORAGE_KEYS.PARTICIPANTS, data.participants);
    if (data.registrations) this.set(STORAGE_KEYS.REGISTRATIONS, data.registrations);
    if (data.scores) this.set(STORAGE_KEYS.SCORES, data.scores);
    if (data.winners) this.set(STORAGE_KEYS.WINNERS, data.winners);
    if (data.certificates) this.set(STORAGE_KEYS.CERTIFICATES, data.certificates);
    if (data.doorprizes) this.set(STORAGE_KEYS.DOORPRIZES, data.doorprizes);
    if (data.settings) this.set(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.history) this.set(STORAGE_KEYS.HISTORY, data.history);
    if (data.waTemplates) this.set(STORAGE_KEYS.WA_TEMPLATES, data.waTemplates);
    if (data.committees) this.set(STORAGE_KEYS.COMMITTEES, data.committees);
    return true;
  }
}
