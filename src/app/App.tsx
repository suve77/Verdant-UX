import { useState, useEffect, Fragment, type ReactNode, type CSSProperties } from "react";
import { HashRouter, Routes, Route, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, Network, Target, ClipboardList,
  CalendarCheck, BarChart2, AlertTriangle, Upload,
  ChevronRight, CheckCircle2, TrendingDown, TrendingUp,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────

const T = {
  sidebar:         "#1E3A5F",
  sidebarText:     "#B8CCE0",
  sidebarActive:   "#38BDF8",
  sidebarActiveBg: "rgba(56,189,248,0.13)",
  sidebarBorder:   "rgba(255,255,255,0.08)",
  accent:          "#0EA5E9",
  accentLight:     "#F0F9FF",
  accentText:      "#0369A1",
  bg:              "#F8FAFC",
  card:            "#FFFFFF",
  border:          "#CBD5E1",
  borderStrong:    "#94A3B8",
  text:            "#0F172A",
  textSub:         "#475569",
  textMuted:       "#94A3B8",
  amber:           "#F59E0B",
  amberBg:         "#FFFBEB",
  amberBorder:     "#FCD34D",
  amberText:       "#92400E",
  success:         "#10B981",
  successBg:       "#ECFDF5",
  successText:     "#065F46",
  heading:         "'Lexend', sans-serif",
  body:            "'Figtree', system-ui, sans-serif",
};

// ─── DATA (from cement.js) ───────────────────────────────────────────────────

const site = {
  company: "Deccan Cement Ltd",
  plant: "Nalgonda Plant — Kiln 2",
  period: "FY 2025–26",
  department: "Energy & Environment",
  deptHead: "Dr. Arun Sharma",
  deptObjective:
    "Achieve ISO 50001 certification and reduce specific heat consumption by 3.7% through optimised kiln operations, false air elimination, and alternative fuel co-processing to deliver a sustainable, low-carbon cement operation.",
};

const orgNodes = [
  { id: "cso",     title: "CSO / Head of Sustainability",          tier: 1, reportsTo: null,       ghgScope: "All (1·2·3)", iso: "Top Management",        authority: "Strategic",              disclosure: "All frameworks",     esgilar: "E · S · G",  energyDomain: "All domains",             frameworkOwnership: "CDP · GRI · TCFD · CSRD", siteCoverage: "All sites",       dataStewardship: "Tier 1 signatory",     externalAssurance: "Subject",         gradeLevel: "C-Suite" },
  { id: "em",      title: "Plant Energy & Environment Manager",     tier: 2, reportsTo: "cso",      ghgScope: "All (1·2·3)", iso: "Mgmt Representative",   authority: "Strategic · Operational", disclosure: "CDP · GRI",          esgilar: "E",          energyDomain: "Thermal · Electrical · GHG",  frameworkOwnership: "CDP · GRI",                siteCoverage: "All sites",       dataStewardship: "Plant data owner",     externalAssurance: "Contributor",     gradeLevel: "L6" },
  { id: "thermal", title: "Thermal Process Engineer",               tier: 3, reportsTo: "em",       ghgScope: "Scope 1, 2",  iso: "Energy Team",           authority: "Operational",            disclosure: "—",                  esgilar: "E",          energyDomain: "Thermal · AF",                frameworkOwnership: "—",                        siteCoverage: "Kiln 2",          dataStewardship: "Kiln energy data",     externalAssurance: "—",               gradeLevel: "L4" },
  { id: "elec",    title: "Electrical Engineer",                    tier: 3, reportsTo: "em",       ghgScope: "Scope 2",     iso: "Energy Team",           authority: "Operational",            disclosure: "—",                  esgilar: "E",          energyDomain: "Electrical",                  frameworkOwnership: "—",                        siteCoverage: "All sections",    dataStewardship: "Electrical meter data",externalAssurance: "—",               gradeLevel: "L4" },
  { id: "ghg",     title: "GHG & Environment Officer",             tier: 3, reportsTo: "em",       ghgScope: "All (1·2·3)", iso: "Energy Team",           authority: "Operational",            disclosure: "GHG Protocol · TCFD",esgilar: "E",          energyDomain: "GHG · Environment",           frameworkOwnership: "GHG Protocol · TCFD",      siteCoverage: "All sites",       dataStewardship: "GHG inventory",        externalAssurance: "Primary subject", gradeLevel: "L4" },
  { id: "esg",     title: "ESG Reporting Officer",                  tier: 3, reportsTo: "em",       ghgScope: "All (1·2·3)", iso: "Energy Team",           authority: "Operational",            disclosure: "CDP · GRI · CSRD",   esgilar: "E · S · G",  energyDomain: "All",                         frameworkOwnership: "CDP · GRI · CSRD",         siteCoverage: "All sites",       dataStewardship: "Disclosure data",      externalAssurance: "Primary subject", gradeLevel: "L4" },
  { id: "site",    title: "Plant Energy Coordinator ×N",            tier: 4, reportsTo: "thermal",  ghgScope: "Scope 1, 2",  iso: "Energy Team",           authority: "Data Contributor",       disclosure: "Site data",          esgilar: "E",          energyDomain: "Site metering",               frameworkOwnership: "—",                        siteCoverage: "Specific sites",  dataStewardship: "Site-level meter data",externalAssurance: "—",               gradeLevel: "L2" },
];

const goals = [
  { id: "g1", type: "CE", source: "Internal", sourceDetail: "ISO 50001 Energy Review FY25", dataFreq: "Monthly",
    statement: "Reduce specific heat consumption (SHC) from 748 to 720 kcal/kg clinker through optimised combustion, false air elimination, and raw mix homogenisation.",
    mp: "Specific Heat Consumption (SHC)", uom: "kcal/kg clinker",
    baseline: 748, target: 720, ucl: 775, lcl: 690,
    responsible: "Thermal Process Engineer", reviewFreq: "Monthly",
    checkpoints: [{ period: "Q1", target: 742 }, { period: "Q2", target: 735 }, { period: "Q3", target: 725 }, { period: "Q4", target: 720 }],
  },
  { id: "g2", type: "CE", source: "Internal", sourceDetail: "Operational Strategy FY25", dataFreq: "Monthly",
    statement: "Increase Alternative Fuel Substitution Rate (TSR%) from 12% to 18% through expanded waste fuel co-processing and AF logistics capability.",
    mp: "Thermal Substitution Rate (TSR%)", uom: "% of total heat from AF",
    baseline: 12, target: 18, ucl: null, lcl: 8,
    responsible: "Thermal Process Engineer", reviewFreq: "Monthly",
    checkpoints: [{ period: "Q1", target: 14 }, { period: "Q2", target: 15 }, { period: "Q3", target: 17 }, { period: "Q4", target: 18 }],
  },
  { id: "g3", type: "CE", source: "Internal", sourceDetail: "Capital Improvement Plan FY25", dataFreq: "Monthly",
    statement: "Reduce specific electrical energy consumption from 96 to 90 kWh/t cement through VFD installation, lighting upgrades, and compressed air optimisation.",
    mp: "Specific Electrical Energy Consumption", uom: "kWh / tonne cement",
    baseline: 96, target: 90, ucl: 105, lcl: 78,
    responsible: "Electrical Engineer", reviewFreq: "Monthly",
    checkpoints: [{ period: "Q1", target: 95 }, { period: "Q2", target: 93 }, { period: "Q3", target: 91 }, { period: "Q4", target: 90 }],
  },
  { id: "g4", type: "PD", source: "Internal", sourceDetail: "3-Year Capital Plan 2024–2027", dataFreq: "Quarterly",
    statement: "Commission Waste Heat Recovery (WHR) system to generate 8 MW power from kiln preheater and cooler exhaust by Q3 FY25-26, reducing grid electricity dependency by 15%.",
    mp: "WHR Power Generation Capacity", uom: "MW commissioned",
    baseline: 0, target: 8, ucl: null, lcl: null,
    responsible: "Plant Energy & Environment Manager", reviewFreq: "Quarterly",
    checkpoints: [{ period: "Q1", target: 0, note: "Civil works complete" }, { period: "Q2", target: 0, note: "Equipment erection" }, { period: "Q3", target: 8, note: "Commissioned" }, { period: "Q4", target: 8, note: "Stabilised" }],
  },
  { id: "g5", type: "CE", source: "External / Regulatory", sourceDetail: "CPCB Notification · GHG Protocol Cement", dataFreq: "Monthly",
    statement: "Maintain kiln stack PM10 below CPCB norms and report Scope 1 CO₂ intensity below 600 kg CO₂/t cement under GHG Protocol — Cement Sector.",
    mp: "Net CO₂ Intensity", uom: "kg CO₂ / tonne cement",
    baseline: 620, target: 600, ucl: 640, lcl: null,
    responsible: "GHG & Environment Officer", reviewFreq: "Monthly",
    checkpoints: [{ period: "Q1", target: 618 }, { period: "Q2", target: 610 }, { period: "Q3", target: 604 }, { period: "Q4", target: 600 }],
  },
];

const roleSheets = [
  {
    position: "Thermal Process Engineer",
    rolePurpose: "Drive kiln thermal efficiency, alternative fuel co-processing, and process control to meet department energy and emissions objectives.",
    roles: [
      {
        role: "Reduce specific heat consumption through optimised kiln combustion and heat recovery",
        managingPoints: [
          {
            mp: "Specific Heat Consumption (SHC)", uom: "kcal/kg clinker",
            standard: "≤ 755", freq: "Monthly", polarity: "Lower is better", source: "DCS CSV export",
            controlPoints: [
              { name: "Preheater exit temperature",    uom: "°C",  target: "310–360°C",  ucl: "370",  lcl: "300", freq: "Daily",  responsible: "Kiln Operator",          source: "DCS" },
              { name: "False air % at preheater exit", uom: "%",   target: "≤ 6%",       ucl: "8",    lcl: "—",   freq: "Weekly", responsible: "Maintenance Technician", source: "Manual" },
              { name: "Coal particle fineness (R90%)", uom: "%",   target: "≤ 12%",      ucl: "15",   lcl: "—",   freq: "Daily",  responsible: "Coal Mill Operator",     source: "Lab CSV" },
              { name: "Kiln inlet temperature",        uom: "°C",  target: "900–1000°C", ucl: "1050", lcl: "850", freq: "Daily",  responsible: "Kiln Operator",          source: "DCS" },
            ],
          },
        ],
      },
      {
        role: "Increase alternative fuel substitution to reduce fossil fuel dependency",
        managingPoints: [
          {
            mp: "Thermal Substitution Rate (TSR%)", uom: "%",
            standard: "Per weekly plan", freq: "Monthly", polarity: "Higher is better", source: "Manual",
            controlPoints: [
              { name: "AF hopper level",     uom: "t",  target: "≥ 80% capacity", ucl: "—",  lcl: "—", freq: "Shift", responsible: "AF Operator", source: "Manual" },
              { name: "AF moisture content", uom: "%",  target: "≤ 25%",          ucl: "30", lcl: "—", freq: "Daily", responsible: "AF Operator", source: "Lab" },
            ],
          },
        ],
      },
    ],
  },
  {
    position: "Electrical Engineer",
    rolePurpose: "Minimise electrical energy intensity, maintain power system reliability, and ensure all electrical assets operate within contracted and efficiency limits.",
    roles: [
      {
        role: "Minimise specific electrical energy consumption across all plant operations",
        managingPoints: [
          {
            mp: "Specific Electrical Energy Consumption", uom: "kWh/t cement",
            standard: "≤ 100", freq: "Monthly", polarity: "Lower is better", source: "Meter CSV",
            controlPoints: [
              { name: "Power factor (pf)",       uom: "—",   target: "≥ 0.95",      ucl: "—", lcl: "0.90", freq: "Monthly", responsible: "Electrical Engineer", source: "Manual" },
              { name: "Maximum demand",          uom: "kVA", target: "Within limit", ucl: "—", lcl: "—",   freq: "Monthly", responsible: "Electrical Engineer", source: "Meter CSV" },
              { name: "VFD operational uptime",  uom: "%",   target: "≥ 98%",       ucl: "—", lcl: "95",  freq: "Daily",   responsible: "Electrical Operator", source: "DCS" },
              { name: "Compressed air pressure", uom: "bar", target: "6.0–6.5",     ucl: "7", lcl: "5.5", freq: "Shift",   responsible: "Electrical Operator", source: "DCS" },
            ],
          },
        ],
      },
      {
        role: "Maintain scheduled motor audit programme for long-term energy efficiency",
        managingPoints: [
          {
            mp: "Planned Motor Audit Completion", uom: "%",
            standard: "100% per schedule", freq: "Quarterly", polarity: "Higher is better", source: "Manual",
            controlPoints: [
              { name: "Motors inspected per week", uom: "Count", target: "Per schedule", ucl: "—", lcl: "—", freq: "Weekly", responsible: "Electrical Engineer", source: "Manual" },
            ],
          },
        ],
      },
    ],
  },
  {
    position: "GHG & Environment Officer",
    rolePurpose: "Ensure accurate GHG accounting, regulatory emissions compliance, and timely disclosure of Scope 1, 2 and 3 data under all applicable frameworks.",
    roles: [
      {
        role: "Track and reduce CO₂ intensity below regulatory and internal targets",
        managingPoints: [
          {
            mp: "Net CO₂ Intensity", uom: "kgCO₂/t cement",
            standard: "≤ 620", freq: "Monthly", polarity: "Lower is better", source: "Manual",
            controlPoints: [
              { name: "Clinker-to-cement ratio",  uom: "%", target: "≤ 78%",  ucl: "80", lcl: "—", freq: "Monthly", responsible: "GHG Officer", source: "Manual" },
              { name: "Scope 1 GHG completeness", uom: "%", target: "100%",   ucl: "—",  lcl: "—", freq: "Monthly", responsible: "GHG Officer", source: "Manual" },
            ],
          },
        ],
      },
      {
        role: "Ensure stack emissions comply with CPCB norms at all times",
        managingPoints: [
          {
            mp: "Kiln Stack PM10", uom: "mg/Nm³",
            standard: "≤ 50 (CPCB)", freq: "Weekly", polarity: "Lower is better", source: "Analyser CSV",
            controlPoints: [
              { name: "Stack analyser calibration", uom: "—", target: "Per schedule", ucl: "—", lcl: "—", freq: "Weekly", responsible: "GHG Officer", source: "Manual" },
            ],
          },
        ],
      },
    ],
  },
  {
    position: "ESG Reporting Officer",
    rolePurpose: "Deliver complete, accurate, and on-time ESG disclosures across CDP, GHG Protocol, GRI, and CSRD with zero compliance incidents.",
    roles: [
      {
        role: "Manage all external ESG framework submissions to achieve 100% completeness",
        managingPoints: [
          {
            mp: "CDP Submission Completeness", uom: "%",
            standard: "100%", freq: "Annual", polarity: "Higher is better", source: "Manual",
            controlPoints: [
              { name: "Data requests closed on time", uom: "Count", target: "All ≥ 5 days early", ucl: "—", lcl: "—", freq: "Weekly",  responsible: "ESG Officer", source: "Manual" },
              { name: "SR data completeness",         uom: "%",     target: "100%",               ucl: "—", lcl: "—", freq: "Monthly", responsible: "ESG Officer", source: "Manual" },
            ],
          },
        ],
      },
      {
        role: "Ensure zero environmental compliance incidents through proactive calendar management",
        managingPoints: [
          {
            mp: "Environmental Compliance Incidents", uom: "Count",
            standard: "0", freq: "Monthly", polarity: "Lower is better", source: "Manual",
            controlPoints: [
              { name: "Compliance calendar review", uom: "—", target: "All deadlines tracked", ucl: "0", lcl: "—", freq: "Monthly", responsible: "ESG Officer", source: "Manual" },
            ],
          },
        ],
      },
    ],
  },
  {
    position: "Plant Energy Coordinator ×N",
    rolePurpose: "Ensure accurate and timely energy data collection at site level to support reliable performance management and exception detection.",
    roles: [
      {
        role: "Ensure all meter readings are collected and submitted accurately by 08:00 daily",
        managingPoints: [
          {
            mp: "Meter Reading Submission Rate", uom: "% by 08:00 daily",
            standard: "100%", freq: "Daily", polarity: "Higher is better", source: "Manual",
            controlPoints: [
              { name: "Meters read by shift end",    uom: "Count", target: "All assigned meters", ucl: "—",  lcl: "—", freq: "Shift",       responsible: "Plant Coordinator", source: "Manual" },
              { name: "Fuel entry accuracy",         uom: "%",     target: "≥ 99% (within ±1%)", ucl: "—",  lcl: "—", freq: "Daily",       responsible: "Plant Coordinator", source: "Manual" },
              { name: "Anomaly reporting timeliness",uom: "Hours", target: "≤ 24 hrs",           ucl: "24", lcl: "—", freq: "As occurred", responsible: "Plant Coordinator", source: "Manual" },
            ],
          },
        ],
      },
    ],
  },
];

const annualTarget = {
  position: "Thermal Process Engineer",
  period: "FY 2025–26",
  approvedBy: "Dr. Arun Sharma",
  status: "Active",
  sections: {
    dwm: [
      { mp: "Specific Heat Consumption", uom: "kcal/kg", priorTarget: 748, priorActual: 751, thisYear: 720, improvement: "-4.1%", checkpoints: [{ p: "Q1", t: 742 }, { p: "Q2", t: 735 }, { p: "Q3", t: 725 }, { p: "Q4", t: 720 }] },
      { mp: "False Air % at Preheater",  uom: "%",       priorTarget: 7,   priorActual: 7.2, thisYear: 5.5, improvement: "-23.6%", checkpoints: [{ p: "Q1", t: 6.8 }, { p: "Q2", t: 6.2 }, { p: "Q3", t: 5.8 }, { p: "Q4", t: 5.5 }] },
      { mp: "Preheater Exit Temperature", uom: "°C",     priorTarget: 340, priorActual: 348, thisYear: 330, improvement: "-5.2%", checkpoints: [{ p: "Q1", t: 345 }, { p: "Q2", t: 338 }, { p: "Q3", t: 333 }, { p: "Q4", t: 330 }] },
    ],
    ce: [
      { mp: "AF Feed Rate (TSR%)", uom: "%", priorTarget: 12, priorActual: 11.8, thisYear: 18, improvement: "+52.5%", checkpoints: [{ p: "Q1", t: 14 }, { p: "Q2", t: 15 }, { p: "Q3", t: 17 }, { p: "Q4", t: 18 }] },
    ],
    pd: [
      { mp: "WHR Commissioning Milestone", uom: "Stage", priorTarget: "—", priorActual: "—", thisYear: "Commissioned Q3", improvement: "New", checkpoints: [{ p: "Q1", t: "Civil complete" }, { p: "Q2", t: "Equipment erected" }, { p: "Q3", t: "Commissioned" }, { p: "Q4", t: "Stabilised" }] },
    ],
  },
};

const shcMonitoring = [
  { m: "Apr", actual: 748, target: 742 },
  { m: "May", actual: 752, target: 742 },
  { m: "Jun", actual: 778, target: 742, exc: true },
  { m: "Jul", actual: 744, target: 735 },
  { m: "Aug", actual: 756, target: 735 },
  { m: "Sep", actual: 738, target: 735 },
  { m: "Oct", actual: 729, target: 725 },
  { m: "Nov", actual: 722, target: 725 },
  { m: "Dec", actual: 716, target: 725 },
  { m: "Jan", actual: 718, target: 720 },
  { m: "Feb", actual: 712, target: 720 },
  { m: "Mar", actual: 719, target: 720 },
];

const electricalMonitoring = [
  { m: "Apr", actual: 96, target: 95 },
  { m: "May", actual: 95, target: 95 },
  { m: "Jun", actual: 97, target: 95 },
  { m: "Jul", actual: 94, target: 93 },
  { m: "Aug", actual: 93, target: 93 },
  { m: "Sep", actual: 92, target: 93 },
  { m: "Oct", actual: 91, target: 91 },
  { m: "Nov", actual: 90, target: 91 },
  { m: "Dec", actual: 91, target: 91 },
  { m: "Jan", actual: 90, target: 90 },
  { m: "Feb", actual: 89, target: 90 },
  { m: "Mar", actual: 91, target: 90 },
];

const gaps = [
  {
    id: "GAP-001",
    type: "Exception",
    mp: "Specific Heat Consumption",
    period: "Jun 2025",
    actual: 778,
    ucl: 775,
    deviation: "+3 kcal/kg above UCL",
    severity: "Critical",
    status: "In progress",
    whys: [
      "SHC increased to 778 kcal/kg, crossing UCL of 775 in June 2025.",
      "Preheater exit temperature rose to 378°C (norm 310–360°C), reducing heat recovery efficiency.",
      "Cooler exhaust fan speed was reduced to manage ambient dust levels during peak summer.",
      "No automated compensation protocol existed when cooling fan speed is reduced.",
      "Root cause: Process control gap — no interlock between cooler fan speed and kiln fuel feed rate to maintain thermal balance during high ambient temperature periods.",
    ],
    actions: [
      { desc: "Implement DCS interlock: cooler fan speed reduction triggers automatic kiln fuel feed adjustment to maintain thermal balance.", owner: "Thermal Process Engineer", due: "15 Jul 2025", status: "In progress", pct: 65 },
      { desc: "Define summer operating procedure for kiln thermal management during ambient temp >40°C.", owner: "Energy Manager", due: "30 Jul 2025", status: "Open", pct: 0 },
      { desc: "Preventive: Schedule quarterly false air measurement to detect thermal efficiency degradation early.", owner: "Thermal Process Engineer", due: "30 Sep 2025", status: "Planned", pct: 0 },
    ],
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function FlameLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill={T.sidebarActive} opacity="0.18" />
      <path
        d="M18 5C18 5 11 12 11 19.5C11 23.9 14.2 27.5 18 27.5C21.8 27.5 25 23.9 25 19.5C25 16 23 13 23 13C23 13 23 16.5 21 18C20 18.6 19 17.5 19 16.4C19 13 18 5 18 5Z"
        fill={T.sidebarActive}
        opacity="0.95"
      />
      <path
        d="M18 15C18 15 15 18.5 15 21.5C15 23.4 16.3 25 18 25C19.7 25 21 23.4 21 21.5C21 19.5 20 18 20 18C20 18 19.5 19.8 18.5 20.3C18 20.6 17.5 20.1 17.5 19.5C17.5 17.5 18 15 18 15Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}

const navItems = [
  { path: "/",           label: "Dashboard",      icon: LayoutDashboard },
  { path: "/org",        label: "Organisation",   icon: Network },
  { path: "/goals",      label: "Annual Org. Goal", icon: Target },
  { path: "/roles",      label: "Role Sheet",     icon: ClipboardList },
  { path: "/targets",    label: "Annual targets", icon: CalendarCheck },
  { path: "/monitoring", label: "Monitoring",     icon: BarChart2 },
  { path: "/gaps",       label: "Gap analysis",   icon: AlertTriangle, badge: 1 },
];

const pageTitle: Record<string, string> = {
  "/":           "Department dashboard",
  "/org":        "Organisation chart",
  "/goals":      "Annual Org. Goal",
  "/roles":      "Role Sheet",
  "/targets":    "Annual targets",
  "/monitoring": "Monitoring & graphs",
  "/gaps":       "Gap analysis",
};

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside style={{
      width: "220px",
      background: T.sidebar,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100%",
    }}>
      {/* Brand */}
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${T.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <FlameLogo size={34} />
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "16px", fontFamily: T.heading, letterSpacing: "-0.3px" }}>
              Verdant
            </div>
            <div style={{ color: T.sidebarText, fontSize: "8.5px", opacity: 0.45, letterSpacing: "2px", textTransform: "uppercase" }}>
              by Clarium
            </div>
          </div>
        </div>
        <div style={{ color: T.sidebarActive, fontSize: "10px", fontWeight: 500, letterSpacing: "0.3px" }}>
          Track · Improve · Sustain
        </div>
      </div>

      {/* Plant context */}
      <div style={{ padding: "10px 16px 12px", borderBottom: `1px solid ${T.sidebarBorder}` }}>
        <div style={{ color: T.sidebarText, fontSize: "8px", opacity: 0.4, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "3px" }}>
          Active plant
        </div>
        <div style={{ color: T.sidebarText, fontSize: "12px", fontWeight: 500 }}>Nalgonda · Kiln 2</div>
        <div style={{ color: T.sidebarActive, fontSize: "10.5px", marginTop: "2px", fontWeight: 500 }}>FY 2025–26</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
        {navItems.map(({ path, label, icon: Icon, badge }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "8px 10px",
                borderRadius: "8px",
                marginBottom: "2px",
                background: active ? T.sidebarActiveBg : "transparent",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                borderLeft: `2.5px solid ${active ? T.sidebarActive : "transparent"}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={14} color={active ? T.sidebarActive : T.sidebarText} style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: "12px", fontWeight: active ? 600 : 400, color: active ? T.sidebarActive : T.sidebarText, opacity: active ? 1 : 0.72, fontFamily: T.body }}>
                {label}
              </span>
              {badge && (
                <span style={{ background: T.amber, color: "white", fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "99px" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "10px 16px 14px", borderTop: `1px solid ${T.sidebarBorder}`, display: "flex", alignItems: "center", gap: "9px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: T.sidebarActiveBg, border: `1.5px solid ${T.sidebarActive}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "9px", fontWeight: 700, color: T.sidebarActive }}>TP</span>
        </div>
        <div>
          <div style={{ color: T.sidebarText, fontSize: "11px", fontWeight: 500 }}>Thermal Process</div>
          <div style={{ color: T.sidebarText, fontSize: "9px", opacity: 0.45 }}>Engineer</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ excCount = 0 }: { excCount?: number }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header style={{
      height: "52px",
      background: T.card,
      borderBottom: `1.5px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11.5px" }}>
        <span style={{ color: T.textMuted }}>{site.company}</span>
        <ChevronRight size={13} color={T.textMuted} />
        <span style={{ color: T.textMuted }}>{site.department}</span>
        <ChevronRight size={13} color={T.textMuted} />
        <span style={{ color: T.text, fontWeight: 600, fontFamily: T.heading }}>{pageTitle[pathname] || pathname}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {excCount > 0 && (
          <button
            onClick={() => navigate("/gaps")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: T.amberBg, border: `1.5px solid ${T.amberBorder}`,
              borderRadius: "7px", padding: "5px 10px",
              cursor: "pointer", fontSize: "11px", fontWeight: 600, color: T.amberText,
            }}
          >
            <AlertTriangle size={12} color={T.amber} />
            {excCount} open exception
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: T.textSub }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: T.success }} />
          Live
        </div>
      </div>
    </header>
  );
}

// ─── SHARED UI PRIMITIVES ─────────────────────────────────────────────────────

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h1 style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "22px", color: T.text, margin: 0, letterSpacing: "-0.4px" }}>
        {title}
      </h1>
      <p style={{ fontFamily: T.body, fontSize: "12px", color: T.textSub, marginTop: "3px", marginBottom: 0 }}>
        {sub}
      </p>
    </div>
  );
}

function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: T.card,
      border: `1.5px solid ${T.border}`,
      borderRadius: "10px",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div style={{
      padding: "12px 18px",
      borderBottom: `1.5px solid ${T.border}`,
      fontFamily: T.heading,
      fontWeight: 600,
      fontSize: "13px",
      color: T.text,
    }}>
      {children}
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th style={{
      padding: "9px 16px",
      textAlign: "left",
      fontSize: "9.5px",
      fontWeight: 700,
      color: T.textSub,
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      background: T.bg,
      borderBottom: `1.5px solid ${T.border}`,
      fontFamily: T.body,
      whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  );
}

function Td({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <td style={{
      padding: "10px 16px",
      fontSize: "12px",
      color: T.text,
      borderBottom: `1px solid ${T.border}`,
      fontFamily: T.body,
      verticalAlign: "middle",
      ...style,
    }}>
      {children}
    </td>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "5px",
      fontSize: "10px",
      fontWeight: 700,
      color,
      background: bg,
      fontFamily: T.body,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────

const dashMetrics = [
  { label: "Specific Heat Consumption", value: "736.1", unit: "kcal/kg",   target: "720",  status: "amber", trend: "−1.6% vs baseline", sub: "1 exception · Jun 2025" },
  { label: "Electrical Intensity",       value: "93.2",  unit: "kWh/t",    target: "90",   status: "blue",  trend: "−2.9% vs baseline", sub: "On track · improving" },
  { label: "Net CO₂ Intensity",          value: "598",   unit: "kgCO₂/t",  target: "600",  status: "green", trend: "Target achieved ✓",  sub: "Below target since Oct" },
  { label: "Alt. Fuel Rate (TSR%)",      value: "16.4",  unit: "%",        target: "18%",  status: "amber", trend: "+4.4 pp vs baseline", sub: "Q4 target: 18%" },
];

const positions = [
  { name: "Thermal Process Engineer",    mps: 4, onTarget: 3, exceptions: 1 },
  { name: "Electrical Engineer",         mps: 4, onTarget: 3, exceptions: 0 },
  { name: "GHG & Environment Officer",   mps: 4, onTarget: 4, exceptions: 0 },
  { name: "ESG Reporting Officer",       mps: 4, onTarget: 4, exceptions: 0 },
  { name: "Plant Energy Coordinator",    mps: 3, onTarget: 3, exceptions: 0 },
];

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: T.body }}>
      <PageHeader title="Department dashboard" sub={`${site.company} · ${site.plant} · ${site.period}`} />

      {/* Dept objective */}
      <div style={{
        background: T.accentLight,
        border: `1.5px solid ${T.accent}30`,
        borderLeft: `4px solid ${T.accent}`,
        borderRadius: "10px",
        padding: "14px 18px",
        marginBottom: "18px",
      }}>
        <div style={{ fontSize: "9px", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "5px" }}>
          Department Objective
        </div>
        <p style={{ fontSize: "12.5px", color: T.text, margin: 0, lineHeight: 1.65 }}>{site.deptObjective}</p>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {dashMetrics.map((m, i) => {
          const borderColor = m.status === "green" ? T.success : m.status === "blue" ? T.accent : T.amber;
          const trendColor  = m.status === "green" ? T.success : m.status === "blue" ? T.accent : T.amber;
          return (
            <div
              key={i}
              onClick={() => navigate("/monitoring")}
              style={{
                background: T.card,
                border: `1.5px solid ${T.border}`,
                borderTop: `3.5px solid ${borderColor}`,
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                transition: "box-shadow 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ fontSize: "9.5px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
                {m.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginBottom: "5px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: T.text, fontFamily: T.heading, letterSpacing: "-0.8px" }}>{m.value}</span>
                <span style={{ fontSize: "12px", color: T.textSub }}>{m.unit}</span>
              </div>
              <div style={{ fontSize: "11px", color: T.textSub, marginBottom: "3px" }}>
                Target: <strong style={{ color: T.text }}>{m.target}</strong>
                {" · "}
                <span style={{ color: trendColor, fontWeight: 600 }}>{m.trend}</span>
              </div>
              <div style={{ fontSize: "10px", color: T.textMuted }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Exception alert */}
      <div
        onClick={() => navigate("/gaps")}
        style={{
          background: T.amberBg,
          border: `1.5px solid ${T.amberBorder}`,
          borderRadius: "10px",
          padding: "14px 18px",
          marginBottom: "18px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: "pointer",
        }}
      >
        <AlertTriangle size={20} color={T.amber} style={{ flexShrink: 0, marginTop: "1px" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: T.amberText, fontSize: "13px", marginBottom: "4px" }}>
            1 open exception requiring immediate action
          </div>
          <div style={{ color: T.amberText, fontSize: "11.5px", lineHeight: 1.6, opacity: 0.85 }}>
            Jun 2025 · SHC 778 kcal/kg → UCL breach (775) · Root cause: Summer ambient temperature impact on preheater cooler efficiency. Corrective action 65% complete — DCS interlock implementation in progress.
          </div>
        </div>
        <span style={{ color: T.amber, fontWeight: 700, fontSize: "12px", flexShrink: 0, whiteSpace: "nowrap" }}>View →</span>
      </div>

      {/* Position overview */}
      <Card>
        <CardHeader>Position performance overview</CardHeader>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Position", "Managing points", "On / below target", "Exceptions", "Status"].map(h => <Th key={h}>{h}</Th>)}
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => (
              <tr
                key={i}
                onClick={() => navigate("/monitoring")}
                style={{ cursor: "pointer", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Td><span style={{ fontWeight: 600 }}>{p.name}</span></Td>
                <Td><span style={{ color: T.textSub }}>{p.mps}</span></Td>
                <Td>
                  <span style={{ fontWeight: 700, color: T.success }}>{p.onTarget}</span>
                  <span style={{ color: T.textSub }}> / {p.mps}</span>
                </Td>
                <Td>
                  {p.exceptions > 0
                    ? <Badge label={String(p.exceptions)} color="white" bg={T.amber} />
                    : <span style={{ color: T.textMuted }}>—</span>}
                </Td>
                <Td>
                  {p.exceptions > 0
                    ? <Badge label="Action required" color={T.amberText} bg={T.amberBg} />
                    : <Badge label="On track ✓" color={T.successText} bg={T.successBg} />}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── PAGE: ORG CHART ─────────────────────────────────────────────────────────

const tierConfig: Record<number, { bg: string; text: string; dot: string; border: string }> = {
  1: { bg: T.sidebar,      text: "white",    dot: T.sidebarActive, border: T.sidebar },
  2: { bg: T.accent,       text: "white",    dot: "white",         border: T.accent },
  3: { bg: T.card,         text: T.text,     dot: T.accent,        border: T.border },
  4: { bg: T.bg,           text: T.textSub,  dot: T.textMuted,     border: T.border },
};

const ORG_ATTRS: { key: string; field: string }[] = [
  { key: "Authority level",      field: "authority" },
  { key: "GHG scope",            field: "ghgScope" },
  { key: "ISO 50001 role",       field: "iso" },
  { key: "ESG pillar",           field: "esgilar" },
  { key: "Energy domain",        field: "energyDomain" },
  { key: "Framework ownership",  field: "frameworkOwnership" },
  { key: "Site / boundary",      field: "siteCoverage" },
  { key: "Data stewardship",     field: "dataStewardship" },
  { key: "Disclosure ownership", field: "disclosure" },
  { key: "External assurance",   field: "externalAssurance" },
  { key: "Grade / level",        field: "gradeLevel" },
];

function OrgCard({ node, selectedId, onSelect }: { node: typeof orgNodes[0]; selectedId: string | null; onSelect: (id: string) => void }) {
  const tc = tierConfig[node.tier];
  const isSel = selectedId === node.id;
  const dotColor = tc.dot === "white" ? T.sidebarActive : tc.dot;
  return (
    <div
      onClick={e => { e.stopPropagation(); onSelect(node.id); }}
      style={{
        background: tc.bg,
        border: isSel ? `2.5px solid ${T.sidebarActive}` : `1.5px solid ${tc.border}`,
        borderRadius: "10px",
        padding: "14px",
        minWidth: "165px",
        maxWidth: "185px",
        fontFamily: T.body,
        cursor: "pointer",
        boxShadow: isSel ? `0 0 0 3px ${T.sidebarActive}33` : "none",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: tc.dot, flexShrink: 0 }} />
        <span style={{ fontSize: "9px", fontWeight: 700, color: tc.text, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          P{node.tier}
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: "12px", color: tc.text, lineHeight: 1.4, marginBottom: "10px", fontFamily: T.heading }}>
        {node.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "8px" }}>
        {[
          { label: "Authority", val: node.authority },
          { label: "GHG Scope", val: node.ghgScope },
          { label: "ISO 50001", val: node.iso },
        ].map(row => (
          <div key={row.label} style={{ fontSize: "10px", color: tc.text, opacity: 0.78 }}>
            <span style={{ fontWeight: 600 }}>{row.label}:</span> {row.val}
          </div>
        ))}
      </div>
      <div style={{ fontSize: "9px", fontWeight: 600, color: isSel ? dotColor : `${dotColor}99` }}>
        {isSel ? "▲ close" : "▼ all attributes"}
      </div>
    </div>
  );
}

function OrgChart() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tier1 = orgNodes.filter(n => n.tier === 1);
  const tier2 = orgNodes.filter(n => n.tier === 2);
  const tier3 = orgNodes.filter(n => n.tier === 3);
  const selectedNode = orgNodes.find(n => n.id === selectedId) ?? null;

  const handleSelect = (id: string) => setSelectedId(prev => prev === id ? null : id);

  useEffect(() => {
    const handler = () => setSelectedId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div>
      {/* Action bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: T.card, border: `1.5px solid ${T.border}`,
        borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {[
            { label: site.company,    icon: "🏭" },
            { label: site.department, icon: "⚡" },
            { label: site.period,     icon: "📅" },
          ].map((chip, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: T.bg, border: `1.5px solid ${T.border}`,
              borderRadius: "6px", padding: "4px 10px",
              fontSize: "11px", fontWeight: 500, color: T.textSub, fontFamily: T.body,
            }}>
              <span style={{ fontSize: "10px" }}>{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>
        <button
          onClick={e => { e.stopPropagation(); setShowCreateModal(true); }}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: T.accent, color: "white",
            border: "none", borderRadius: "8px", padding: "9px 18px",
            fontSize: "12.5px", fontWeight: 600, fontFamily: T.body,
            cursor: "pointer", boxShadow: `0 2px 8px ${T.accent}55`, flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#0284C7"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.accent; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Create Org
        </button>
      </div>

      {/* Coming-soon modal */}
      {showCreateModal && (
        <div onClick={() => setShowCreateModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, borderRadius: "14px", padding: "32px 36px",
            border: `1.5px solid ${T.border}`, maxWidth: "440px", width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Network size={20} color={T.accent} />
              </div>
              <div>
                <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "16px", color: T.text }}>Create Org</div>
                <div style={{ fontSize: "11px", color: T.textSub, marginTop: "1px" }}>Organisation builder — coming soon</div>
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: T.textSub, lineHeight: 1.65, margin: "0 0 20px" }}>
              The organisation builder will let you define positions, tiers, reporting lines, GHG scope assignments, ISO 50001 roles, and disclosure responsibilities — and generate this chart automatically.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: "8px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${T.border}`, background: T.card, color: T.textSub, cursor: "pointer", fontFamily: T.body }}>Close</button>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: "8px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, border: "none", background: T.accent, color: "white", cursor: "pointer", fontFamily: T.body }}>Got it</button>
            </div>
          </div>
        </div>
      )}

      {/* Master-detail card: tree left | attributes right */}
      <Card style={{ padding: "0", overflow: "hidden", display: "flex", minHeight: "320px" }}>
        {/* Tree — scrolls horizontally independently */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, overflowX: "auto", borderRight: selectedId ? `1.5px solid ${T.border}` : "none" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "620px", padding: "28px 24px" }}>
            {/* T1 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              {tier1.map(n => <OrgCard key={n.id} node={n} selectedId={selectedId} onSelect={handleSelect} />)}
            </div>
            <div style={{ width: "2px", height: "28px", background: T.borderStrong }} />
            {/* T2 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              {tier2.map(n => <OrgCard key={n.id} node={n} selectedId={selectedId} onSelect={handleSelect} />)}
            </div>
            <div style={{ width: "2px", height: "20px", background: T.borderStrong }} />
            <div style={{ borderTop: `2px solid ${T.borderStrong}`, width: "88%" }} />
            {/* T3 + T4 (T4 hangs below its reportsTo T3 node) */}
            <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
              {tier3.map(n => {
                const children = orgNodes.filter(x => x.reportsTo === n.id && x.tier > n.tier);
                return (
                  <div key={n.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "2px", height: "24px", background: T.borderStrong }} />
                    <OrgCard node={n} selectedId={selectedId} onSelect={handleSelect} />
                    {children.map(c => (
                      <Fragment key={c.id}>
                        <div style={{ width: "2px", height: "16px", background: T.border }} />
                        <OrgCard node={c} selectedId={selectedId} onSelect={handleSelect} />
                      </Fragment>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel — slides in from right when a node is selected */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: selectedId ? "290px" : "0px",
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.2s ease",
            background: T.card,
          }}
        >
          {selectedNode && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", minWidth: "290px" }}>
              <div style={{ padding: "11px 14px", background: T.accentLight, borderBottom: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: tierConfig[selectedNode.tier].dot === "white" ? T.sidebarActive : tierConfig[selectedNode.tier].dot, flexShrink: 0 }} />
                <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "12px", color: T.accentText, flex: 1, lineHeight: 1.3 }}>{selectedNode.title}</span>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedId(null); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: "18px", lineHeight: 1, padding: "2px 6px" }}
                >×</button>
              </div>
              <div style={{ padding: "14px", overflowY: "auto", flex: 1 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 12px" }}>
                  {ORG_ATTRS.map(a => (
                    <div key={a.field}>
                      <div style={{ fontSize: "9px", fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "2px" }}>{a.key}</div>
                      <div style={{ fontSize: "11.5px", color: T.text, fontWeight: 500 }}>{String((selectedNode as any)[a.field] ?? "—")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Legend */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
        {[
          { tier: 1, label: "P1 — Strategic",            bg: T.sidebar, text: "white" },
          { tier: 2, label: "P2 — Management",           bg: T.accent,  text: "white" },
          { tier: 3, label: "P3 — Operational",          bg: T.card,    text: T.text, border: T.border },
          { tier: 4, label: "P4 — Site coordinator ×N",  bg: T.bg,      text: T.textSub, border: T.border },
        ].map(l => (
          <div key={l.tier} style={{ fontSize: "11px", fontWeight: 600, padding: "5px 12px", borderRadius: "6px", background: l.bg, color: l.text, border: l.border ? `1.5px solid ${l.border}` : "none", fontFamily: T.body }}>
            {l.label}
          </div>
        ))}
      </div>

      {/* Full attribute reference table */}
      <Card style={{ marginTop: "16px" }}>
        <CardHeader>Full position attribute map — click any row to open detail</CardHeader>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr>
                <Th>Position</Th>
                {ORG_ATTRS.slice(0, 5).map(a => <Th key={a.field}>{a.key}</Th>)}
              </tr>
            </thead>
            <tbody>
              {orgNodes.map(n => (
                <tr
                  key={n.id}
                  onClick={e => { e.stopPropagation(); handleSelect(n.id); }}
                  style={{ cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Td><span style={{ fontWeight: 600 }}>{n.title}</span></Td>
                  {ORG_ATTRS.slice(0, 5).map(a => <Td key={a.field}>{String((n as any)[a.field] ?? "—")}</Td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "6px 16px 10px", fontSize: "10.5px", color: T.textMuted, fontFamily: T.body }}>
            Showing 5 of 11 attributes · Click any row to open full detail
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── PAGE: GOALS REGISTER ─────────────────────────────────────────────────────

const goalTypeLabel: Record<string, string> = {
  CE: "Continuous Improvement",
  PD: "Breakthrough",
};

function GoalsRegister() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(true);

  const visions = [
    "To be the global benchmark for decarbonised cement manufacturing, achieving net zero Scope 1 and 2 emissions across all operations by 2035.",
    "Deliver superior shareholder value by transforming our energy cost structure and carbon risk profile into a durable competitive advantage by 2035.",
  ];
  const strategies = [
    "Accelerate energy efficiency and alternative fuel adoption to reduce carbon intensity while maintaining cost competitiveness across all kilns.",
    "Reduce specific energy costs by 8% through operational excellence, positioning the business ahead of carbon pricing and regulatory tightening.",
  ];
  const kfas = ["Thermal efficiency", "Alternative fuel adoption", "Electrical energy reduction", "Waste heat recovery", "GHG compliance"];

  return (
    <div>
      {/* Compact action bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: T.card, border: `1.5px solid ${T.border}`,
        borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {[
            { label: site.company, icon: "🏭" },
            { label: "ESG Energy Goals", icon: "🎯" },
            { label: site.period,  icon: "📅" },
          ].map((chip, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: T.bg, border: `1.5px solid ${T.border}`,
              borderRadius: "6px", padding: "4px 10px",
              fontSize: "11px", fontWeight: 500, color: T.textSub, fontFamily: T.body,
            }}>
              <span style={{ fontSize: "10px" }}>{chip.icon}</span>{chip.label}
            </span>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: T.accent, color: "white",
            borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none",
            borderRadius: "8px", padding: "9px 18px",
            fontSize: "12.5px", fontWeight: 600, fontFamily: T.body,
            cursor: "pointer", boxShadow: `0 2px 8px ${T.accent}55`,
            transition: "all 0.15s ease", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#0284C7"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.accent; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Create Goal
        </button>
      </div>

      {/* Coming-soon modal */}
      {showCreateModal && (
        <div onClick={() => setShowCreateModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, borderRadius: "14px", padding: "32px 36px",
            border: `1.5px solid ${T.border}`, maxWidth: "440px", width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={20} color={T.accent} />
              </div>
              <div>
                <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "16px", color: T.text }}>Create Goal</div>
                <div style={{ fontSize: "11px", color: T.textSub, marginTop: "1px" }}>Annual goal builder — coming soon</div>
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: T.textSub, lineHeight: 1.65, margin: "0 0 20px" }}>
              The goal builder will let you define managing points, baselines, targets, control limits, responsible positions, review frequency, and quarterly checkpoints.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: "8px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${T.border}`, background: T.card, color: T.textSub, cursor: "pointer", fontFamily: T.body }}>
                Close
              </button>
              <button onClick={() => setShowCreateModal(false)} style={{ padding: "8px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none", background: T.accent, color: "white", cursor: "pointer", fontFamily: T.body }}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Policy Context ── */}
      <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
        <div
          onClick={() => setPolicyOpen(p => !p)}
          style={{ background: T.sidebar, padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
              style={{ transform: policyOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
              <path d="M2.5 4.5L6.5 8.5L10.5 4.5" stroke={T.sidebarActive} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: T.heading, fontWeight: 600, fontSize: "13px", color: "white" }}>Policy context</span>
            <span style={{ fontSize: "10px", color: T.sidebarText, opacity: 0.7 }}>Vision · Strategy · Key Focus Areas</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setShowCreateModal(true); }}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: T.sidebarActive, color: T.sidebar, border: "none", borderRadius: "7px", padding: "6px 14px", fontSize: "11.5px", fontWeight: 700, fontFamily: T.body, cursor: "pointer" }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke={T.sidebar} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Create
          </button>
        </div>

        {policyOpen && (
          <div style={{ padding: "16px 18px", background: T.bg }}>

            {/* Vision */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px" }}>Vision</div>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", fontFamily: T.body }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round" /></svg>
                  Add vision
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {visions.map((v, i) => (
                  <div key={i} style={{ background: T.sidebar, borderRadius: "8px", padding: "11px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                    <div style={{ fontFamily: T.heading, fontSize: "12px", fontWeight: 500, color: "white", lineHeight: 1.5, flex: 1 }}>{v}</div>
                    <div style={{ display: "flex", gap: "5px", flexShrink: 0, marginTop: "1px" }}>
                      <button style={{ width: "22px", height: "22px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 8.5L3.5 9l6-6L7 .5 1 6.5z" stroke={T.sidebarText} strokeWidth="1.2" /></svg>
                      </button>
                      <button style={{ width: "22px", height: "22px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke={T.sidebarText} strokeWidth="1.4" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy */}
            <div style={{ borderLeft: `2px solid ${T.border}`, marginLeft: "10px", paddingLeft: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px" }}>Strategy FY 2025–26</div>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", fontFamily: T.body }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round" /></svg>
                  Add strategy
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {strategies.map((s, i) => (
                  <div key={i} style={{ background: T.accent, borderRadius: "8px", padding: "11px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                    <div style={{ fontFamily: T.heading, fontSize: "12px", fontWeight: 500, color: "white", lineHeight: 1.5, flex: 1 }}>{s}</div>
                    <div style={{ display: "flex", gap: "5px", flexShrink: 0, marginTop: "1px" }}>
                      <button style={{ width: "22px", height: "22px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 8.5L3.5 9l6-6L7 .5 1 6.5z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" /></svg>
                      </button>
                      <button style={{ width: "22px", height: "22px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KFAs */}
            <div style={{ borderLeft: `2px solid ${T.border}`, marginLeft: "10px", paddingLeft: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px" }}>Key focus areas</div>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", fontFamily: T.body }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round" /></svg>
                  Add KFA
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {kfas.map((k, i) => (
                  <span key={i} style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "6px", background: T.successBg, color: T.successText, border: `1.5px solid ${T.success}33`, fontFamily: T.body }}>{k}</span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {goals.map(g => {
          const typeLabel = goalTypeLabel[g.type] ?? g.type;
          const typeBg    = g.type === "CE" ? T.accentLight : "#FAF5FF";
          const typeColor = g.type === "CE" ? T.accentText  : "#6B21A8";
          const srcBg     = g.source === "Internal" ? T.bg   : T.amberBg;
          const srcColor  = g.source === "Internal" ? T.textSub : T.amberText;
          return (
            <Card key={g.id}>
              {/* Header row */}
              <div style={{ padding: "14px 18px", borderBottom: `1.5px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <Badge label={typeLabel} color={typeColor} bg={typeBg} />
                  <Badge label={g.source} color={srcColor} bg={srcBg} />
                  {(g as any).sourceDetail && (
                    <span style={{ fontSize: "11px", color: T.textSub, fontStyle: "italic" }}>{(g as any).sourceDetail}</span>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: "10px", fontWeight: 700, padding: "2px 9px", borderRadius: "5px", background: T.bg, color: T.textSub, border: `1.5px solid ${T.border}`, whiteSpace: "nowrap" }}>{site.period}</span>
                </div>
                <p style={{ fontSize: "12.5px", color: T.text, margin: 0, lineHeight: 1.6 }}>{g.statement}</p>
              </div>
              {/* Detail grid */}
              <div style={{ padding: "12px 18px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", borderBottom: `1.5px solid ${T.border}` }}>
                {[
                  { label: "Managing point", val: g.mp },
                  { label: "UOM",            val: g.uom },
                  { label: "Baseline → Target", val: <span><span style={{ color: T.textSub }}>{g.baseline}</span><span style={{ color: T.textMuted, margin: "0 6px" }}>→</span><span style={{ fontWeight: 700, color: T.accent }}>{g.target} {g.uom}</span></span> },
                  { label: "Responsible",    val: g.responsible },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{f.label}</div>
                    <div style={{ fontSize: "12px", color: T.text, fontWeight: 500 }}>{f.val}</div>
                  </div>
                ))}
              </div>
              {/* Periodic Targets */}
              <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", flexShrink: 0 }}>Periodic Targets</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {g.checkpoints.map((cp, j) => (
                    <div key={j} style={{ background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: "6px", padding: "5px 10px", fontSize: "11px" }}>
                      <span style={{ fontWeight: 700, color: T.textSub }}>{cp.period}: </span>
                      <span style={{ fontWeight: 700, color: T.accent }}>{cp.target}{typeof cp.target === "number" ? ` ${g.uom}` : ""}</span>
                      {"note" in cp && cp.note && <span style={{ color: T.textMuted }}> · {cp.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/// ─── ROLE SHEET FORM ─────────────────────────────────────────────────────────

const CAPTURE_FREQ  = ["Daily", "Weekly", "Monthly", "Quarterly", "Annual"];
const REVIEW_FREQ   = ["Monthly", "Quarterly", "Annual"];
const CHART_TYPES   = ["Line (trend)", "Bar (period)", "Gauge", "Control chart", "Stacked bar", "Bullet"];
const POLARITIES    = ["Higher is better", "Lower is better"];
const DATA_SOURCES  = ["Manual entry", "Meter reading", "ERP system", "Third-party report"];

type RoleRow = {
  area: string; position: string; role: string; mp: string; uom: string;
  definition: string; standard: string; captureFreq: string; reviewFreq: string;
  chartType: string; polarity: string; dataSource: string; goalsLink: string; responsible: string;
};

const emptyRow = (): RoleRow => ({
  area: "", position: "", role: "", mp: "", uom: "", definition: "", standard: "",
  captureFreq: "Monthly", reviewFreq: "Monthly", chartType: "Line (trend)",
  polarity: "Lower is better", dataSource: "Manual entry", goalsLink: "", responsible: "",
});

const positionOptions = orgNodes.map(n => n.title);
const goalOptions     = goals.map(g => g.mp);

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "5px", fontFamily: T.body }}>
      {text}{required && <span style={{ color: T.amber, marginLeft: "3px" }}>*</span>}
    </label>
  );
}

function FormInput({ value, onChange, placeholder, multiline }: { value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const base: CSSProperties = {
    width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "12.5px",
    color: T.text, background: T.bg, border: `1.5px solid ${T.border}`,
    borderRadius: "6px", padding: "7px 10px", outline: "none",
    transition: "border-color 0.15s", resize: "none",
  };
  if (multiline) return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
      style={base}
      onFocus={e => (e.target.style.borderColor = T.accent)}
      onBlur={e => (e.target.style.borderColor = T.border)} />
  );
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ ...base, height: "34px" }}
      onFocus={e => (e.target.style.borderColor = T.accent)}
      onBlur={e => (e.target.style.borderColor = T.border)} />
  );
}

function FormSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "12px",
      color: T.text, background: T.card, border: `1.5px solid ${T.border}`,
      borderRadius: "6px", padding: "6px 8px", height: "34px", outline: "none", cursor: "pointer",
    }}>
      <option value="">— select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function GridCell({ children, width = 160, first }: { children: ReactNode; width?: number; first?: boolean }) {
  return (
    <td style={{
      padding: "6px 8px", borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
      minWidth: `${width}px`, maxWidth: `${width}px`, verticalAlign: "top",
      background: first ? T.accentLight : T.card,
      position: first ? "sticky" : undefined, left: first ? 0 : undefined, zIndex: first ? 2 : undefined,
    }}>
      {children}
    </td>
  );
}

function GridInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "11.5px",
        color: T.text, background: "transparent", border: `1px solid transparent`,
        borderRadius: "4px", padding: "4px 6px", outline: "none",
      }}
      onFocus={e => { e.target.style.background = "white"; e.target.style.borderColor = T.accent; }}
      onBlur={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "transparent"; }} />
  );
}

function GridSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "11px",
      color: T.text, background: "transparent", border: `1px solid transparent`,
      borderRadius: "4px", padding: "4px 4px", outline: "none", cursor: "pointer",
    }}
      onFocus={e => { e.target.style.background = "white"; e.target.style.borderColor = T.accent; }}
      onBlur={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "transparent"; }}>
      <option value="">—</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SectionLabel({ num, title, subtitle, color = T.accent, bg = T.accentLight, textColor = T.accentText }:
  { num: string; title: string; subtitle?: string; color?: string; bg?: string; textColor?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "50%", background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 800, color: "white", flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "13px", color: T.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: "10.5px", color: T.textSub, marginTop: "1px" }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function CreateRoleSheetForm({ onClose }: { onClose: () => void }) {
  const [deptName,    setDeptName]    = useState(site.department);
  const [deptHead,    setDeptHead]    = useState("Dr. Arun Sharma");
  const [objective,   setObjective]   = useState(site.deptObjective);
  const [position,    setPosition]    = useState("");
  const [rolePurpose, setRolePurpose] = useState("");
  const [rows,        setRows]        = useState<RoleRow[]>([emptyRow()]);

  const updateRow = (i: number, field: keyof RoleRow, val: string) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const addRow    = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const roleColHeaders: { label: string; width: number; field: keyof RoleRow; type: "text" | "select"; options?: string[] }[] = [
    { label: "Area of responsibility", width: 170, field: "area",        type: "text" },
    { label: "Role (routine work)",    width: 220, field: "role",        type: "text" },
    { label: "Managing point",         width: 190, field: "mp",          type: "text" },
    { label: "UOM",                    width: 90,  field: "uom",         type: "text" },
    { label: "Definition & formula",   width: 200, field: "definition",  type: "text" },
    { label: "Standard",               width: 130, field: "standard",    type: "text" },
    { label: "Capture frequency",      width: 130, field: "captureFreq", type: "select", options: CAPTURE_FREQ },
    { label: "Review frequency",       width: 130, field: "reviewFreq",  type: "select", options: REVIEW_FREQ },
    { label: "Chart type",             width: 150, field: "chartType",   type: "select", options: CHART_TYPES },
    { label: "Polarity",               width: 150, field: "polarity",    type: "select", options: POLARITIES },
    { label: "Data source",            width: 150, field: "dataSource",  type: "select", options: DATA_SOURCES },
    { label: "Goals register link",    width: 200, field: "goalsLink",   type: "select", options: goalOptions },
    { label: "Responsible",            width: 190, field: "responsible", type: "select", options: positionOptions },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: T.bg, zIndex: 1000, display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 28px", background: T.sidebar, flexShrink: 0,
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FlameLogo size={28} />
          <div>
            <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "15px", color: "white" }}>
              Create Role Sheet
            </div>
            <div style={{ fontSize: "10px", color: T.sidebarText, opacity: 0.6, marginTop: "1px" }}>
              {site.company} · {site.department} · {site.period}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onClose} style={{
            padding: "7px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
            border: `1.5px solid rgba(255,255,255,0.18)`, background: "transparent",
            color: T.sidebarText, cursor: "pointer", fontFamily: T.body,
          }}>Cancel</button>
          <button onClick={onClose} style={{
            padding: "7px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
            borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none",
            background: T.accent, color: "white", cursor: "pointer", fontFamily: T.body,
          }}>Save Role Sheet</button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Progress strip */}
        <div style={{
          display: "flex", borderBottom: `1.5px solid ${T.border}`,
          background: T.card, flexShrink: 0,
        }}>
          {[
            { n: "1", label: "Department Profile", done: true },
            { n: "2", label: "Position",           done: !!position },
            { n: "3", label: "Roles",              done: rows.some(r => r.role) },
          ].map((step, i) => (
            <div key={i} style={{
              flex: 1, padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px",
              borderRight: i < 2 ? `1px solid ${T.border}` : "none",
              borderBottom: step.done ? `3px solid ${T.accent}` : `3px solid transparent`,
            }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                background: step.done ? T.accent : T.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 700, color: "white",
              }}>{step.n}</div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: step.done ? T.text : T.textMuted, fontFamily: T.body }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* ── SECTION 1: Department Profile ── */}
          <div>
            <SectionLabel num="1" title="Department Profile" subtitle="One per department — anchors every role to the department's purpose" />
            <div style={{
              background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px",
              padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "16px",
            }}>
              <div>
                <FieldLabel text="Department name" required />
                <FormInput value={deptName} onChange={setDeptName} placeholder="e.g. Energy & Environment" />
              </div>
              <div>
                <FieldLabel text="Department head" required />
                <FormSelect value={deptHead} onChange={setDeptHead} options={positionOptions} />
                <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "4px" }}>Linked to Org Chart</div>
              </div>
              <div>
                <FieldLabel text="High level objective" required />
                <FormInput value={objective} onChange={setObjective}
                  placeholder="The department's purpose statement — mandatory. Visible to all team members." multiline />
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Position ── */}
          <div>
            <SectionLabel num="2" title="Position" subtitle="Select the position this role sheet is for — auto-populated from Org Chart"
              color="#7C3AED" />
            <div style={{
              background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px",
              padding: "20px", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px",
            }}>
              <div>
                <FieldLabel text="Position" required />
                <FormSelect value={position} onChange={setPosition} options={positionOptions} />
                <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "4px" }}>From Org Chart</div>
              </div>
              <div>
                <FieldLabel text="Role purpose statement" required />
                <FormInput value={rolePurpose} onChange={setRolePurpose}
                  placeholder="What this position exists to do — its reason for being in the department" multiline />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Roles ── */}
          <div>
            <SectionLabel num="3" title="Roles" subtitle="Repeating rows — one row per routine work item for this position"
              color="#059669" />

            <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", overflow: "hidden" }}>
              {/* Section header */}
              <div style={{
                padding: "11px 18px", borderBottom: `1.5px solid ${T.border}`,
                background: T.successBg, display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "12px", color: T.successText, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    Role rows
                  </span>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, padding: "1px 7px",
                    borderRadius: "99px", background: T.success, color: "white",
                  }}>{rows.length}</span>
                </div>
                <button onClick={addRow} style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "6px 14px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600,
                  background: T.success, color: "white", cursor: "pointer", fontFamily: T.body,
                  borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none",
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Add role row
                </button>
              </div>

              {/* Grid — horizontally scrollable */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                  <thead>
                    <tr style={{ background: T.bg }}>
                      <th style={{
                        padding: "8px 10px", borderRight: `1px solid ${T.border}`, borderBottom: `1.5px solid ${T.border}`,
                        fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase",
                        minWidth: "36px", textAlign: "center", position: "sticky", left: 0, zIndex: 3, background: T.bg,
                      }}>#</th>
                      {roleColHeaders.map(col => (
                        <th key={col.field} style={{
                          padding: "8px 10px", borderRight: `1px solid ${T.border}`, borderBottom: `1.5px solid ${T.border}`,
                          fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase",
                          letterSpacing: "0.6px", minWidth: `${col.width}px`, textAlign: "left",
                          whiteSpace: "nowrap", fontFamily: T.body,
                        }}>{col.label}</th>
                      ))}
                      <th style={{
                        padding: "8px 10px", borderBottom: `1.5px solid ${T.border}`,
                        minWidth: "44px", textAlign: "center",
                      }} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}
                        onMouseEnter={e => (e.currentTarget.style.background = "#F8FFF8")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{
                          padding: "6px 8px", borderRight: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
                          textAlign: "center", fontSize: "10px", fontWeight: 700, color: T.success,
                          position: "sticky", left: 0, background: T.successBg, zIndex: 2, minWidth: "36px",
                        }}>{i + 1}</td>
                        {roleColHeaders.map(col => (
                          <GridCell key={col.field} width={col.width}>
                            {col.type === "select"
                              ? <GridSelect value={row[col.field]} onChange={v => updateRow(i, col.field, v)} options={col.options!} />
                              : <GridInput  value={row[col.field]} onChange={v => updateRow(i, col.field, v)} placeholder={col.label} />}
                          </GridCell>
                        ))}
                        <td style={{ padding: "6px 8px", borderBottom: `1px solid ${T.border}`, textAlign: "center", verticalAlign: "middle" }}>
                          {rows.length > 1 && (
                            <button onClick={() => removeRow(i)} style={{
                              width: "24px", height: "24px", borderRadius: "5px", display: "inline-flex",
                              alignItems: "center", justifyContent: "center",
                              background: "#FEF2F2", border: "none", cursor: "pointer",
                            }}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6h8" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ padding: "10px 18px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "16px", background: T.bg }}>
                <span style={{ fontSize: "10.5px", color: T.textMuted, fontFamily: T.body }}>
                  Tab between cells to move · Click to edit · Each row = one routine work item for this position
                </span>
                <button onClick={addRow} style={{
                  fontSize: "11px", fontWeight: 600, color: T.success,
                  background: "none", border: "none", cursor: "pointer", fontFamily: T.body, padding: 0, marginLeft: "auto",
                }}>+ Add another role row</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── PAGE: ROLE SHEETS ────────────────────────────────────────────────────────

function PolarityBadge({ polarity }: { polarity: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    "Lower is better":  { color: "#1D4ED8", bg: "#EFF6FF" },
    "Higher is better": { color: T.successText, bg: T.successBg },
    "Within band":      { color: T.textSub, bg: T.bg },
  };
  const s = map[polarity] ?? { color: T.textSub, bg: T.bg };
  return <Badge label={polarity} color={s.color} bg={s.bg} />;
}

function RoleSheets() {
  const [selected, setSelected] = useState(0);
  const [expandedMPs, setExpandedMPs] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const rs: any = roleSheets[selected] ?? {};
  const roles: any[] = Array.isArray(rs.roles) ? rs.roles : [];

  const toggleMP = (key: string) =>
    setExpandedMPs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ fontFamily: T.body }}>
      {showForm && <CreateRoleSheetForm onClose={() => setShowForm(false)} />}

      {/* ── Compact action bar (matches Org Chart / Goals pattern) ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: T.card, border: `1.5px solid ${T.border}`,
        borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {[
            { label: site.company,    icon: "🏭" },
            { label: site.department, icon: "📋" },
            { label: site.period,     icon: "📅" },
          ].map((chip, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: T.bg, border: `1.5px solid ${T.border}`,
              borderRadius: "6px", padding: "4px 10px",
              fontSize: "11px", fontWeight: 500, color: T.textSub, fontFamily: T.body,
            }}>
              <span style={{ fontSize: "10px" }}>{chip.icon}</span>{chip.label}
            </span>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: T.accent, color: "white", flexShrink: 0,
            borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none",
            borderRadius: "8px", padding: "9px 18px", fontSize: "12.5px", fontWeight: 600,
            fontFamily: T.body, cursor: "pointer", boxShadow: `0 2px 8px ${T.accent}55`,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#0284C7")}
          onMouseLeave={e => (e.currentTarget.style.background = T.accent)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Create Role Sheet
        </button>
      </div>

      {/* ── Department header section ── */}
      <div style={{
        background: T.card, border: `1.5px solid ${T.border}`,
        borderRadius: "10px", marginBottom: "16px", overflow: "hidden",
      }}>
        <div style={{
          padding: "10px 18px", borderBottom: `1.5px solid ${T.border}`,
          background: T.accentLight, display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "11px", color: T.accentText, textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Department Profile
          </span>
        </div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "20px" }}>
          {/* Dept name */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>
              Department name
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, fontFamily: T.heading }}>
              {site.department}
            </div>
          </div>
          {/* Dept head */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>
              Department head
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, fontFamily: T.heading }}>
              {site.deptHead}
            </div>
            <div style={{ fontSize: "10.5px", color: T.textSub, marginTop: "2px" }}>
              Plant Energy &amp; Environment Manager
            </div>
          </div>
          {/* Objective */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>
              High level objective
            </div>
            <p style={{ fontSize: "12.5px", color: T.text, margin: 0, lineHeight: 1.65 }}>
              {site.deptObjective}
            </p>
          </div>
        </div>
      </div>

      {/* Position tabs */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
        {roleSheets.map((r: any, i) => (
          <button key={i} onClick={() => { setSelected(i); setExpandedMPs({}); }} style={{
            padding: "7px 14px", borderRadius: "7px",
            border: `1.5px solid ${selected === i ? T.accent : T.border}`,
            background: selected === i ? T.accent : T.card,
            color: selected === i ? "white" : T.textSub,
            fontSize: "11.5px", fontWeight: 600, cursor: "pointer",
            fontFamily: T.body, transition: "all 0.15s",
          }}>
            {r.position}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Role — Qualitative mandate",  color: "#92400E", bg: "#FFFBEB", border: "#FCD34D" },
          { label: "MP — Managing Point (KPI)",   color: T.accentText, bg: T.accentLight, border: T.accent + "40" },
          { label: "CP — Control Point (daily)", color: "#5B21B6", bg: "#FAF5FF", border: "#C4B5FD" },
        ].map(l => (
          <span key={l.label} style={{
            fontSize: "10.5px", fontWeight: 600, padding: "3px 10px",
            borderRadius: "5px", background: l.bg, color: l.color,
            border: `1px solid ${l.border}`, fontFamily: T.body,
          }}>{l.label}</span>
        ))}
        <span style={{ fontSize: "10.5px", color: T.textMuted, fontFamily: T.body, marginLeft: "4px" }}>
          Click an MP row to expand its Control Points
        </span>
      </div>

      <Card>
        {/* Position header */}
        <div style={{ padding: "14px 20px", background: T.sidebar, borderBottom: `1.5px solid ${T.border}` }}>
          <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "15px", color: "white", marginBottom: "5px" }}>
            {rs.position}
          </div>
          <div style={{ fontSize: "9px", fontWeight: 700, color: T.sidebarActive, textTransform: "uppercase", letterSpacing: "0.9px", marginBottom: "3px" }}>
            Position Purpose
          </div>
          <div style={{ fontSize: "12px", color: T.sidebarText, opacity: 0.8, lineHeight: 1.6, maxWidth: "780px" }}>
            {rs.rolePurpose}
          </div>
        </div>

        {/* Cascade header */}
        <div style={{
          padding: "7px 20px", background: T.bg, borderBottom: `1.5px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: T.textMuted, fontFamily: T.body,
        }}>
          <span style={{ fontWeight: 700, color: T.text }}>Position</span>
          <span>→</span>
          <span style={{ fontWeight: 700, color: "#92400E" }}>Roles</span>
          <span>→</span>
          <span style={{ fontWeight: 700, color: T.accentText }}>Managing Points</span>
          <span>→</span>
          <span style={{ fontWeight: 700, color: "#5B21B6" }}>Control Points</span>
        </div>

        {/* Scrollable table wrapper */}
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "860px", borderCollapse: "collapse" }}>
          <colgroup>
            <col style={{ width: "34%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead>
            <tr>
              <Th>Role / Managing Point / Control Point</Th>
              <Th>UOM</Th>
              <Th>Standard / Target</Th>
              <Th>Frequency</Th>
              <Th>Polarity</Th>
              <Th>Responsible</Th>
              <Th>Source</Th>
            </tr>
          </thead>
          <tbody>
            {roles.map((roleRow: any, ri: number) => {
              const roleKey = `role-${selected}-${ri}`;
              return (
                <Fragment key={roleKey}>

                  {/* ── ROLE ROW ── */}
                  <tr style={{ background: "#FFFBEB", borderLeft: `4px solid #F59E0B` }}>
                    <td colSpan={6} style={{
                      padding: "10px 16px", borderBottom: `1px solid #FDE68A`,
                      fontFamily: T.body,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                        <span style={{
                          fontSize: "8.5px", fontWeight: 800, padding: "2px 7px", borderRadius: "4px",
                          background: "#F59E0B", color: "white", flexShrink: 0, marginTop: "1px",
                          letterSpacing: "0.3px",
                        }}>ROLE {ri + 1}</span>
                        <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#78350F", lineHeight: 1.5 }}>
                          {roleRow.role}
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: "10px 16px", borderBottom: `1px solid #FDE68A`,
                      fontFamily: T.body, verticalAlign: "middle",
                    }}>
                      <span style={{
                        fontSize: "10.5px", fontWeight: 600, color: "#92400E",
                        background: "#FEF3C7", padding: "2px 8px", borderRadius: "4px",
                        whiteSpace: "nowrap",
                      }}>
                        {rs.position}
                      </span>
                    </td>
                  </tr>

                  {/* ── MP rows under this Role ── */}
                  {(Array.isArray(roleRow.managingPoints) ? roleRow.managingPoints : []).map((mp: any, mi: number) => {
                    const mpKey = `${selected}-${ri}-${mi}`;
                    const expanded = !!expandedMPs[mpKey];
                    return (
                      <Fragment key={mpKey}>
                        <tr
                          onClick={() => toggleMP(mpKey)}
                          style={{
                            cursor: "pointer",
                            background: expanded ? T.accentLight : "transparent",
                            borderLeft: `4px solid ${T.accent}`,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => !expanded && (e.currentTarget.style.background = T.bg)}
                          onMouseLeave={e => !expanded && (e.currentTarget.style.background = "transparent")}
                        >
                          <Td style={{ paddingLeft: "28px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{
                                fontSize: "8.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px",
                                background: T.accentLight, color: T.accentText, flexShrink: 0,
                              }}>MP</span>
                              <span style={{ fontWeight: 700, color: T.text }}>{mp.mp}</span>
                              <span style={{
                                fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "99px",
                                background: "#FAF5FF", color: "#5B21B6", marginLeft: "4px",
                              }}>{Array.isArray(mp.controlPoints) ? mp.controlPoints.length : 0} CP</span>
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                                style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", marginLeft: "auto", flexShrink: 0 }}>
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </Td>
                          <Td style={{ color: T.textSub }}>{mp.uom}</Td>
                          <Td><span style={{ fontWeight: 700, color: T.accent }}>{mp.standard}</span></Td>
                          <Td style={{ color: T.textSub }}>{mp.freq}</Td>
                          <Td><PolarityBadge polarity={mp.polarity} /></Td>
                          <Td>
                            <span style={{
                              fontSize: "10.5px", fontWeight: 600, color: T.accentText,
                              background: T.accentLight, padding: "2px 8px", borderRadius: "4px",
                              whiteSpace: "nowrap",
                            }}>
                              {rs.position}
                            </span>
                          </Td>
                          <Td style={{ color: T.textSub }}>{mp.source}</Td>
                        </tr>

                        {/* ── Checking Point rows ── */}
                        {expanded && (Array.isArray(mp.controlPoints) ? mp.controlPoints : []).map((cp: any, ci: number) => (
                          <tr key={`cp-${ri}-${mi}-${ci}`} style={{ background: "#FAFAFF", borderLeft: `4px solid #A78BFA` }}>
                            <Td style={{ paddingLeft: "52px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                                <span style={{
                                  fontSize: "8.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px",
                                  background: "#EDE9FE", color: "#5B21B6", flexShrink: 0,
                                }}>CP</span>
                                <span style={{ color: T.text, fontSize: "12px" }}>{cp.name}</span>
                              </div>
                            </Td>
                            <Td style={{ color: T.textSub, fontSize: "11px" }}>{cp.uom}</Td>
                            <Td>
                              <div style={{ fontSize: "11px" }}>
                                <span style={{ fontWeight: 600, color: T.text }}>{cp.target}</span>
                                {(cp.ucl !== "—" || cp.lcl !== "—") && (
                                  <div style={{ fontSize: "9.5px", color: T.textMuted, marginTop: "2px" }}>
                                    {cp.ucl !== "—" && `UCL ${cp.ucl}`}
                                    {cp.ucl !== "—" && cp.lcl !== "—" && " · "}
                                    {cp.lcl !== "—" && `LCL ${cp.lcl}`}
                                  </div>
                                )}
                              </div>
                            </Td>
                            <Td style={{ color: T.textSub, fontSize: "11px" }}>{cp.freq}</Td>
                            <Td style={{ color: T.textSub, fontSize: "11px" }}>—</Td>
                            <Td style={{ color: T.textSub, fontSize: "11px" }}>{cp.responsible}</Td>
                            <Td style={{ color: T.textSub, fontSize: "11px" }}>{cp.source}</Td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        </div>{/* end scrollable wrapper */}
      </Card>
    </div>
  );
}

// ─── PAGE: ANNUAL TARGETS ─────────────────────────────────────────────────────

// Section colour tokens — mapped to steel blue theme
// A = primary accent (sky blue), B = indigo complement, C = amber (already in theme)
const SA = { color: T.accent,   bg: T.accentLight,  border: T.accent,   light: "#E0F2FE" };
const SB = { color: "#6366F1",  bg: "#EEF2FF",      border: "#6366F1",  light: "#F0F0FF" };
const SC = { color: T.amber,    bg: T.amberBg,      border: T.amber,    light: T.amberBg };

// Demo data for Annual Target Sheet
const AT_DATA = {
  position: "Thermal Process Engineer",
  period: "FY 2025–26",
  supervisor: "Dr. Arun Sharma",
  status: "Active",
  sectionA: [
    {
      id: "shc", mp: "Specific Heat Consumption (SHC)", uom: "kcal/kg clinker",
      standard: "≤ 755", polarity: "Lower is better", source: "DCS CSV export",
      priorTarget: 740, priorActual: 748, thisYear: 720,
      periodicTargets: [
        { period: "Q1", target: "742" }, { period: "Q2", target: "735" },
        { period: "Q3", target: "725" }, { period: "Q4", target: "720" },
      ],
      controlPoints: [
        { name: "Preheater exit temperature", uom: "°C",  target: "310–360°C", ucl: "360", lcl: "310", freq: "Daily",  responsible: "Kiln Operator" },
        { name: "False air at preheater exit", uom: "%",  target: "≤ 6%",      ucl: "8",   lcl: "—",   freq: "Weekly", responsible: "Maintenance Technician" },
        { name: "Coal particle fineness R90",  uom: "%",  target: "≤ 12%",     ucl: "15",  lcl: "—",   freq: "Daily",  responsible: "Coal Mill Operator" },
      ],
    },
    {
      id: "tsr", mp: "Alt. Fuel Feed Rate (TSR%)", uom: "%",
      standard: "Per weekly plan", polarity: "Higher is better", source: "Manual",
      priorTarget: 12, priorActual: 12, thisYear: 18,
      periodicTargets: [
        { period: "Q1", target: "13%" }, { period: "Q2", target: "15%" },
        { period: "Q3", target: "16.5%" }, { period: "Q4", target: "18%" },
      ],
      controlPoints: [
        { name: "AF hopper level",    uom: "t",        target: "Per shift plan", ucl: "—",  lcl: "—",    freq: "Shift",  responsible: "Kiln Operator" },
        { name: "AF calorific value", uom: "kcal/kg",  target: "≥ 3500",        ucl: "—",  lcl: "3000", freq: "Weekly", responsible: "AF Coordinator" },
      ],
    },
  ],
  sectionB: [
    {
      id: "ce1",
      statement: "Reduce SHC from 748 to 720 kcal/kg clinker through optimised combustion and false air reduction.",
      source: "ESG Strategy FY2025",
      parentGoal: "Reduce plant energy intensity by 15%",
      allocation: 100,
      parentTarget: 100,
      priorTarget: 740, priorActual: 748, thisYear: 720,
      periodicTargets: [
        { period: "Q1", target: "742" }, { period: "Q2", target: "735" },
        { period: "Q3", target: "725" }, { period: "Q4", target: "720" },
      ],
    },
  ],
  sectionC: [
    {
      id: "pd1",
      statement: "Commission WHR system to generate 8 MW power by Q3 FY25-26.",
      source: "3-Year Capital Plan 2024-2027",
      periodicTargets: [
        { period: "Q1", target: "Civil works complete" },
        { period: "Q2", target: "Equipment erection" },
        { period: "Q3", target: "8 MW commissioned" },
        { period: "Q4", target: "Stabilised" },
      ],
    },
  ],
};

const STATUS_STEPS = ["Draft", "Under review", "Approved", "Active", "Closed"];
const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "Draft":        { color: T.textSub,     bg: T.bg },
  "Under review": { color: T.accentText,  bg: T.accentLight },
  "Approved":     { color: T.successText, bg: T.successBg },
  "Active":       { color: T.accent,      bg: T.accentLight },
  "Closed":       { color: T.textMuted,   bg: T.bg },
};

function ReadOnly({ value }: { value: string | number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "4px",
      background: "#F8FAFC", borderRadius: "5px", padding: "5px 8px",
      fontSize: "12px", color: "#64748B", fontFamily: T.body,
    }}>
      <span>{value}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
        <rect x="1" y="4" width="8" height="5.5" rx="1" stroke="#64748B" strokeWidth="1.2" />
        <path d="M3 4V3a2 2 0 014 0v1" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function EditableInput({ value, onChange, placeholder, isNumeric }: {
  value: string; onChange: (v: string) => void; placeholder?: string; isNumeric?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? "—"}
      type={isNumeric ? "number" : "text"}
      style={{
        width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "12.5px",
        color: T.text, background: "white", border: `1px solid ${T.border}`,
        borderRadius: "5px", padding: "5px 8px", outline: "none",
      }}
      onFocus={e => { e.target.style.borderColor = SA.color; e.target.style.boxShadow = `0 0 0 2px ${SA.color}22`; }}
      onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
    />
  );
}

function ImprovementPill({ priorActual, thisYear }: { priorActual: number; thisYear: number }) {
  if (!thisYear || !priorActual) return <span style={{ color: T.textMuted }}>—</span>;
  const pct = (((thisYear - priorActual) / priorActual) * 100).toFixed(1);
  const isImprovement = parseFloat(pct) < 0;
  return (
    <span style={{
      fontWeight: 700, fontSize: "12px",
      color: isImprovement ? T.successText : T.amberText,
      background: isImprovement ? T.successBg : T.amberBg,
      padding: "2px 8px", borderRadius: "4px", fontFamily: T.body,
    }}>
      {parseFloat(pct) > 0 ? "+" : ""}{pct}%
    </span>
  );
}

function SectionHeader({ section, label, sub, color, bg, border, collapsed, onToggle }: any) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", background: bg,
        borderLeft: `4px solid ${color}`, borderBottom: `1.5px solid ${border}40`,
        cursor: "pointer", userSelect: "none",
      }}
    >
      <div>
        <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "13px", color }}>
          {label}
        </div>
        <div style={{ fontSize: "10.5px", color, opacity: 0.7, marginTop: "2px" }}>{sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "10px", fontWeight: 600, color, opacity: 0.7 }}>
          {collapsed ? "Expand" : "Collapse"}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: collapsed ? "none" : "rotate(180deg)", transition: "transform 0.2s" }}>
          <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const FREQ_PRESETS: Record<string, { period: string; target: string }[]> = {
  Quarterly: [
    { period: "Q1", target: "" }, { period: "Q2", target: "" },
    { period: "Q3", target: "" }, { period: "Q4", target: "" },
  ],
  Monthly: [
    { period: "Apr", target: "" }, { period: "May", target: "" }, { period: "Jun", target: "" },
    { period: "Jul", target: "" }, { period: "Aug", target: "" }, { period: "Sep", target: "" },
    { period: "Oct", target: "" }, { period: "Nov", target: "" }, { period: "Dec", target: "" },
    { period: "Jan", target: "" }, { period: "Feb", target: "" }, { period: "Mar", target: "" },
  ],
  "Half-yearly": [
    { period: "H1 (Apr–Sep)", target: "" }, { period: "H2 (Oct–Mar)", target: "" },
  ],
  Annual: [
    { period: "FY 2025–26", target: "" },
  ],
  Custom: [],
};

function PeriodicTargetsTable({ rows, onChange, onRowsChange, color, textOnly }: {
  rows: { period: string; target: string }[];
  onChange: (i: number, field: "period" | "target", val: string) => void;
  onRowsChange?: (rows: { period: string; target: string }[]) => void;
  color: string; textOnly?: boolean;
}) {
  const [freq, setFreq] = useState("Quarterly");

  const handleFreqChange = (f: string) => {
    setFreq(f);
    if (f !== "Custom" && onRowsChange) {
      const preset = FREQ_PRESETS[f].map(p => ({ ...p }));
      onRowsChange(preset);
    }
  };

  const addRow = () => {
    if (onRowsChange) onRowsChange([...rows, { period: "", target: "" }]);
  };

  const removeRow = (i: number) => {
    if (onRowsChange) onRowsChange(rows.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Header row with label + frequency selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Periodic Targets — time-sliced milestones for this Managing Point
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", color: T.textSub, fontFamily: T.body }}>Frequency:</span>
          <select
            value={freq}
            onChange={e => handleFreqChange(e.target.value)}
            style={{
              fontSize: "11px", fontFamily: T.body, fontWeight: 600,
              color, background: "white",
              border: `1.5px solid ${color}40`, borderRadius: "5px",
              padding: "3px 8px", outline: "none", cursor: "pointer",
            }}
          >
            {Object.keys(FREQ_PRESETS).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {["Period", "Target value", "Responsible", ""].map((h, i) => (
              <th key={i} style={{ padding: "7px 12px", textAlign: "left", fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: `1.5px solid ${T.border}`, fontFamily: T.body }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              {/* Period — editable */}
              <td style={{ padding: "5px 8px", width: "140px" }}>
                <input
                  value={row.period}
                  onChange={e => onChange(i, "period", e.target.value)}
                  placeholder="e.g. Q1 or Apr"
                  style={{
                    width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "12px",
                    fontWeight: 600, color: T.text, background: "white",
                    border: `1px solid ${T.border}`, borderRadius: "5px", padding: "4px 8px", outline: "none",
                  }}
                  onFocus={e => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 2px ${color}22`; }}
                  onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
                />
              </td>
              {/* Target — editable */}
              <td style={{ padding: "5px 8px", width: "180px" }}>
                <EditableInput
                  value={row.target}
                  onChange={v => onChange(i, "target", v)}
                  placeholder={textOnly ? "e.g. Civil works complete" : "Enter target"}
                />
              </td>
              <td style={{ padding: "7px 12px" }}>
                <ReadOnly value="Thermal Process Engineer" />
              </td>
              {/* Remove row */}
              <td style={{ padding: "5px 8px", width: "32px", textAlign: "center" }}>
                {rows.length > 1 && (
                  <button onClick={() => removeRow(i)} style={{
                    width: "22px", height: "22px", borderRadius: "4px", display: "inline-flex",
                    alignItems: "center", justifyContent: "center",
                    background: "#FEF2F2", border: "none", cursor: "pointer",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5h6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} style={{
        marginTop: "6px", fontSize: "11px", fontWeight: 600, color,
        background: "none", border: "none", cursor: "pointer", fontFamily: T.body, padding: "4px 0",
      }}>+ Add period</button>
    </div>
  );
}

function ControlPointsTable({ cps, color }: { cps: any[]; color: string }) {
  const [targets, setTargets] = useState<Record<number, string>>({});

  return (
    <div>
      {/* Section label */}
      <div style={{ marginBottom: "6px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Control Points — daily process levers that drive this Managing Point
        </div>
        <div style={{ fontSize: "10.5px", fontWeight: 500, color: T.textSub, marginTop: "3px", fontFamily: T.body }}>
          <span style={{ fontWeight: 700, color: T.textSub }}>SDCA Standard:</span> Maintain and stabilize the set operational baselines.
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Control Point", "UOM", "Target", "UCL", "LCL", "Frequency", "Responsible"].map(h => (
                <th key={h} style={{ padding: "7px 10px", textAlign: "left", fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1.5px solid ${T.border}`, whiteSpace: "nowrap", fontFamily: T.body }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cps.map((cp, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "7px 10px", fontSize: "12px", fontWeight: 500, color: T.text, fontFamily: T.body }}>{cp.name}</td>
                <td style={{ padding: "7px 10px", fontSize: "11px", color: T.textSub, fontFamily: T.body }}>{cp.uom}</td>
                <td style={{ padding: "5px 8px", minWidth: "120px" }}>
                  <input
                    value={targets[i] ?? cp.target}
                    onChange={e => setTargets(p => ({ ...p, [i]: e.target.value }))}
                    placeholder="Enter target"
                    style={{
                      width: "100%", boxSizing: "border-box", fontFamily: T.body, fontSize: "12px",
                      fontWeight: 600, color: T.text, background: "white",
                      border: `1px solid ${T.border}`, borderRadius: "5px", padding: "4px 8px", outline: "none",
                    }}
                    onFocus={e => { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 2px ${color}22`; }}
                    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
                  />
                </td>
                <td style={{ padding: "5px 8px" }}>
                  <span style={{
                    display: "inline-block", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 600,
                    background: cp.ucl !== "—" ? "#FFFBEB" : T.bg,
                    border: cp.ucl !== "—" ? `1px solid #FCD34D` : `1px solid ${T.border}`,
                    color: cp.ucl !== "—" ? "#92400E" : T.textMuted,
                    fontFamily: T.body,
                  }}>{cp.ucl}</span>
                </td>
                <td style={{ padding: "5px 8px" }}>
                  <span style={{
                    display: "inline-block", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 600,
                    background: cp.lcl !== "—" ? "#FFFBEB" : T.bg,
                    border: cp.lcl !== "—" ? `1px solid #FCD34D` : `1px solid ${T.border}`,
                    color: cp.lcl !== "—" ? "#92400E" : T.textMuted,
                    fontFamily: T.body,
                  }}>{cp.lcl}</span>
                </td>
                <td style={{ padding: "7px 10px", fontSize: "11px", color: T.textSub, fontFamily: T.body }}>{cp.freq}</td>
                <td style={{ padding: "7px 10px", fontSize: "11px", color: T.textSub, fontFamily: T.body }}>{cp.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button style={{
        marginTop: "6px", fontSize: "11px", fontWeight: 600, color,
        background: "none", border: "none", cursor: "pointer", fontFamily: T.body, padding: "4px 0",
      }}>+ Add control point</button>
    </div>
  );
}

function AnnualTargets() {
  const [status] = useState("Active");
  const [sectionOpen, setSectionOpen] = useState({ A: true, B: true, C: true });
  const [expandedA, setExpandedA] = useState<Record<string, boolean>>({ shc: true });
  const [expandedB, setExpandedB] = useState<Record<string, boolean>>({});
  const [expandedC, setExpandedC] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(true);
  const [aTargets, setATargets] = useState<Record<string, string>>({ shc: "720", tsr: "18" });
  const [aPeriodic, setAPeriodic] = useState<Record<string, { period: string; target: string }[]>>({
    shc: AT_DATA.sectionA[0].periodicTargets.map(p => ({ ...p })),
    tsr: AT_DATA.sectionA[1].periodicTargets.map(p => ({ ...p })),
  });

  const toggleA = (id: string) => setExpandedA(p => ({ ...p, [id]: !p[id] }));
  const toggleB = (id: string) => setExpandedB(p => ({ ...p, [id]: !p[id] }));
  const toggleC = (id: string) => setExpandedC(p => ({ ...p, [id]: !p[id] }));

  const statusSC = STATUS_COLORS[status] ?? STATUS_COLORS["Draft"];

  return (
    <div style={{ fontFamily: T.body, paddingBottom: "80px" }}>

      {/* Toast */}
      {showToast && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between",
          background: SA.bg, border: `1.5px solid ${SA.color}60`, borderRadius: "8px",
          padding: "10px 16px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: SA.color }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: SA.color }}>
              Loaded 2 managing points from Role Sheet · 1 CE goal · 1 PD goal
            </span>
          </div>
          <button onClick={() => setShowToast(false)} style={{
            background: "none", border: "none", cursor: "pointer", color: SA.color, fontSize: "16px", lineHeight: 1,
          }}>×</button>
        </div>
      )}

      {/* Form header card */}
      <div style={{
        background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px",
        padding: "18px 20px", marginBottom: "14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr 1fr", gap: "16px", marginBottom: "14px" }}>
          {/* Position */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Position</div>
            <ReadOnly value={AT_DATA.position} />
          </div>
          {/* Period */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Period</div>
            <EditableInput value={AT_DATA.period} onChange={() => {}} />
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "9px", color: T.textMuted, marginBottom: "3px" }}>Start</div>
                <input type="date" defaultValue="2025-04-01" style={{ width: "100%", boxSizing: "border-box", fontSize: "11px", fontFamily: T.body, border: `1px solid ${T.border}`, borderRadius: "5px", padding: "4px 7px", outline: "none", color: T.text }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "9px", color: T.textMuted, marginBottom: "3px" }}>End</div>
                <input type="date" defaultValue="2026-03-31" style={{ width: "100%", boxSizing: "border-box", fontSize: "11px", fontFamily: T.body, border: `1px solid ${T.border}`, borderRadius: "5px", padding: "4px 7px", outline: "none", color: T.text }} />
              </div>
            </div>
          </div>
          {/* Supervisor */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Supervisor</div>
            <select style={{ width: "100%", fontFamily: T.body, fontSize: "12px", color: T.text, background: T.card, border: `1px solid ${T.border}`, borderRadius: "5px", padding: "5px 8px", outline: "none" }}>
              <option>Dr. Arun Sharma</option>
            </select>
            <div style={{ fontSize: "9.5px", color: T.textMuted, marginTop: "3px" }}>Plant Energy &amp; Environment Manager</div>
          </div>
          {/* Status */}
          <div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>Status</div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              fontWeight: 700, fontSize: "12px", padding: "5px 12px", borderRadius: "99px",
              background: statusSC.bg, color: statusSC.color, fontFamily: T.body,
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusSC.color, display: "inline-block" }} />
              {status}
            </span>
          </div>
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "12px", borderTop: `1px solid ${T.border}` }}>
          <button style={{ padding: "7px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${T.border}`, background: "white", color: T.textSub, cursor: "pointer", fontFamily: T.body }}>
            Save draft
          </button>
          <button style={{ padding: "7px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none", background: SA.color, color: "white", cursor: "pointer", fontFamily: T.body }}>
            Submit for review
          </button>
          <button style={{ padding: "7px 12px", fontSize: "12px", fontWeight: 500, background: "none", border: "none", cursor: "pointer", color: T.textSub, fontFamily: T.body, textDecoration: "underline", marginLeft: "4px" }}>
            Export PDF
          </button>
        </div>
      </div>

      {/* Status lifecycle stepper */}
      <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", padding: "12px 20px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "0" }}>
        {STATUS_STEPS.map((step, i) => {
          const isActive = step === status;
          const isPast = STATUS_STEPS.indexOf(status) > i;
          const sc = STATUS_COLORS[step];
          return (
            <Fragment key={step}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: "none" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: isActive ? sc.color : isPast ? T.accent : T.bg,
                  border: `2px solid ${isActive ? sc.color : isPast ? T.accent : T.border}`,
                  fontSize: "11px", fontWeight: 700,
                  color: (isActive || isPast) ? "white" : T.textMuted,
                }}>
                  {isPast ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "9.5px", fontWeight: isActive ? 700 : 500, color: isActive ? sc.color : T.textSub, whiteSpace: "nowrap", fontFamily: T.body }}>
                  {step}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: isPast ? T.accent : T.border, margin: "0 4px", marginBottom: "16px" }} />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* ── SECTION A ── */}
      <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", marginBottom: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <SectionHeader
          label="Section A — DWM · Routine work managing points"
          sub="Auto-populated from Role Sheet · Standard is the operating norm, not a target"
          color={SA.color} bg={SA.bg} border={SA.color}
          collapsed={!sectionOpen.A} onToggle={() => setSectionOpen(p => ({ ...p, A: !p.A }))}
        />
        {sectionOpen.A && (
          <div style={{ padding: "12px 16px" }}>
            {/* Column headers */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 80px 100px 110px 110px 130px 120px 36px",
              gap: "8px", padding: "6px 14px 8px",
              borderBottom: `1.5px solid ${T.border}`, marginBottom: "8px",
            }}>
              {["Managing Point", "UOM", "Standard", "Prior Target", "Prior Actual", "This Year Target", "Improvement %", ""].map((h, i) => (
                <div key={i} style={{
                  fontSize: "9px", fontWeight: 700, color: T.textSub,
                  textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: T.body,
                  whiteSpace: "nowrap",
                }}>{h}</div>
              ))}
            </div>
            {AT_DATA.sectionA.map(mp => {
              const expanded = !!expandedA[mp.id];
              const thisYearVal = parseFloat(aTargets[mp.id] ?? String(mp.thisYear));
              return (
                <div key={mp.id} style={{ border: `1.5px solid ${T.border}`, borderRadius: "8px", marginBottom: "10px", overflow: "hidden" }}>
                  {/* Collapsed row header */}
                  <div
                    onClick={() => toggleA(mp.id)}
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 80px 100px 110px 110px 130px 120px 36px",
                      alignItems: "center", gap: "8px",
                      padding: "11px 14px", cursor: "pointer",
                      background: expanded ? SA.light : "white",
                      borderBottom: expanded ? `1.5px solid ${T.border}` : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px", color: T.text, fontFamily: T.heading }}>{mp.mp}</div>
                      <div style={{ fontSize: "10px", color: T.textSub, marginTop: "1px" }}>{mp.polarity} · {mp.source}</div>
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: SA.bg, color: SA.color, textAlign: "center", whiteSpace: "nowrap" }}>{mp.uom}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: SA.bg, color: SA.color, whiteSpace: "nowrap" }}>{mp.standard}</span>
                    <ReadOnly value={mp.priorTarget} />
                    <ReadOnly value={mp.priorActual} />
                    <EditableInput value={aTargets[mp.id] ?? String(mp.thisYear)} onChange={v => setATargets(p => ({ ...p, [mp.id]: v }))} isNumeric />
                    <ImprovementPill priorActual={mp.priorActual} thisYear={thisYearVal} />
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                      <path d="M3 5l4 4 4-4" stroke={SA.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  {expanded && (
                    <div style={{ padding: "16px 18px", background: "white" }}>
                      <PeriodicTargetsTable
                        rows={aPeriodic[mp.id] ?? mp.periodicTargets}
                        onChange={(i, field, v) => setAPeriodic(p => ({
                          ...p, [mp.id]: (p[mp.id] ?? mp.periodicTargets).map((r, idx) => idx === i ? { ...r, [field]: v } : r)
                        }))}
                        onRowsChange={newRows => setAPeriodic(p => ({ ...p, [mp.id]: newRows }))}
                        color={SA.color}
                      />
                      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "14px" }}>
                        <ControlPointsTable cps={mp.controlPoints} color={SA.color} />
                      </div>
                      <div style={{ marginTop: "10px", fontSize: "10.5px", color: T.textMuted, fontStyle: "italic" }}>
                        Polarity: {mp.polarity} · Data source: {mp.source}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button style={{
              width: "100%", padding: "9px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
              border: `1.5px dashed ${SA.color}`, background: "transparent", color: SA.color,
              cursor: "pointer", fontFamily: T.body, marginTop: "4px",
            }}>+ Add Managing Point</button>
          </div>
        )}
      </div>

      {/* ── SECTION B ── */}
      <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", marginBottom: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <SectionHeader
          label="Section B — CE · Continuous improvement goals"
          sub="Auto-populated from Goals Register · Targets cascaded from department-level goals"
          color={SB.color} bg={SB.bg} border={SB.color}
          collapsed={!sectionOpen.B} onToggle={() => setSectionOpen(p => ({ ...p, B: !p.B }))}
        />
        {sectionOpen.B && (
          <div style={{ padding: "12px 16px" }}>
            {/* Column headers — same grid as collapsed rows */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 110px 110px 130px 120px 36px",
              gap: "8px", padding: "6px 14px 8px",
              borderBottom: `1.5px solid ${T.border}`, marginBottom: "8px",
            }}>
              {["Goal Statement", "Prior Target", "Prior Actual", "This Year Target", "Improvement %", ""].map((h, i) => (
                <div key={i} style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: T.body, whiteSpace: "nowrap" }}>{h}</div>
              ))}
            </div>
            {AT_DATA.sectionB.map(goal => {
              const expanded = !!expandedB[goal.id];
              return (
                <div key={goal.id} style={{ border: `1.5px solid ${T.border}`, borderRadius: "8px", marginBottom: "10px", overflow: "hidden" }}>
                  {/* Collapsed row — matches header grid */}
                  <div
                    onClick={() => toggleB(goal.id)}
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 110px 110px 130px 120px 36px",
                      alignItems: "center", gap: "8px",
                      padding: "11px 14px", cursor: "pointer",
                      background: expanded ? SB.light : "white",
                      borderBottom: expanded ? `1.5px solid ${T.border}` : "none",
                    }}
                  >
                    {/* Goal statement + meta */}
                    <div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "7px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "8.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "3px", background: SB.bg, color: SB.color, flexShrink: 0, marginTop: "2px", border: `1px solid ${SB.color}40` }}>CE</span>
                        <span style={{ fontSize: "12px", color: T.text, fontStyle: "italic", lineHeight: 1.45, fontFamily: T.body }}>{goal.statement}</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "9.5px", color: T.textSub, fontFamily: T.body }}>Source: <strong>{goal.source}</strong></span>
                        <span style={{ fontSize: "9.5px", color: SB.color, background: SB.bg, padding: "1px 6px", borderRadius: "3px", fontWeight: 600, fontFamily: T.body }}>↗ {goal.parentGoal}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "9px", color: T.textMuted, fontFamily: T.body }}>Alloc: {goal.allocation}%</span>
                          <div style={{ width: "50px", height: "4px", background: T.border, borderRadius: "99px", overflow: "hidden" }}>
                            <div style={{ width: `${goal.allocation}%`, height: "100%", background: SB.color, borderRadius: "99px" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <ReadOnly value={goal.priorTarget} />
                    <ReadOnly value={goal.priorActual} />
                    <EditableInput value={String(goal.thisYear)} onChange={() => {}} isNumeric />
                    <ImprovementPill priorActual={goal.priorActual} thisYear={goal.thisYear} />
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                      <path d="M3 5l4 4 4-4" stroke={SB.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {expanded && (
                    <div style={{ padding: "16px 18px", background: "white" }}>
                      <div style={{ fontSize: "10.5px", color: SB.color, background: SB.bg, padding: "7px 12px", borderRadius: "6px", marginBottom: "12px" }}>
                        Contributing to: <strong>{goal.parentGoal}</strong>
                      </div>
                      <PeriodicTargetsTable rows={goal.periodicTargets} onChange={() => {}} onRowsChange={() => {}} color={SB.color} />
                    </div>
                  )}
                </div>
              );
            })}
            <button style={{
              width: "100%", padding: "9px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
              border: `1.5px dashed ${SB.color}`, background: "transparent", color: SB.color,
              cursor: "pointer", fontFamily: T.body,
            }}>+ Add CE goal</button>
          </div>
        )}
      </div>

      {/* ── SECTION C ── */}
      <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", marginBottom: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <SectionHeader
          label="Section C — PD · Breakthrough improvement goals"
          sub="Derived from 3-year strategic plan and vision · Milestone-based targets"
          color={SC.color} bg={SC.bg} border={SC.color}
          collapsed={!sectionOpen.C} onToggle={() => setSectionOpen(p => ({ ...p, C: !p.C }))}
        />
        {sectionOpen.C && (
          <div style={{ padding: "12px 16px" }}>
            {/* Column headers — same grid as collapsed rows */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 180px 36px",
              gap: "8px", padding: "6px 14px 8px",
              borderBottom: `1.5px solid ${T.border}`, marginBottom: "8px",
            }}>
              {["Goal Statement", "Source / Plan", ""].map((h, i) => (
                <div key={i} style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.7px", fontFamily: T.body, whiteSpace: "nowrap" }}>{h}</div>
              ))}
            </div>
            {AT_DATA.sectionC.map(goal => {
              const expanded = !!expandedC[goal.id];
              return (
                <div key={goal.id} style={{ border: `1.5px solid ${T.border}`, borderRadius: "8px", marginBottom: "10px", overflow: "hidden" }}>
                  {/* Collapsed row — matches header grid */}
                  <div
                    onClick={() => toggleC(goal.id)}
                    style={{
                      display: "grid", gridTemplateColumns: "2fr 180px 36px",
                      alignItems: "center", gap: "8px",
                      padding: "11px 14px", cursor: "pointer",
                      background: expanded ? SC.light : "white",
                      borderBottom: expanded ? `1.5px solid ${T.border}` : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                      <span style={{ fontSize: "8.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "3px", background: SC.bg, color: SC.color, flexShrink: 0, marginTop: "2px", border: `1px solid ${SC.color}40` }}>PD</span>
                      <span style={{ fontSize: "12px", color: T.text, fontStyle: "italic", lineHeight: 1.45, fontFamily: T.body }}>{goal.statement}</span>
                    </div>
                    <ReadOnly value={goal.source} />
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                      <path d="M3 5l4 4 4-4" stroke={SC.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {expanded && (
                    <div style={{ padding: "16px 18px", background: "white" }}>
                      <PeriodicTargetsTable rows={goal.periodicTargets} onChange={() => {}} onRowsChange={() => {}} color={SC.color} textOnly />
                    </div>
                  )}
                </div>
              );
            })}
            <button style={{
              width: "100%", padding: "9px", borderRadius: "7px", fontSize: "12px", fontWeight: 600,
              border: `1.5px dashed ${SC.color}`, background: "transparent", color: SC.color,
              cursor: "pointer", fontFamily: T.body,
            }}>+ Add PD goal</button>
          </div>
        )}
      </div>

      {/* Floating bottom bar */}
      <div style={{
        position: "fixed", bottom: 0, left: "220px", right: 0,
        background: T.card, borderTop: `1.5px solid ${T.border}`,
        padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 100, boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
      }}>
        <select style={{ fontFamily: T.body, fontSize: "12px", color: T.text, background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "7px", padding: "7px 12px", cursor: "pointer", outline: "none" }}>
          <option value="">+ Add row to section…</option>
          <option value="A">Section A — Managing Point</option>
          <option value="B">Section B — CE Goal</option>
          <option value="C">Section C — PD Goal</option>
        </select>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ padding: "8px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${T.border}`, background: "white", color: T.textSub, cursor: "pointer", fontFamily: T.body }}>
            Save draft
          </button>
          <button style={{ padding: "8px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none", background: SA.color, color: "white", cursor: "pointer", fontFamily: T.body }}>
            Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: MONITORING ─────────────────────────────────────────────────────────

const MPs = [
  { id: "shc",  label: "Specific Heat Consumption", uom: "kcal/kg clinker", data: shcMonitoring,       ucl: 775, lcl: 690, annualTarget: 720, domain: [660, 800] as [number, number] },
  { id: "elec", label: "Electrical Intensity",       uom: "kWh/t cement",   data: electricalMonitoring, ucl: 105, lcl: 78,  annualTarget: 90,  domain: [70, 115]  as [number, number] },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: T.card, border: `1.5px solid ${T.border}`,
      borderRadius: "8px", padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.10)", fontSize: "11px", fontFamily: T.body,
    }}>
      <div style={{ fontWeight: 700, color: T.text, marginBottom: "5px" }}>{label}</div>
      <div style={{ color: d?.exc ? T.amber : T.success, fontWeight: 600 }}>
        Actual: {d?.actual}{d?.exc ? " ⚠ Exception" : ""}
      </div>
      <div style={{ color: T.textSub, marginTop: "3px" }}>Target: {d?.target}</div>
    </div>
  );
}

const cpViewData = [
  {
    mpLabel: "Specific Heat Consumption (SHC)",
    entries: [
      { date: "25 Jun", cp: "Preheater exit temperature", actual: "372°C", target: "310–360°C", status: "exc",  responsible: "Kiln Operator" },
      { date: "25 Jun", cp: "False air % at preheater",   actual: "6.8%",  target: "≤ 6%",      status: "exc",  responsible: "Maintenance Technician" },
      { date: "25 Jun", cp: "Coal particle fineness",      actual: "11.2%", target: "≤ 12%",     status: "ok",   responsible: "Coal Mill Operator" },
      { date: "25 Jun", cp: "Kiln inlet temperature",      actual: "962°C", target: "900–1000°C", status: "ok",  responsible: "Kiln Operator" },
      { date: "24 Jun", cp: "Preheater exit temperature", actual: "342°C", target: "310–360°C", status: "ok",   responsible: "Kiln Operator" },
      { date: "24 Jun", cp: "False air % at preheater",   actual: "5.9%",  target: "≤ 6%",      status: "ok",   responsible: "Maintenance Technician" },
      { date: "24 Jun", cp: "Coal particle fineness",      actual: "12.8%", target: "≤ 12%",     status: "exc",  responsible: "Coal Mill Operator" },
      { date: "24 Jun", cp: "Kiln inlet temperature",      actual: "941°C", target: "900–1000°C", status: "ok",  responsible: "Kiln Operator" },
    ],
  },
];

function Monitoring() {
  const [view, setView] = useState<"mp" | "cp">("mp");
  const [mpId, setMpId] = useState("shc");
  const navigate = useNavigate();
  const mp = MPs.find(m => m.id === mpId)!;
  const data = mp.data;
  const exceptions = data.filter((d: any) => d.exc);
  const avg = (data.reduce((a: number, b: any) => a + b.actual, 0) / data.length).toFixed(1);
  const minV = Math.min(...data.map((d: any) => d.actual));
  const maxV = Math.max(...data.map((d: any) => d.actual));

  return (
    <div>
      <PageHeader title="Monitoring & graphs" sub={`Thermal Process Engineer · ${site.company} · ${site.plant}`} />

      {/* View switcher: MP vs CP */}
      <div style={{
        display: "inline-flex", background: T.bg, border: `1.5px solid ${T.border}`,
        borderRadius: "8px", padding: "3px", marginBottom: "16px",
      }}>
        {([["mp", "MP View — Monthly"], ["cp", "CP View — Control Points"]] as const).map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
            background: view === v ? T.accent : "transparent",
            color: view === v ? "white" : T.textSub,
            borderTop: "none", borderRight: "none", borderBottom: "none", borderLeft: "none",
            cursor: "pointer", fontFamily: T.body, transition: "all 0.15s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── CP VIEW ── */}
      {view === "cp" && (
        <div>
          <div style={{ marginBottom: "14px", padding: "12px 16px", background: T.accentLight, border: `1.5px solid ${T.accent}30`, borderRadius: "8px", fontSize: "12px", color: T.accentText }}>
            <strong>Control Point log</strong> — Daily / shift entries by operators. Each CP drives the Managing Point above it. Flag exceptions here before they breach the MP UCL.
          </div>
          {cpViewData.map((group, gi) => (
            <Card key={gi} style={{ marginBottom: "14px" }}>
              <CardHeader>
                <span style={{ color: T.accent }}>{group.mpLabel}</span>
                <span style={{ color: T.textMuted, fontWeight: 400, fontSize: "11px", marginLeft: "8px" }}>— Control Point entries</span>
              </CardHeader>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Control Point</Th>
                    <Th>Actual</Th>
                    <Th>Target / Band</Th>
                    <Th>Responsible</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {group.entries.map((row, ri) => (
                    <tr key={ri}
                      style={{ background: row.status === "exc" ? T.amberBg : "transparent", transition: "background 0.1s" }}
                      onMouseEnter={e => row.status !== "exc" && (e.currentTarget.style.background = T.bg)}
                      onMouseLeave={e => (e.currentTarget.style.background = row.status === "exc" ? T.amberBg : "transparent")}
                    >
                      <Td style={{ color: T.textSub, whiteSpace: "nowrap" }}>{row.date}</Td>
                      <Td><span style={{ fontWeight: 500 }}>{row.cp}</span></Td>
                      <Td><span style={{ fontWeight: 700, color: row.status === "exc" ? T.amber : T.text }}>{row.actual}</span></Td>
                      <Td style={{ color: T.textSub }}>{row.target}</Td>
                      <Td style={{ color: T.textSub }}>{row.responsible}</Td>
                      <Td>
                        {row.status === "exc"
                          ? <Badge label="⚠ Out of range" color="white" bg={T.amber} />
                          : <Badge label="Within range ✓" color={T.successText} bg={T.successBg} />}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}
        </div>
      )}

      {/* ── MP VIEW ── */}
      {view === "mp" && <>

      {/* MP tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
        {MPs.map(m => (
          <button key={m.id} onClick={() => setMpId(m.id)} style={{
            padding: "7px 14px", borderRadius: "7px", fontFamily: T.body,
            border: `1.5px solid ${mpId === m.id ? T.accent : T.border}`,
            background: mpId === m.id ? T.accent : T.card,
            color: mpId === m.id ? "white" : T.textSub,
            fontSize: "11.5px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
          }}>
            {m.label} <span style={{ opacity: 0.65, fontSize: "10.5px" }}>· {m.uom}</span>
          </button>
        ))}
      </div>

      {/* Exception banner */}
      {exceptions.length > 0 && (
        <div style={{
          background: T.amberBg, border: `1.5px solid ${T.amberBorder}`,
          borderRadius: "8px", padding: "10px 16px", marginBottom: "14px",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <AlertTriangle size={16} color={T.amber} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: "11.5px" }}>
            <span style={{ fontWeight: 700, color: T.amberText }}>{exceptions.length} exception detected · </span>
            <span style={{ color: T.amberText }}>
              {(exceptions[0] as any).m} — {mp.label} reached {(exceptions[0] as any).actual} {mp.uom}, crossing UCL of {mp.ucl}
            </span>
          </div>
          <button onClick={() => navigate("/gaps")} style={{
            background: T.amber, color: "white", fontSize: "11px", fontWeight: 700,
            padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", flexShrink: 0,
          }}>
            View gap analysis →
          </button>
        </div>
      )}

      {/* Chart */}
      <Card style={{ marginBottom: "14px" }}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "14px", color: T.text }}>{mp.label} · {mp.uom}</div>
              <div style={{ fontSize: "11px", color: T.textSub, marginTop: "3px" }}>Monthly actuals vs target · UCL: {mp.ucl} · LCL: {mp.lcl}</div>
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              {[
                { label: "Target",    style: { borderTop: `2px dashed ${T.accent}`, width: "20px" } },
                { label: "UCL/LCL",  style: { borderTop: `2px dashed ${T.amber}`,  width: "20px" } },
                { label: "Exception", dot: T.amber },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10.5px", color: T.textSub }}>
                  {l.dot
                    ? <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: l.dot }} />
                    : <div style={{ ...(l.style || {}) }} />}
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 8, right: 80, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 6" stroke={T.border} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: T.textSub, fontFamily: T.body }} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis domain={mp.domain} tick={{ fontSize: 11, fill: T.textSub, fontFamily: T.body }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={mp.ucl} stroke={T.amber} strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: `UCL ${mp.ucl}`, position: "insideTopRight", fill: T.amber, fontSize: 10, fontWeight: 700 }} />
              <ReferenceLine y={mp.annualTarget} stroke={T.accent} strokeDasharray="8 4" strokeWidth={1.5}
                label={{ value: `Target ${mp.annualTarget}`, position: "insideBottomRight", fill: T.accent, fontSize: 10, fontWeight: 700 }} />
              <ReferenceLine y={mp.lcl} stroke={T.amber} strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: `LCL ${mp.lcl}`, position: "insideBottomRight", fill: T.amber, fontSize: 10, fontWeight: 700 }} />
              <Line
                type="monotone" dataKey="actual"
                stroke={T.accent} strokeWidth={2.5}
                dot={(props: any) => {
                  const { cx, cy, payload, index } = props;
                  if (!cx || !cy) return <g key={`empty-${index}`} />;
                  if (payload.exc) return (
                    <g key={`exc-${index}`}>
                      <circle cx={cx} cy={cy} r={10} fill={T.amber} opacity={0.18} />
                      <circle cx={cx} cy={cy} r={6} fill={T.amber} />
                      <circle cx={cx} cy={cy} r={2.5} fill="white" />
                    </g>
                  );
                  return <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill={T.accent} stroke="white" strokeWidth={1.5} />;
                }}
                activeDot={{ r: 6, fill: T.accent, stroke: "white", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "14px" }}>
        {[
          { l: "YTD average",   v: avg,  u: mp.uom, s: `Annual target: ${mp.annualTarget}`, ok: true },
          { l: "Best month",    v: minV, u: mp.uom, s: (data.find((d: any) => d.actual === minV) as any)?.m + " 2026", ok: true },
          { l: "Worst month",   v: maxV, u: mp.uom, s: (data.find((d: any) => d.actual === maxV) as any)?.m + (exceptions.length ? " ⚠ UCL breach" : ""), ok: exceptions.length === 0 },
          { l: "Within limits", v: `${data.filter((d: any) => !d.exc).length} / ${data.length}`, u: "months", s: `${exceptions.length} exception${exceptions.length !== 1 ? "s" : ""} this year`, ok: exceptions.length === 0 },
        ].map((s, i) => (
          <Card key={i} style={{ borderTop: `3.5px solid ${s.ok ? T.accent : T.amber}` }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: "9.5px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{s.l}</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: s.ok ? T.text : T.amber, fontFamily: T.heading, letterSpacing: "-0.5px" }}>{s.v}</div>
              <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "2px" }}>{s.u}</div>
              <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "2px" }}>{s.s}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Data table */}
      <Card>
        <div style={{ padding: "12px 18px", borderBottom: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: T.heading, fontWeight: 600, fontSize: "13px", color: T.text }}>Monthly data capture</span>
          <button style={{
            display: "flex", alignItems: "center", gap: "5px",
            background: T.accent, color: "white", fontSize: "11px", fontWeight: 600,
            padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: T.body,
          }}>
            <Upload size={12} /> Import CSV
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Month", "Target", "Actual", "vs Target", "Status"].map(h => <Th key={h}>{h}</Th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => {
              const diff = row.actual - row.target;
              return (
                <tr key={i} style={{ background: row.exc ? T.amberBg : "transparent", transition: "background 0.1s" }}
                  onMouseEnter={e => !row.exc && (e.currentTarget.style.background = T.bg)}
                  onMouseLeave={e => (e.currentTarget.style.background = row.exc ? T.amberBg : "transparent")}
                >
                  <Td><span style={{ fontWeight: 600 }}>{row.m} {i < 6 ? "2025" : "2026"}</span></Td>
                  <Td style={{ color: T.textSub }}>{row.target}</Td>
                  <Td style={{ fontWeight: 700, color: row.exc ? T.amber : T.text }}>{row.actual}</Td>
                  <Td style={{ fontWeight: 600, color: diff > 0 ? T.amber : T.success }}>
                    {diff > 0 ? "+" : ""}{diff}
                  </Td>
                  <Td>
                    {row.exc
                      ? <Badge label="⚠ UCL breach" color="white" bg={T.amber} />
                      : diff <= 0
                        ? <Badge label="On target ✓" color={T.successText} bg={T.successBg} />
                        : <Badge label="Above target" color={T.textSub} bg={T.bg} />}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      </>}
    </div>
  );
}

// ─── PAGE: GAP ANALYSIS ───────────────────────────────────────────────────────

const actionStatusStyle: Record<string, { color: string; bg: string }> = {
  "In progress": { color: T.accentText,  bg: T.accentLight },
  "Open":        { color: T.amberText,   bg: T.amberBg },
  "Planned":     { color: T.textSub,     bg: T.bg },
  "Closed":      { color: T.successText, bg: T.successBg },
};

function GapAnalysis() {
  const gap = gaps[0];
  return (
    <div>
      <PageHeader title="Gap analysis" sub={`Exception · ${gap.mp} · ${gap.period} · ${site.plant}`} />

      {/* Meta cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
        {[
          { l: "Exception type", v: gap.type,     c: T.amber },
          { l: "Actual value",   v: `${gap.actual} kcal/kg`, c: T.amber },
          { l: "Deviation",      v: gap.deviation, c: T.amber },
          { l: "Managing point", v: gap.mp,         c: T.text },
          { l: "Period",         v: gap.period,     c: T.text },
          { l: "Status",         v: gap.status,     c: T.accent },
        ].map((f, i) => (
          <Card key={i}>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px" }}>{f.l}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: f.c, fontFamily: T.heading }}>{f.v}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* 5-Why */}
      <Card style={{ marginBottom: "16px", padding: "20px 24px" }}>
        <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "14px", color: T.text, marginBottom: "18px" }}>
          5-Why root cause analysis
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {gap.whys.map((w, i) => {
            const isRoot = i === gap.whys.length - 1;
            return (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", position: "relative" }}>
                {/* Connector line */}
                {i < gap.whys.length - 1 && (
                  <div style={{
                    position: "absolute",
                    left: "15px",
                    top: "30px",
                    bottom: "-8px",
                    width: "2px",
                    background: T.border,
                    zIndex: 0,
                  }} />
                )}
                {/* Step number */}
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: isRoot ? T.amber : T.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                  zIndex: 1,
                  marginBottom: "16px",
                }}>
                  {isRoot ? "✓" : `W${i + 1}`}
                </div>
                <div style={{
                  flex: 1,
                  fontSize: "12.5px",
                  lineHeight: 1.65,
                  marginBottom: "16px",
                  padding: isRoot ? "12px 16px" : "5px 0 0",
                  background: isRoot ? T.amberBg : "transparent",
                  border: isRoot ? `1.5px solid ${T.amberBorder}` : "none",
                  borderRadius: isRoot ? "8px" : 0,
                  color: isRoot ? T.amberText : T.textSub,
                  fontWeight: isRoot ? 600 : 400,
                }}>
                  {w}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Action plan */}
      <Card style={{ padding: "20px 24px" }}>
        <div style={{ fontFamily: T.heading, fontWeight: 700, fontSize: "14px", color: T.text, marginBottom: "18px" }}>
          Corrective &amp; preventive action plan
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {gap.actions.map((a, i) => {
            const s = actionStatusStyle[a.status] || { color: T.textSub, bg: T.bg };
            return (
              <div key={i} style={{
                paddingTop: i > 0 ? "20px" : 0,
                paddingBottom: "20px",
                borderBottom: i < gap.actions.length - 1 ? `1.5px solid ${T.border}` : "none",
              }}>
                <p style={{ fontSize: "12.5px", color: T.text, margin: "0 0 10px", lineHeight: 1.65 }}>{a.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11.5px", color: T.textSub }}>
                    Owner: <strong style={{ color: T.text }}>{a.owner}</strong>
                  </span>
                  <span style={{ fontSize: "11.5px", color: T.textSub }}>
                    Due: <strong style={{ color: T.text }}>{a.due}</strong>
                  </span>
                  <Badge label={a.status} color={s.color} bg={s.bg} />
                </div>
                {a.pct > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: T.textSub, marginBottom: "4px" }}>
                      <span>Progress</span><span style={{ fontWeight: 700, color: T.accent }}>{a.pct}%</span>
                    </div>
                    <div style={{ height: "6px", background: T.border, borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${a.pct}%`, background: T.accent, borderRadius: "99px", transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────

function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: T.body, overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar excCount={1} />
        <main style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/org"        element={<OrgChart />} />
          <Route path="/goals"      element={<GoalsRegister />} />
          <Route path="/roles"      element={<RoleSheets />} />
          <Route path="/targets"    element={<AnnualTargets />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/gaps"       element={<GapAnalysis />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
