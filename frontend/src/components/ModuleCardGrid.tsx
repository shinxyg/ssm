import React from 'react';

interface ModuleCard {
  title: string;
  description: string;
  requirements?: string[];
  processingTime?: string;
  benefitAmount?: string;
}

interface ModuleCardGridProps {
  activeTab: string;
  onApply: (title: string, description: string) => void;
  darkMode?: boolean;
}

export const ModuleCardGrid: React.FC<ModuleCardGridProps> = ({ activeTab, onApply, darkMode = true }) => {
  const getCardsForTab = (): { cards: ModuleCard[]; maxCols: string } => {
    switch (activeTab) {
      case 'aics':
        return {
          maxCols: 'grid-cols-1 md:grid-cols-3',
          cards: [
            {
              title: 'Educational Assistance - Children with Disability',
              description:
                'This program provides financial assistance to individuals with disabilities and qualified students to support educational expenses and tuition. The aid amount is P5,000 for each qualified beneficiary.',
            },
            {
              title: 'Burial / Funeral Assistance',
              description:
                'The Funeral and Burial Assistance Program under Ordinance 2865 S-2019 provides financial aid through a Certificate of Guarantee to accredited partner funeral homes, covering service packages up to Php25,000.',
            },
            {
              title: 'Medical Assistance',
              description:
                'The Medical Assistance Program safeguards the health of residents unable to meet medical needs, providing financial or medical support for hospitalization, laboratory examinations, medicines, and supplies.',
            },
          ],
        };

      case 'pwd':
        return {
          maxCols: 'grid-cols-1 max-w-2xl mx-auto',
          cards: [
            {
              title: 'PWD Social Assistance Program',
              description:
                'The PWD Social Assistance Program provides specialized financial aid, healthcare subsidies, assistive devices (wheelchairs, crutches, walkers), and emergency social safety nets for indigent Persons with Disabilities and their families to address disability-related vulnerabilities.',
            },
          ],
        };

      case 'senior':
        return {
          maxCols: 'grid-cols-1 max-w-2xl mx-auto',
          cards: [
            {
              title: 'Senior Citizen Social Assistance Program',
              description:
                'The Senior Citizen Social Assistance Program provides specialized financial aid, healthcare subsidies, and emergency social safety nets for indigent Senior Citizens and their families to address senior-related vulnerabilities.',
            },
          ],
        };

      case 'soloparent':
        return {
          maxCols: 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto',
          cards: [
            {
              title: 'Solo Parent Financial Subsidy Program',
              description:
                'SOLO PARENT SECTOR: Qualified applicants may receive financial subsidy. For qualified Solo Parents who meet the applicable income and program requirements. Eligibility is subject to document verification and assessment before approval.',
            },
            {
              title: 'Solo Parent Educational Assistance Program',
              description:
                "Educational financial assistance for indigent solo parents' dependent children/beneficiaries who are currently studying. The program includes solo parents with two (2) or more children enrolled in public school, providing financial assistance of P5,000 per qualified beneficiary, subject to interview and social worker assessment prior to granting assistance.",
            },
          ],
        };

      case 'childwelfare':
        return {
          maxCols: 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto',
          cards: [
            {
              title: 'Educational Assistance for Indigent Children & Youth',
              description:
                "Provides educational and financial aid support for indigent children & youth, solo parents' children/beneficiaries, and children with disabilities (CWD) residing in Quezon City.",
            },
            {
              title: 'Child Welfare Services',
              description:
                'Comprehensive care, protection, and developmental welfare services dedicated to ensuring the well-being and rights of children and youth in Quezon City.',
            },
          ],
        };

      case 'livelihood':
      case 'livelihood-grants':
        return {
          maxCols: 'grid-cols-1 max-w-2xl mx-auto',
          cards: [
            {
              title: 'Livelihood Micro-Enterprise Seed Capital',
              description:
                'Capital grant up to P15,000 for starting small sari-sari store, carwash, tailoring, or food vending business for qualified beneficiaries.',
            },
          ],
        };

      case 'skills-training':
        return {
          maxCols: 'grid-cols-1 max-w-2xl mx-auto',
          cards: [
            {
              title: 'Skills & Vocational Training Program',
              description:
                'Free skills and vocational training courses (TESDA Accredited) including Bread & Pastry, Computer Hardware Servicing, Caregiving, and Electrical Installation.',
            },
          ],
        };

      case 'payout':
        return {
          maxCols: 'grid-cols-1 max-w-2xl mx-auto',
          cards: [
            {
              title: 'Financial Aid Disbursement & QR Voucher Claim',
              description:
                'Claim approved financial grants via GCash, Maya, Landbank payout, or present QR voucher at partner city treasury counters.',
            },
          ],
        };

      default:
        return { cards: [], maxCols: 'grid-cols-1' };
    }
  };

  const { cards, maxCols } = getCardsForTab();

  if (cards.length === 0) return null;

  return (
    <div className="py-6 px-2">
      <div className={`grid ${maxCols} gap-6 items-stretch`}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
              darkMode 
                ? 'bg-[#0f1b35] border-blue-900/40 hover:border-blue-500/50' 
                : 'bg-white border-slate-200 hover:border-blue-400 shadow-slate-200/50'
            }`}
          >
            <div>
              {/* Top Banner Header of Card */}
              <div className={`border-b px-5 py-4 text-center ${
                darkMode ? 'bg-[#1b345d] border-blue-800/40' : 'bg-blue-50 border-blue-100'
              }`}>
                <h3 className={`text-sm sm:text-base font-extrabold leading-snug tracking-wide ${
                  darkMode ? 'text-white' : 'text-blue-950'
                }`}>
                  {card.title}
                </h3>
              </div>

              {/* Card Body Text */}
              <div className="p-6 text-center">
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {card.description}
                </p>
              </div>
            </div>

            {/* Bottom Centered APPLY NOW Button */}
            <div className="pb-6 pt-2 text-center">
              <button
                type="button"
                onClick={() => onApply(card.title, card.description)}
                className={`font-extrabold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-1.5 hover:underline transition-colors ${
                  darkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-blue-600 group-hover:text-blue-700'
                }`}
              >
                APPLY NOW
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
