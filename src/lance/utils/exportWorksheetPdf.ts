import { jsPDF } from 'jspdf';

// Real, typeset PDF export for worksheet-style tools (Crisis Safety Plan, Coping Cards, etc.) —
// the "hand this to your therapist / put it on the fridge" artifacts. Shared by any tool that
// wants a real downloadable document instead of a copy-to-clipboard string.

interface WorksheetSection {
  label: string;
  body: string;
}

interface ExportWorksheetPdfOptions {
  title: string;
  subtitle?: string;
  sections: WorksheetSection[];
  footerNote?: string;
}

const MINT = [127, 217, 140] as const; // #7FD98C
const TEAL = [62, 207, 207] as const; // #3ECFCF
const INK = [60, 60, 60] as const; // #3C3C3C
const MUTED = [107, 114, 128] as const; // #6B7280

export function exportWorksheetPdf({ title, subtitle, sections, footerNote }: ExportWorksheetPdfOptions): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Header band
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageWidth, 86, 'F');
  doc.setFillColor(...MINT);
  doc.rect(0, 82, pageWidth, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(title, margin, 46);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(subtitle, margin, 66);
  }

  y = 116;

  const addPageIfNeeded = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - 60) {
      doc.addPage();
      y = 48;
    }
  };

  sections.forEach((section) => {
    if (!section.body.trim()) return;

    addPageIfNeeded(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...TEAL);
    doc.text(section.label.toUpperCase(), margin, y);
    y += 8;
    doc.setDrawColor(...MINT);
    doc.setLineWidth(1.5);
    doc.line(margin, y, margin + 36, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(section.body, contentWidth) as string[];
    lines.forEach((line) => {
      addPageIfNeeded(16);
      doc.text(line, margin, y);
      y += 15;
    });
    y += 14;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const stamp = `Generated ${new Date().toLocaleDateString()} · Rehabit${footerNote ? ' · ' + footerNote : ''}`;
    doc.text(stamp, margin, pageHeight - 30);
    doc.text(`${i} / ${pageCount}`, pageWidth - margin - 24, pageHeight - 30);
  }

  const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  doc.save(`${filename || 'worksheet'}.pdf`);
}
