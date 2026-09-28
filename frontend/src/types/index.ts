export interface ServiceItem {
  id: string;
  title: string;
  category: 'aics' | 'pwd' | 'senior' | 'soloparent' | 'child' | 'livelihood' | 'payout';
  description: string;
  requirements: string[];
  processingTime: string;
  benefitAmount?: string;
  iconName?: string;
  badge?: string;
}

export interface ApplicationRecord {
  referenceNo: string;
  serviceName: string;
  category: string;
  dateSubmitted: string;
  status: 'Approved' | 'Under Review' | 'Pending Documents' | 'Ready for Payout';
  amountOrType: string;
  assignedSocialWorker: string;
}
