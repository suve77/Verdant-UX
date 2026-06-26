export const site = {
  company: 'Deccan Cement Ltd',
  plant: 'Nalgonda Plant — Kiln 2',
  period: 'FY 2025–26',
  department: 'Energy & Environment',
  deptHead: 'Dr. Arun Sharma',
  deptObjective:
    'Achieve ISO 50001 certification and reduce specific heat consumption by 3.7% through optimised kiln operations, false air elimination, and alternative fuel co-processing to deliver a sustainable, low-carbon cement operation.',
};

export const orgNodes = [
  { id: 'cso',     title: 'CSO / Head of Sustainability', tier: 1, reportsTo: null,  ghgScope: 'All (1·2·3)', iso: 'Top Management',       authority: 'Strategic',              disclosure: 'All frameworks' },
  { id: 'em',      title: 'Plant Energy & Environment Manager', tier: 2, reportsTo: 'cso',  ghgScope: 'All (1·2·3)', iso: 'Mgmt Representative', authority: 'Strategic · Operational', disclosure: 'CDP · GRI' },
  { id: 'thermal', title: 'Thermal Process Engineer',    tier: 3, reportsTo: 'em',   ghgScope: 'Scope 1, 2',  iso: 'Energy Team',          authority: 'Operational',            disclosure: '—' },
  { id: 'elec',    title: 'Electrical Engineer',         tier: 3, reportsTo: 'em',   ghgScope: 'Scope 2',     iso: 'Energy Team',          authority: 'Operational',            disclosure: '—' },
  { id: 'ghg',     title: 'GHG & Environment Officer',  tier: 3, reportsTo: 'em',   ghgScope: 'All (1·2·3)', iso: 'Energy Team',          authority: 'Operational',            disclosure: 'GHG Protocol · TCFD' },
  { id: 'esg',     title: 'ESG Reporting Officer',      tier: 3, reportsTo: 'em',   ghgScope: 'All (1·2·3)', iso: 'Energy Team',          authority: 'Operational',            disclosure: 'CDP · GRI · CSRD' },
  { id: 'site',    title: 'Plant Energy Coordinator ×N', tier: 4, reportsTo: 'em',   ghgScope: 'Scope 1, 2',  iso: 'Energy Team',          authority: 'Data Contributor',       disclosure: 'Site data' },
];

