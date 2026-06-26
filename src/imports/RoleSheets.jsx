import { useState } from 'react';
import { roleSheets, site } from '../data/cement';

export default function RoleSheets() {
  const [selected, setSelected] = useState(0);
  const rs = roleSheets[selected];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Role sheets</h1>
        <p className="text-stone text-xs mt-1">{site.department} · {site.company} · Routine work definitions per position</p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {roleSheets.map((r, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
              selected === i ? 'bg-forest border-forest text-white' : 'bg-white border-border text-stone hover:border-leaf/60'
            }`}>
            {r.position}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 bg-forest/5 border-b border-border">
          <div className="font-semibold text-ink text-sm">{rs.position}</div>
          <div className="text-stone text-xs mt-0.5">{site.department} · {site.company}</div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-faint border-b border-border">
              {['Role (routine work)', 'Managing point', 'UOM', 'Standard', 'Frequency', 'Polarity', 'Data source'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-stone uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rs.roles.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-chalk/40">
                <td className="px-4 py-3 font-medium text-ink leading-snug">{r.role}</td>
                <td className="px-4 py-3 text-stone">{r.mp}</td>
                <td className="px-4 py-3 text-stone">{r.uom}</td>
                <td className="px-4 py-3 font-semibold text-leaf">{r.standard}</td>
                <td className="px-4 py-3 text-stone">{r.freq}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    r.polarity === 'Lower is better' ? 'bg-blue-50 text-blue-700'
                    : r.polarity === 'Higher is better' ? 'bg-mist text-leaf'
                    : 'bg-faint text-stone'
                  }`}>{r.polarity}</span>
                </td>
                <td className="px-4 py-3 text-stone">{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
