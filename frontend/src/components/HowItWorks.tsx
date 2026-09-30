import React from 'react';
import { FileSearch, FileEdit, UserCheck, CreditCard } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Select Service & Requirements',
      description:
        'Choose the service you need (AICS, PWD, Senior, Solo Parent) and prepare the required digital files (Indigency, Medical Abstract, IDs).',
      icon: FileSearch,
      iconBg: 'bg-blue-600/20 border-blue-500/40 text-blue-400',
    },
    {
      stepNumber: '02',
      title: 'Fill Online Form & Upload',
      description:
        'Provide your citizen details, address, and upload legible photos or scanned copies of supporting documents.',
      icon: FileEdit,
      iconBg: 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400',
    },
    {
      stepNumber: '03',
      title: 'Social Worker Assessment',
      description:
        'Assigned City Social Workers review your case, evaluate eligibility, and approve the assistance amount or ID card request.',
      icon: UserCheck,
      iconBg: 'bg-purple-600/20 border-purple-500/40 text-purple-400',
    },
    {
      stepNumber: '04',
      title: 'Approval & Payout / ID Claim',
      description:
        'Receive real-time notification, QR Claim Voucher for financial payout, or notification to claim your official ID card.',
      icon: CreditCard,
      iconBg: 'bg-teal-600/20 border-teal-500/40 text-teal-400',
    },
  ];

  return (
    <section className="py-8">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          How the Social Services Application Works
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Four simple steps from application filing to official payout and ID releasing.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.stepNumber}
              className="relative rounded-2xl bg-[#0e172a]/90 border border-slate-800 p-5 hover:border-blue-500/40 hover:bg-[#111d36] transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Header Row: Icon & Large Step Number */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner ${step.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-extrabold text-slate-600 font-mono group-hover:text-blue-400/80 transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Card Title */}
                <h4 className="text-sm font-bold text-slate-100 mb-2 leading-snug">
                  {step.title}
                </h4>

                {/* Card Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-[11px] font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
