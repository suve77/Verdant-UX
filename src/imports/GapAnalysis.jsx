import { gaps } from '../data/cement';

const statusColors = {
  'In progress': 'bg-mist text-leaf',
  'Open':        'bg-amber-bg text-amber-text',
  'Planned':     'bg-faint text-stone',
  'Closed':      'bg-green-50 text-green-700',
};

export default function GapAnalysis() {
  const gap = gaps[0];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Gap analysis</h1>
        <p className="text-stone text-xs mt-1">Exception · Specific Heat Consumption · {gap.period} · Nalgonda Plant – Kiln 2</p>
      </div>

      {/* Gap details */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { l: 'Exception type', v: gap.type,      c: 'text-amber' },
          { l: 'Actual value',   v: `${gap.actual} kcal/kg`, c: 'text-amber' },
          { l: 'Deviation',      v: gap.deviation,  c: 'text-amber' },
          { l: 'Managing point', v: gap.mp,          c: 'text-ink' },
          { l: 'Period',         v: gap.period,      c: 'text-ink' },
          { l: 'Status',         v: gap.status,      c: 'text-leaf' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-lg border border-border px-4 py-3">
            <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-1.5">{f.l}</div>
            <div className={`text-sm font-semibold ${f.c}`}>{f.v}</div>
          </div>
        ))}
      </div>

      {/* 5-Why */}
      <div className="bg-white rounded-xl border border-border p-5 mb-4">
        <h2 className="font-semibold text-ink text-sm mb-4">5-Why root cause analysis</h2>
        <div className="space-y-3">
          {gap.whys.map((w, i) => {
            const isRoot = i === gap.whys.length - 1;
            return (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5 ${isRoot ? 'bg-amber' : 'bg-leaf'}`}>
                  {isRoot ? '✓' : `W${i + 1}`}
                </div>
                <div className={`text-xs leading-relaxed flex-1 ${isRoot
                  ? 'bg-amber-bg border border-amber-light text-amber-text font-semibold p-3 rounded-lg'
                  : 'text-stone pt-0.5'}`}>
                  {w}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action plan */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold text-ink text-sm mb-4">Corrective &amp; preventive action plan</h2>
        <div className="space-y-5">
          {gap.actions.map((a, i) => (
            <div key={i} className={i > 0 ? 'pt-5 border-t border-border' : ''}>
              <p className="text-xs text-ink leading-relaxed mb-3">{a.desc}</p>
              <div className="flex items-center gap-4 flex-wrap text-xs text-stone">
                <span>Owner: <strong className="text-ink">{a.owner}</strong></span>
                <span>Due: <strong className="text-ink">{a.due}</strong></span>
                <span className={`ml-auto text-[10px] font-semibold px-2.5 py-0.5 rounded ${statusColors[a.status] || 'bg-faint text-stone'}`}>
                  {a.status}
                </span>
              </div>
              {a.pct > 0 && (
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] text-stone mb-1">
                    <span>Progress</span><span>{a.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-leaf rounded-full transition-all" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
