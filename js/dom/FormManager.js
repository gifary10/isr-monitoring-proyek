import { getElement, getValueTrim, getValue } from './DOMHelpers.js';

/**
 * Form Manager - handles form data collection and validation
 */

export class FormManager {
  constructor() {
    this.elements = {
      tanggal: getElement('tanggal'),
      waktu: getElement('waktu'),
      lokasi: getElement('lokasi'),
      vendor: getElement('vendor'),
      aktivitas: getElement('aktivitas'),
      peralatan: getElement('peralatan'),
      kategori: getElement('kategori'),
      deskripsi: getElement('deskripsi'),
      rekomendasi: getElement('rekomendasi'),
      dokumentasi: getElement('dokumentasi'),
      preview: getElement('imagePreview')
    };
  }

  getFormData() {
    return {
      tanggal: getValue('tanggal'),
      waktu: getValue('waktu'),
      lokasi: getValueTrim('lokasi'),
      vendor: getValueTrim('vendor'),
      aktivitas: getValueTrim('aktivitas'),
      peralatan: getValueTrim('peralatan') || '-',
      kategori: getValue('kategori'),
      deskripsi: getValueTrim('deskripsi'),
      rekomendasi: getValueTrim('rekomendasi')
    };
  }

  validate() {
    const data = this.getFormData();
    const required = ['tanggal', 'waktu', 'lokasi', 'vendor', 'aktivitas', 'kategori', 'deskripsi', 'rekomendasi'];
    
    for (const field of required) {
      if (!data[field]) {
        alert('Mohon lengkapi semua field wajib (kecuali Peralatan dan foto).');
        return false;
      }
    }
    return true;
  }

  getLoadedImages() {
    return this.loadedImages || [];
  }

  setLoadedImages(images) {
    this.loadedImages = images;
  }

  clearPreview() {
    this.elements.preview.innerHTML = '';
  }

  addPreviewImage(src) {
    const thumb = document.createElement('img');
    thumb.src = src;
    this.elements.preview.appendChild(thumb);
  }
}