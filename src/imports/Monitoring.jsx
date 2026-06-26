import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Upload } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { shcMonitoring, electricalMonitoring } from '../data/cement';

const MPs = [
  { id: 'shc',  label: 'Specific Heat Consumption', uom: 'kcal/kg clinker', data: shcMonitoring,       ucl: 775, lcl: 690, annualTarget: 720, domain: [660, 800] },
  { id: 'elec', label: 'Electrical Intensity',       uom: 'kWh/t cement',   data: electricalMonitoring, ucl: 105, lcl: 78,  annualTarget: 90,  domain: [70, 115]  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-xs">
      <div className="font-semibold text-ink mb-1.5">{label}</div>
      <div className={`font-semibold ${d?.exc ? 'text-amber' : 'text-leaf'}`}>
        Actual: {d?.actual}{d?.exc ? ' ⚠ Exception' : ''}
      </div>
      <div className="text-stone mt-1">Target: {d?.target}</div>
    </div>
  );
};

export default function Monitoring() {
  const [mpId, setMpId] = useState('shc');
  const navigate = useNavigate();
  const mp = MPs.find(m => m.id === mpId);
  const data = mp.data;
  const exceptions = data.filter(d => d.exc);
  const avg = (data.reduce((a, b) => a + b.actual, 0) / data.length).toFixed(1);
  const minV = Math.min(...data.map(d => d.actual));
  const maxV = Math.max(...data.map(d => d.actual));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Monitoring &amp; graphs</h1>
        <p className="text-stone text-xs mt-1">Thermal Process Engineer · Deccan Cement Ltd · Nalgonda Plant – Kiln 2</p>
      </div>

      {/* MP selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {MPs.map(m => (
          <button key={m.id} onClick={() => setMpId(m.id)}
            className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
              mpId === m.id ? 'bg-leaf border-leaf text-white' : 'bg-white border-border text-stone hover:border-leaf/50'
            }`}>
            {m.label} <span className="opacity-60 ml-1">· {m.uom}</span>
          </button>
        ))}
      </div>

      {/* Exception banner */}
      {exceptions.length > 0 && (
        <div className="bg-amber-bg border border-amber-light rounded-lg px-4 py-3 mb-4 flex items-center gap-3">
          <AlertTriangle size={17} className="text-amber flex-shrink-0" />
          <div className="flex-1 text-xs">
            <span className="font-semibold text-amber-text">{exceptions.length} exception detected · </span>
            <span className="text-amber-text">
              {exceptions[0].m} — {mp.label} reached {exceptions[0].actual} {mp.uom}, crossing UCL of {mp.ucl}
            </span>
          </div>
          <button onClick={() => navigate('/gaps')}
            className="bg-amber text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-amber/90 transition-colors flex-shrink-0">
            View gap analysis →
          </button>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border p-5 mb-4">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="font-semibold text-ink text-sm">{mp.label} · {mp.uom}</div>
            <div className="text-stone text-xs mt-1">Monthly actuals vs target · UCL: {mp.ucl} · LCL: {mp.lcl}</div>
          </div>
          <div className="flex gap-4 text-xs text-stone">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-dashed border-leaf" />Target
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-dashed border-amber" />UCL / LCL
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber" />Exception
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 8, right: 90, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="#E2E8F0" />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
            <YAxis domain={mp.domain} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={mp.ucl} stroke="#D97706" strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: `UCL ${mp.ucl}`, position: 'insideTopRight', fill: '#D97706', fontSize: 10, fontWeight: 600 }} />
            <ReferenceLine y={mp.annualTarget} stroke="#40916C" strokeDasharray="8 4" strokeWidth={1.5}
              label={{ value: `Target ${mp.annualTarget}`, position: 'insideBottomRight', fill: '#40916C', fontSize: 10, fontWeight: 600 }} />
            <ReferenceLine y={mp.lcl} stroke="#D97706" strokeDasharray="5 3" strokeWidth={1.5}
              label={{ value: `LCL ${mp.lcl}`, position: 'insideBottomRight', fill: '#D97706', fontSize: 10, fontWeight: 600 }} />
            <Line
              type="monotone" dataKey="actual"
              stroke="#64748B" strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy) return null;
                if (payload.exc) return (
                  <g key={`exc-${cx}`}>
                    <circle cx={cx} cy={cy} r={11} fill="#D97706" opacity={0.18} className="exception-ping" />
                    <circle cx={cx} cy={cy} r={7} fill="#D97706" />
                    <circle cx={cx} cy={cy} r={3} fill="white" />
                  </g>
                );
                return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={4} fill="#40916C" stroke="white" strokeWidth={1.5} />;
              }}
              activeDot={{ r: 5, fill: '#40916C' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { l: 'YTD average',   v: avg,  u: mp.uom, s: `Annual target: ${mp.annualTarget}`, ok: true },
          { l: 'Best month',    v: minV, u: mp.uom, s: data.find(d => d.actual === minV)?.m + ' 2026', ok: true },
          { l: 'Worst month',   v: maxV, u: mp.uom, s: data.find(d => d.actual === maxV)?.m + (exceptions.length ? ' ⚠ UCL breach' : ''), ok: exceptions.length === 0 },
          { l: 'Within limits', v: `${data.filter(d => !d.exc).length} / ${data.length}`, u: 'months', s: `${exceptions.length} exception${exceptions.length !== 1 ? 's' : ''} this year`, ok: exceptions.length === 0 },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl border border-border p-3.5 border-t-[3px] ${s.ok ? 'border-t-leaf' : 'border-t-amber'}`}>
            <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-1.5">{s.l}</div>
            <div className={`text-2xl font-bold tracking-tight ${s.ok ? 'text-ink' : 'text-amber'}`}>{s.v}</div>
            <div className="text-[10px] text-stone mt-1">{s.u}</div>
            <div className="text-[10px] text-stone/60 mt-0.5">{s.s}</div>
          </div>
        ))}
      </div>

      {/* Data table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="font-semibold text-ink text-sm">Monthly data capture</span>
          <button className="flex items-center gap-1.5 bg-leaf text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-pine transition-colors">
            <Upload size={13} /> Import CSV
          </button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-faint">
              {['Month', 'Target', 'Actual', 'vs Target', 'Status'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold text-stone uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const diff = row.actual - row.target;
              return (
                <tr key={i} className={`border-t border-border ${row.exc ? 'bg-amber-bg' : 'hover:bg-chalk/40'}`}>
                  <td className="px-4 py-2.5 font-medium text-ink">{row.m} {i < 6 ? '2025' : '2026'}</td>
                  <td className="px-4 py-2.5 text-stone">{row.target}</td>
                  <td className={`px-4 py-2.5 font-semibold ${row.exc ? 'text-amber' : 'text-ink'}`}>{row.actual}</td>
                  <td className={`px-4 py-2.5 font-medium ${diff > 0 ? 'text-amber' : 'text-leaf'}`}>{diff > 0 ? '+' : ''}{diff}</td>
                  <td className="px-4 py-2.5">
                    {row.exc
                      ? <span className="bg-amber text-white rounded px-2 py-0.5 text-[10px] font-bold">⚠ UCL breach</span>
                      : diff <= 0
                        ? <span className="bg-mist text-leaf rounded px-2 py-0.5 text-[10px] font-semibold">On target ✓</span>
                        : <span className="bg-faint text-stone rounded px-2 py-0.5 text-[10px]">Above target</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
