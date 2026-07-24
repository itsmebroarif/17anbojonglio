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

export function generateWinnerNotificationMessage(opts: MessageOptions & { rank: string; point: number }): string {
  const text = `Selamat ${opts.participantName}! 🏆

Anda dinyatakan sebagai *${opts.rank}* pada lomba *${opts.competitionName}* 🇮🇩!

*Total Poin:* ${opts.point}
Penyerahan hadiah dan sertifikat akan dilaksanakan saat Malam Puncak Kemerdekaan.

Terima kasih atas partisipasi luar biasa Anda! 👏`;

  const phone = cleanPhoneNumber(opts.phone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
