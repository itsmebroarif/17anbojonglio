import { defineStore } from 'pinia';
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
  RegistrationStatus,
  WaTemplate,
  CommitteeMember
} from '../types';
import { StorageService, DEFAULT_SETTINGS, DEFAULT_WA_TEMPLATES } from '../services/storage';
import { exportToJSON } from '../services/export';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export const useArenaStore = defineStore('arena', {
  state: () => ({
    competitions: [] as Competition[],
    participants: [] as Participant[],
    registrations: [] as Registration[],
    scores: [] as Score[],
    winners: [] as Winner[],
    certificates: [] as Certificate[],
    doorprizes: [] as Doorprize[],
    settings: DEFAULT_SETTINGS as AppSettings,
    history: [] as ActivityLog[],
    waTemplates: [] as WaTemplate[],
    committees: [] as CommitteeMember[],
    globalSearchQuery: '',
    isInitialized: false,
    isDarkMode: false
  }),

  getters: {
    getCompetitionById: (state) => (id: string) => {
      return state.competitions.find(c => c.id === id);
    },
    getParticipantById: (state) => (id: string) => {
      return state.participants.find(p => p.id === id);
    },
    getRegistrationsByCompetition: (state) => (competitionId: string) => {
      return state.registrations.filter(r => r.competitionId === competitionId);
    },
    getParticipantRegistrations: (state) => (participantId: string) => {
      return state.registrations.filter(r => r.participantId === participantId);
    },
    // Combined Participant Leaderboard (Resulting Point)
    participantLeaderboard: (state) => {
      const pointsMap = new Map<string, { participant: Participant; totalPoints: number; breakdown: { competitionName: string; rankName: string; points: number }[] }>();

      state.participants.forEach(p => {
        pointsMap.set(p.id, {
          participant: p,
          totalPoints: 0,
          breakdown: []
        });
      });

      state.winners.forEach(w => {
        const comp = state.competitions.find(c => c.id === w.competitionId);
        if (!comp) return;

        if (w.firstPlaceId && pointsMap.has(w.firstPlaceId)) {
          const entry = pointsMap.get(w.firstPlaceId)!;
          entry.totalPoints += comp.pointFirst;
          entry.breakdown.push({ competitionName: comp.name, rankName: 'Juara 1', points: comp.pointFirst });
        }
        if (w.secondPlaceId && pointsMap.has(w.secondPlaceId)) {
          const entry = pointsMap.get(w.secondPlaceId)!;
          entry.totalPoints += comp.pointSecond;
          entry.breakdown.push({ competitionName: comp.name, rankName: 'Juara 2', points: comp.pointSecond });
        }
        if (w.thirdPlaceId && pointsMap.has(w.thirdPlaceId)) {
          const entry = pointsMap.get(w.thirdPlaceId)!;
          entry.totalPoints += comp.pointThird;
          entry.breakdown.push({ competitionName: comp.name, rankName: 'Juara 3', points: comp.pointThird });
        }
      });

      return Array.from(pointsMap.values())
        .filter(item => item.totalPoints > 0)
        .sort((a, b) => b.totalPoints - a.totalPoints);
    },

    dashboardStats: (state) => {
      return {
        totalCompetitions: state.competitions.length,
        totalParticipants: state.participants.length,
        totalWinners: state.winners.length,
        totalCertificates: state.certificates.length,
        totalDoorprizes: state.doorprizes.length,
        waiting: state.registrations.filter(r => r.status === 'Waiting' || r.status === 'Called').length,
        playing: state.registrations.filter(r => r.status === 'Ready' || r.status === 'Playing').length,
        finished: state.registrations.filter(r => r.status === 'Finished').length
      };
    }
  },

  actions: {
    init() {
      StorageService.initializeDefaults();
      const data = StorageService.getAllData();
      this.competitions = data.competitions;
      this.participants = data.participants;
      this.registrations = data.registrations;
      this.scores = data.scores;
      this.winners = data.winners;
      this.certificates = data.certificates;
      this.doorprizes = data.doorprizes;
      this.settings = data.settings;
      if (this.settings.headOfCommittee === 'Ahmad Subardjo, S.T.') {
        this.settings.headOfCommittee = '';
      }
      if (this.settings.location === 'Lapangan Warga Depok') {
        this.settings.location = '';
      }
      this.history = data.history;
      this.waTemplates = data.waTemplates || DEFAULT_WA_TEMPLATES;
      this.committees = data.committees || [];
      this.isInitialized = true;
      this.applyDarkMode(false);
    },

    toggleDarkMode(force?: boolean) {
      this.isDarkMode = false;
      StorageService.set('17an_darkmode', false);
      this.applyDarkMode(false);
    },

    applyDarkMode(_isDark: boolean) {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    },

    exportBackupJson() {
      const data = StorageService.getAllData();
      const dateStr = new Date().toISOString().substring(0, 10);
      this.settings.lastBackupAt = new Date().toISOString();
      this.saveAll();
      exportToJSON(data, `17an_arena_backup_${dateStr}.json`);
      this.logActivity('Backup Export JSON', 'Data berhasil diexport dan waktu backup diperbarui.');
    },

    flushDemoData() {
      this.competitions = [];
      this.participants = [];
      this.registrations = [];
      this.scores = [];
      this.winners = [];
      this.certificates = [];
      this.doorprizes = [];
      this.history = [
        {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          action: 'System Flush (Fresh App)',
          details: 'Sistem dibersihkan total dari seluruh data demo. Siap digunakan untuk acara baru.'
        }
      ];
      this.saveAll();
    },

    saveAll() {
      StorageService.set('17an_competitions', this.competitions);
      StorageService.set('17an_participants', this.participants);
      StorageService.set('17an_registrations', this.registrations);
      StorageService.set('17an_scores', this.scores);
      StorageService.set('17an_winners', this.winners);
      StorageService.set('17an_certificates', this.certificates);
      StorageService.set('17an_doorprizes', this.doorprizes);
      StorageService.set('17an_settings', this.settings);
      StorageService.set('17an_history', this.history);
      StorageService.set('17an_wa_templates', this.waTemplates);
      StorageService.set('17an_committees', this.committees);
    },

    logActivity(action: string, details: string) {
      this.history.unshift({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        action,
        details
      });
      if (this.history.length > 100) this.history.pop();
      this.saveAll();
    },

    resetToDefault() {
      StorageService.initializeDefaults(true);
      this.init();
    },

    // Competitions Actions
    addCompetition(comp: Omit<Competition, 'id'>) {
      const newComp: Competition = {
        ...comp,
        id: 'comp-' + uuidv4().substring(0, 8)
      };
      this.competitions.push(newComp);
      this.logActivity('Lomba Ditambahkan', `Lomba ${newComp.name} (${newComp.category}) berhasil dibuat.`);
      this.saveAll();
      return newComp;
    },

    updateCompetition(id: string, comp: Partial<Competition>) {
      const idx = this.competitions.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.competitions[idx] = { ...this.competitions[idx], ...comp };
        this.logActivity('Lomba Diperbarui', `Lomba ${this.competitions[idx].name} telah diperbarui.`);
        this.saveAll();
      }
    },

    deleteCompetition(id: string) {
      const comp = this.competitions.find(c => c.id === id);
      this.competitions = this.competitions.filter(c => c.id !== id);
      this.registrations = this.registrations.filter(r => r.competitionId !== id);
      this.scores = this.scores.filter(s => s.competitionId !== id);
      this.winners = this.winners.filter(w => w.competitionId !== id);
      this.certificates = this.certificates.filter(c => c.competitionId !== id);
      this.logActivity('Lomba Dihapus', `Lomba ${comp?.name || id} dihapus beserta data registrasinya.`);
      this.saveAll();
    },

    // Participant Registration
    registerParticipant(
      participantData: Omit<Participant, 'id' | 'createdAt'>,
      competitionIds: string[]
    ) {
      // Check if participant already exists by name & whatsapp
      let participant = this.participants.find(
        p => p.name.trim().toLowerCase() === participantData.name.trim().toLowerCase() &&
             (participantData.whatsapp && participantData.whatsapp.trim() !== '' ? p.whatsapp === participantData.whatsapp : true)
      );

      if (!participant) {
        participant = {
          ...participantData,
          id: 'part-' + uuidv4().substring(0, 8),
          createdAt: new Date().toISOString()
        };
        this.participants.push(participant);
      } else {
        if (participantData.photoUrl) {
          participant.photoUrl = participantData.photoUrl;
        }
      }

      const createdRegistrations: Registration[] = [];

      competitionIds.forEach(compId => {
        const comp = this.competitions.find(c => c.id === compId);
        if (!comp) return;

        // Check if already registered
        const existing = this.registrations.find(
          r => r.participantId === participant!.id && r.competitionId === compId
        );
        if (existing) return;

        // Generate Participant Number
        const prefix = comp.prefix || 'LB';
        const existingInComp = this.registrations.filter(r => r.competitionId === compId);
        const seqNumber = String(existingInComp.length + 1).padStart(3, '0');
        const participantNumber = `${prefix}-${seqNumber}`;

        const reg: Registration = {
          id: 'reg-' + uuidv4().substring(0, 8),
          participantId: participant!.id,
          competitionId: compId,
          participantNumber,
          status: 'Waiting',
          registeredAt: new Date().toISOString()
        };

        this.registrations.push(reg);
        createdRegistrations.push(reg);
      });

      this.logActivity(
        'Pendaftaran Baru',
        `Peserta ${participant.name} terdaftar pada ${competitionIds.length} lomba.`
      );
      this.saveAll();

      return { participant, registrations: createdRegistrations };
    },

    updateParticipantPhoto(participantId: string, photoUrl: string) {
      const part = this.participants.find(p => p.id === participantId);
      if (part) {
        part.photoUrl = photoUrl;
        this.logActivity('Foto Peserta Diperbarui', `Foto peserta ${part.name} berhasil diperbarui.`);
        this.saveAll();
      }
    },

    registerBulkParticipants(
      competitionId: string,
      participantsList: Omit<Participant, 'id' | 'createdAt'>[]
    ) {
      const results: { participant: Participant; registration: Registration }[] = [];
      const comp = this.competitions.find(c => c.id === competitionId);
      if (!comp) return results;

      participantsList.forEach(pData => {
        if (!pData.name || !pData.name.trim()) return;

        const res = this.registerParticipant(pData, [competitionId]);
        if (res.registrations.length > 0) {
          results.push({
            participant: res.participant,
            registration: res.registrations[0]
          });
        }
      });

      this.logActivity(
        'Pendaftaran Massal (Bulk)',
        `Berhasil mendaftarkan ${results.length} peserta sekaligus untuk lomba ${comp.name}.`
      );
      this.saveAll();
      return results;
    },

    updateParticipant(id: string, updatedData: Partial<Participant>) {
      const idx = this.participants.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.participants[idx] = { ...this.participants[idx], ...updatedData };
        this.logActivity('Data Peserta Diperbarui', `Peserta ${this.participants[idx].name} telah diperbarui.`);
        this.saveAll();
      }
    },

    deleteParticipant(id: string) {
      const part = this.participants.find(p => p.id === id);
      this.participants = this.participants.filter(p => p.id !== id);
      this.registrations = this.registrations.filter(r => r.participantId !== id);
      this.scores = this.scores.filter(s => s.participantId !== id);
      this.logActivity('Peserta Dihapus', `Peserta ${part?.name || id} telah dihapus dari sistem.`);
      this.saveAll();
    },

    updateRegistrationStatus(id: string, status: RegistrationStatus) {
      const reg = this.registrations.find(r => r.id === id);
      if (reg) {
        reg.status = status;
        this.logActivity('Status Peserta Diubah', `Nomor ${reg.participantNumber} diubah statusnya menjadi ${status}.`);
        this.saveAll();
      }
    },

    bulkUpdateRegistrationStatus(ids: string[], status: RegistrationStatus) {
      let count = 0;
      ids.forEach(id => {
        const reg = this.registrations.find(r => r.id === id);
        if (reg) {
          reg.status = status;
          count++;
        }
      });
      if (count > 0) {
        this.logActivity('Status Peserta Massal (Bulk)', `${count} peserta diubah statusnya menjadi ${status}.`);
        this.saveAll();
      }
    },

    // Scoring & Winners
    addScore(scoreData: Omit<Score, 'id' | 'createdAt'>) {
      const score: Score = {
        ...scoreData,
        id: 'score-' + uuidv4().substring(0, 8),
        createdAt: new Date().toISOString()
      };
      this.scores.push(score);
      this.logActivity('Penilaian Dicatat', `Juri ${score.judgeName} memberikan nilai ${score.score}.`);
      this.saveAll();
      return score;
    },

    saveCompetitionWinners(competitionId: string, firstPlaceId?: string, secondPlaceId?: string, thirdPlaceId?: string) {
      let winner = this.winners.find(w => w.competitionId === competitionId);
      if (!winner) {
        winner = {
          id: 'win-' + uuidv4().substring(0, 8),
          competitionId,
          firstPlaceId,
          secondPlaceId,
          thirdPlaceId,
          decidedAt: new Date().toISOString()
        };
        this.winners.push(winner);
      } else {
        winner.firstPlaceId = firstPlaceId;
        winner.secondPlaceId = secondPlaceId;
        winner.thirdPlaceId = thirdPlaceId;
        winner.decidedAt = new Date().toISOString();
      }

      // Automatically update competition status to Finished
      const comp = this.competitions.find(c => c.id === competitionId);
      if (comp) comp.status = 'Finished';

      this.logActivity('Juara Ditetapkan', `Pemenang lomba ${comp?.name || competitionId} resmi ditetapkan.`);
      this.saveAll();
    },

    // Certificates Generator
    async generateBatchCertificates(competitionId: string) {
      const comp = this.competitions.find(c => c.id === competitionId);
      const winner = this.winners.find(w => w.competitionId === competitionId);
      const regs = this.registrations.filter(r => r.competitionId === competitionId);

      if (!comp) return [];

      const newCerts: Certificate[] = [];

      for (const reg of regs) {
        const participant = this.participants.find(p => p.id === reg.participantId);
        if (!participant) continue;

        let title: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Peserta' = 'Peserta';
        if (winner?.firstPlaceId === participant.id) title = 'Juara 1';
        else if (winner?.secondPlaceId === participant.id) title = 'Juara 2';
        else if (winner?.thirdPlaceId === participant.id) title = 'Juara 3';

        const certNo = `CERT/17AN/${this.settings.eventYear}/${comp.prefix}/${reg.participantNumber}`;
        const verifyCode = uuidv4().substring(0, 8).toUpperCase();

        // Check if certificate already generated
        let cert = this.certificates.find(c => c.participantId === participant.id && c.competitionId === competitionId);

        if (!cert) {
          const qrText = `https://17an-arena.local/verify?code=${verifyCode}&cert=${certNo}`;
          let qrCodeUrl = '';
          try {
            qrCodeUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 120 });
          } catch (e) {
            console.error('QR code generation error:', e);
          }

          cert = {
            id: 'cert-' + uuidv4().substring(0, 8),
            certificateNo: certNo,
            participantId: participant.id,
            competitionId,
            title,
            issueDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            verificationCode: verifyCode,
            qrCodeUrl
          };

          this.certificates.push(cert);
        } else {
          cert.title = title;
        }
        newCerts.push(cert);
      }

      this.logActivity('Sertifikat Digenerate', `Dibuat ${newCerts.length} sertifikat untuk lomba ${comp.name}.`);
      this.saveAll();
      return newCerts;
    },

    // Doorprizing
    addDoorprize(item: Omit<Doorprize, 'id'>) {
      const dp: Doorprize = {
        ...item,
        id: 'dp-' + uuidv4().substring(0, 8)
      };
      this.doorprizes.push(dp);
      this.logActivity('Doorprize Ditambahkan', `Hadiah ${dp.name} telah dimasukkan.`);
      this.saveAll();
    },

    setDoorprizeWinner(doorprizeId: string, participantId: string) {
      const dp = this.doorprizes.find(d => d.id === doorprizeId);
      if (dp) {
        dp.winnerParticipantId = participantId;
        dp.wonAt = new Date().toISOString();
        const part = this.participants.find(p => p.id === participantId);
        this.logActivity('Doorprize Dimenangkan', `Hadiah ${dp.name} dimenangkan oleh ${part?.name || participantId}.`);
        this.saveAll();
      }
    },

    resetDoorprizeWinner(doorprizeId: string) {
      const dp = this.doorprizes.find(d => d.id === doorprizeId);
      if (dp) {
        dp.winnerParticipantId = undefined;
        dp.wonAt = undefined;
        this.saveAll();
      }
    },

    // Settings
    updateSettings(newSettings: Partial<AppSettings>) {
      this.settings = { ...this.settings, ...newSettings };
      this.logActivity('Pengaturan Diperbarui', 'Pengaturan acara 17an berhasil disimpan.');
      this.saveAll();
    },

    // WhatsApp Template Manager
    addWaTemplate(template: Omit<WaTemplate, 'id'>) {
      const newTpl: WaTemplate = {
        ...template,
        id: 'tpl-' + uuidv4().substring(0, 8)
      };
      this.waTemplates.push(newTpl);
      this.logActivity('Template WA Ditambahkan', `Template "${newTpl.title}" berhasil disimpan.`);
      this.saveAll();
      return newTpl;
    },

    updateWaTemplate(id: string, updated: Partial<WaTemplate>) {
      const idx = this.waTemplates.findIndex(t => t.id === id);
      if (idx !== -1) {
        this.waTemplates[idx] = { ...this.waTemplates[idx], ...updated };
        this.logActivity('Template WA Diperbarui', `Template "${this.waTemplates[idx].title}" diperbarui.`);
        this.saveAll();
      }
    },

    deleteWaTemplate(id: string) {
      const idx = this.waTemplates.findIndex(t => t.id === id);
      if (idx !== -1) {
        const title = this.waTemplates[idx].title;
        this.waTemplates.splice(idx, 1);
        this.logActivity('Template WA Dihapus', `Template "${title}" berhasil dihapus.`);
        this.saveAll();
      }
    },

    resetWaTemplates() {
      this.waTemplates = JSON.parse(JSON.stringify(DEFAULT_WA_TEMPLATES));
      this.logActivity('Template WA Direset', 'Template WhatsApp dikembalikan ke bawaan.');
      this.saveAll();
    },

    // Committee Actions
    addCommitteeMember(member: Omit<CommitteeMember, 'id' | 'idCardNumber' | 'joinedAt'>) {
      const seq = String(this.committees.length + 1).padStart(3, '0');
      const newMember: CommitteeMember = {
        ...member,
        id: 'pnt-' + uuidv4().substring(0, 8),
        idCardNumber: `PNT-${seq}`,
        joinedAt: new Date().toISOString()
      };
      this.committees.push(newMember);
      this.logActivity('Panitia Ditambahkan', `Panitia ${newMember.name} (${newMember.role}) berhasil ditambahkan.`);
      this.saveAll();
      return newMember;
    },

    updateCommitteeMember(id: string, updated: Partial<CommitteeMember>) {
      const idx = this.committees.findIndex(m => m.id === id);
      if (idx !== -1) {
        this.committees[idx] = { ...this.committees[idx], ...updated };
        this.logActivity('Panitia Diperbarui', `Data panitia ${this.committees[idx].name} telah diperbarui.`);
        this.saveAll();
      }
    },

    deleteCommitteeMember(id: string) {
      const m = this.committees.find(item => item.id === id);
      this.committees = this.committees.filter(item => item.id !== id);
      this.logActivity('Panitia Dihapus', `Panitia ${m?.name || id} telah dihapus.`);
      this.saveAll();
    },

    bulkAddCommitteeMembers(membersList: { name: string; role?: string; section?: string; phone?: string; rtRw?: string }[]) {
      const added: CommitteeMember[] = [];
      membersList.forEach((item) => {
        if (!item.name || !item.name.trim()) return;
        const seq = String(this.committees.length + 1).padStart(3, '0');
        const newMember: CommitteeMember = {
          id: 'pnt-' + uuidv4().substring(0, 8),
          name: item.name.trim(),
          role: item.role?.trim() || 'Anggota Panitia',
          section: item.section?.trim() || 'Panitia HUT RI',
          phone: item.phone?.trim() || '-',
          rtRw: item.rtRw?.trim() || '-',
          idCardNumber: `PNT-${seq}`,
          joinedAt: new Date().toISOString()
        };
        this.committees.push(newMember);
        added.push(newMember);
      });
      this.logActivity('Bulk Add Panitia', `Berhasil mengimpor ${added.length} panitia sekaligus.`);
      this.saveAll();
      return added;
    }
  }
});
