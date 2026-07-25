export interface MessageOptions {
  phone: string;
  participantName: string;
  participantNumber: string;
  competitionName: string;
  location?: string;
  time?: string;
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWaitingLoungeCallMessage(opts: MessageOptions): string {
  const text = `Halo 👋

Panggilan Peserta Lomba Kemerdekaan 🇮🇩

*Peserta:* ${opts.participantName}
*Nomor Peserta:* ${opts.participantNumber}
*Lomba:* ${opts.competitionName}
${opts.location ? `*Lokasi:* ${opts.location}\n` : ''}${opts.time ? `*Jam:* ${opts.time}\n` : ''}
Silakan segera menuju area pertandingan / panggung.

Terima kasih.`;

  const phone = cleanPhoneNumber(opts.phone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateRegistrationConfirmationMessage(opts: MessageOptions): string {
  const text = `Halo ${opts.participantName}! 🎉

Pendaftaran Lomba Kemerdekaan Berhasil! 🇮🇩

*Nomor Peserta:* ${opts.participantNumber}
*Lomba:* ${opts.competitionName}
${opts.location ? `*Lokasi:* ${opts.location}\n` : ''}${opts.time ? `*Waktu:* ${opts.time}\n` : ''}
Harap hadir 15 menit sebelum lomba dimulai dan tunjukkan nomor peserta ini kepada panitia.

Semangat berlomba & Merdeka! ✊`;

  const phone = cleanPhoneNumber(opts.phone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function renderBulkTemplate(
  templateText: string,
  data: {
    participantName: string;
    participantNumber: string;
    competitionName: string;
    location?: string;
    status?: string;
    time?: string;
    category?: string;
  }
): string {
  let rendered = templateText;
  rendered = rendered.replace(/\{nama\}/gi, data.participantName || '');
  rendered = rendered.replace(/\{nomor\}/gi, data.participantNumber || '');
  rendered = rendered.replace(/\{lomba\}/gi, data.competitionName || '');
  rendered = rendered.replace(/\{lokasi\}/gi, data.location || '-');
  rendered = rendered.replace(/\{status\}/gi, data.status || '-');
  rendered = rendered.replace(/\{waktu\}/gi, data.time || '-');
  rendered = rendered.replace(/\{kategori\}/gi, data.category || '-');
  return rendered;
}

export function generateWaLink(phone: string, text: string): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  if (!cleanedPhone) return '#';
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
}

