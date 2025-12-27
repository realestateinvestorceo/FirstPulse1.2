
export type Role = 'admin' | 'partner' | 'investor';

export enum ClientStatus {
  Onboarding = 'Onboarding',
  Active = 'Active',
  Paused = 'Paused',
  Cancelled = 'Cancelled'
}

export enum SubscriptionTier {
  FRESH_ONLY = 'FRESH_ONLY',
  FOCUSED = 'FOCUSED',
  EXPANSION = 'EXPANSION',
  DOMINANCE = 'DOMINANCE'
}

export type Lane = 'Blitz' | 'Chase' | 'Nurture';

export enum TrackingStatus {
  Active = 'Active',
  CoolingDown = 'CoolingDown',
  Removed_Sold = 'Removed_Sold',
  Removed_Listed = 'Removed_Listed',
  Suppressed = 'Suppressed',
  ContactConstrained = 'ContactConstrained'
}

export type SourceType = 'Fresh' | 'Repeat' | 'Queue';

export type SuppressionType = 'address' | 'phone' | 'owner_name';

export enum BatchStatus {
  Generated = 'Generated',
  Downloaded = 'Downloaded',
  Archived = 'Archived'
}

export interface User {
  id: number;
  email: string;
  role: Role;
  partnerId?: number;
  clientId?: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  partnerId: number;
  name: string;
  email: string;
  companyName: string;
  clientStatus: ClientStatus;
  subscriptionTier: SubscriptionTier;
  weeklyCapacity: number;
  skipTraceWalletBalance: number;
  skipTraceAutoRecharge: boolean;
  skipTraceRechargeThreshold: number;
  stripeCustomerId?: string;
  cycleDay?: string; // e.g., 'Monday'
  cycleTime?: string; // e.g., '09:00'
  firstBatchGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: number;
  clientId?: number;
  ownerId?: number;
  fips: string;
  addressLine1: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  propertyType?: string; // Added for Buy Box filtering
  tags: string[]; // Comma-separated in DB, array in frontend
  estimatedValue: number;
  equityPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  clientId?: number;
  fullName: string;
  ownerType: 'Individual' | 'Trust' | 'LLC';
  addressLine1: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkipTrace {
  id: number;
  contactId: number;
  clientId: number;
  phone1: string;
  phone1Type: string;
  phone2?: string;
  phone2Type?: string;
  phone3?: string;
  phone3Type?: string;
  email1?: string;
  provider: string;
  cost: number;
  createdAt: string;
}

export interface DistressSignal {
  id: number;
  signalKey: string;
  displayName: string;
  description?: string;
  baseConversionRate: number;
  defaultLane: Lane;
  isTimeSensitive: boolean;
  isActive: boolean;
}

export interface ClientRecordTracking {
  id: number;
  clientId: number;
  propertyId: number;
  lane: Lane;
  status: TrackingStatus;
  baseScore: number;
  effectiveScore: number;
  finalAllocationPoints: number;
  touchCount: number;
  lastTouchAt?: string;
  nextEligibleAt?: string;
  cooldownStartAt?: string;
  cooldownEndAt?: string;
  skipTracedAt?: string;
  sourceType: SourceType;
  createdAt: string;
  updatedAt: string;
}

export interface SuppressionList {
  id: number;
  clientId: number;
  fileName: string;
  suppressionType: SuppressionType;
  recordCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface WeeklyBatch {
  id: number;
  clientId: number;
  batchId: string;
  weekStart: string;
  weekEnd: string;
  totalRecords: number;
  freshCount: number;
  repeatCount: number;
  queueCount: number;
  blitzCount: number;
  chaseCount: number;
  nurtureCount: number;
  skipTraceCount: number;
  skipTraceCost: number;
  duplicateContactsAvoided: number;
  status: BatchStatus;
  generatedAt: string;
  firstDownloadAt?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BatchRecord {
  id: number;
  batchId: number; // FK to WeeklyBatch
  propertyId: number;
  clientRecordTrackingId: number;
  sourceType: SourceType;
  lane: Lane;
  finalAllocationPoints: number;
  touchCountAtAllocation: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  clientId: number;
  protocolEvent: string;
  settlementAmount: number;
  timestamp: string;
}

export interface County {
  fips: string;
  name: string;
  state: string;
  stateCode: string;
  population: number;
  status: 'Active' | 'Inactive' | 'Pending';
  activeClients: number;
  lastDataPull: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemDefault {
  id: number;
  settingKey: string;
  settingValue: string;
  dataType: 'number' | 'string' | 'boolean';
  description: string;
  updatedAt: string;
}

export interface PartnerConfiguration {
  id: number;
  partnerId: number;
  settingKey: string;
  settingValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientSettings {
  clientId: number;
  buyBox: {
    counties: string[];
    propertyTypes: string[];
    maxPrice: number;
    minEquity: number;
    excludedZips: string;
  };
  cadence: {
    blitzDays: number;
    blitzMaxTouches: number;
    chaseDays: number;
    chaseMaxTouches: number;
    nurtureDays: number;
    nurtureMaxTouches: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}