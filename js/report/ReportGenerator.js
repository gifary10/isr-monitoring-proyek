import { wrapText } from '../utils/canvasUtils.js';
import { formatTanggalIndo, getFormattedDateTime } from '../utils/dateUtils.js';

/**
 * Report Generator - generates report canvas from form data
 */

export class ReportGenerator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.reportImageDataUrl = null;
    this.reportData = null;
    this.loadedImages = [];
    this.signatureImg = null;
  }

  setLoadedImages(images) {
    this.loadedImages = images || [];
  }

  setSignatureImage(img) {
    this.signatureImg = img;
  }

  generate(data) {
    const now = getFormattedDateTime();
    
    this.reportData = {
      ...data,
      tanggalLaporan: now.tanggalLaporan,
      jamLaporan: now.jamLaporan,
      hseStaff: 'Gifary Setia Putra'
    };

    const width = 800;
    const height = 1200;
    const ctx = this.ctx;

    // Clear and set canvas
    this.canvas.width = width;
    this.canvas.height = height;

    // Background with subtle gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#f8faff');
    bgGradient.addColorStop(1, '#eef3f9');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw header
    this.drawHeader(ctx, width);

    let yPos = 145;
    const leftX = 50;
    const rightX = 430;

    // Draw form data
    yPos = this.drawFormData(ctx, leftX, rightX, yPos);

    // Draw separator
    this.drawSeparator(ctx, width, yPos);
    yPos += 30;

    // Draw documentation
    yPos = this.drawDocumentation(ctx, leftX, width, yPos);

    // Draw signature
    yPos = this.drawSignature(ctx, leftX, yPos);

    // Draw footer
    this.drawFooter(ctx, width);

    // Crop canvas to content
    this.cropCanvas(width, yPos);
  }

  drawHeader(ctx, width) {
    // Header background with blue gradient
    const headerGradient = ctx.createLinearGradient(0, 0, 0, 130);
    headerGradient.addColorStop(0, '#0d2b4b');
    headerGradient.addColorStop(0.5, '#1a4a7a');
    headerGradient.addColorStop(1, '#2a6ab0');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, width, 130);
    
    // Decorative accent line
    ctx.fillStyle = '#6ab0ff';
    ctx.fillRect(0, 130, width, 4);

    // Shield icon
    ctx.fillStyle = '#6ab0ff';
    ctx.font = '40px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🛡️', 40, 75);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('HSE MONITORING PROYEK', 90, 60);
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#b8d4f0';
    ctx.fillText('Laporan Temuan & Ketidaksesuaian', 90, 90);
    
    // Report ID / Date badge
    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.roundRect ? ctx.roundRect(width - 180, 20, 150, 35, 8) : null;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(width - 180, 20, 150, 35, 8) : ctx.rect(width - 180, 20, 150, 35);
    ctx.fill();
    ctx.fillStyle = '#b8d4f0';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`📋 Laporan: ${dateStr}`, width - 175, 44);
  }

  drawFormData(ctx, leftX, rightX, yPos) {
    const data = this.reportData;
    
    // Section title
    ctx.fillStyle = '#1a4a7a';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('📋 DATA TEMUAN', leftX, yPos);
    yPos += 35;
    
    // Data fields with modern card style
    this.drawField(ctx, '📅 Tanggal', formatTanggalIndo(data.tanggal), leftX, yPos);
    this.drawField(ctx, '⏰ Waktu', data.waktu, rightX, yPos);
    yPos += 55;

    this.drawField(ctx, '📍 Lokasi', data.lokasi, leftX, yPos);
    this.drawField(ctx, '🏢 Vendor/Kontraktor', data.vendor, rightX, yPos);
    yPos += 55;

    this.drawField(ctx, '🔧 Aktivitas', data.aktivitas, leftX, yPos);
    this.drawField(ctx, '⚙️ Peralatan/Mesin', data.peralatan, rightX, yPos);
    yPos += 65;

    // Category with modern badge
    this.drawCategory(ctx, data.kategori, leftX, yPos);
    yPos += 60;

    // Description
    yPos = this.drawTextBlock(ctx, '📋 Deskripsi Temuan', data.deskripsi, leftX, yPos);

    // Recommendation
    yPos = this.drawTextBlock(ctx, '💡 Rekomendasi Perbaikan', data.rekomendasi, leftX, yPos);

    return yPos;
  }

  drawField(ctx, label, value, x, y) {
    ctx.fillStyle = '#4a6a8a';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#1a3a5a';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(value || '-', x, y + 24);
  }

  drawCategory(ctx, category, leftX, yPos) {
    ctx.fillStyle = '#4a6a8a';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('⚠️ Kategori Temuan', leftX, yPos);
    
    const categoryColors = {
      'Unsafe Act': '#dc3545',
      'Unsafe Condition': '#fd7e14',
      'Environmental': '#28a745',
      'Equipment Failure': '#6f42c1',
      'Procedural': '#007bff'
    };
    const catColor = categoryColors[category] || '#2a6ab0';
    const catText = category || '-';
    const catWidth = ctx.measureText(catText).width + 40;
    
    // Modern pill badge
    ctx.shadowColor = 'rgba(0,0,0,0.05)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = catColor + '15';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(leftX - 5, yPos + 5, catWidth + 10, 28, 14) : ctx.rect(leftX - 5, yPos + 5, catWidth + 10, 28);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = catColor;
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(catText, leftX + 15, yPos + 26);
  }

  drawTextBlock(ctx, label, text, leftX, yPos) {
    ctx.fillStyle = '#4a6a8a';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(label, leftX, yPos);
    ctx.fillStyle = '#1a3a5a';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    const lines = wrapText(ctx, text, 700);
    lines.forEach((line, i) => {
      ctx.fillText(line, leftX, yPos + 24 + i * 22);
    });
    return yPos + 35 + lines.length * 22;
  }

  drawSeparator(ctx, width, yPos) {
    ctx.strokeStyle = '#b8cce0';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(40, yPos);
    ctx.lineTo(width - 40, yPos);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawDocumentation(ctx, leftX, width, yPos) {
    if (this.loadedImages.length > 0) {
      ctx.fillStyle = '#1a4a7a';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('📸 Dokumentasi Temuan', leftX, yPos);
      yPos += 35;

      let currentX = leftX;
      const maxImgWidth = 160;
      const maxImgHeight = 120;
      const gap = 15;

      this.loadedImages.forEach((img, index) => {
        if (currentX + maxImgWidth > width - 40) {
          currentX = leftX;
          yPos += maxImgHeight + gap;
        }
        
        // Image card shadow
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(currentX - 5, yPos - 5, maxImgWidth + 10, maxImgHeight + 10, 8) : ctx.rect(currentX - 5, yPos - 5, maxImgWidth + 10, maxImgHeight + 10);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.drawImage(img, currentX, yPos, maxImgWidth, maxImgHeight);
        
        // Image number badge
        ctx.fillStyle = 'rgba(13,43,75,0.8)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(currentX + 5, yPos + 5, 28, 20, 10) : ctx.rect(currentX + 5, yPos + 5, 28, 20);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`#${index + 1}`, currentX + 12, yPos + 20);
        
        currentX += maxImgWidth + gap;
      });
      yPos += maxImgHeight + 40;
    } else {
      ctx.fillStyle = '#8a9aa8';
      ctx.font = 'italic 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('📷 Tidak ada foto dokumentasi', leftX, yPos + 15);
      yPos += 45;
    }
    return yPos;
  }

  drawSignature(ctx, leftX, yPos) {
    // Signature section with modern card
    ctx.shadowColor = 'rgba(0,0,0,0.04)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#f8faff';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(leftX - 10, yPos - 10, 380, 160, 12) : ctx.rect(leftX - 10, yPos - 10, 380, 160);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#1a4a7a';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✍️ Tanda Tangan Digital', leftX + 10, yPos + 15);
    
    yPos += 30;
    
    if (this.signatureImg && this.signatureImg.complete) {
      ctx.drawImage(this.signatureImg, leftX + 10, yPos, 250, 80);
    }
    
    ctx.fillStyle = '#1a3a5a';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Gifary Setia Putra', leftX + 10, yPos + 110);
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6a8aaa';
    ctx.fillText('HSE Staff', leftX + 10, yPos + 130);
    
    return yPos + 165;
  }

  drawFooter(ctx, width) {
    const data = this.reportData;
    const footerY = this.canvas.height - 70;
    
    ctx.fillStyle = '#f0f5fc';
    ctx.fillRect(0, footerY, width, 70);
    
    ctx.fillStyle = '#2a6ab0';
    ctx.fillRect(0, footerY, width, 3);
    
    ctx.fillStyle = '#4a6a8a';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`📅 Dibuat: ${data.tanggalLaporan}  •  ${data.jamLaporan}`, 40, footerY + 30);
    ctx.fillText(`👤 HSE Staff: ${data.hseStaff}  •  © ${new Date().getFullYear()} All Rights Reserved`, 40, footerY + 50);
  }

  cropCanvas(width, yPos) {
    const finalHeight = yPos + 100;
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = width;
    resizedCanvas.height = finalHeight;
    const resizedCtx = resizedCanvas.getContext('2d');
    resizedCtx.drawImage(this.canvas, 0, 0, width, finalHeight, 0, 0, width, finalHeight);
    
    this.canvas.width = width;
    this.canvas.height = finalHeight;
    this.canvas.getContext('2d').drawImage(resizedCanvas, 0, 0);
    
    this.reportImageDataUrl = this.canvas.toDataURL('image/png');
  }

  getReportDataUrl() {
    return this.reportImageDataUrl;
  }

  getReportData() {
    return this.reportData;
  }
}