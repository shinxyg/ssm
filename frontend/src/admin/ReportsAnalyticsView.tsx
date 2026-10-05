import React, { useState, useEffect, useMemo } from 'react';
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

interface ReportsAnalyticsViewProps {
  darkMode?: boolean;
  applications?: any[];
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({ 
  darkMode = true,
  applications = []
}) => {
  const [timeRange, setTimeRange] = useState<string>('Last 6 Months');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Live database records state
  const [dbSeniorApps, setDbSeniorApps] = useState<any[]>([]);
  const [dbAicsApps, setDbAicsApps] = useState<any[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const resSenior = await fetch('http://localhost:5000/api/senior/applications');
        if (resSenior.ok) {
          const data = await resSenior.json();
          setDbSeniorApps(data);
        }
      } catch (e) {}

      try {
        const resAics = await fetch('http://localhost:5000/api/aics/applications');
        if (resAics.ok) {
          const data = await resAics.json();
          setDbAicsApps(data);
        }
      } catch (e) {}
    };

    fetchApps();
    const interval = setInterval(fetchApps, 4000);
    return () => clearInterval(interval);
  }, []);

  // Merge DB records with prop applications
  const combinedApps = useMemo(() => {
    const list: any[] = [];
    const seen = new Set<string>();

    // 1. Senior DB records
    dbSeniorApps.forEach((item) => {
      seen.add(item.reference_no);
      list.push({
        referenceNo: item.reference_no,
        applicantName: item.applicant_name,
        serviceName: item.service_name || 'Senior Citizen Financial Assistance',
        category: item.category || 'Senior Assistance',
        status: item.status || 'Pending Validation',
        amountOrType: '₱3,000.00 Financial Assistance',
        dateSubmitted: item.date_submitted
      });
    });

    // 2. AICS DB records
    dbAicsApps.forEach((item) => {
      if (!seen.has(item.reference_no)) {
        seen.add(item.reference_no);
        list.push({
          referenceNo: item.reference_no,
          applicantName: item.applicant_name,
          serviceName: item.service_name || 'AICS Financial Assistance',
          category: item.category || 'AICS',
          status: item.status || 'Pending Validation',
          amountOrType: item.assistance_type || '₱5,000.00 Financial Subsidy',
          dateSubmitted: item.date_submitted
        });
      }
    });

    // 3. Prop records (include only non-AICS and non-Senior records from props to prevent mock double counting)
    applications.forEach((app) => {
      const isSeniorOrPwd = app.category?.toLowerCase().includes('senior') || app.serviceName?.toLowerCase().includes('senior') || app.category?.toLowerCase().includes('pwd') || app.serviceName?.toLowerCase().includes('pwd');
      const isAics = app.category?.toLowerCase().includes('aics') || app.serviceName?.toLowerCase().includes('aics') || app.category?.toLowerCase().includes('medical') || app.serviceName?.toLowerCase().includes('medical') || app.category?.toLowerCase().includes('funeral') || app.serviceName?.toLowerCase().includes('funeral');

      if (!isSeniorOrPwd && !isAics && app.referenceNo && !seen.has(app.referenceNo)) {
        seen.add(app.referenceNo);
        list.push(app);
      }
    });

    return list;
  }, [dbSeniorApps, dbAicsApps, applications]);

  const totalApplications = combinedApps.length;

  const isApprovedStatus = (st: string) => {
    const s = (st || '').toLowerCase();
    return s.includes('approved') || s.includes('scheduled') || s.includes('payout') || s.includes('ready') || s.includes('completed') || s.includes('released');
  };

  const isRejectedStatus = (st: string) => {
    const s = (st || '').toLowerCase();
    return s.includes('reject') || s.includes('disqualified');
  };

  const isPendingStatus = (st: string) => {
    const s = (st || '').toLowerCase();
    return s.includes('pending') || s.includes('review') || s.includes('validation') || s.includes('submitted');
  };

  const approvedCount = combinedApps.filter(a => isApprovedStatus(a.status)).length;
  const rejectedCount = combinedApps.filter(a => isRejectedStatus(a.status)).length;
  const pendingReviewCount = combinedApps.filter(a => isPendingStatus(a.status)).length;
  const decidedCount = approvedCount + rejectedCount;
  const approvalRate = decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 0;
  
  // Calculate total disbursed from approved/payout applications
  const totalDisbursed = combinedApps
    .filter(a => isApprovedStatus(a.status))
    .reduce((sum, a) => {
      const match = a.amountOrType?.match(/\d[\d,]*/);
      return sum + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 3000);
    }, 0);

  // Group by program with flexible category and status matching
  const getProgStats = (type: 'aics' | 'pwd_senior' | 'solo_child' | 'livelihood') => {
    const progApps = combinedApps.filter(a => {
      const cat = (a.category || '').toLowerCase();
      const serv = (a.serviceName || '').toLowerCase();

      if (type === 'aics') {
        return cat.includes('aics') || cat.includes('medical') || cat.includes('funeral') || serv.includes('aics') || serv.includes('medical') || serv.includes('funeral');
      }
      if (type === 'pwd_senior') {
        return cat.includes('pwd') || cat.includes('senior') || serv.includes('pwd') || serv.includes('senior');
      }
      if (type === 'solo_child') {
        return cat.includes('solo') || cat.includes('child') || serv.includes('solo') || serv.includes('child');
      }
      if (type === 'livelihood') {
        return cat.includes('livelihood') || cat.includes('training') || serv.includes('livelihood') || serv.includes('training');
      }
      return false;
    });

    const total = progApps.length;
    const pending = progApps.filter(a => isPendingStatus(a.status)).length;
    const approved = progApps.filter(a => isApprovedStatus(a.status)).length;
    const rejected = progApps.filter(a => isRejectedStatus(a.status)).length;
    const sharePercent = totalApplications > 0 ? Math.round((total / totalApplications) * 100) : 0;
    const approvalPercent = (approved + rejected) > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0;
    return { pending, approved, rejected, total, sharePercent, approvalPercent };
  };

  const aicsStats = getProgStats('aics');
  const pwdSeniorStats = getProgStats('pwd_senior');
  const soloChildStats = getProgStats('solo_child');
  const livelihoodStats = getProgStats('livelihood');

  const programData: ProgramStats[] = [
    {
      id: 'aics',
      name: 'AICS',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      dotColor: '#3b82f6',
      ...aicsStats
    },
    {
      id: 'pwd_senior',
      name: 'PWD & Senior Citizen',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      dotColor: '#a855f7',
      ...pwdSeniorStats
    },
    {
      id: 'solo_child',
      name: 'Solo Parent & Child Welfare',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      dotColor: '#f43f5e',
      ...soloChildStats
    },
    {
      id: 'livelihood',
      name: 'Livelihood & Training',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      dotColor: '#10b981',
      ...livelihoodStats
    },
  ];

  const disbursementSources: DisbursementSource[] = [
    { name: 'AICS', amount: aicsStats.approved * 5000, color: 'bg-blue-500' },
    { name: 'Social pension', amount: pwdSeniorStats.approved * 3000, color: 'bg-purple-500' },
    { name: 'Educational assistance', amount: soloChildStats.approved * 5000, color: 'bg-pink-500' },
    { name: 'Livelihood kit funding', amount: livelihoodStats.approved * 15000, color: 'bg-emerald-500' },
  ];

  const monthlyVolume = [
    { month: 'Apr', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'May', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Jun', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Jul', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Aug', applications: 0, disbursed: 0, barHeight: 0 },
    { month: 'Sep', applications: totalApplications, disbursed: totalDisbursed, barHeight: totalApplications > 0 ? 45 : 0 },
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
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in slide-in-from-bottom-3 duration-500 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
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
                {totalApplications > 0 && (
                  <>
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * (aicsStats.total / totalApplications))} className="transition-all duration-1000 ease-out" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#a855f7" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * (pwdSeniorStats.total / totalApplications))} className="transition-all duration-1000 ease-out" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f43f5e" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * (soloChildStats.total / totalApplications))} className="transition-all duration-1000 ease-out" />
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * (livelihoodStats.total / totalApplications))} className="transition-all duration-1000 ease-out" />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-black text-white leading-none">{totalApplications}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Total Application{totalApplications !== 1 ? 's' : ''}
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
                const percent = source.amount > 0 ? (source.amount / maxVal) * 100 : 0;
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
                    d={totalApplications > 0 ? "M 30 144 L 85 144 L 140 144 L 195 144 L 250 144 C 290 144, 310 20, 350 20" : "M 30 144 L 85 144 L 140 144 L 195 144 L 250 144 L 350 144"}
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
                        idx === 5 && totalApplications > 0 ? 'bg-blue-400 scale-125 shadow-[0_0_10px_#3b82f6]' : 'bg-blue-500'
                      }`}
                      style={{ marginBottom: (idx === 5 && totalApplications > 0) ? '135px' : '12px' }}
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
            Latest month (Sep): <strong className="text-slate-200">{monthlyVolume[5].applications} applications</strong> · <strong className="text-slate-200">₱{monthlyVolume[5].disbursed.toLocaleString()} disbursed</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
