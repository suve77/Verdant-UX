import { goals } from '../data/cement';

const typeColors = {
  CE: 'bg-mist text-leaf',
  PD: 'bg-purple-50 text-purple-700',
};
const sourceColors = {
  Internal: 'bg-slate-100 text-slate-600',
  'External / Regulatory': 'bg-amber-bg text-amber-text',
};

export default function GoalsRegister() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Goals register</h1>
        <p className="text-stone text-xs mt-1">ESG Energy goals for FY 2025–26 — CE (Continuous Improvement) + PD (Breakthrough)</p>
      </div>

      <div className="space-y-4">
        {goals.map((g, i) => (
          <div key={g.id} className="bg-white rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-border flex items-start gap-3">
              <div className="flex gap-2 flex-shrink-0 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeColors[g.type]}`}>{g.type}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${sourceColors[g.source]}`}>{g.source}</span>
              </div>
              <p className="text-sm text-ink leading-relaxed flex-1">{g.statement}</p>
            </div>

            {/* Detail grid */}
            <div className="px-5 py-3.5 grid grid-cols-4 gap-4 border-b border-border text-xs">
              <div>
                <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-1">Managing point</div>
                <div className="text-ink font-medium">{g.mp}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-1">UOM</div>
                <div className="text-ink">{g.uom}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-1">Baseline → Target</div>
                <div className="text-ink">
                  <span className="text-stone">{g.baseline}</span>
                  <span className="mx-1.5 text-stone/40">→</span>
                  <span className="font-semibold text-leaf">{g.target}</span>
                  <span className="text-stone ml-1">{g.uom}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-stone uppercase tracking-widest mb-1">Responsible</div>
                <div className="text-ink">{g.responsible}</div>
              </div>
            </div>

            {/* Checkpoints */}
            <div className="px-5 py-3 flex items-center gap-3">
              <span className="text-[10px] font-semibold text-stone uppercase tracking-widest flex-shrink-0">Checkpoints</span>
              <div className="flex gap-2 flex-wrap">
                {g.checkpoints.map((cp, j) => (
                  <div key={j} className="bg-chalk border border-border rounded-md px-3 py-1.5 text-[11px]">
                    <span className="font-semibold text-stone">{cp.period}:</span>
                    <span className="text-leaf font-semibold ml-1.5">{cp.target} {typeof cp.target === 'number' ? g.uom : ''}</span>
                    {cp.note && <span className="text-stone/60 ml-1">· {cp.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
