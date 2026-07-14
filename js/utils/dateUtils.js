/**
 * Utility functions for date formatting
 */

export function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('-');
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${parseInt(day)} ${bulan[parseInt(month) - 1]} ${year}`;
}

export function getCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getCurrentTime() {
  const today = new Date();
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getFormattedDateTime() {
  const now = new Date();
  return {
    tanggalLaporan: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    jamLaporan: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}