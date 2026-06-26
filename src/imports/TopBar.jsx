import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const titles = {
  '/':           'Department dashboard',
  '/org':        'Organisation chart',
  '/goals':      'Goals register',
  '/roles':      'Role sheets',
  '/targets':    'Annual targets',
  '/monitoring': 'Monitoring & graphs',
  '/gaps':       'Gap analysis',
};

export default function TopBar({ excCount = 0 }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-border h-[50px] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-stone">Deccan Cement Ltd</span>
        <span className="text-stone/30">›</span>
        <span className="text-stone">Energy &amp; Environment</span>
        <span className="text-stone/30">›</span>
        <span className="text-ink font-medium">{titles[pathname] || pathname}</span>
      </div>

      <div className="flex items-center gap-3">
        {excCount > 0 && (
          <button
            onClick={() => navigate('/gaps')}
            className="flex items-center gap-1.5 bg-amber-bg border border-amber-light rounded-md px-3 py-1 text-xs cursor-pointer hover:bg-amber-light/50 transition-colors"
          >
            <AlertTriangle size={12} className="text-amber" />
            <span className="text-amber-text font-semibold">{excCount} open exception</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 text-xs text-stone">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Live
        </div>
      </div>
    </header>
  );
}
