import React from 'react';
import { ServiceItem } from '../types';
import { 
  Stethoscope, 
  GraduationCap, 
  Cross, 
  Bus, 
  ShoppingBag, 
  Accessibility, 
  UserCheck, 
  Users, 
  Heart, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ServiceCatalogProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
  filterTitle?: string;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  onSelectService,
  filterTitle = "Available Social Services Programs"
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'medical': return Stethoscope;
      case 'education': return GraduationCap;
      case 'funeral': return Cross;
      case 'transport': return Bus;
      case 'food': return ShoppingBag;
      case 'pwd': return Accessibility;
      case 'senior': return UserCheck;
      case 'soloparent': return Users;
      case 'child': return Heart;
      case 'livelihood': return Briefcase;
      default: return ShieldAlert;
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {filterTitle}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Select a service to view qualifications, required documents, or file your digital application.
          </p>
        </div>
        <span className="text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-full font-mono border border-slate-700">
          {services.length} Programs Found
        </span>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 bg-[#0e172a]/60 border border-slate-800 rounded-2xl p-6">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-200">No Services Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or filter category above to browse available programs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = getIcon(service.iconName);
            return (
              <div
                key={service.id}
                className="group relative bg-[#0e172a]/90 border border-slate-800/90 hover:border-blue-500/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Category */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-900/50 text-blue-300 border border-blue-600/40 px-2.5 py-0.5 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                    {service.title}
                  </h4>

                  {/* Benefit / Amount if present */}
                  {service.benefitAmount && (
                    <div className="text-xs font-semibold text-amber-400 mb-2.5 flex items-center gap-1.5">
                      <span className="bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {service.benefitAmount}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Requirements List Preview */}
                  <div className="space-y-1.5 mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Required Documents:
                    </span>
                    {service.requirements.slice(0, 2).map((req, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                    {service.requirements.length > 2 && (
                      <span className="text-[10px] text-blue-400 pl-4 block font-medium">
                        +{service.requirements.length - 2} more requirements
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Est. {service.processingTime}
                  </span>
                  <button
                    onClick={() => onSelectService(service)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-white bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>Apply / Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
