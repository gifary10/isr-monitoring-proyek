import { isCanvasBlank, resizeCanvas } from '../utils/canvasUtils.js';
import { getElement, setInnerHTML } from '../dom/DOMHelpers.js';

/**
 * Signature Pad - handles digital signature drawing
 */

export class SignaturePad {
  constructor(canvasId, statusId, clearBtnId, confirmBtnId) {
    this.canvas = getElement(canvasId);
    this.statusEl = getElement(statusId);
    this.clearBtn = getElement(clearBtnId);
    this.confirmBtn = getElement(confirmBtnId);
    
    this.isDrawing = false;
    this.signatureDataUrl = null;
    this.isConfirmed = false;
    this.ctx = null;
    
    this.init();
    this.setupEventListeners();
  }

  init() {
    this.ctx = resizeCanvas(this.canvas, this.canvas.clientWidth, 180, 2);
    this.ctx.strokeStyle = '#1a4a7a';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.clear();
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.signatureDataUrl = null;
    this.isConfirmed = false;
    this.updateStatus(false);
  }

  updateStatus(confirmed) {
    if (confirmed) {
      this.statusEl.className = 'signature-status signed';
      setInnerHTML(this.statusEl.id, '<i class="bi bi-check-circle-fill"></i> <span>Tanda tangan telah dikonfirmasi</span>');
    } else {
      this.statusEl.className = 'signature-status unsigned';
      setInnerHTML(this.statusEl.id, '<i class="bi bi-exclamation-circle-fill"></i> <span>Silakan tanda tangan di atas</span>');
    }
  }

  getPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / (2 * rect.width);
    const scaleY = this.canvas.height / (2 * rect.height);
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) / scaleX,
      y: (clientY - rect.top) / scaleY
    };
  }

  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getPosition(e);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getPosition(e);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();
    this.signatureDataUrl = this.canvas.toDataURL();
    if (isCanvasBlank(this.canvas)) {
      this.signatureDataUrl = null;
      this.isConfirmed = false;
      this.updateStatus(false);
    }
  }

  confirm() {
    if (isCanvasBlank(this.canvas)) {
      alert('Silakan tanda tangan terlebih dahulu sebelum mengkonfirmasi.');
      return;
    }
    this.isConfirmed = true;
    this.signatureDataUrl = this.canvas.toDataURL();
    this.updateStatus(true);
  }

  getSignatureImage() {
    if (!this.isConfirmed || !this.signatureDataUrl) return null;
    const img = new Image();
    img.src = this.signatureDataUrl;
    return img;
  }

  isConfirmedSignature() {
    return this.isConfirmed && this.signatureDataUrl !== null;
  }

  getSignatureDataUrl() {
    return this.signatureDataUrl;
  }

  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDrawing(e);
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.draw(e);
    });
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.stopDrawing();
    });

    // Button events
    this.clearBtn.addEventListener('click', () => this.clear());
    this.confirmBtn.addEventListener('click', () => this.confirm());

    // Handle window resize
    window.addEventListener('resize', () => {
      if (!this.isConfirmed) {
        this.init();
      }
    });
  }
}