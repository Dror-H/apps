import { BillingsDetails } from '@instigo-app/data-transfer-object';

export interface User {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  id: string;
  profilePicture: string;
  isAdmin: boolean;
  adAccounts: AdAccount[];
  createdAt: string;
  lastLogin: string;
  billing: BillingsDetails;
  stripeSubscriptionId: string;
}

export interface AdAccount {
  adsetId: string;
  businessCity: string;
  businessCountryCode: string;
  businessId: string;
  businessName: string;
  businessProfilePicture: string;
  businessZip: string;
  campaignId: string;
  createdAt: string;
  currency: string;
  id: string;
  name: string;
  provider: string;
  status: string;
  minDailyBudget: 476;
  synchronized: boolean;
}
