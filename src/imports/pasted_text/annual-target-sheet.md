# Figma Design Prompt — Annual Target Sheet (Block 3)
## Application: Verdant by Clarium · ESG Energy Management

---

## CONTEXT

Screen name: Annual Target Sheet (Form AT)
Position in app: Sidebar → Annual Targets
Purpose: The first temporal document in the TQM cycle. Created once per year per position. Jointly filled by the position holder and their direct supervisor. Becomes Active after supervisor approval — this triggers the monitoring cycle.

---

## DESIGN SYSTEM

Font: Inter (400, 500, 600, 700) — bundled, no CDN
Colors:
  Forest    #1B4332  — sidebar, primary brand
  Leaf      #40916C  — Section A accent, primary actions, positive status
  Mint      #52B788  — highlights, badges, success
  Mist      #D8F3DC  — Section A header bg, light green surfaces
  Chalk     #F0FDF4  — page background
  Purple    #7F77DD  — Section B accent
  Purple-bg #EDE9FE  — Section B header bg
  Amber     #D97706  — Section C accent, exceptions, warnings
  Amber-bg  #FFFBEB  — Section C header bg
  Snow      #FFFFFF  — cards, editable cells
  Ink       #0F172A  — primary text
  Stone     #64748B  — secondary text, labels
  Border    #E2E8F0  — card borders, table lines
  Faint     #F8FAFC  — read-only cell backgrounds

Border radius: 10–12px cards, 6–8px inputs and badges
Shadow: 0 1px 3px rgba(0,0,0,0.06) on cards

---

## VOCABULARY — CRITICAL

Do NOT use the word "Checkpoint". The correct terms are:

  Managing Point (MP) — the outcome KPI a manager is accountable for. Measured monthly.
  Control Point (CP)  — the process parameter an operator controls daily to drive the MP.
                        1 Managing Point → N Control Points.
  Periodic Target     — the annual target broken into time slices (Q1/Q2/Q3/Q4 or monthly).
                        These are milestones on the Managing Point. NOT Control Points.

---

## FORM HEADER CARD

White card. 4-column grid. Sits at top of content area below page title.

Fields:
  1. Position           — Auto-populated from Org Chart. Read-only. Lock icon.
  2. Period             — Editable text. e.g. "FY 2025–26". 
                          + Date pickers for Start date and End date underneath.
  3. Supervisor         — Dropdown linked to Org Chart. Shows who jointly fills this form.
  4. Status             — Color-coded pill badge.
                          Draft (gray) → Under review (blue) → Approved (green) → Active (mint) → Closed (gray)

Right side of header: Action buttons
  — Save draft (secondary, outline)
  — Submit for review (primary, leaf green)
  — Export PDF (text link)

---

## SECTION A — DWM: ROUTINE WORK MANAGING POINTS

