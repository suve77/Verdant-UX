import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle } from 'lucide-react';
import { site } from '../data/cement';

const metrics = [
  { label: 'Specific Heat Consumption', value: '736.1', unit: 'kcal/kg', target: '720', status: 'amber', trend: '-1.6% vs baseline', sub: '1 exception · Jun 2025' },
  { label: 'Electrical Intensity',       value: '93.2',  unit: 'kWh/t',  target: '90',  status: 'amber', trend: '-2.9% vs baseline', sub: 'On track · improving' },
  { label: 'Net CO₂ Intensity',          value: '598',   unit: 'kgCO₂/t', target: '600', status: 'green', trend: 'Target achieved ✓', sub: 'Below target since Oct' },
  { label: 'Alt. Fuel Rate (TSR%)',      value: '16.4',  unit: '%',       target: '18%', status: 'amber', trend: '+4.4 pp vs baseline', sub: 'Q4 target: 18%' },
];

const positions = [
  { name: 'Thermal Process Engineer', mps: 4, onTarget: 3, exceptions: 1 },
  { name: 'Electrical Engineer',      mps: 4, onTarget: 3, exceptions: 0 },
  { name: 'GHG & Environment Officer',mps: 4, onTarget: 4, exceptions: 0 },
  { name: 'ESG Reporting Officer',    mps: 4, onTarget: 4, exceptions: 0 },
  { name: 'Plant Energy Coordinator', mps: 3, onTarget: 3, exceptions: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Department dashboard</h1>
        <p className="text-stone text-xs mt-1">{site.company} · {site.plant} · {site.period}</p>
      </div>

      {/* Dept objective */}
      <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 mb-5">
        <div className="text-[10px] font-semibold text-leaf uppercase tracking-widest mb-1.5">Department objective</div>
        <p className="text-ink text-xs leading-relaxed">{site.deptObjective}</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {metrics.map((m, i) => (
          <div key={i} onClick={() => navigate('/monitoring')}
            className={`bg-white rounded-xl border border-border p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${m.status === 'green' ? 'border-l-leaf' : 'border-l-amber'}`}>
            <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-2.5">{m.label}</div>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-3xl font-bold text-ink tracking-tight">{m.value}</span>
              <span className="text-sm text-stone">{m.unit}</span>
            </div>
            <div className="text-xs text-stone">
              Target: <strong>{m.target}</strong> ·{' '}
              <span className={m.status === 'green' ? 'text-leaf font-medium' : 'text-amber font-medium'}>{m.trend}</span>
            </div>
            <div className="text-[11px] text-stone/70 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Exception alert */}
      <div onClick={() => navigate('/gaps')}
        className="bg-amber-bg border border-amber-light rounded-xl p-4 mb-5 flex items-start gap-3 cursor-pointer hover:bg-amber-light/40 transition-colors">
        <AlertTriangle size={20} className="text-amber mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-semibold text-amber-text text-sm">1 open exception requiring immediate action</div>
          <div className="text-amber-text/80 text-xs mt-1 leading-relaxed">
            Jun 2025 · SHC 778 kcal/kg → UCL breach (775) · Root cause: Summer ambient temperature impact on preheater cooler efficiency. Corrective action 65% complete — DCS interlock implementation in progress.
          </div>
        </div>
        <span className="text-amber font-semibold text-sm flex-shrink-0">View →</span>
      </div>

      {/* Position overview */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-ink text-sm">Position performance overview</h2>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-faint">
              {['Position', 'Managing points', 'On / below target', 'Exceptions', 'Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-stone uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => (
              <tr key={i} className="border-t border-border hover:bg-chalk/50 cursor-pointer" onClick={() => navigate('/monitoring')}>
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-stone">{p.mps}</td>
                <td className="px-4 py-3">
                  <span className="text-leaf font-semibold">{p.onTarget}</span>
                  <span className="text-stone"> / {p.mps}</span>
                </td>
                <td className="px-4 py-3">
                  {p.exceptions > 0
                    ? <span className="bg-amber text-white text-[10px] font-bold rounded px-2 py-0.5">{p.exceptions}</span>
                    : <span className="text-stone">—</span>}
                </td>
                <td className="px-4 py-3">
                  {p.exceptions > 0
                    ? <span className="bg-amber-bg text-amber-text text-[10px] font-semibold rounded px-2 py-0.5">Action required</span>
                    : <span className="bg-mist text-leaf text-[10px] font-semibold rounded px-2 py-0.5">On track ✓</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