export const goals = [
  {
    id: 'g1', type: 'CE', source: 'Internal',
    statement: 'Reduce specific heat consumption (SHC) from 748 to 720 kcal/kg clinker through optimised combustion, false air elimination, and raw mix homogenisation.',
    mp: 'Specific Heat Consumption (SHC)', uom: 'kcal/kg clinker',
    baseline: 748, target: 720, ucl: 775, lcl: 690,
    responsible: 'Thermal Process Engineer', reviewFreq: 'Monthly',
    checkpoints: [
      { period: 'Q1', target: 742 }, { period: 'Q2', target: 735 },
      { period: 'Q3', target: 725 }, { period: 'Q4', target: 720 },
    ],
  },
  {
    id: 'g2', type: 'CE', source: 'Internal',
    statement: 'Increase Alternative Fuel Substitution Rate (TSR%) from 12% to 18% through expanded waste fuel co-processing and AF logistics capability.',
    mp: 'Thermal Substitution Rate (TSR%)', uom: '% of total heat from AF',
    baseline: 12, target: 18, ucl: null, lcl: 8,
    responsible: 'Thermal Process Engineer', reviewFreq: 'Monthly',
    checkpoints: [
      { period: 'Q1', target: 14 }, { period: 'Q2', target: 15 },
      { period: 'Q3', target: 17 }, { period: 'Q4', target: 18 },
    ],
  },
  {
    id: 'g3', type: 'CE', source: 'Internal',
    statement: 'Reduce specific electrical energy consumption from 96 to 90 kWh/t cement through VFD installation, lighting upgrades, and compressed air optimisation.',
    mp: 'Specific Electrical Energy Consumption', uom: 'kWh / tonne cement',
    baseline: 96, target: 90, ucl: 105, lcl: 78,
    responsible: 'Electrical Engineer', reviewFreq: 'Monthly',
    checkpoints: [
      { period: 'Q1', target: 95 }, { period: 'Q2', target: 93 },
      { period: 'Q3', target: 91 }, { period: 'Q4', target: 90 },
    ],
  },
  {
    id: 'g4', type: 'PD', source: 'Internal',
    statement: 'Commission Waste Heat Recovery (WHR) system to generate 8 MW power from kiln preheater and cooler exhaust by Q3 FY25-26, reducing grid electricity dependency by 15%.',
    mp: 'WHR Power Generation Capacity', uom: 'MW commissioned',
    baseline: 0, target: 8, ucl: null, lcl: null,
    responsible: 'Plant Energy & Environment Manager', reviewFreq: 'Quarterly',
    checkpoints: [
      { period: 'Q1', target: 0, note: 'Civil works complete' },
      { period: 'Q2', target: 0, note: 'Equipment erection' },
      { period: 'Q3', target: 8, note: 'Commissioned' },
      { period: 'Q4', target: 8, note: 'Stabilised' },
    ],
  },
  {
    id: 'g5', type: 'CE', source: 'External / Regulatory',
    statement: 'Maintain kiln stack PM10 below CPCB norms and report Scope 1 CO₂ intensity below 600 kg CO₂/t cement under GHG Protocol — Cement Sector.',
    mp: 'Net CO₂ Intensity', uom: 'kg CO₂ / tonne cement',
    baseline: 620, target: 600, ucl: 640, lcl: null,
    responsible: 'GHG & Environment Officer', reviewFreq: 'Monthly',
    checkpoints: [
      { period: 'Q1', target: 618 }, { period: 'Q2', target: 610 },
      { period: 'Q3', target: 604 }, { period: 'Q4', target: 600 },
    ],
  },
];

