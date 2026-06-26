import { annualTarget } from '../data/cement';

const sectionConfig = {
  dwm: { label: 'Section A — DWM (Routine work)',     color: 'bg-mist text-leaf border-leaf/30' },
  ce:  { label: 'Section B — CE (Continuous improvement)', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  pd:  { label: 'Section C — PD (Breakthrough)',      color: 'bg-amber-bg text-amber-text border-amber-light' },
};

export default function AnnualTargets() {
  const at = annualTarget;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Annual target sheet</h1>
        <p className="text-stone text-xs mt-1">{at.position} · {at.period} · Approved by {at.approvedBy}</p>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-3 mb-5">
        <span className="bg-mist text-leaf text-xs font-bold px-3 py-1.5 rounded-md">{at.status}</span>
        <span className="text-stone text-xs">Form AT = Form RD + Annual CE/PD goals · FY 2025–26</span>
      </div>

      {Object.entries(at.sections).map(([key, rows]) => {
        const sc = sectionConfig[key];
        return (
          <div key={key} className="bg-white rounded-xl border border-border overflow-hidden mb-4">
            <div className="px-5 py-3 border-b border-border">
              <span className={`text-[11px] font-semibold px-3 py-1 rounded border ${sc.color}`}>{sc.label}</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-faint border-b border-border">
                  {['Managing point', 'UOM', 'Prior target', 'Prior actual', 'This year target', 'Improvement', 'Checkpoints'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-stone uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border hover:bg-chalk/30">
                    <td className="px-4 py-3 font-medium text-ink">{r.mp}</td>
                    <td className="px-4 py-3 text-stone">{r.uom}</td>
                    <td className="px-4 py-3 text-stone">{r.priorTarget}</td>
                    <td className="px-4 py-3 text-stone">{r.priorActual}</td>
                    <td className="px-4 py-3 font-bold text-leaf text-sm">{r.thisYear}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-xs ${r.improvement === 'New' ? 'text-amber' : r.improvement?.startsWith('-') ? 'text-leaf' : 'text-leaf'}`}>
                        {r.improvement}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {r.checkpoints.map((cp, j) => (
                          <div key={j} className="bg-chalk border border-border rounded px-2 py-1 text-[10px]">
                            <span className="font-semibold text-stone">{cp.p}:</span>
                            <span className="text-leaf font-semibold ml-1">{cp.t}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
