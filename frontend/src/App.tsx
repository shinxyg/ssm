import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { HowItWorks } from './components/HowItWorks';
import { ServiceCatalog } from './components/ServiceCatalog';
import { ModuleCardGrid } from './components/ModuleCardGrid';
import { LivelihoodProgramView } from './components/LivelihoodProgramView';
import { TrainingProgramView } from './components/TrainingProgramView';
import { TrackApplicationsModal } from './components/TrackApplicationsModal';
import { EligibilityFinderModal } from './components/EligibilityFinderModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { MedicalAssistanceView } from './components/MedicalAssistanceView';
import { FuneralAssistanceView } from './components/FuneralAssistanceView';
import { EducationalAssistanceView } from './components/EducationalAssistanceView';
import { PwdAssistanceView } from './components/PwdAssistanceView';
import { UserProfileView } from './components/UserProfileView';

import { initialServices, initialApplications } from './data/servicesData';
import type { ServiceItem, ApplicationRecord } from './types';
import { History, ShieldCheck, QrCode } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('help-guide');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Modals
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Dynamic application state
  const [applications, setApplications] = useState<ApplicationRecord[]>(initialApplications);

  const handleAddApplication = (newApp: ApplicationRecord) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleApplyFromModule = (title: string, description: string) => {
    const t = title.toLowerCase();
    if (t.includes('medical')) {
      setActiveTab('aics-medical');
      return;
    }
    if (t.includes('burial') || t.includes('funeral')) {
      setActiveTab('aics-funeral');
      return;
    }
    if (t.includes('educational')) {
      setActiveTab('aics-educational');
      return;
    }
    if (t.includes('child welfare') || t.includes('childwelfare') || t.includes('child')) {
      setActiveTab('childwelfare-form');
      return;
    }
    if (t.includes('pwd')) {
      setActiveTab('pwd-form');
      return;
    }
    const customService: ServiceItem = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category: (activeTab as any) || 'aics',
      requirements: [
        'Certificate of Indigency from Barangay',
        'Valid Government Photo ID (PhilSys / Comelec)',
        'Supporting Documents'
      ],
      processingTime: '2 - 3 Business Days',
      benefitAmount: 'Financial Aid Grant',
      iconName: 'aics'
    };
    setSelectedService(customService);
  };

  // Filtered Services Logic for Help Guide Search
  const filteredServices = useMemo(() => {
    return initialServices.filter((service) => {
      // Hero Banner Filter Pills
      if (activeFilter === 'aics' && service.category !== 'aics') return false;
      if (activeFilter === 'pwd_senior' && service.category !== 'pwd' && service.category !== 'senior') return false;
      if (activeFilter === 'solo_child' && service.category !== 'soloparent' && service.category !== 'child') return false;
      if (activeFilter === 'livelihood_payout' && service.category !== 'livelihood') return false;

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesReqs = service.requirements.some((r) => r.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesReqs;
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  // Dynamic Header Section Name (Matching Screenshots)
  const sectionTitleMap: Record<string, string> = {
    'help-guide': 'Help & Service Guide',
    'aics': 'AICS Assistance',
    'aics-medical': 'AICS Assistance',
    'aics-funeral': 'AICS Assistance',
    'aics-educational': 'Child Welfare Services',
    'pwd': 'PWD Services',
    'pwd-form': 'PWD Services',
    'senior': 'Senior Citizen Services',
    'soloparent': 'Solo Parent Services',
    'childwelfare': 'Child Welfare Services',
    'livelihood': 'Livelihood & Training',
    'livelihood-grants': 'Livelihood & Training',
    'skills-training': 'Livelihood & Training',
    'payout': 'Financial Aid Disbursement',
    'history': 'Application History',
    'profile': 'User Profile',
  };

  return (
    <div className={`h-screen max-h-screen overflow-hidden flex flex-row font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
      darkMode ? 'dark bg-[#0b1220] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Left Sidebar (Full height from top to bottom) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* Main Right Column: Top Header Navbar + Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeSection={sectionTitleMap[activeTab] || 'Help & Service Guide'}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onNavigateToProfile={() => setActiveTab('profile')}
        />

        {/* Main Content Area (Independent Viewport Scroll) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {activeTab === 'help-guide' ? (
            /* Help & Service Guide Main Overview Page */
            <>
              <HeroBanner
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                onOpenTrackModal={() => setIsTrackModalOpen(true)}
                onOpenEligibilityModal={() => setIsEligibilityModalOpen(true)}
              />

              <HowItWorks />

              <ServiceCatalog
                services={filteredServices}
                onSelectService={(service) => {
                  const s = (service.id + ' ' + service.title).toLowerCase();
                  if (s.includes('medical')) {
                    setActiveTab('aics-medical');
                  } else if (s.includes('funeral') || s.includes('burial')) {
                    setActiveTab('aics-funeral');
                  } else if (s.includes('educational')) {
                    setActiveTab('aics-educational');
                  } else if (s.includes('child welfare') || s.includes('childwelfare')) {
                    setActiveTab('childwelfare-form');
                  } else {
                    setSelectedService(service);
                  }
                }}
                filterTitle="Available Social Services Programs"
              />
            </>
          ) : activeTab === 'aics-medical' ? (
            /* Dedicated QC Medical Assistance 4-Step Form View */
            <MedicalAssistanceView
              onBack={() => setActiveTab('aics')}
              onAddApplication={handleAddApplication}
              darkMode={darkMode}
            />
          ) : activeTab === 'aics-funeral' ? (
            /* Dedicated QC Funeral Assistance 4-Step Form View */
            <FuneralAssistanceView
              onBack={() => setActiveTab('aics')}
              onAddApplication={handleAddApplication}
              darkMode={darkMode}
            />
          ) : activeTab === 'aics-educational' ? (
            /* Dedicated QC Educational Assistance 4-Step Form View */
            <EducationalAssistanceView
              mode="educational"
              onBack={() => setActiveTab('childwelfare')}
              onAddApplication={handleAddApplication}
              darkMode={darkMode}
            />
          ) : activeTab === 'childwelfare-form' ? (
            /* Dedicated QC Child Welfare Services 4-Step Form View */
            <EducationalAssistanceView
              mode="childwelfare"
              onBack={() => setActiveTab('childwelfare')}
              onAddApplication={handleAddApplication}
              darkMode={darkMode}
            />
          ) : activeTab === 'pwd-form' ? (
            /* Dedicated PWD Social Assistance 4-Step Form View */
            <PwdAssistanceView
              onBack={() => setActiveTab('pwd')}
              onAddApplication={handleAddApplication}
              darkMode={darkMode}
            />
          ) : activeTab === 'profile' ? (
            /* Dedicated User Profile Content View */
            <UserProfileView darkMode={darkMode} />
          ) : activeTab === 'livelihood' || activeTab === 'livelihood-grants' ? (
            /* Livelihood Program View */
            <LivelihoodProgramView
              onApply={() => handleApplyFromModule('Gov Service Livelihood Program', 'Official government service for Livelihood and Enterprise Assistance of Gov Service.')}
              darkMode={darkMode}
            />
          ) : activeTab === 'skills-training' ? (
            /* Training Program View */
            <TrainingProgramView
              onApplyCourse={(courseTitle) => handleApplyFromModule(courseTitle, `Free skills and vocational training course for ${courseTitle}.`)}
              darkMode={darkMode}
            />
          ) : activeTab === 'history' ? (
            /* Application History View */
            <section className={`border rounded-2xl p-6 shadow-xl space-y-6 ${
              darkMode ? 'bg-[#0e172a]/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <History className="w-5 h-5 text-blue-500" />
                    Application History & Disbursement Records
                  </h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Official log of applications filed under Citizen Jefferson Lee (PhilSys Verified)
                  </p>
                </div>
                <button
                  onClick={() => setIsTrackModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl border border-blue-400/40"
                >
                  Track Status
                </button>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.referenceNo}
                    className={`p-5 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                      darkMode 
                        ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                          darkMode ? 'text-blue-400 bg-blue-950 border-blue-800' : 'text-blue-700 bg-blue-50 border-blue-200'
                        }`}>
                          {app.referenceNo}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {app.category}
                        </span>
                      </div>
                      <h4 className={`text-base font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {app.serviceName}
                      </h4>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Assigned: {app.assignedSocialWorker} • Submitted {app.dateSubmitted}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-500">{app.amountOrType}</div>
                        <span className="text-[10px] text-emerald-600 font-semibold">{app.status}</span>
                      </div>

                      {app.status === 'Ready for Payout' && (
                        <button 
                          onClick={() => setIsTrackModalOpen(true)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-500 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <QrCode className="w-4 h-4 text-blue-500" />
                          <span>View QR</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            /* Module Card Views for AICS, PWD, Senior, Solo Parent, Child Welfare */
            <ModuleCardGrid
              activeTab={activeTab}
              onApply={handleApplyFromModule}
              darkMode={darkMode}
            />
          )}


        </main>
      </div>

      {/* Modals */}
      <TrackApplicationsModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        applications={applications}
      />

      <EligibilityFinderModal
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        onApplyCategoryFilter={(category) => {
          setActiveFilter(category);
          setActiveTab('help-guide');
        }}
      />

      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onAddApplication={handleAddApplication}
      />
    </div>
  );
}
