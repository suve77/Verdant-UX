import { orgNodes, site } from '../data/cement';

const tierColors = {
  1: { bg: 'bg-forest text-white',      dot: 'bg-mint' },
  2: { bg: 'bg-leaf text-white',        dot: 'bg-mist' },
  3: { bg: 'bg-white border-leaf/40',   dot: 'bg-leaf' },
  4: { bg: 'bg-white border-dashed border-stone/30', dot: 'bg-stone/50' },
};

function OrgCard({ node }) {
  const tc = tierColors[node.tier];
  return (
    <div className={`rounded-xl border p-3.5 ${tc.bg} min-w-[160px]`}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tc.dot}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-widest opacity-70`}>Tier {node.tier}</span>
      </div>
      <div className="font-semibold text-sm leading-snug mb-2.5">{node.title}</div>
      <div className="space-y-1 text-[10px] opacity-80">
        <div><span className="font-medium">Authority:</span> {node.authority}</div>
        <div><span className="font-medium">GHG Scope:</span> {node.ghgScope}</div>
        <div><span className="font-medium">ISO 50001:</span> {node.iso}</div>
      </div>
    </div>
  );
}

export default function OrgChart() {
  const tier1 = orgNodes.filter(n => n.tier === 1);
  const tier2 = orgNodes.filter(n => n.tier === 2);
  const tier3 = orgNodes.filter(n => n.tier === 3);
  const tier4 = orgNodes.filter(n => n.tier === 4);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-ink tracking-tight">Organisation chart</h1>
        <p className="text-stone text-xs mt-1">{site.department} · {site.company}</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 overflow-x-auto">
        <div className="flex flex-col items-center gap-0 min-w-[700px]">

          {/* Tier 1 */}
          <div className="flex justify-center">
            {tier1.map(n => <OrgCard key={n.id} node={n} />)}
          </div>

          {/* Connector T1 → T2 */}
          <div className="w-px h-6 bg-border" />

          {/* Tier 2 */}
          <div className="flex justify-center">
            {tier2.map(n => <OrgCard key={n.id} node={n} />)}
          </div>

          {/* Connector T2 → T3 */}
          <div className="w-px h-6 bg-border" />
          <div className="border-t border-border" style={{ width: '85%' }} />

          {/* Tier 3 */}
          <div className="flex justify-center gap-3 mt-0">
            {tier3.map((n, i) => (
              <div key={n.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgCard node={n} />
              </div>
            ))}
            {tier4.map(n => (
              <div key={n.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-border" />
                <OrgCard node={n} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 flex-wrap">
        {[
          { tier: 1, label: 'Tier 1 — Strategic', cls: 'bg-forest text-white' },
          { tier: 2, label: 'Tier 2 — Management', cls: 'bg-leaf text-white' },
          { tier: 3, label: 'Tier 3 — Operational', cls: 'bg-white border border-leaf/40 text-ink' },
          { tier: 4, label: 'Tier 4 — Site coordinator ×N', cls: 'bg-white border border-dashed border-stone/30 text-stone' },
        ].map(l => (
          <div key={l.tier} className={`text-[11px] font-medium px-3 py-1.5 rounded-md ${l.cls}`}>{l.label}</div>
        ))}
      </div>
    </div>
  );
}
