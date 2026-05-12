from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from io import BytesIO
from datetime import datetime

class VoidlexPDFGenerator:
    def __init__(self, case_serial: str = "VLX-STRAT-000"):
        self.case_serial = case_serial
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        # Header Style
        self.header_style = ParagraphStyle(
            'HeaderStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.grey,
            alignment=TA_LEFT,
            spaceAfter=12
        )
        # Title Style
        self.title_style = ParagraphStyle(
            'TitleStyle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.black,
            alignment=TA_CENTER,
            spaceAfter=20,
            fontName='Helvetica-Bold'
        )
        # Subtitle Style
        self.subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.darkblue,
            alignment=TA_CENTER,
            spaceAfter=30
        )
        # Section Heading Style (Elite Contrast + Safe Padding)
        self.section_heading_style = ParagraphStyle(
            'SectionHeading',
            parent=self.styles['Heading2'],
            fontSize=11,
            textColor=colors.whitesmoke,
            alignment=TA_LEFT,
            spaceBefore=12,
            spaceAfter=8,
            fontName='Helvetica-Bold',
            borderPadding=(6, 4, 6, 4), # left, bottom, right, top
            borderWidth=0,
            backColor=colors.Color(0.2, 0.25, 0.3),
            leading=14
        )
        # Content Style
        self.content_style = ParagraphStyle(
            'ContentStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_JUSTIFY,
            leading=13,
            spaceAfter=6
        )
        # Bullet Style (Bespoke Legal Padding)
        self.bullet_style = ParagraphStyle(
            'BulletStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_JUSTIFY,
            leading=13,
            spaceAfter=4,
            leftIndent=15,
            bulletIndent=5,
            firstLineIndent=0
        )
        # Notice Style (Formal UK Stationary)
        self.notice_style = ParagraphStyle(
            'NoticeStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_LEFT,
            leading=13,
            fontName='Times-Roman',
            spaceBefore=4,
            spaceAfter=4
        )
        # Footer Style
        self.footer_style = ParagraphStyle(
            'FooterStyle',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )

    def _add_header_footer(self, canvas, doc):
        canvas.saveState()
        # Header
        canvas.setFont('Helvetica-Bold', 10)
        canvas.drawString(inch, A4[1] - 0.5 * inch, "VOIDLEX | STRATEGIC LEGAL INTELLIGENCE ENGINE")
        
        # Move corporate name down slightly to prevent overlapping on long titles
        canvas.setFont('Helvetica', 7) 
        canvas.drawRightString(A4[0] - inch, A4[1] - 0.62 * inch, "IMPERIAL EMINENCE CYBERGUARD CORPORATION (IECC)")
        canvas.line(inch, A4[1] - 0.7 * inch, A4[0] - inch, A4[1] - 0.7 * inch)
        
        # Footer
        page_id = f"{self.case_serial}-PG{doc.page}"
        canvas.setStrokeColor(colors.grey)
        canvas.setLineWidth(0.5)
        canvas.line(inch, 0.7 * inch, A4[0] - inch, 0.7 * inch)
        
        canvas.setFont('Helvetica', 7)
        canvas.drawString(inch, 0.5 * inch, f"Ref: {page_id}")
        canvas.drawCentredString(A4[0]/2.0, 0.5 * inch, f"CONFIDENTIAL | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} UTC")
        canvas.drawRightString(A4[0] - inch, 0.5 * inch, f"Page {doc.page}")
        
        canvas.restoreState()

    def generate(self, data, strategy, case_serial="VLX-STRAT-000"):
        self.case_serial = case_serial
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=0.8 * inch,
            leftMargin=1.1 * inch,
            topMargin=0.8 * inch,
            bottomMargin=0.8 * inch
        )
        
        story = []
        
        # --- COVER PAGE ---
        story.append(Spacer(1, 2 * inch))
        story.append(Paragraph("VOIDLEX Strategic Legal Analysis", self.title_style))
        story.append(Paragraph("Issued by T.R.I.B.U.N.E.T.H. a Division of Imperial Eminence Cyberguard Corporation", self.subtitle_style))
        story.append(Spacer(1, 1 * inch))
        
        # Client Information Table
        client_info = [
            [Paragraph("<b>CLIENT NAME:</b>", self.content_style), f"{data.get('first_name')} {data.get('last_name')}"],
            [Paragraph("<b>LOCATION:</b>", self.content_style), data.get('country')],
            [Paragraph("<b>OPPONENT:</b>", self.content_style), data.get('opponent', 'N/A')],
            [Paragraph("<b>CATEGORY:</b>", self.content_style), data.get('category')],
            [Paragraph("<b>URGENCY:</b>", self.content_style), data.get('urgency').upper()],
            [Paragraph("<b>DATE:</b>", self.content_style), datetime.now().strftime('%Y-%m-%d')],
        ]
        t = Table(client_info, colWidths=[1.5 * inch, 4.5 * inch])
        t.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 0), (0, -1), colors.whitesmoke),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t)
        story.append(PageBreak())
        
        # --- ANALYSIS SECTIONS ---
        sections = [
            ("I. Executive Summary", strategy.get("executive_summary")),
            ("II. Legal Position Analysis", strategy.get("legal_position_analysis")),
            ("III. Strengths", "\n".join([f"• {s}" for s in strategy.get("strengths", [])])),
            ("IV. Weaknesses", "\n".join([f"• {w}" for w in strategy.get("weaknesses", [])])),
            ("V. Strategic Recommendations", "\n".join([f"• {r}" for r in strategy.get("strategic_recommendations", [])])),
            ("VI. Required Documents", "\n".join([f"• {d}" for d in strategy.get("required_documents", [])])),
            ("VII. Immediate Legal Actions", "\n".join([f"• {a}" for a in strategy.get("immediate_legal_actions", [])])),
            (f"VIII. {strategy.get('draft_document_title', 'Draft Document')}", strategy.get("draft_document_body")),
            ("IX. Risk Assessment", strategy.get("risk_assessment")),
            ("X. Next Steps", "\n".join([f"• {n}" for n in strategy.get("next_steps", [])])),
            ("XI. Strategic Risk Score", strategy.get("risk_score")),
            ("XII. Total Strategic Readiness Score", f"{strategy.get('total_readiness_score', '0')}%"),
            ("XIII. Global Optimization Blueprint (Path to 100%)", strategy.get("global_optimization_blueprint")),
        ]
        for title, content in sections:
            # Roman numeral small caps processing
            parts = title.split(" ", 1)
            roman = parts[0]
            rest = parts[1].upper() if len(parts) > 1 else ""
            formatted_title = f"<font size='10'>{roman}</font> {rest}"

            # Add Score if available
            section_key = None
            if title.startswith("I. "): section_key = "executive_summary"
            elif title.startswith("II. "): section_key = "legal_position"
            elif title.startswith("III. "): section_key = "strengths"
            elif title.startswith("IV. "): section_key = "weaknesses"
            elif title.startswith("V. "): section_key = "recommendations"
            elif title.startswith("VIII. "): section_key = "draft_document"

            sa = strategy.get("section_analysis", {})
            if section_key and sa.get(section_key):
                analysis = sa[section_key]
                score_text = f"QUALITY RATING: {analysis.get('score', 0)}/10"
                story.append(Paragraph(f"<b>{score_text}</b>", ParagraphStyle('ScoreStyle', parent=self.content_style, textColor=colors.darkblue, fontSize=8)))

            story.append(Paragraph(formatted_title, self.section_heading_style))
            if content:
                # Ensure content is a string
                if not isinstance(content, str):
                    content = str(content)
                # Choose style based on section
                p_style = self.notice_style if title.startswith("VIII.") else self.content_style
                # Handle lists vs blocks
                for p in content.split('\n'):
                    if p.strip():
                        if p.strip().startswith("•") or p.strip().startswith("-"):
                            story.append(Paragraph(p, self.bullet_style))
                        else:
                            story.append(Paragraph(p, p_style))
            
            # Add Optimization if available
            if section_key and sa.get(section_key):
                analysis = sa[section_key]
                opt_text = f"OPTIMIZATION DIRECTIVE: {analysis.get('optimization', '')}"
                story.append(Paragraph(f"<i>{opt_text}</i>", ParagraphStyle('OptStyle', parent=self.content_style, textColor=colors.grey, fontSize=8, leftIndent=10)))

            story.append(Spacer(1, 0.1 * inch))

        # Build document
        doc.build(story, onFirstPage=self._add_header_footer, onLaterPages=self._add_header_footer)
        
        pdf_value = buffer.getvalue()
        buffer.close()
        return pdf_value