export const roleSheets = [
  {
    position: 'Thermal Process Engineer',
    roles: [
      { role: 'SHC daily monitoring & reporting',    mp: 'Specific Heat Consumption',     uom: 'kcal/kg clinker', standard: '≤ 755',           freq: 'Daily',   polarity: 'Lower is better', source: 'DCS CSV export' },
      { role: 'False air assessment',               mp: 'False air % at preheater exit', uom: '%',              standard: '≤ 6%',            freq: 'Weekly',  polarity: 'Lower is better', source: 'Manual' },
      { role: 'Alternative fuel feed monitoring',   mp: 'AF feed rate',                  uom: 't/day',          standard: 'Per weekly plan', freq: 'Daily',   polarity: 'Higher is better', source: 'Manual' },
      { role: 'Kiln thermal profile management',    mp: 'Preheater exit temperature',    uom: '°C',             standard: '310 – 360°C',    freq: 'Daily',   polarity: 'Within band',     source: 'DCS CSV export' },
    ],
  },
  {
    position: 'Electrical Engineer',
    roles: [
      { role: 'Electrical intensity monitoring',   mp: 'Specific electrical consumption', uom: 'kWh/t cement', standard: '≤ 100',               freq: 'Monthly',   polarity: 'Lower is better', source: 'Meter CSV' },
      { role: 'Power factor management',           mp: 'Power factor (pf)',               uom: '—',            standard: '≥ 0.95',              freq: 'Monthly',   polarity: 'Higher is better', source: 'Manual' },
      { role: 'Peak demand management',            mp: 'Maximum demand',                  uom: 'kVA',          standard: 'Within contract limit', freq: 'Monthly',   polarity: 'Lower is better', source: 'Meter CSV' },
      { role: 'Motor efficiency audit',            mp: 'Planned motor audit completion',  uom: '%',            standard: '100% per schedule',     freq: 'Quarterly', polarity: 'Higher is better', source: 'Manual' },
    ],
  },
  {
    position: 'GHG & Environment Officer',
    roles: [
      { role: 'Stack emissions monitoring',       mp: 'Kiln stack PM10',                     uom: 'mg/Nm³',           standard: '≤ 50 (CPCB)',  freq: 'Weekly',  polarity: 'Lower is better', source: 'Analyser CSV' },
      { role: 'CO₂ intensity tracking',           mp: 'Net CO₂ intensity',                   uom: 'kgCO₂/t cement',   standard: '≤ 620',        freq: 'Monthly', polarity: 'Lower is better', source: 'Manual' },
      { role: 'Clinker factor management',        mp: 'Clinker-to-cement ratio',             uom: '%',                standard: '≤ 78%',        freq: 'Monthly', polarity: 'Lower is better', source: 'Manual' },
      { role: 'GHG inventory compilation',        mp: 'Scope 1 GHG inventory completeness',  uom: '% sources covered', standard: '100%',         freq: 'Monthly', polarity: 'Higher is better', source: 'Manual' },
    ],
  },
  {
    position: 'ESG Reporting Officer',
    roles: [
      { role: 'CDP response management',     mp: 'CDP submission completeness',      uom: '%',                     standard: '100%',            freq: 'Annual',  polarity: 'Higher is better', source: 'Manual' },
      { role: 'GHG Protocol reporting',      mp: 'GHG report delivery timeliness',   uom: 'Days before deadline',   standard: '≥ 5 days early', freq: 'Annual',  polarity: 'Higher is better', source: 'Manual' },
      { role: 'Sustainability report data',  mp: 'SR data completeness',             uom: '%',                     standard: '100%',            freq: 'Annual',  polarity: 'Higher is better', source: 'Manual' },
      { role: 'Compliance calendar mgmt',    mp: 'Environmental compliance incidents', uom: 'Count',               standard: '0',               freq: 'Monthly', polarity: 'Lower is better', source: 'Manual' },
    ],
  },
  {
    position: 'Plant Energy Coordinator ×N',
    roles: [
      { role: 'Meter data collection',   mp: 'Meter reading submission rate',     uom: '% by 08:00 daily',   standard: '100%',    freq: 'Daily',      polarity: 'Higher is better', source: 'Manual' },
      { role: 'Fuel consumption logging', mp: 'Fuel entry accuracy (within ±1%)', uom: '%',                  standard: '≥ 99%',   freq: 'Daily',      polarity: 'Higher is better', source: 'Manual' },
      { role: 'Anomaly reporting',        mp: 'Anomaly reporting timeliness',     uom: 'Hours from detection', standard: '≤ 24 hrs', freq: 'As occurred', polarity: 'Lower is better', source: 'Manual' },
    ],
  },
];

export const annualTarget = {
  position: 'Thermal Process Engineer',
  period: 'FY 2025–26',
  approvedBy: 'Dr. Arun Sharma',
  status: 'Active',
  sections: {
    dwm: [
      { mp: 'Specific Heat Consumption', uom: 'kcal/kg', priorTarget: 748, priorActual: 751, thisYear: 720, improvement: '-4.1%', checkpoints: [{p:'Q1',t:742},{p:'Q2',t:735},{p:'Q3',t:725},{p:'Q4',t:720}] },
      { mp: 'False Air % at Preheater',  uom: '%',        priorTarget: 7,   priorActual: 7.2, thisYear: 5.5, improvement: '-23.6%', checkpoints: [{p:'Q1',t:6.8},{p:'Q2',t:6.2},{p:'Q3',t:5.8},{p:'Q4',t:5.5}] },
      { mp: 'Preheater Exit Temperature', uom: '°C',      priorTarget: 340, priorActual: 348, thisYear: 330, improvement: '-5.2%', checkpoints: [{p:'Q1',t:345},{p:'Q2',t:338},{p:'Q3',t:333},{p:'Q4',t:330}] },
    ],
    ce: [
      { mp: 'AF Feed Rate (TSR%)', uom: '%', priorTarget: 12, priorActual: 11.8, thisYear: 18, improvement: '+52.5%', checkpoints: [{p:'Q1',t:14},{p:'Q2',t:15},{p:'Q3',t:17},{p:'Q4',t:18}] },
    ],
    pd: [
      { mp: 'WHR Commissioning Milestone', uom: 'Stage', priorTarget: '—', priorActual: '—', thisYear: 'Commissioned Q3', improvement: 'New', checkpoints: [{p:'Q1',t:'Civil complete'},{p:'Q2',t:'Equipment erected'},{p:'Q3',t:'Commissioned'},{p:'Q4',t:'Stabilised'}] },
    ],
  },
};

