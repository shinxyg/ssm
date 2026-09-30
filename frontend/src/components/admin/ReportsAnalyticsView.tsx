import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  Wallet, 
  Download, 
  ChevronDown
} from 'lucide-react';

interface ProgramStats {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  sharePercent: number;
  approvalPercent: number;
}

interface DisbursementSource {
  name: string;
  amount: number;
  color: string;
}

export const ReportsAnalyticsView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [timeRange, setTimeRange] = useState<string>('Last 6 Months');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const totalApplications = 1;
  const approvalRate = 0;
  const approvedCount = 0;
  const decidedCount = 1;
  const pendingReviewCount = 0;
  const totalDisbursed = 4500;

  const programData: ProgramStats[] = [
    {
      id: 'aics',
      name: 'AICS',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      dotColor: '#3b82f6',
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
      sharePercent: 0,
      approvalPercent: 0,
    },
    {
      id: 'pwd_senior',
      name: 'PWD & Senior Citizen',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      dotColor: '#a855f7',
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
      sharePercent: 0,
      approvalPercent: 0,
    },
    {
      id: 'solo_child',
      name: 'Solo Parent & Child Welfare',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      dotColor: '#f43f5e',
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
      sharePercent: 0,
      approvalPercent: 0,
    },
    {
      id: 'livelihood',
      name: 'Livelihood & Training',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      dotColor: '#10b981',
      pending: 0,
      approved: 0,
      rejected: 1,
      total: 1,
      sharePercent: 100,
      approvalPercent: 0,
    },
  ];

  const disbursementSources: DisbursementSource[] = [
    { name: 'AICS', amount: 0, color: 'bg-blue-500' },
    { name: 'Social pension', amount: 2000, color: 'bg-purple-500' },
    { name: 'Educational assistance', amount: 2500, color: 'bg-pink-500' },
    { name: 'Livelihood kit funding', amount: 0, color: 'bg-emerald-500' },
  ];

  const monthlyVolume = [
    { month: 'Apr', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'May', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Jun', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Jul', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Aug', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Sep', applications: 3, disbursed: 1500, barHeight: 45 },
  ];

  const handleExportCSV = () => {
    const csvRows = [
      ['GovServe Admin Reports & Analytics Export'],
      ['Generated On', new Date().toLocaleString()],
      ['Timeframe', timeRange],
      [],
      ['KPI Summary'],
      ['Total Applications', totalApplications],
      ['Approval Rate', `${approvalRate}%`],
      ['Pending Review', pendingReviewCount],
      ['Total Disbursed', `PHP ${totalDisbursed.toLocaleString()}`],
      [],
      ['Applications By Program'],
      ['Program', 'Pending', 'Approved', 'Rejected', 'Total', 'Share %', 'Approval %'],
      ...programData.map(p => [p.name, p.pending, p.approved, p.rejected, p.total, `${p.sharePercent}%`, `${p.approvalPercent}%`]),
      [],
      ['Disbursement By Funding Source'],
      ['Source', 'Amount (PHP)'],
      ...disbursementSources.map(s => [s.name, s.amount]),
      [],
      ['Monthly Application Volume'],
      ['Month', 'Applications', 'Disbursed (PHP)'],
      ...monthlyVolume.map(m => [m.month, m.applications, m.disbursed])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GovServe_Reports_Analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Reports & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-[#0f172a] hover:bg-[#16223b] text-slate-200 border border-slate-700/80 rounded-xl px-4 py-2 pr-9 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-colors"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-blue-600 text-white border border-blue-400/30 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TOTAL APPLICATIONS
            </span>
            <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {totalApplications}
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              across all programs
            </div>
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              APPROVAL RATE
            </span>
            <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#00d285] tracking-tight">
              {approvalRate}%
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              {approvedCount} approved of {decidedCount} decided
            </div>
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              PENDING REVIEW
            </span>
            <div className="p-2 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-orange-500 tracking-tight">
              {pendingReviewCount}
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              awaiting decision
            </div>
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TOTAL DISBURSED
            </span>
            <div className="p-2 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ₱{totalDisbursed.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1">
              this period
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-6 shadow-xl">
        <h2 className="text-sm font-bold text-white mb-6 tracking-wide">
          Applications by program
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-2">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="11" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset="210" className="transition-all duration-1000 ease-out" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#a855f7" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset="180" className="transition-all duration-1000 ease-out" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f43f5e" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset="155" className="transition-all duration-1000 ease-out" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset="60" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-black text-white leading-none">1</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Total Application
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            {programData.map((prog) => (
              <div key={prog.id} className="space-y-1.5 group">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${prog.bgColor} ${prog.borderColor} ${prog.color}`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: prog.dotColor }}></span>
                      {prog.name}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
                      {prog.pending} pending &nbsp; {prog.approved} approved &nbsp; {prog.rejected} rejected
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    {prog.total} total · {prog.sharePercent}% share · {prog.approvalPercent}% approval
                  </div>
                </div>

                <div className="w-full bg-[#162032] rounded-full h-2 overflow-hidden border border-slate-800/60">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      prog.sharePercent > 0 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-700/30'
                    }`}
                    style={{ width: `${prog.sharePercent > 0 ? prog.sharePercent : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-6 tracking-wide">
              Disbursement by funding source
            </h2>
            <div className="space-y-5 my-4">
              {disbursementSources.map((source) => {
                const maxVal = 3000;
                const percent = (source.amount / maxVal) * 100;
                return (
                  <div 
                    key={source.name} 
                    className="space-y-1.5"
                    onMouseEnter={() => setHoveredBar(source.name)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300 text-[11px] font-semibold">{source.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {source.amount > 0 ? `₱${source.amount.toLocaleString()}` : ''}
                      </span>
                    </div>

                    <div className="w-full bg-[#162032] rounded-full h-3 overflow-hidden relative border border-slate-800/60">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${source.color} ${
                          hoveredBar === source.name ? 'brightness-125' : ''
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-800/80 pt-2 flex justify-between text-[10px] font-mono text-slate-500">
              <span>₱0k</span>
              <span>₱1k</span>
              <span>₱2k</span>
              <span>₱2k</span>
              <span>₱3k</span>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-4 mt-6 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300">Total</span>
            <span className="font-extrabold text-white text-sm tracking-tight font-mono">
              ₱{totalDisbursed.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-6 tracking-wide">
              Monthly application volume
            </h2>
            <div className="relative h-48 w-full pt-4 pb-6">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-600 font-mono">
                <div className="border-b border-slate-800/60 pb-1 flex justify-between"><span>4</span><span>₱0.0M</span></div>
                <div className="border-b border-slate-800/60 pb-1 flex justify-between"><span>3</span><span>₱0.0M</span></div>
                <div className="border-b border-slate-800/60 pb-1 flex justify-between"><span>2</span><span>₱0.0M</span></div>
                <div className="border-b border-slate-800/60 pb-1 flex justify-between"><span>1</span><span>₱0.0M</span></div>
                <div className="border-b border-slate-800/60 pb-1 flex justify-between"><span>0</span><span>₱0.0M</span></div>
              </div>

              <div className="relative h-full w-full px-6 flex items-end justify-between">
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                  <path
                    d="M 30 144 L 85 144 L 140 144 L 195 144 L 250 144 C 290 144, 310 20, 350 20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  />
                </svg>

                {monthlyVolume.map((item, idx) => (
                  <div
                    key={item.month}
                    className="relative flex flex-col items-center h-full justify-end group z-10"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {hoveredPoint === idx && (
                      <div className="absolute -top-10 bg-slate-900 border border-slate-700 text-white text-[10px] py-1 px-2 rounded shadow-xl whitespace-nowrap z-30">
                        {item.month}: {item.applications} Apps · ₱{item.disbursed.toLocaleString()}
                      </div>
                    )}
                    {item.barHeight > 0 && (
                      <div
                        className="w-7 bg-blue-500/30 border border-blue-400/50 rounded-t-md mb-0.5 transition-all group-hover:bg-blue-500/50"
                        style={{ height: `${item.barHeight}px` }}
                      ></div>
                    )}
                    <div
                      className={`w-2.5 h-2.5 rounded-full border-2 border-[#0e1726] transition-transform ${
                        idx === 5 ? 'bg-blue-400 scale-125 shadow-[0_0_10px_#3b82f6]' : 'bg-blue-500'
                      }`}
                      style={{ marginBottom: idx === 5 ? '135px' : '12px' }}
                    ></div>
                    <span className="absolute -bottom-5 text-[11px] font-medium text-slate-400">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="w-3 h-3 bg-blue-500/50 border border-blue-400 rounded-sm"></span>
                <span>Applications</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="w-4 h-0.5 bg-blue-500 rounded-full"></span>
                <span>Disbursed</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 mt-4 text-[11px] text-slate-400 font-medium">
            Latest month (Sep): <strong className="text-slate-200">1 applications</strong> · <strong className="text-slate-200">₱1,500 disbursed</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