Source: Role Sheet (Form RD) — auto-populated on page load.
Design:
  — Section header bar: bg Mist (#D8F3DC), left border 4px Leaf (#40916C)
  — Label: "Section A — DWM · Routine work managing points"
  — Sub-label: "Auto-populated from Role Sheet · Standard is the operating norm, not a target"

For each Managing Point — expandable accordion card:

  ROW HEADER (always visible, collapsed state):
  [ MP Name (13px 600) ]  [ UOM badge ]  [ Standard badge — green ]
  [ Prior year target — gray read-only ]  [ Prior year actual — gray read-only ]
  [ This year target — white editable input with green focus border ]
  [ Improvement % — auto-calculated, show in green if improvement, amber if regression ]
  [ Expand ▼ ]

  EXPANDED CONTENT:

  Sub-section 1 — Periodic Targets (NOT checkpoints):
    Label: "Periodic targets — time-sliced milestones for this Managing Point"
    Table columns: Period | Target value (editable) | Responsible (position dropdown)
    Rows: Auto-generated based on review frequency from Role Sheet.
          If Monthly → 12 rows (Apr to Mar). If Quarterly → 4 rows (Q1–Q4).
    Note: Rows are pre-labeled. User only fills the target value.
    "+ Add period" button below table.

  Sub-section 2 — Control Points:
    Label: "Control points — daily process levers that drive this Managing Point"
    Table columns: Control Point name | Measure & UOM | Target | UCL | LCL | Frequency | Responsible
    Each row is a process parameter an operator controls to influence the Managing Point.
    Example for SHC Managing Point:
      Row 1: Preheater exit temperature · °C · 310–360°C · 360 UCL · 310 LCL · Daily · Kiln Operator
      Row 2: False air at preheater exit · % · ≤ 6% · 8 UCL · — LCL · Weekly · Maintenance Technician
      Row 3: Coal particle fineness (R90) · % · ≤ 12% · 15 UCL · — LCL · Daily · Coal Mill Operator
    "+ Add control point" button below table.
    Note: UCL and LCL cells — amber border when filled (visual reminder these trigger exceptions).

  Bottom of expanded card: small note "Polarity: Lower is better · Data source: DCS / CSV export"

Bottom of Section A: "+ Add Managing Point" button (dashed outline, leaf green).

---

## SECTION B — CE: CONTINUOUS IMPROVEMENT GOALS

Source: Goals Register (Block 1B) — auto-populated for this position.
Design:
  — Section header bar: bg Purple-bg (#EDE9FE), left border 4px Purple (#7F77DD)
  — Label: "Section B — CE · Continuous improvement goals"
  — Sub-label: "Auto-populated from Goals Register · Targets cascaded from department-level goals"

For each CE Goal — expandable accordion card:

  ROW HEADER (collapsed state):
  [ Goal statement — italic, read-only, gray lock icon ]  [ CE badge — purple ]
  [ Source detail — e.g. "ESG Strategy FY2025" ]
  [ Parent goal reference — small tag showing which org-level goal this contributes to ]
  [ Allocation indicator — "This position: 15% of dept goal 25%" — progress bar segment ]
  [ Prior year target ]  [ Prior year actual ]
  [ This year target — editable ]  [ Improvement % — auto ]
  [ Expand ▼ ]

  EXPANDED CONTENT:

  Periodic Targets table — same structure as Section A.
  Responsible — position dropdown.
  Parent cascade note: "Contributing to: Reduce total energy intensity by 25% (Org goal)"

Bottom of Section B: "+ Add CE goal" button — opens Goals Register to select existing goal.

---

## SECTION C — PD: BREAKTHROUGH IMPROVEMENT GOALS

Source: Goals Register (Block 1B).
Design:
  — Section header bar: bg Amber-bg (#FFFBEB), left border 4px Amber (#D97706)
  — Label: "Section C — PD · Breakthrough improvement goals"
  — Sub-label: "Derived from 3-year strategic plan and vision · Milestone-based targets"

Same structure as Section B with one difference:
  Periodic Target values can be text or numeric (e.g. "Civil works complete" for Q1, "8 MW commissioned" for Q3).
  Design the target input cell to accept both free text and numeric value.

---

## BOTTOM FLOATING BAR

Fixed at bottom of screen (above scroll):
  Left: "+ Add row" dropdown — choose Section A, B, or C to add a new item.
  Right: Save draft button · Submit for review button (primary).

---

## READ-ONLY vs EDITABLE — VISUAL TREATMENT

Read-only fields (auto-populated):
  — Background: Faint (#F8FAFC)
  — No border or very light border
  — Small lock icon (12px) at right of cell
  — Text color: Stone (#64748B)

Editable fields:
  — Background: Snow (#FFFFFF)
  — Border: 1px Border (#E2E8F0)
  — Focus state: border-color Leaf (#40916C), subtle green glow
  — Placeholder text in Stone

---

## KEY UX BEHAVIORS TO DESIGN (annotate in Figma)

1. Auto-populate on load:
   Show a green toast: "Loaded 3 managing points from Role Sheet · 2 CE goals · 1 PD goal"

2. Improvement % calculation:
   When user enters "This year target", the Improvement % cell auto-fills.
   Show it in Leaf green if it's an improvement, Amber if regression vs prior year actual.

3. Cascade allocation tracker:
   For Section B/C goals, show a small horizontal bar indicating how much of the
   parent goal has been allocated. Example: [████░░░] 15% allocated of 25% parent target.

4. Validation on submit:
   — Red border on any empty "This year target" field.
   — Amber warning if target is worse than the Standard from Role Sheet.
   — Prompt: "Section B has 1 goal without a target. Set target before submitting."

5. Section collapse:
   Each section can be collapsed to just its header bar. Default: all expanded.

6. Add row behaviour:
   Clicking "+ Add Managing Point" opens a search/select from the 50 Measures Library.
   Typing creates a new custom measure on the fly.

7. Periodic target row count:
   This comes from the Review Frequency field on the Role Sheet.
   Monthly = 12 rows · Quarterly = 4 rows · If mid-year addition: fewer rows from current period.

---

## STATUS LIFECYCLE BAR

Show at top of page below the form header card.
Horizontal stepper:
[ Draft ] → [ Under review ] → [ Approved / Active ] → [ Closed ]
Highlight current status. Show date and actor (who changed status) on hover.

---

## CEMENT DEMO DATA (pre-populate these values in Figma)

Position: Thermal Process Engineer
Period: FY 2025–26
Supervisor: Dr. Arun Sharma (Plant Energy & Environment Manager)
Status: Active

Section A — Managing Points:
  MP 1: Specific Heat Consumption (SHC) · kcal/kg clinker · Standard ≤755
    Prior year target: 740 · Prior year actual: 748 · This year target: 720 · Improvement: -3.7%
    Periodic Targets: Q1: 742 · Q2: 735 · Q3: 725 · Q4: 720
    Control Points:
      - Preheater exit temperature · °C · 310–360°C · UCL 360 · LCL 310 · Daily · Kiln Operator
      - False air at preheater exit · % · ≤6% · UCL 8 · — · Weekly · Maintenance Technician
      - Coal particle fineness R90 · % · ≤12% · UCL 15 · — · Daily · Coal Mill Operator
  
  MP 2: Alt. Fuel Feed Rate (TSR%) · % · Standard: Per weekly plan
    Prior year target: 12% · Prior year actual: 12% · This year target: 18% · Improvement: +50%
    Periodic Targets: Q1: 13% · Q2: 15% · Q3: 16.5% · Q4: 18%
    Control Points:
      - AF hopper level · t · Per shift plan · — · — · Shift · Kiln Operator
      - AF calorific value · kcal/kg · ≥3500 · — · 3000 LCL · Weekly · AF Coordinator

Section B — CE Goals:
  Goal: Reduce SHC from 748 to 720 kcal/kg clinker through optimised combustion and false air reduction.
  Source: ESG Strategy FY2025 · Parent: Reduce plant energy intensity by 15%
  Allocation: This position covers 100% of the SHC reduction goal.
  Target: 720 · Periodic: Q1:742 Q2:735 Q3:725 Q4:720

Section C — PD Goals:
  Goal: Commission WHR system to generate 8 MW power by Q3 FY25-26.
  Source: 3-Year Capital Plan 2024-2027
  Periodic: Q1: Civil works complete · Q2: Equipment erection · Q3: 8 MW commissioned · Q4: Stabilised

---

## GAP CHECK — VERIFY THESE IN YOUR FIGMA DESIGN

[ ] Form header with 4 fields: Position, Period, Supervisor, Status
[ ] Three colour-coded sections: Section A (green), Section B (purple), Section C (amber)
[ ] Accordion cards — collapsed and expanded states designed for each section
[ ] Managing Point row: MP name, UOM, Standard badge, prior year reference, this year target input, improvement %
[ ] Periodic Targets sub-table inside each expanded MP card (NOT called checkpoints)
[ ] Control Points sub-table inside each expanded MP card (CP name, measure, UCL, LCL, responsible)
[ ] Parent goal cascade reference and allocation bar in Section B and C
[ ] Read-only vs editable visual distinction (lock icon, faint background vs white editable)
[ ] Status lifecycle stepper at top
[ ] Validation states (red border, amber warning)
[ ] Toast notification for auto-populate behaviour
[ ] Floating bottom bar with Save and Submit actions
[ ] "+ Add row" behaviour for each section