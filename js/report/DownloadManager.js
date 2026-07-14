/**
 * Download Manager - handles PDF and PNG downloads
 */

export class DownloadManager {
  constructor() {
    this.pdfLib = window.jspdf;
  }

  downloadPDF(imageDataUrl, filename = 'HSE_Report') {
    if (!imageDataUrl) {
      alert('Hasilkan laporan terlebih dahulu.');
      return;
    }
    
    const { jsPDF } = this.pdfLib;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imageDataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    
    pdf.addImage(imageDataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
    
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imageDataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }
    
    const dateStr = new Date().toISOString().slice(0, 10);
    pdf.save(`${filename}_${dateStr}.pdf`);
  }

  downloadPNG(imageDataUrl, filename = 'HSE_Report') {
    if (!imageDataUrl) {
      alert('Hasilkan laporan terlebih dahulu.');
      return;
    }
    
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `${filename}_${dateStr}.png`;
    link.href = imageDataUrl;
    link.click();
  }
}