export const shcMonitoring = [
  { m: 'Apr', actual: 748, target: 742 },
  { m: 'May', actual: 752, target: 742 },
  { m: 'Jun', actual: 778, target: 742, exc: true },
  { m: 'Jul', actual: 744, target: 735 },
  { m: 'Aug', actual: 756, target: 735 },
  { m: 'Sep', actual: 738, target: 735 },
  { m: 'Oct', actual: 729, target: 725 },
  { m: 'Nov', actual: 722, target: 725 },
  { m: 'Dec', actual: 716, target: 725 },
  { m: 'Jan', actual: 718, target: 720 },
  { m: 'Feb', actual: 712, target: 720 },
  { m: 'Mar', actual: 719, target: 720 },
];

export const electricalMonitoring = [
  { m: 'Apr', actual: 96, target: 95 },
  { m: 'May', actual: 95, target: 95 },
  { m: 'Jun', actual: 97, target: 95 },
  { m: 'Jul', actual: 94, target: 93 },
  { m: 'Aug', actual: 93, target: 93 },
  { m: 'Sep', actual: 92, target: 93 },
  { m: 'Oct', actual: 91, target: 91 },
  { m: 'Nov', actual: 90, target: 91 },
  { m: 'Dec', actual: 91, target: 91 },
  { m: 'Jan', actual: 90, target: 90 },
  { m: 'Feb', actual: 89, target: 90 },
  { m: 'Mar', actual: 91, target: 90 },
];

export const gaps = [
  {
    id: 'GAP-001',
    type: 'Exception',
    mp: 'Specific Heat Consumption',
    period: 'Jun 2025',
    actual: 778,
    ucl: 775,
    deviation: '+3 kcal/kg above UCL',
    severity: 'Critical',
    status: 'In progress',
    whys: [
      'SHC increased to 778 kcal/kg, crossing UCL of 775 in June 2025.',
      'Preheater exit temperature rose to 378°C (norm 310–360°C), reducing heat recovery efficiency.',
      'Cooler exhaust fan speed was reduced to manage ambient dust levels during peak summer.',
      'No automated compensation protocol existed when cooling fan speed is reduced.',
      'Root cause: Process control gap — no interlock between cooler fan speed and kiln fuel feed rate to maintain thermal balance during high ambient temperature periods.',
    ],
    actions: [
      { desc: 'Implement DCS interlock: cooler fan speed reduction triggers automatic kiln fuel feed adjustment to maintain thermal balance.', owner: 'Thermal Process Engineer', due: '15 Jul 2025', status: 'In progress', pct: 65 },
      { desc: 'Define summer operating procedure for kiln thermal management during ambient temp >40°C.', owner: 'Energy Manager', due: '30 Jul 2025', status: 'Open', pct: 0 },
      { desc: 'Preventive: Schedule quarterly false air measurement to detect thermal efficiency degradation early.', owner: 'Thermal Process Engineer', due: '30 Sep 2025', status: 'Planned', pct: 0 },
    ],
  },
];
