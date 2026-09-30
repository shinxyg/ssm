import type { ServiceItem, ApplicationRecord } from '../types';

export const initialServices: ServiceItem[] = [
  // AICS Services
  {
    id: 'aics-medical',
    title: 'AICS Medical & Hospitalization Guarantee Letter',
    category: 'aics',
    description: 'Financial assistance for hospital billing, chemotherapy, dialysis treatments, and specialty laboratory procedures for indigent citizens.',
    requirements: [
      'Certificate of Indigency from Barangay',
      'Clinical Abstract / Medical Certificate with Doctor Sign & License',
      'Hospital Statement of Account / Billing Statement',
      'Valid Government Issued Photo ID (PhilSys / Comelec / Driver License)'
    ],
    processingTime: '1 - 2 Business Days',
    benefitAmount: 'Up to ₱50,000 Guarantee Letter',
    iconName: 'medical',
    badge: 'Urgent Aid'
  },
  {
    id: 'aics-medicine',
    title: 'AICS Outpatient Medicine Financial Grant',
    category: 'aics',
    description: 'Direct cash grant or pharmacy voucher for expensive maintenance medicines, prescription drugs, and medical supplies.',
    requirements: [
      'Doctor Prescription (stamped within last 3 months)',
      'Certificate of Indigency',
      'Valid ID of Patient or Authorized Representative'
    ],
    processingTime: 'Same-day Processing',
    benefitAmount: 'Up to ₱10,000 Direct Voucher',
    iconName: 'medical',
    badge: 'Same-Day'
  },
  {
    id: 'aics-funeral',
    title: 'AICS Funeral & Burial Financial Assistance',
    category: 'aics',
    description: 'Financial aid to defray casket costs, embalming, cremation, and cemetery burial expenses for deceased indigent family members.',
    requirements: [
      'Registered Death Certificate',
      'Funeral Contract / Official Receipt',
      'Certificate of Indigency of Claimant',
      'Proof of Relationship (Birth/Marriage Certificate)'
    ],
    processingTime: '24 Hours',
    benefitAmount: '₱10,000 - ₱20,000 Cash Assistance',
    iconName: 'funeral',
    badge: 'Priority'
  },
  {
    id: 'aics-educational',
    title: 'AICS Educational Financial Aid',
    category: 'aics',
    description: 'Stipend for enrolled elementary, high school, vocational, and college students belonging to low-income households.',
    requirements: [
      'School ID / Enrollment Verification Certificate',
      'Certificate of Indigency of Parent/Guardian',
      'Statement of Tuition Fees or School Materials List'
    ],
    processingTime: '3 - 5 Business Days',
    benefitAmount: '₱1,000 - ₱5,000 per Student',
    iconName: 'education'
  },
  {
    id: 'aics-food-emergency',
    title: 'Emergency Food & Disaster Assistance',
    category: 'aics',
    description: 'Emergency relief pack, food vouchers, and shelter repair assistance for families affected by typhoon, fire, or calamity.',
    requirements: [
      'Barangay Calamity / Fire Certificate',
      'Government ID / PhilSys'
    ],
    processingTime: 'Immediate Release',
    benefitAmount: 'Food Packs & ₱5,000 Shelter Aid',
    iconName: 'food',
    badge: 'Emergency'
  },
  {
    id: 'aics-transport',
    title: 'AICS Transportation Assistance',
    category: 'aics',
    description: 'Financial assistance for strandees returning to their home provinces or medical travel to regional hospitals.',
    requirements: [
      'Police / Barangay Clearance',
      'Travel Referral / Medical Appointment Form',
      'Valid Photo ID'
    ],
    processingTime: 'Same-day Processing',
    benefitAmount: 'Full Bus/Ferry/Flight Voucher',
    iconName: 'transport'
  },

  // PWD Services
  {
    id: 'pwd-id-issuance',
    title: 'PWD ID Card Issuance & Renewal',
    category: 'pwd',
    description: 'Official Person with Disability (PWD) Identification Card conferring 20% discount on medicines, transportation, and groceries.',
    requirements: [
      'Medical Certificate signed by licensed physician detailing disability type',
      'Two (2) 1x1 1x1 ID Photos on White Background',
      'Barangay Certificate of Residency',
      'Valid Government ID'
    ],
    processingTime: '3 Business Days',
    benefitAmount: '20% Discount + 12% VAT Exemption',
    iconName: 'pwd',
    badge: 'Official ID'
  },
  {
    id: 'pwd-assistive-devices',
    title: 'PWD Mobility & Assistive Devices Grant',
    category: 'pwd',
    description: 'Free provision of wheelchairs, crutches, hearing aids, and walking canes for indigent PWD citizens.',
    requirements: [
      'Valid PWD ID',
      'Doctor recommendation for mobility device',
      'Certificate of Indigency'
    ],
    processingTime: '5 - 7 Business Days',
    benefitAmount: 'Free Wheelchair / Hearing Aid',
    iconName: 'pwd'
  },

  // Senior Citizen Services
  {
    id: 'senior-social-pension',
    title: 'Senior Citizen Social Pension (₱1,000/month)',
    category: 'senior',
    description: 'Quarterly financial stipend for indigent senior citizens 60 years old and above who have no regular income or pension.',
    requirements: [
      'Senior Citizen ID Card',
      'OSCA Clearance Certificate',
      'Barangay Certificate of Non-Employment / Indigency'
    ],
    processingTime: 'Quarterly Disbursement',
    benefitAmount: '₱3,000 Quarterly Cash Payout',
    iconName: 'senior',
    badge: 'Monthly Pension'
  },
  {
    id: 'senior-booklet',
    title: 'Senior Citizen Medicine Purchase Booklet',
    category: 'senior',
    description: 'Official OSCA Medicine and Grocery booklet for claiming 20% discounts and mandatory drug store record tracking.',
    requirements: [
      'Senior ID Card',
      'Proof of Age (Birth Certificate / Passport / PhilSys)'
    ],
    processingTime: '1 Business Day',
    benefitAmount: 'Medicine Purchase Discount Log',
    iconName: 'senior'
  },

  // Solo Parent Services
  {
    id: 'soloparent-id',
    title: 'Solo Parent ID & Subsidy Benefit',
    category: 'soloparent',
    description: 'Comprehensive welfare card granting 7-day flexible work leave, educational scholarships, and monthly ₱1,000 rice allowance.',
    requirements: [
      'Affidavit of Solo Parent Status (Death Cert, Legal Separation, or Abandonment)',
      'Birth Certificate of Minor Children',
      'Barangay Residency Certificate (at least 6 months residency)'
    ],
    processingTime: '3 - 5 Business Days',
    benefitAmount: '₱1,000 Monthly Subsidy + 7-Day Leave',
    iconName: 'soloparent',
    badge: 'Welfare Card'
  },

  // Livelihood & Payouts
  {
    id: 'livelihood-grant',
    title: 'Sustainable Livelihood Micro-Enterprise Seed Capital',
    category: 'livelihood',
    description: 'Capital grant up to ₱15,000 for starting small sari-sari store, carwash, tailoring, or food vending business.',
    requirements: [
      'Simple Business Proposal / Idea Plan',
      'Barangay Business Clearance & Indigency',
      'Attendance in CSWD Livelihood Orientation Workshop'
    ],
    processingTime: '7 - 10 Business Days',
    benefitAmount: '₱15,000 Non-Collateral Seed Capital',
    iconName: 'livelihood',
    badge: 'Capital Grant'
  },
];

export const initialApplications: ApplicationRecord[] = [
  {
    referenceNo: 'AICS-2026-8841',
    serviceName: 'AICS Medical & Hospitalization Guarantee Letter',
    category: 'AICS',
    dateSubmitted: 'Sep 24, 2026',
    status: 'Ready for Payout',
    amountOrType: '₱25,000 Guarantee Letter',
    assignedSocialWorker: 'Social Worker Maria Santos, RSW',
  },
  {
    referenceNo: 'PWD-2026-4019',
    serviceName: 'PWD ID Card Issuance & Renewal',
    category: 'PWD',
    dateSubmitted: 'Sep 26, 2026',
    status: 'Approved',
    amountOrType: 'Official PWD Card #34-8891',
    assignedSocialWorker: 'Officer Arnaldo Cruz, OSCA',
  },
  {
    referenceNo: 'SEN-2026-1102',
    serviceName: 'Senior Citizen Social Pension (₱1,000/month)',
    category: 'SENIOR',
    dateSubmitted: 'Sep 28, 2026',
    status: 'Under Review',
    amountOrType: '₱3,000 Q3 Pension',
    assignedSocialWorker: 'Social Worker Elena Reyes, RSW',
  },
];
