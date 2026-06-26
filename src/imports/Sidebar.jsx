import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Network, Target, ClipboardList,
  CalendarCheck, BarChart2, AlertTriangle, Settings,
} from 'lucide-react';

const nav = [
  { path: '/',          label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/org',       label: 'Organisation',    icon: Network },
  { path: '/goals',     label: 'Goals register',  icon: Target },
  { path: '/roles',     label: 'Role sheets',     icon: ClipboardList },
  { path: '/targets',   label: 'Annual targets',  icon: CalendarCheck },
  { path: '/monitoring',label: 'Monitoring',      icon: BarChart2 },
  { path: '/gaps',      label: 'Gap analysis',    icon: AlertTriangle, badge: 1 },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-[220px] bg-forest flex flex-col flex-shrink-0 h-full">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center text-forest font-extrabold text-base flex-shrink-0">
            V
          </div>
          <div>
            <div className="text-white font-bold text-base tracking-tight">Verdant</div>
            <div className="text-mist text-[9px] tracking-widest uppercase opacity-60">by Clarium</div>
          </div>
        </div>
        <div className="mt-2 text-mint text-[10px] font-medium tracking-wide">
          Track · Improve · Sustain
        </div>
      </div>

      {/* Plant context */}
      <div className="mx-2 px-3 py-2.5 border-b border-white/8">
        <div className="text-[9px] text-mist opacity-55 uppercase tracking-widest mb-1">Active plant</div>
        <div className="text-mist text-xs font-medium">Nalgonda · Kiln 2</div>
        <div className="text-mint text-[11px] mt-0.5">FY 2025–26</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {nav.map(({ path, label, icon: Icon, badge }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                active ? 'bg-leaf text-white' : 'text-mist/70 hover:bg-white/8 hover:text-mist'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="bg-amber text-white text-[10px] font-bold rounded-full px-1.5 py-px">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-pine flex items-center justify-center text-mist text-[10px] font-bold flex-shrink-0">
          TP
        </div>
        <div>
          <div className="text-mist text-[11px] font-medium leading-tight">Thermal Process</div>
          <div className="text-mist/50 text-[10px] leading-tight">Engineer</div>
        </div>
      </div>
    </aside>
  );
}
