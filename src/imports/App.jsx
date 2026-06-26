import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import OrgChart from './pages/OrgChart';
import GoalsRegister from './pages/GoalsRegister';
import RoleSheets from './pages/RoleSheets';
import AnnualTargets from './pages/AnnualTargets';
import Monitoring from './pages/Monitoring';
import GapAnalysis from './pages/GapAnalysis';

function Layout({ children, excCount }) {
  return (
    <div className="flex h-screen bg-chalk font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar excCount={excCount} />
        <main className="flex-1 overflow-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout excCount={1}>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/org"        element={<OrgChart />} />
          <Route path="/goals"      element={<GoalsRegister />} />
          <Route path="/roles"      element={<RoleSheets />} />
          <Route path="/targets"    element={<AnnualTargets />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/gaps"       element={<GapAnalysis />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
