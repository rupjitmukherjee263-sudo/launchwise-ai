import io
import csv
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
from reportlab.lib.units import inch

class ReportExportService:
    @staticmethod
    def generate_pdf(project_name: str, report_data: Dict[str, Any], financial_data: Dict[str, Any]) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        
        # Custom palette & typography
        primary_color = colors.HexColor("#0f172a") # Slate 900
        accent_color = colors.HexColor("#2563eb")  # Blue 600
        neutral_bg = colors.HexColor("#f8fafc")    # Slate 50
        border_color = colors.HexColor("#cbd5e1")  # Slate 300

        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=primary_color,
            spaceAfter=6
        )

        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#64748b"),
            spaceAfter=14
        )

        h2_style = ParagraphStyle(
            'ReportH2',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=17,
            textColor=accent_color,
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['BodyText'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#1e293b"),
            spaceAfter=8
        )

        table_header_style = ParagraphStyle(
            'TableHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11,
            textColor=colors.white
        )

        table_cell_style = ParagraphStyle(
            'TableCell',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#0f172a")
        )

        story = []

        # Header Title
        story.append(Paragraph("LaunchWise AI — Business Feasibility Intelligence Report", subtitle_style))
        story.append(Paragraph(project_name, title_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceAfter=14))

        # Executive Verdict & Recommendation Card
        rec = report_data.get('recommendation', 'LAUNCH SMALL PILOT')
        score = report_data.get('viability_score', 82.5)
        conf = report_data.get('confidence_score', 86.0)

        badge_color = colors.HexColor("#16a34a") if "LAUNCH" in rec else colors.HexColor("#ca8a04")

        verdict_data = [
            [
                Paragraph("<b>FEASIBILITY VERDICT</b>", table_header_style),
                Paragraph("<b>VIABILITY INDEX</b>", table_header_style),
                Paragraph("<b>CONFIDENCE SCORE</b>", table_header_style)
            ],
            [
                Paragraph(f"<font size=12 color='{badge_color.hexval()}'><b>{rec}</b></font>", table_cell_style),
                Paragraph(f"<font size=12><b>{score}/100</b></font><br/>Market & Economic Viability", table_cell_style),
                Paragraph(f"<font size=12><b>{conf}%</b></font><br/>Evidence Coverage", table_cell_style)
            ]
        ]
        verdict_table = Table(verdict_data, colWidths=[200, 160, 160])
        verdict_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_color),
            ('BACKGROUND', (0, 1), (-1, 1), neutral_bg),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(verdict_table)
        story.append(Spacer(1, 12))

        # Executive Summary
        story.append(Paragraph("1. Executive Summary", h2_style))
        summary_text = report_data.get('executive_summary', 'Comprehensive feasibility assessment.')
        story.append(Paragraph(summary_text, body_style))

        # Product Idea Overview
        sections = report_data.get('sections_data', {})
        story.append(Paragraph("2. Product Overview & Strategic Scope", h2_style))
        story.append(Paragraph(sections.get('2_product_overview', ''), body_style))

        # Market Sizing & Local Analysis
        story.append(Paragraph("4 & 5. Market Demand & Sizing (TAM / SAM / SOM)", h2_style))
        story.append(Paragraph(sections.get('4_market_demand_trends', ''), body_style))
        sizing = sections.get('5_market_sizing', {})
        if isinstance(sizing, dict):
            sizing_data = [
                [Paragraph("<b>Metric</b>", table_header_style), Paragraph("<b>Market Estimate</b>", table_header_style), Paragraph("<b>Scope / Definition</b>", table_header_style)],
                [Paragraph("TAM", table_cell_style), Paragraph(sizing.get('tam', 'N/A'), table_cell_style), Paragraph("Total Addressable Market in geography", table_cell_style)],
                [Paragraph("SAM", table_cell_style), Paragraph(sizing.get('sam', 'N/A'), table_cell_style), Paragraph("Serviceable Addressable Catchment", table_cell_style)],
                [Paragraph("SOM", table_cell_style), Paragraph(sizing.get('som', 'N/A'), table_cell_style), Paragraph("Serviceable Obtainable 3-Year Capture", table_cell_style)],
            ]
            sizing_table = Table(sizing_data, colWidths=[80, 200, 240])
            sizing_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), primary_color),
                ('GRID', (0, 0), (-1, -1), 0.5, border_color),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ]))
            story.append(sizing_table)
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"<b>Methodology:</b> {sizing.get('methodology', '')}", body_style))

        # Financial Summary Table
        story.append(Paragraph("12 & 13. Financial Feasibility & Break-Even Analysis", h2_style))
        be_info = sections.get('13_break_even_analysis', {})
        fin_forecast = sections.get('12_financial_forecasts', {})
        
        fin_summary_data = [
            [Paragraph("<b>Financial Metric</b>", table_header_style), Paragraph("<b>Computed Value</b>", table_header_style), Paragraph("<b>Target Benchmark</b>", table_header_style)],
            [Paragraph("Monthly Break-Even Units", table_cell_style), Paragraph(str(be_info.get('break_even_units_monthly', 'N/A')), table_cell_style), Paragraph("Operational survival minimum", table_cell_style)],
            [Paragraph("Monthly Break-Even Revenue", table_cell_style), Paragraph(f"INR {be_info.get('break_even_revenue_monthly', 0):,.2f}", table_cell_style), Paragraph("Covers all fixed overheads", table_cell_style)],
            [Paragraph("Unit Contribution Margin", table_cell_style), Paragraph(f"INR {be_info.get('contribution_per_unit', 0):,.2f}", table_cell_style), Paragraph("Net cash per transaction", table_cell_style)],
            [Paragraph("Year 1 Projected Revenue", table_cell_style), Paragraph(f"INR {fin_forecast.get('year1_revenue', 0):,.2f}", table_cell_style), Paragraph("Base case forecast", table_cell_style)],
            [Paragraph("Year 1 Net Operating Profit", table_cell_style), Paragraph(f"INR {fin_forecast.get('year1_net_profit', 0):,.2f}", table_cell_style), Paragraph("After corporate taxes", table_cell_style)],
            [Paragraph("Projected Annual ROI", table_cell_style), Paragraph(f"{fin_forecast.get('annual_roi_pct', 0)}%", table_cell_style), Paragraph("Net profit / Initial capital", table_cell_style)],
            [Paragraph("Estimated Payback Period", table_cell_style), Paragraph(f"{fin_forecast.get('payback_period_months', 0)} months", table_cell_style), Paragraph("Capital recovery timeline", table_cell_style)]
        ]
        fin_table = Table(fin_summary_data, colWidths=[180, 160, 180])
        fin_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), primary_color),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(fin_table)
        story.append(Spacer(1, 10))

        # Risk Assessment
        story.append(Paragraph("18. Top Risk Assessment & Mitigation Strategy", h2_style))
        risks = sections.get('18_risk_assessment', [])
        if isinstance(risks, list):
            for r in risks:
                r_text = f"• <b>{r.get('risk', '')}</b> [Severity: {r.get('severity', '')} | Likelihood: {r.get('likelihood', '')}]<br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>Mitigation:</b> {r.get('mitigation', '')}"
                story.append(Paragraph(r_text, body_style))

        # 30-60-90 Roadmap
        story.append(Paragraph("19. 30/60/90-Day Execution Roadmap", h2_style))
        roadmap = sections.get('19_execution_roadmap', {})
        if isinstance(roadmap, dict):
            story.append(Paragraph(f"<b>Days 0 - 30 (Validation):</b> {roadmap.get('days_0_30', '')}", body_style))
            story.append(Paragraph(f"<b>Days 31 - 60 (Setup & Team):</b> {roadmap.get('days_31_60', '')}", body_style))
            story.append(Paragraph(f"<b>Days 61 - 90 (Soft Launch):</b> {roadmap.get('days_61_90', '')}", body_style))

        doc.build(story)
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_financial_csv(projections: List[Any]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Month",
            "Units Sold",
            "Revenue (INR)",
            "Variable Costs (INR)",
            "Gross Profit (INR)",
            "Fixed Overhead (INR)",
            "Operating Profit (INR)",
            "Tax (INR)",
            "Net Profit (INR)",
            "Cumulative Cash Flow (INR)"
        ])
        for p in projections:
            month = getattr(p, 'month', None) if not isinstance(p, dict) else p.get('month')
            units = getattr(p, 'units_sold', 0) if not isinstance(p, dict) else p.get('units_sold', 0)
            rev = getattr(p, 'revenue', 0.0) if not isinstance(p, dict) else p.get('revenue', 0.0)
            var_c = getattr(p, 'variable_costs', 0.0) if not isinstance(p, dict) else p.get('variable_costs', 0.0)
            gross = getattr(p, 'gross_profit', 0.0) if not isinstance(p, dict) else p.get('gross_profit', 0.0)
            fixed = getattr(p, 'fixed_costs', 0.0) if not isinstance(p, dict) else p.get('fixed_costs', 0.0)
            op = getattr(p, 'operating_profit', 0.0) if not isinstance(p, dict) else p.get('operating_profit', 0.0)
            tax = getattr(p, 'tax_amount', 0.0) if not isinstance(p, dict) else p.get('tax_amount', 0.0)
            net = getattr(p, 'net_profit', 0.0) if not isinstance(p, dict) else p.get('net_profit', 0.0)
            cash = getattr(p, 'cumulative_cash_flow', 0.0) if not isinstance(p, dict) else p.get('cumulative_cash_flow', 0.0)
            writer.writerow([month, units, rev, var_c, gross, fixed, op, tax, net, cash])
        return output.getvalue()

    @staticmethod
    def generate_competitors_csv(competitors: List[Any]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Competitor Name",
            "Category",
            "Location / Address",
            "Estimated Price (INR)",
            "Strengths",
            "Weaknesses",
            "Market Gaps",
            "Verified Status",
            "Source"
        ])
        for c in competitors:
            name = getattr(c, 'name', '') if not isinstance(c, dict) else c.get('name', '')
            cat = getattr(c, 'category', '') if not isinstance(c, dict) else c.get('category', '')
            loc = getattr(c, 'location', '') if not isinstance(c, dict) else c.get('location', '')
            price = getattr(c, 'est_price', 0.0) if not isinstance(c, dict) else c.get('est_price', 0.0)
            
            s_raw = getattr(c, 'strengths', []) if not isinstance(c, dict) else c.get('strengths', [])
            strengths = "; ".join(s_raw) if isinstance(s_raw, list) else str(s_raw or '')
            
            w_raw = getattr(c, 'weaknesses', []) if not isinstance(c, dict) else c.get('weaknesses', [])
            weaknesses = "; ".join(w_raw) if isinstance(w_raw, list) else str(w_raw or '')
            
            g_raw = getattr(c, 'market_gaps', []) if not isinstance(c, dict) else c.get('market_gaps', [])
            gaps = "; ".join(g_raw) if isinstance(g_raw, list) else str(g_raw or '')
            
            verified_val = getattr(c, 'is_verified', False) if not isinstance(c, dict) else c.get('is_verified', False)
            verified = "VERIFIED" if verified_val else "UNVERIFIED"
            
            src = getattr(c, 'source_url', '') if not isinstance(c, dict) else c.get('source_url', '')

            writer.writerow([name, cat, loc, price, strengths, weaknesses, gaps, verified, src])
        return output.getvalue()
