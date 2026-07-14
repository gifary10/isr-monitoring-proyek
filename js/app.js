import { getElement, setValue, showElement, setButtonLoading } from './dom/DOMHelpers.js';
import { FormManager } from './dom/FormManager.js';
import { SignaturePad } from './signature/SignaturePad.js';
import { ReportGenerator } from './report/ReportGenerator.js';
import { DownloadManager } from './report/DownloadManager.js';
import { getCurrentDate, getCurrentTime } from './utils/dateUtils.js';

/**
 * Main Application
 */

class App {
  constructor() {
    // Initialize managers
    this.formManager = new FormManager();
    this.signaturePad = new SignaturePad(
      'signatureCanvas',
      'signatureStatus',
      'clearSignature',
      'confirmSignature'
    );
    this.reportGenerator = new ReportGenerator('reportCanvas');
    this.downloadManager = new DownloadManager();

    // DOM elements
    this.generateBtn = getElement('generateBtn');
    this.downloadGroup = getElement('downloadGroup');
    this.downloadPdfBtn = getElement('downloadPdf');
    this.downloadPngBtn = getElement('downloadPng');
    this.dokumentasiInput = getElement('dokumentasi');

    // State
    this.loadedImages = [];

    this.init();
    this.setupEventListeners();
  }

  init() {
    // Set default date and time
    setValue('tanggal', getCurrentDate());
    setValue('waktu', getCurrentTime());

    // Initialize signature pad
    this.signaturePad.init();
  }

  setupEventListeners() {
    // File upload preview
    this.dokumentasiInput.addEventListener('change', (e) => {
      this.handleFileUpload(e);
    });

    // Generate report button
    this.generateBtn.addEventListener('click', () => {
      this.generateReport();
    });

    // Download buttons
    this.downloadPdfBtn.addEventListener('click', () => {
      this.downloadManager.downloadPDF(this.reportGenerator.getReportDataUrl());
    });

    this.downloadPngBtn.addEventListener('click', () => {
      this.downloadManager.downloadPNG(this.reportGenerator.getReportDataUrl());
    });
  }

  handleFileUpload(e) {
    const files = Array.from(e.target.files);
    this.formManager.clearPreview();
    this.loadedImages = [];

    if (files.length === 0) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.src = ev.target.result;
        img.onload = () => {
          this.loadedImages.push(img);
          this.formManager.addPreviewImage(ev.target.result);
        };
      };
      reader.readAsDataURL(file);
    });
  }

  generateReport() {
    // Validate form
    if (!this.formManager.validate()) return;
    
    // Validate signature
    if (!this.signaturePad.isConfirmedSignature()) {
      alert('Mohon tanda tangan digital dan konfirmasi terlebih dahulu.');
      return;
    }

    // Set loading state
    setButtonLoading('generateBtn', true);

    // Get signature image
    const sigImg = this.signaturePad.getSignatureImage();
    if (!sigImg) {
      setButtonLoading('generateBtn', false);
      return;
    }

    // Get form data
    const formData = this.formManager.getFormData();

    // Set data for report generator
    this.reportGenerator.setLoadedImages(this.loadedImages);
    this.reportGenerator.setSignatureImage(sigImg);

    // Generate report
    sigImg.onload = () => {
      this.reportGenerator.generate(formData);
      
      // Show download buttons
      showElement('downloadGroup');
      
      // Reset button state
      setButtonLoading('generateBtn', false);
      
      // Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    // Handle image load error
    sigImg.onerror = () => {
      setButtonLoading('generateBtn', false);
      alert('Error loading signature image. Silakan coba lagi.');
    };
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});