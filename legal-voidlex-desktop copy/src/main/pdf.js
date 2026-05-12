const PDFDocument = require('pdfkit');
const fs = require('fs');
const { dialog } = require('electron');

class VoidlexPDFGenerator {
  async generate(caseRecord) {
    const { intake, strategy, case_serial } = caseRecord;
    
    // 1. Show file save dialog to user
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Voidlex Strategic Synthesis',
      defaultPath: `VOIDLEX_STRATEGY_${(intake.last_name || 'CASE').toUpperCase()}_VS_${(intake.opponent || 'UNKNOWN').toUpperCase().replace(/\s+/g, '_')}.pdf`,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });

    if (!filePath) return null; // Cancelled

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 54, bottom: 54, left: 72, right: 54 },
          bufferPages: true
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Define color palette
        const goldColor = '#fbbf24';
        const primaryDark = '#0f172a';
        const textMuted = '#64748b';
        const textDark = '#1e293b';

        // --- COVER PAGE ---
        // Top dark banner
        doc.rect(0, 0, doc.page.width, 220).fill(primaryDark);
        
        // Brand logo
        doc.fillColor(goldColor)
           .font('Helvetica-Bold')
           .fontSize(32)
           .text('VOIDLEX', 72, 80, { characterSpacing: 4 });
           
        doc.fillColor('#ffffff')
           .font('Helvetica')
           .fontSize(11)
           .text('LEGAL INTELLIGENCE ENGINE', 72, 125, { characterSpacing: 2 });

        doc.fillColor(textMuted)
           .fontSize(8)
           .text('A DIVISION OF IMPERIAL EMINENCE CYBERGUARD CORPORATION (IECC)', 72, 145);

        // Cover page info box
        doc.y = 260;
        doc.fillColor(primaryDark)
           .font('Helvetica-Bold')
           .fontSize(22)
           .text('Strategic Legal Synthesis Report', { lineGap: 6 });
           
        doc.fillColor(textMuted)
           .font('Helvetica')
           .fontSize(11)
           .text(`Case Reference: ${case_serial || 'VLX-STRAT-001'}`)
           .text(`Generated: ${new Date().toISOString().split('T')[0]} UTC`)
           .moveDown(3);

        // Intake details grid
        const drawGridItem = (label, value) => {
          doc.fillColor(textMuted).font('Helvetica-Bold').fontSize(9).text(label.toUpperCase(), { lineGap: 2 });
          doc.fillColor(textDark).font('Helvetica').fontSize(11).text(value || 'N/A').moveDown(1);
        };

        drawGridItem('Client Name', `${intake.first_name || ''} ${intake.last_name || ''}`.trim());
        drawGridItem('Jurisdiction / Country', intake.country);
        drawGridItem('Opponent / Organization', intake.opponent);
        drawGridItem('Case Category', intake.category);
        drawGridItem('Urgency Level', intake.urgency);

        doc.addPage();

        // --- CORE ANALYSIS SECTIONS ---
        const sections = [
          { title: "I. Executive Summary", key: "executive_summary" },
          { title: "II. Legal Position Analysis", key: "legal_position_analysis" },
          { title: "III. Core Strengths", key: "strengths", isList: true },
          { title: "IV. Strategic Weaknesses", key: "weaknesses", isList: true },
          { title: "V. Recommendations", key: "strategic_recommendations", isList: true },
          { title: "VI. Required Documents", key: "required_documents", isList: true },
          { title: "VII. Immediate Legal Actions", key: "immediate_legal_actions", isList: true },
          { title: `VIII. ${strategy.draft_document_title || 'Draft Strategic Document'}`, key: "draft_document_body", isMonospace: true },
          { title: "IX. Risk Assessment", key: "risk_assessment" },
          { title: "X. Next Steps", key: "next_steps", isList: true },
          { title: "XI. Strategic Risk Score", key: "risk_score" },
          { title: "XII. Total Strategic Readiness Score", key: "total_readiness_score", isBadge: true },
          { title: "XIII. Global Optimization Blueprint", key: "global_optimization_blueprint" }
        ];

        sections.forEach((sec) => {
          let content = strategy[sec.key];
          if (!content) return;

          // Header block
          doc.rect(72, doc.y, doc.page.width - 126, 22).fill('#f1f5f9');
          doc.fillColor(primaryDark)
             .font('Helvetica-Bold')
             .fontSize(10)
             .text(`   ${sec.title.toUpperCase()}`, 72, doc.y - 17);
          
          doc.y += 12;

          // Handle list vs block vs code/document formats
          if (sec.isList) {
            const listItems = Array.isArray(content) ? content : String(content).split('\n');
            listItems.forEach(item => {
              if (item.trim() === '') return;
              const cleanItem = item.trim().replace(/^[•\-\*]\s*/, '');
              doc.fillColor(textDark)
                 .font('Helvetica')
                 .fontSize(9.5)
                 .text(`•  ${cleanItem}`, 86, doc.y, { width: doc.page.width - 140, lineGap: 3 });
              doc.y += 4;
            });
            doc.y += 12;
          } else if (sec.isMonospace) {
            // Document Draft styling (Times-Roman formal)
            doc.rect(72, doc.y, doc.page.width - 126, 1).fill('#cbd5e1');
            doc.y += 10;
            
            doc.fillColor('#0f172a')
               .font('Times-Roman')
               .fontSize(10)
               .text(content, 76, doc.y, { width: doc.page.width - 134, lineGap: 4 });
               
            doc.y += 14;
            doc.rect(72, doc.y, doc.page.width - 126, 1).fill('#cbd5e1');
            doc.y += 16;
          } else if (sec.isBadge) {
            doc.y += 4;
            doc.fillColor(goldColor)
               .font('Helvetica-Bold')
               .fontSize(32)
               .text(`${content}%`, 80, doc.y, { lineGap: 4 });
            doc.fillColor(textMuted)
               .font('Helvetica')
               .fontSize(8)
               .text('OVERALL COMBAT READINESS VALUE', 80, doc.y - 4);
            doc.y += 12;
          } else {
            // General text content block
            doc.fillColor(textDark)
               .font('Helvetica')
               .fontSize(9.5)
               .text(content, 76, doc.y, { width: doc.page.width - 130, lineGap: 4 });
            doc.y += 18;
          }
        });

        // Add running headers & footers dynamically to all content pages
        const pages = doc.bufferedPageRange();
        for (let i = 1; i < pages.count; i++) {
          doc.switchToPage(i);

          // Header
          doc.fillColor(textMuted)
             .font('Helvetica-Bold')
             .fontSize(7)
             .text('VOIDLEX | STRATEGIC LEGAL INTELLIGENCE ENGINE', 72, 30);
          
          doc.font('Helvetica')
             .text('CONFIDENTIAL REPORT', doc.page.width - 150, 30, { align: 'right' });
             
          doc.moveTo(72, 40).lineTo(doc.page.width - 54, 40).stroke('#e2e8f0');

          // Footer
          doc.moveTo(72, doc.page.height - 40).lineTo(doc.page.width - 54, doc.page.height - 40).stroke('#e2e8f0');
          doc.fillColor(textMuted)
             .font('Helvetica')
             .fontSize(7)
             .text(`Reference: ${case_serial || 'VLX-STRAT-001'}`, 72, doc.page.height - 30)
             .text(`Page ${i + 1} of ${pages.count}`, doc.page.width - 120, doc.page.height - 30, { align: 'right' });
        }

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });

        stream.on('error', (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new VoidlexPDFGenerator();
