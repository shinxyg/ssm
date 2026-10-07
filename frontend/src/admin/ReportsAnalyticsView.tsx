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
  barColor: string;
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
  const [dbSoloApps, setDbSoloApps] = useState<any[]>([]);

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

      try {
        const resSolo = await fetch('http://localhost:5000/api/solo-parent/applications');
        if (resSolo.ok) {
          const data = await resSolo.json();
          setDbSoloApps(data);
        }
      } catch (e) {}
    };

    fetchApps();
  }, []);

  const allCombinedApps = useMemo(() => {
    const merged = [...applications];

    dbSeniorApps.forEach(s => {
      const ref = s.reference_no || s.application_no || `SENIOR-${s.id}`;
      if (!merged.some(m => m.referenceNo === ref)) {
        merged.push({
          id: `db-senior-${s.id}`,
          referenceNo: ref,
          applicantName: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Senior Citizen',
          serviceName: 'Senior Citizen Financial Assistance',
          category: 'pwd_senior',
          status: s.status || 'Pending Verification',
          benefitAmount: '₱3,000 / semi-annual',
          amountNumber: 3000,
          dateSubmitted: s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        });
      }
    });

    dbAicsApps.forEach(a => {
      const ref = a.reference_no || `QC-AICS-2026-${a.id}`;
      if (!merged.some(m => m.referenceNo === ref)) {
        merged.push({
          id: `db-aics-${a.id}`,
          referenceNo: ref,
          applicantName: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'AICS Beneficiary',
          serviceName: `AICS ${a.assistance_type || 'Assistance'}`,
          category: 'aics',
          status: a.status || 'Pending Admin Review',
          benefitAmount: a.benefit_amount || '₱5,000',
          amountNumber: 5000,
          dateSubmitted: a.created_at ? new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        });
      }
    });

    dbSoloApps.forEach(sp => {
      const ref = sp.reference_no || `SP-${sp.id}`;
      if (!merged.some(m => m.referenceNo === ref)) {
        merged.push({
          id: `db-solo-${sp.id}`,
          referenceNo: ref,
          applicantName: `${sp.first_name || ''} ${sp.last_name || ''}`.trim() || 'Solo Parent',
          serviceName: 'Solo Parent Cash Subsidy',
          category: 'solo_child',
          status: sp.status || 'Pending Document Verification',
          benefitAmount: '₱1,000 / month',
          amountNumber: 1000,
          dateSubmitted: sp.created_at ? new Date(sp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        });
      }
    });

    return merged;
  }, [applications, dbSeniorApps, dbAicsApps, dbSoloApps]);

  const totalApplications = allCombinedApps.length;

  const isPendingStatus = (s?: string) => {
    if (!s) return true;
    const st = s.toLowerCase();
    return st.includes('pending') || st.includes('review') || st.includes('submitted') || st.includes('evaluation');
  };

  const isApprovedStatus = (s?: string) => {
    if (!s) return false;
    const st = s.toLowerCase();
    return st.includes('approved') || st.includes('released') || st.includes('completed') || st.includes('payout');
  };

  const isRejectedStatus = (s?: string) => {
    if (!s) return false;
    const st = s.toLowerCase();
    return st.includes('reject') || st.includes('declined') || st.includes('disqualified');
  };

  const pendingReviewCount = allCombinedApps.filter(a => isPendingStatus(a.status)).length;
  const approvedCount = allCombinedApps.filter(a => isApprovedStatus(a.status)).length;
  const rejectedCount = allCombinedApps.filter(a => isRejectedStatus(a.status)).length;
  const decidedCount = approvedCount + rejectedCount;
  const approvalRate = decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 100;

  const totalDisbursed = allCombinedApps
    .filter(a => isApprovedStatus(a.status))
    .reduce((sum, a) => {
      if (a.amountNumber) return sum + a.amountNumber;
      if (a.category === 'livelihood') return sum + 15000;
      if (a.category === 'pwd_senior') return sum + 3000;
      return sum + 5000;
    }, 0);

  const getProgStats = (catKey: string) => {
    const progApps = allCombinedApps.filter(a => {
      if (catKey === 'aics') return a.category === 'aics' || (a.referenceNo && a.referenceNo.includes('AICS'));
      if (catKey === 'pwd_senior') return a.category === 'pwd_senior' || (a.referenceNo && a.referenceNo.includes('SENIOR'));
      if (catKey === 'solo_child') return a.category === 'solo_child' || (a.referenceNo && a.referenceNo.includes('SP'));
      if (catKey === 'livelihood') return a.category === 'livelihood' || (a.referenceNo && a.referenceNo.includes('LVH'));
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
      barColor: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      ...aicsStats
    },
    {
      id: 'pwd_senior',
      name: 'PWD & Senior Citizen',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      dotColor: '#a855f7',
      barColor: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
      ...pwdSeniorStats
    },
    {
      id: 'solo_child',
      name: 'Solo Parent & Child Welfare',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      dotColor: '#f43f5e',
      barColor: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]',
      ...soloChildStats
    },
    {
      id: 'livelihood',
      name: 'Livelihood & Training',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      dotColor: '#10b981',
      barColor: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
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

  const cardClass = darkMode 
    ? 'bg-[#0e1726] border-slate-800/90 text-white' 
    : 'bg-white border-slate-200/90 text-slate-900 shadow-sm';

  const selectClass = darkMode 
    ? 'bg-[#0f172a] hover:bg-[#16223b] text-slate-200 border-slate-700/80' 
    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300';

  const subTextClass = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in slide-in-from-bottom-3 duration-500 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight flex items-center gap-2.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Reports & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`appearance-none rounded-xl px-4 py-2 pr-9 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-colors border ${selectClass}`}
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <ChevronDown className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${subTextClass}`} />
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
        <div className={`${cardClass} border rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subTextClass}`}>
              TOTAL APPLICATIONS
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {totalApplications}
            </div>
            <div className={`text-xs font-medium mt-1 ${subTextClass}`}>
              across all programs
            </div>
          </div>
        </div>

        <div className={`${cardClass} border rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subTextClass}`}>
              APPROVAL RATE
            </span>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border border-emerald-200 text-emerald-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#00d285] tracking-tight">
              {approvalRate}%
            </div>
            <div className={`text-xs font-medium mt-1 ${subTextClass}`}>
              {approvedCount} approved of {decidedCount} decided
            </div>
          </div>
        </div>

        <div className={`${cardClass} border rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subTextClass}`}>
              PENDING REVIEW
            </span>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-amber-950/60 border border-amber-500/30 text-amber-400' : 'bg-amber-100 border border-amber-200 text-amber-600'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-orange-500 tracking-tight">
              {pendingReviewCount}
            </div>
            <div className={`text-xs font-medium mt-1 ${subTextClass}`}>
              awaiting decision
            </div>
          </div>
        </div>

        <div className={`${cardClass} border rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all`}>
          <div className="flex items-start justify-between">
            <span className={`text-[11px] font-bold tracking-wider uppercase ${subTextClass}`}>
              TOTAL DISBURSED
            </span>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-950/60 border border-blue-500/30 text-blue-400' : 'bg-blue-100 border border-blue-200 text-blue-600'}`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              ₱{totalDisbursed.toLocaleString()}
            </div>
            <div className={`text-xs font-medium mt-1 ${subTextClass}`}>
              this period
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardClass} border rounded-2xl p-6`}>
        <h2 className={`text-sm font-bold mb-6 tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Applications by program
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-2">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke={darkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="11" />
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
                <span className={`text-2xl font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalApplications}</span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider mt-1 ${subTextClass}`}>
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
                    <span className={`text-[11px] font-medium hidden sm:inline ${subTextClass}`}>
                      {prog.approved} approved
                    </span>
                  </div>
                  <div className={`text-[11px] font-medium ${subTextClass}`}>
                    {prog.total} total · {prog.sharePercent}% share · {prog.approvalPercent}% approval
                  </div>
                </div>

                <div className={`w-full rounded-full h-2 overflow-hidden border ${darkMode ? 'bg-[#162032] border-slate-800/60' : 'bg-slate-100 border-slate-200'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      prog.sharePercent > 0 ? prog.barColor : (darkMode ? 'bg-slate-700/30' : 'bg-slate-300')
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
        <div className={`${cardClass} border rounded-2xl p-6 flex flex-col justify-between`}>
          <div>
            <h2 className={`text-sm font-bold mb-6 tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
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
                      <span className={`text-[11px] font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{source.name}</span>
                      <span className={`font-mono text-[11px] ${subTextClass}`}>
                        {source.amount > 0 ? `₱${source.amount.toLocaleString()}` : ''}
                      </span>
                    </div>

                    <div className={`w-full rounded-full h-3 overflow-hidden relative border ${darkMode ? 'bg-[#162032] border-slate-800/60' : 'bg-slate-100 border-slate-200'}`}>
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
            <div className={`border-t pt-2 flex justify-between text-[10px] font-mono ${darkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
              <span>₱0k</span>
              <span>₱1k</span>
              <span>₱2k</span>
              <span>₱2k</span>
              <span>₱3k</span>
            </div>
          </div>
          <div className={`border-t pt-4 mt-6 flex justify-between items-center text-xs ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total</span>
            <span className={`font-extrabold text-sm tracking-tight font-mono ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              ₱{totalDisbursed.toLocaleString()}
            </span>
          </div>
        </div>

        <div className={`${cardClass} border rounded-2xl p-6 flex flex-col justify-between`}>
          <div>
            <h2 className={`text-sm font-bold mb-6 tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Monthly application volume
            </h2>
            <div className="relative h-48 w-full pt-4 pb-6">
              <div className={`absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] font-mono ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                <div className={`border-b pb-1 flex justify-between ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}><span>4</span><span>₱0.0M</span></div>
                <div className={`border-b pb-1 flex justify-between ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}><span>3</span><span>₱0.0M</span></div>
                <div className={`border-b pb-1 flex justify-between ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}><span>2</span><span>₱0.0M</span></div>
                <div className={`border-b pb-1 flex justify-between ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}><span>1</span><span>₱0.0M</span></div>
                <div className={`border-b pb-1 flex justify-between ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}><span>0</span><span>₱0.0M</span></div>
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
                      <div className={`absolute -top-10 text-[10px] py-1 px-2 rounded shadow-xl whitespace-nowrap z-30 border ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}>
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
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-transform ${
                        darkMode ? 'border-[#0e1726]' : 'border-white'
                      } ${
                        idx === 5 && totalApplications > 0 ? 'bg-blue-400 scale-125 shadow-[0_0_10px_#3b82f6]' : 'bg-blue-500'
                      }`}
                      style={{ marginBottom: (idx === 5 && totalApplications > 0) ? '135px' : '12px' }}
                    ></div>
                    <span className={`absolute -bottom-5 text-[11px] font-medium ${subTextClass}`}>
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-2">
              <div className={`flex items-center gap-2 text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="w-3 h-3 bg-blue-500/50 border border-blue-400 rounded-sm"></span>
                <span>Applications</span>
              </div>
              <div className={`flex items-center gap-2 text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="w-4 h-0.5 bg-blue-500 rounded-full"></span>
                <span>Disbursed</span>
              </div>
            </div>
          </div>

          <div className={`border-t pt-3 mt-4 text-[11px] font-medium ${darkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            Latest month (Sep): <strong className={darkMode ? 'text-slate-200' : 'text-slate-900'}>{monthlyVolume[5].applications} applications</strong> · <strong className={darkMode ? 'text-slate-200' : 'text-slate-900'}>₱{monthlyVolume[5].disbursed.toLocaleString()} disbursed</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
