
import { 
  User, Partner, Client, Property, Contact, 
  Role, ClientStatus, SubscriptionTier, AuthResponse,
  DistressSignal, ClientRecordTracking, Lane, TrackingStatus, SourceType,
  SuppressionList, Transaction, WeeklyBatch, BatchStatus, BatchRecord,
  County, SystemDefault, PartnerConfiguration, ClientSettings, SkipTrace
} from '../types';

/**
 * MOCK BACKEND SERVICE
 */

// --- US County Reference Data (Representative Sample of 3,143) ---
const ALL_US_COUNTIES = [
  { fips: '01001', name: 'Autauga County', stateCode: 'AL', state: 'Alabama' },
  { fips: '04013', name: 'Maricopa County', stateCode: 'AZ', state: 'Arizona' },
  { fips: '06001', name: 'Alameda County', stateCode: 'CA', state: 'California' },
  { fips: '06037', name: 'Los Angeles County', stateCode: 'CA', state: 'California' },
  { fips: '06059', name: 'Orange County', stateCode: 'CA', state: 'California' },
  { fips: '06071', name: 'San Bernardino County', stateCode: 'CA', state: 'California' },
  { fips: '06073', name: 'San Diego County', stateCode: 'CA', state: 'California' },
  { fips: '06075', name: 'San Francisco County', stateCode: 'CA', state: 'California' },
  { fips: '06085', name: 'Santa Clara County', stateCode: 'CA', state: 'California' },
  { fips: '12011', name: 'Broward County', stateCode: 'FL', state: 'Florida' },
  { fips: '12086', name: 'Miami-Dade County', stateCode: 'FL', state: 'Florida' },
  { fips: '12099', name: 'Palm Beach County', stateCode: 'FL', state: 'Florida' },
  { fips: '13089', name: 'DeKalb County', stateCode: 'GA', state: 'Georgia' },
  { fips: '13121', name: 'Fulton County', stateCode: 'GA', state: 'Georgia' },
  { fips: '17031', name: 'Cook County', stateCode: 'IL', state: 'Illinois' },
  { fips: '26163', name: 'Wayne County', stateCode: 'MI', state: 'Michigan' },
  { fips: '32003', name: 'Clark County', stateCode: 'NV', state: 'Nevada' },
  { fips: '36047', name: 'Kings County (Brooklyn)', stateCode: 'NY', state: 'New York' },
  { fips: '36061', name: 'New York County (Manhattan)', stateCode: 'NY', state: 'New York' },
  { fips: '36081', name: 'Queens County', stateCode: 'NY', state: 'New York' },
  { fips: '48029', name: 'Bexar County', stateCode: 'TX', state: 'Texas' },
  { fips: '48113', name: 'Dallas County', stateCode: 'TX', state: 'Texas' },
  { fips: '48201', name: 'Harris County', stateCode: 'TX', state: 'Texas' },
  { fips: '48439', name: 'Tarrant County', stateCode: 'TX', state: 'Texas' },
  { fips: '48453', name: 'Travis County', stateCode: 'TX', state: 'Texas' },
  { fips: '53033', name: 'King County', stateCode: 'WA', state: 'Washington' },
];

// Seed logic usually fills this, but we'll export it for the typeahead
export const getFullCountyRegistry = () => ALL_US_COUNTIES;

// --- Data Stores ---
let users: User[] = [];
let partners: Partner[] = [];
let clients: Client[] = [];
let properties: Property[] = [];
let contacts: Contact[] = [];
let distressSignals: DistressSignal[] = [];
let clientRecordTrackings: ClientRecordTracking[] = [];
let suppressionLists: SuppressionList[] = [];
let transactions: Transaction[] = [];
let weeklyBatches: WeeklyBatch[] = [];
let batchRecords: BatchRecord[] = [];
let counties: County[] = [];
let systemDefaults: SystemDefault[] = [];
let partnerConfigurations: PartnerConfiguration[] = [];
let clientSettingsStore: ClientSettings[] = [];
let skipTraces: SkipTrace[] = [];

// --- Seeding Logic ---
const TAG_OPTIONS = ['pre-foreclosure', 'foreclosure', 'probate', 'vacant', 'absentee', 'divorce', 'tax-sale', 'bankruptcy'];
const STREET_NAMES = ['Maple', 'Oak', 'Pine', 'Cedar', 'Elm', 'Washington', 'Lake', 'Hill', 'Main', 'Park', 'View', 'Highland'];
const PROPERTY_TYPES = ['Single Family', 'Multi-Family', 'Condo', 'Townhouse'];
const SEED_COUNTIES_CONFIG = [
  { city: 'Chicago', state: 'IL', zipBase: 60600 },
  { city: 'Houston', state: 'TX', zipBase: 77000 }
];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomTags = () => {
  const count = randomInt(1, 3);
  const shuffled = [...TAG_OPTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const seedDistressSignals = () => {
  distressSignals = [
    { id: 1, signalKey: 'foreclosure', displayName: 'Foreclosure', baseConversionRate: 0.0111, defaultLane: 'Blitz', isTimeSensitive: true, isActive: true },
    { id: 2, signalKey: 'pre-foreclosure', displayName: 'Pre-Foreclosure', baseConversionRate: 0.0095, defaultLane: 'Blitz', isTimeSensitive: true, isActive: true },
    { id: 3, signalKey: 'probate', displayName: 'Probate', baseConversionRate: 0.0092, defaultLane: 'Chase', isTimeSensitive: false, isActive: true },
    { id: 4, signalKey: 'tax-sale', displayName: 'Tax Sale', baseConversionRate: 0.0085, defaultLane: 'Blitz', isTimeSensitive: true, isActive: true },
    { id: 5, signalKey: 'vacant', displayName: 'Vacant', baseConversionRate: 0.0073, defaultLane: 'Chase', isTimeSensitive: false, isActive: true },
    { id: 6, signalKey: 'divorce', displayName: 'Divorce', baseConversionRate: 0.0068, defaultLane: 'Chase', isTimeSensitive: false, isActive: true },
    { id: 7, signalKey: 'absentee', displayName: 'Absentee Owner', baseConversionRate: 0.0046, defaultLane: 'Nurture', isTimeSensitive: false, isActive: true },
    { id: 8, signalKey: 'bankruptcy', displayName: 'Bankruptcy', baseConversionRate: 0.0085, defaultLane: 'Blitz', isTimeSensitive: true, isActive: true }
  ];
};

const seedCounties = () => {
  counties = [
    { fips: '17031', name: 'Cook County', state: 'Illinois', stateCode: 'IL', population: 5100000, status: 'Active', activeClients: 12, lastDataPull: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { fips: '48201', name: 'Harris County', state: 'Texas', stateCode: 'TX', population: 4700000, status: 'Active', activeClients: 8, lastDataPull: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { fips: '04013', name: 'Maricopa County', state: 'Arizona', stateCode: 'AZ', population: 4400000, status: 'Active', activeClients: 5, lastDataPull: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { fips: '06037', name: 'Los Angeles County', state: 'California', stateCode: 'CA', population: 9800000, status: 'Inactive', activeClients: 0, lastDataPull: new Date(Date.now() - 86400000 * 5).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
};

const seedSystemDefaults = () => {
  systemDefaults = [
    { id: 1, settingKey: 'blitz_days_between', settingValue: '14', dataType: 'number', description: 'Days between touches in Blitz lane', updatedAt: new Date().toISOString() },
    { id: 2, settingKey: 'blitz_max_touches', settingValue: '12', dataType: 'number', description: 'Maximum touches allowed in Blitz lane', updatedAt: new Date().toISOString() },
    { id: 3, settingKey: 'chase_days_between', settingValue: '30', dataType: 'number', description: 'Days between touches in Chase lane', updatedAt: new Date().toISOString() },
    { id: 4, settingKey: 'chase_max_touches', settingValue: '18', dataType: 'number', description: 'Maximum touches allowed in Chase lane', updatedAt: new Date().toISOString() },
    { id: 5, settingKey: 'nurture_days_between', settingValue: '45', dataType: 'number', description: 'Days between touches in Nurture lane', updatedAt: new Date().toISOString() },
    { id: 6, settingKey: 'nurture_max_touches', settingValue: '10', dataType: 'number', description: 'Maximum touches allowed in Nurture lane', updatedAt: new Date().toISOString() },
    { id: 7, settingKey: 'cooldown_duration_months', settingValue: '6', dataType: 'number', description: 'Duration of Cooldown period in months', updatedAt: new Date().toISOString() },
    { id: 8, settingKey: 'score_floor', settingValue: '0.10', dataType: 'number', description: 'Minimum score required to be eligible', updatedAt: new Date().toISOString() },
    { id: 9, settingKey: 'skip_trace_cost', settingValue: '0.06', dataType: 'number', description: 'Cost per skip trace execution', updatedAt: new Date().toISOString() },
  ];
};

const seedPartnerConfig = () => {
  partnerConfigurations = [
    { id: 1, partnerId: 101, settingKey: 'skip_trace_rate', settingValue: '0.12', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];
};

const seedClientSettings = () => {
  clientSettingsStore = [
    {
      clientId: 201,
      buyBox: {
        counties: ['17031'],
        propertyTypes: ['Single Family', 'Multi-Family'],
        maxPrice: 850000,
        minEquity: 30,
        excludedZips: '60621, 60636'
      },
      cadence: {
        blitzDays: 14, blitzMaxTouches: 12,
        chaseDays: 30, chaseMaxTouches: 18,
        nurtureDays: 45, nurtureMaxTouches: 10
      }
    },
    {
      clientId: 202,
      buyBox: {
        counties: ['48201'],
        propertyTypes: ['Single Family'],
        maxPrice: 450000,
        minEquity: 40,
        excludedZips: ''
      },
      cadence: {
        blitzDays: 14, blitzMaxTouches: 12,
        chaseDays: 30, chaseMaxTouches: 18,
        nurtureDays: 45, nurtureMaxTouches: 10
      }
    }
  ];
};

const randomTagsWithBias = (id: number) => {
  if (id === 99) return ['foreclosure', 'vacant'];
  return randomTags();
}

const runScoringEngine = () => {
  const investorId = 201;
  const targetProperties = properties;
  
  let trackingIdCounter = 1;

  clientRecordTrackings = targetProperties.map(property => {
    let baseScore = 0;
    let highestPriorityLane: Lane = 'Nurture';
    let hasBlitz = false;
    let hasChase = false;

    property.tags.forEach(tag => {
      const signal = distressSignals.find(s => s.signalKey === tag);
      if (signal) {
        baseScore += signal.baseConversionRate;
        if (signal.defaultLane === 'Blitz') hasBlitz = true;
        if (signal.defaultLane === 'Chase') hasChase = true;
      }
    });

    if (hasBlitz) highestPriorityLane = 'Blitz';
    else if (hasChase) highestPriorityLane = 'Chase';
    else highestPriorityLane = 'Nurture';

    const touchCount = 0; 
    const effectiveScore = baseScore * Math.pow(0.5, touchCount);

    const sources: SourceType[] = ['Fresh', 'Fresh', 'Fresh', 'Repeat', 'Queue'];
    const sourceType = randomPick(sources);

    return {
      id: trackingIdCounter++,
      clientId: investorId,
      propertyId: property.id,
      lane: highestPriorityLane,
      status: TrackingStatus.Active,
      baseScore: Number(baseScore.toFixed(4)),
      effectiveScore: Number(effectiveScore.toFixed(4)),
      finalAllocationPoints: Number((effectiveScore * 100).toFixed(2)),
      touchCount: touchCount,
      sourceType: sourceType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
  
  const cooldownIds = [5, 12, 18, 25];
  clientRecordTrackings.forEach(t => {
      if (cooldownIds.includes(t.propertyId)) {
          t.status = TrackingStatus.CoolingDown;
          t.cooldownStartAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString();
          t.cooldownEndAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 165).toISOString();
          t.touchCount = 12;
      }
  });

  const tracedPropId = 99;
  const tracedProp = properties.find(p => p.id === tracedPropId);
  const tracedTracking = clientRecordTrackings.find(t => t.propertyId === tracedPropId);
  if (tracedProp && tracedTracking) {
      tracedTracking.skipTracedAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString();
      skipTraces.push({
          id: 1,
          contactId: tracedProp.ownerId || 0,
          clientId: 201,
          phone1: '555-012-3456',
          phone1Type: 'Mobile',
          provider: 'MockProvider',
          cost: 0.12,
          createdAt: tracedTracking.skipTracedAt
      });
  }
};

export const initializeDatabase = () => {
  if (users.length > 0) return;

  users = [
    { id: 1, email: 'admin@firstpulse.ai', role: 'admin', firstName: 'System', lastName: 'Admin', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, email: 'partner@firstpulse.ai', role: 'partner', partnerId: 101, firstName: 'Alex', lastName: 'Partner', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, email: 'investor@firstpulse.ai', role: 'investor', clientId: 201, firstName: 'Sarah', lastName: 'Investor', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, email: 'mike@flip.com', role: 'investor', clientId: 202, firstName: 'Mike', lastName: 'Flipper', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  partners = [
    { id: 101, name: 'Growth Marketing LLC', email: 'alex@growth.com', phone: '555-0101', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  clients = [
    {
      id: 201, partnerId: 101, name: 'Sarah Investor', email: 'sarah@inv.com', companyName: 'Windy City Homes',
      clientStatus: ClientStatus.Active, subscriptionTier: SubscriptionTier.EXPANSION,
      weeklyCapacity: 500, skipTraceWalletBalance: 425.50,
      skipTraceAutoRecharge: true, skipTraceRechargeThreshold: 50.00, stripeCustomerId: 'cus_123456',
      cycleDay: 'Monday', cycleTime: '08:00',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      id: 202, partnerId: 101, name: 'Mike Flipper', email: 'mike@flip.com', companyName: 'Lone Star Properties',
      clientStatus: ClientStatus.Onboarding, subscriptionTier: SubscriptionTier.FRESH_ONLY,
      weeklyCapacity: 100, skipTraceWalletBalance: 0.00,
      skipTraceAutoRecharge: false, skipTraceRechargeThreshold: 25.00,
      cycleDay: 'Tuesday', cycleTime: '09:00',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }
  ];

  for (let i = 1; i <= 100; i++) {
    const loc = randomPick(SEED_COUNTIES_CONFIG);
    const ownerId = randomInt(1, 20);
    properties.push({
      id: i,
      clientId: i % 3 === 0 ? 201 : 202,
      ownerId: ownerId,
      fips: loc.state === 'IL' ? '17031' : '48201',
      addressLine1: `${randomInt(100, 9999)} ${randomPick(STREET_NAMES)} ${randomPick(['St', 'Ave', 'Blvd', 'Dr'])}`,
      addressCity: loc.city,
      addressState: loc.state,
      addressPostalCode: (loc.zipBase + randomInt(1, 99)).toString(),
      propertyType: randomPick(PROPERTY_TYPES),
      tags: i === 99 ? ['foreclosure', 'vacant'] : randomTags(),
      estimatedValue: randomInt(150000, 850000),
      equityPercent: randomInt(10, 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  for (let i = 1; i <= 20; i++) {
    const loc = randomPick(SEED_COUNTIES_CONFIG);
    contacts.push({
      id: i,
      clientId: 201,
      fullName: `Contact Owner ${i}`,
      ownerType: randomPick(['Individual', 'Trust', 'LLC']),
      addressLine1: `${randomInt(100, 9999)} ${randomPick(STREET_NAMES)} ${randomPick(['St', 'Ave'])}`,
      addressCity: loc.city,
      addressState: loc.state,
      addressPostalCode: (loc.zipBase + randomInt(1, 99)).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  seedDistressSignals();
  seedCounties();
  seedSystemDefaults();
  seedPartnerConfig();
  seedClientSettings();
  runScoringEngine();

  suppressionLists = [
    { id: 1, clientId: 201, fileName: 'Do Not Call - Global.csv', suppressionType: 'phone', recordCount: 8200, isActive: true, createdAt: new Date().toISOString() },
    { id: 2, clientId: 201, fileName: 'Litigator Scrub.csv', suppressionType: 'owner_name', recordCount: 450, isActive: true, createdAt: new Date().toISOString() },
    { id: 3, clientId: 201, fileName: 'Previous Buyers.csv', suppressionType: 'address', recordCount: 3753, isActive: true, createdAt: new Date().toISOString() }
  ];

  transactions = [
    { id: 1, clientId: 201, protocolEvent: "INITIAL WALLET LOADING", settlementAmount: 425.50, timestamp: "2025-12-20T02:38:00" }
  ];

  weeklyBatches = [
    {
      id: 1,
      clientId: 201,
      batchId: '201-2025-51',
      weekStart: '2025-12-15',
      weekEnd: '2025-12-21',
      totalRecords: 10,
      freshCount: 3,
      repeatCount: 7,
      queueCount: 50,
      blitzCount: 2,
      chaseCount: 4,
      nurtureCount: 4,
      skipTraceCount: 3,
      skipTraceCost: 0.36,
      duplicateContactsAvoided: 45,
      status: BatchStatus.Downloaded,
      generatedAt: '2025-12-16T08:00:00',
      firstDownloadAt: '2025-12-16T08:00:00',
      downloadCount: 1,
      createdAt: '2025-12-16T08:00:00',
      updatedAt: '2025-12-16T08:00:00'
    }
  ];
};

// --- Mock API Methods ---

export const api = {
  login: async (email: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return { token: `fake-jwt-token-${user.id}-${Date.now()}`, user };
  },

  getStats: async () => {
    return { userCount: users.length, partnerCount: partners.length, clientCount: clients.length, propertyCount: properties.length };
  },

  getInvestorStats: async (clientId: number) => {
      const tracks = clientRecordTrackings.filter(t => t.clientId === clientId);
      const active = tracks.filter(t => t.status === TrackingStatus.Active).length;
      const cooldown = tracks.filter(t => t.status === TrackingStatus.CoolingDown).length;
      const removed = tracks.filter(t => t.status.toString().includes('Removed')).length;
      return { active, cooldown, removed };
  },
  
  getPartners: async () => partners,
  getAllClients: async () => clients,
  getCounties: async () => counties,

  // High performance search for provisioning
  searchFullCountyRegistry: async (query: string) => {
    const q = query.toLowerCase();
    return ALL_US_COUNTIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.state.toLowerCase().includes(q) || 
      c.fips.includes(q)
    ).slice(0, 10);
  },

  provisionTerritory: async (fips: string) => {
    const existing = counties.find(c => c.fips === fips);
    if (existing) return existing;

    const ref = ALL_US_COUNTIES.find(c => c.fips === fips);
    if (!ref) throw new Error("Invalid FIPS code");

    const newCounty: County = {
      ...ref,
      population: 0,
      status: 'Pending',
      activeClients: 1,
      lastDataPull: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    counties.push(newCounty);
    return newCounty;
  },

  getSystemDefaults: async () => systemDefaults,

  updateSystemDefault: async (id: number, value: string) => {
    const def = systemDefaults.find(d => d.id === id);
    if (def) {
      def.settingValue = value;
      def.updatedAt = new Date().toISOString();
    }
    return def;
  },
  
  updateDistressSignal: async (id: number, updates: Partial<DistressSignal>) => {
    const signal = distressSignals.find(s => s.id === id);
    if (signal) Object.assign(signal, updates);
    return signal;
  },

  getPartnerConfig: async (partnerId: number) => partnerConfigurations.filter(c => c.partnerId === partnerId),

  updatePartnerConfig: async (partnerId: number, key: string, value: string) => {
    const existing = partnerConfigurations.find(c => c.partnerId === partnerId && c.settingKey === key);
    if (existing) {
      existing.settingValue = value;
      existing.updatedAt = new Date().toISOString();
      return existing;
    } else {
      const newConfig = { id: partnerConfigurations.length + 1, partnerId, settingKey: key, settingValue: value, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      partnerConfigurations.push(newConfig);
      return newConfig;
    }
  },

  getClientSettings: async (clientId: number) => {
    const settings = clientSettingsStore.find(s => s.clientId === clientId);
    return settings || {
      clientId,
      buyBox: { counties: [], propertyTypes: [], maxPrice: 500000, minEquity: 30, excludedZips: '' },
      cadence: { blitzDays: 14, blitzMaxTouches: 12, chaseDays: 30, chaseMaxTouches: 18, nurtureDays: 45, nurtureMaxTouches: 10 }
    };
  },

  updateClientSettings: async (clientId: number, updates: Partial<ClientSettings>) => {
    const index = clientSettingsStore.findIndex(s => s.clientId === clientId);
    if (index >= 0) {
      clientSettingsStore[index] = { ...clientSettingsStore[index], ...updates };
      return clientSettingsStore[index];
    }
    return null;
  },

  impersonateClient: async (clientId: number) => {
    const user = users.find(u => u.clientId === clientId);
    if (!user) throw new Error("Client user not found");
    return { token: `fake-impersonation-token-${user.id}-${Date.now()}`, user };
  },

  generateWeeklyBatch: async (clientId: number) => {
     console.log(`[GenerateBatch] Starting for clientId: ${clientId}`);
     await new Promise(resolve => setTimeout(resolve, 1500));
     const client = clients.find(c => c.id === clientId);
     if (!client) throw new Error("Client not found");
     const settings = await api.getClientSettings(clientId);
     const allProperties = properties;

     const eligibleProperties = allProperties.filter(p => {
        if (settings.buyBox.counties.length > 0 && !settings.buyBox.counties.includes(p.fips)) return false;
        if (p.estimatedValue > settings.buyBox.maxPrice) return false;
        if (p.equityPercent < settings.buyBox.minEquity) return false;
        if (settings.buyBox.propertyTypes.length > 0 && p.propertyType && !settings.buyBox.propertyTypes.includes(p.propertyType)) return false;
        if (settings.buyBox.excludedZips && settings.buyBox.excludedZips.includes(p.addressPostalCode)) return false;
        return true;
     });

     const trackedRecords: ClientRecordTracking[] = [];
     const now = new Date();
     
     eligibleProperties.forEach(prop => {
        let tracking = clientRecordTrackings.find(t => t.clientId === clientId && t.propertyId === prop.id);
        let baseScore = 0;
        let lane: Lane = 'Nurture';
        let hasBlitz = false, hasChase = false;
        
        prop.tags.forEach(tag => {
           const signal = distressSignals.find(s => s.signalKey === tag);
           if (signal) {
               baseScore += signal.baseConversionRate;
               if (signal.defaultLane === 'Blitz') hasBlitz = true;
               if (signal.defaultLane === 'Chase') hasChase = true;
           }
        });

        if (hasBlitz) lane = 'Blitz';
        else if (hasChase) lane = 'Chase';
        
        if (!tracking) {
            tracking = { id: clientRecordTrackings.length + 1, clientId, propertyId: prop.id, lane, status: TrackingStatus.Active, baseScore, effectiveScore: baseScore, finalAllocationPoints: baseScore * 100, touchCount: 0, sourceType: 'Fresh', createdAt: now.toISOString(), updatedAt: now.toISOString() };
            clientRecordTrackings.push(tracking);
        } else {
            tracking.baseScore = baseScore;
            tracking.lane = lane;
            tracking.effectiveScore = baseScore * Math.pow(0.5, tracking.touchCount);
            tracking.finalAllocationPoints = tracking.effectiveScore * 100;
        }

        if (tracking.status === TrackingStatus.CoolingDown) {
            if (tracking.cooldownEndAt && new Date(tracking.cooldownEndAt) <= now) {
                tracking.status = TrackingStatus.Active;
                tracking.cooldownStartAt = undefined;
                tracking.cooldownEndAt = undefined;
                tracking.touchCount = 0;
            }
        }

        if (tracking.status === TrackingStatus.Active) {
            let maxTouches = 10;
            if (tracking.lane === 'Blitz') maxTouches = settings.cadence.blitzMaxTouches;
            if (tracking.lane === 'Chase') maxTouches = settings.cadence.chaseMaxTouches;
            if (tracking.lane === 'Nurture') maxTouches = settings.cadence.nurtureMaxTouches;

            const scoreFloor = 0.10;
            
            if (tracking.touchCount >= maxTouches || tracking.finalAllocationPoints < scoreFloor) {
                tracking.status = TrackingStatus.CoolingDown;
                tracking.cooldownStartAt = now.toISOString();
                const endDate = new Date(now);
                endDate.setMonth(endDate.getMonth() + 6);
                tracking.cooldownEndAt = endDate.toISOString();
            }
        }
        trackedRecords.push(tracking);
     });

     const candidates = trackedRecords.filter(t => t.status === TrackingStatus.Active && (t.touchCount === 0 || (t.nextEligibleAt && new Date(t.nextEligibleAt) <= now)));
     const recordsByOwner = new Map<number, ClientRecordTracking[]>();
     candidates.forEach(record => {
       const prop = properties.find(p => p.id === record.propertyId);
       const ownerId = prop?.ownerId || 0;
       if (!recordsByOwner.has(ownerId)) recordsByOwner.set(ownerId, []);
       recordsByOwner.get(ownerId)!.push(record);
     });

     const finalSelection: ClientRecordTracking[] = [];
     recordsByOwner.forEach((records) => {
         records.sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints);
         finalSelection.push(records[0]);
     });

     finalSelection.sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints);
     const batchRecordsList = finalSelection.slice(0, client.weeklyCapacity);
     if (batchRecordsList.length === 0) throw new Error("No eligible records found");

     const weekNum = Math.floor(now.getDate() / 7) + 1;
     const newBatch: WeeklyBatch = {
        id: weeklyBatches.length + 1, clientId, batchId: `${clientId}-${now.getFullYear()}-W${weekNum}-${Date.now()}`,
        weekStart: now.toISOString().split('T')[0], weekEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalRecords: batchRecordsList.length, freshCount: batchRecordsList.filter(r => r.touchCount === 0).length,
        repeatCount: batchRecordsList.filter(r => r.touchCount > 0).length, queueCount: candidates.length - batchRecordsList.length,
        blitzCount: batchRecordsList.filter(r => r.lane === 'Blitz').length, chaseCount: batchRecordsList.filter(r => r.lane === 'Chase').length,
        nurtureCount: batchRecordsList.filter(r => r.lane === 'Nurture').length, skipTraceCount: 0, skipTraceCost: 0,
        duplicateContactsAvoided: candidates.length - finalSelection.length, status: BatchStatus.Generated, generatedAt: now.toISOString(), downloadCount: 0, createdAt: now.toISOString(), updatedAt: now.toISOString()
     };
     weeklyBatches.push(newBatch);
     
     // Persistence check: batch records are not strictly persisted in an IDs array in this mock but we identify the batch by status 'Generated'
     if (!client.firstBatchGeneratedAt) client.firstBatchGeneratedAt = now.toISOString();
     console.log(`[GenerateBatch] Batch ${newBatch.batchId} created with ${newBatch.totalRecords} records.`);
     return newBatch;
  },

  getBatchSkipTraceEstimates: async (clientId: number) => {
      console.log(`[Estimates] Calculating for clientId: ${clientId}`);
      const client = clients.find(c => c.id === clientId);
      if (!client) {
          console.warn(`[Estimates] Client ${clientId} not found.`);
          return { eligibleCount: 0, alreadyTracedCount: 0, rate: 0.06, totalCost: 0 };
      }

      const partnerConfigs = await api.getPartnerConfig(client.partnerId || 0);
      const rateStr = partnerConfigs.find(c => c.settingKey === 'skip_trace_rate')?.settingValue;
      const rate = rateStr ? parseFloat(rateStr) : 0.06;

      // Find the specific 'Generated' batch records.
      // In the real system, batch_records links properties to a batch.
      // In this mock, we re-run the selection logic to identify which records would be in the current generated batch.
      const batch = weeklyBatches
        .filter(b => b.clientId === clientId && b.status === BatchStatus.Generated)
        .sort((a, b) => b.id - a.id)[0];
      
      const targetCount = batch ? batch.totalRecords : client.weeklyCapacity;
      console.log(`[Estimates] Target record count for estimation: ${targetCount} (Source: ${batch ? 'Batch' : 'Capacity Fallback'})`);

      // Selection logic matching generateWeeklyBatch
      const activeTracks = clientRecordTrackings
        .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
        .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
        .slice(0, targetCount);

      if (activeTracks.length === 0) {
          console.warn(`[Estimates] No active tracks found for client ${clientId}. Pool empty.`);
          return { 
            eligibleCount: 0, 
            alreadyTracedCount: 0, 
            rate, 
            totalCost: 0 
          };
      }

      const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 180);
      const eligibleRecords = activeTracks.filter(t => !t.skipTracedAt || new Date(t.skipTracedAt) < sixMonthsAgo);
      const eligibleCount = eligibleRecords.length;
      const alreadyTracedCount = activeTracks.length - eligibleCount;

      const result = { 
        eligibleCount, 
        alreadyTracedCount: Math.max(0, alreadyTracedCount), 
        rate, 
        totalCost: Number((eligibleCount * rate).toFixed(2))
      };
      console.log(`[Estimates] Calculation Success:`, result);
      return result;
  },

  getClients: async (partnerId?: number) => partnerId ? clients.filter(c => c.partnerId === partnerId) : clients,
  getClientById: async (clientId: number) => clients.find(c => c.id === clientId),

  getProperties: async (clientId?: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return clientId ? properties.map(p => ({ ...p, _tracking: clientRecordTrackings.find(t => t.propertyId === p.id && t.clientId === clientId) })) : properties;
  },

  getTrackingRecords: async (clientId: number) => clientRecordTrackings.filter(t => t.clientId === clientId),
  getDistressSignals: async () => distressSignals,
  getSuppressionLists: async (clientId: number) => suppressionLists.filter(s => s.clientId === clientId),
  getTransactions: async (clientId: number) => transactions.filter(t => t.clientId === clientId),
  getWeeklyBatches: async (clientId: number) => weeklyBatches.filter(b => b.clientId === clientId).sort((a,b) => b.id - a.id),

  executeWeeklyBatch: async (clientId: number, options?: { skipTrace: boolean }) => {
    console.log(`[ExecuteBatch] Executing for clientId: ${clientId}, Options:`, options);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const client = clients.find(c => c.id === clientId);
    if (!client) throw new Error("Client not found");

    let targetBatch = weeklyBatches.filter(b => b.clientId === clientId && b.status === BatchStatus.Generated).sort((a,b) => b.id - a.id)[0];
    if (!targetBatch) {
        console.log(`[ExecuteBatch] No existing Generated batch found. Triggering on-the-fly generation.`);
        targetBatch = await api.generateWeeklyBatch(clientId);
    }

    if (options?.skipTrace) {
        const estimate = await api.getBatchSkipTraceEstimates(clientId);
        console.log(`[ExecuteBatch] Skip Trace requested. Estimate:`, estimate);
        if (estimate && estimate.eligibleCount > 0) {
            if (client.skipTraceWalletBalance < estimate.totalCost) {
                console.error(`[ExecuteBatch] Insufficient funds: ${client.skipTraceWalletBalance} < ${estimate.totalCost}`);
                throw new Error("Insufficient wallet balance for skip trace enrichment.");
            }
            
            // Deduct from wallet
            const previousBalance = client.skipTraceWalletBalance;
            client.skipTraceWalletBalance = Number((client.skipTraceWalletBalance - estimate.totalCost).toFixed(2));
            console.log(`[ExecuteBatch] Wallet Updated: ${previousBalance} -> ${client.skipTraceWalletBalance}`);

            // Log Transaction
            const newTx: Transaction = { 
                id: transactions.length + 1, 
                clientId, 
                protocolEvent: 'SKIP TRACE BATCH ENRICHMENT', 
                settlementAmount: -estimate.totalCost, 
                timestamp: new Date().toISOString() 
            };
            transactions.push(newTx);
            console.log(`[ExecuteBatch] Transaction created:`, newTx);

            targetBatch.skipTraceCount = estimate.eligibleCount;
            targetBatch.skipTraceCost = estimate.totalCost;

            // Mark records as skip traced
            const targetTracks = clientRecordTrackings
                .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
                .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
                .slice(0, targetBatch.totalRecords);
            
            const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 180);
            targetTracks.forEach(t => {
                if (!t.skipTracedAt || new Date(t.skipTracedAt) < sixMonthsAgo) {
                    const prop = properties.find(p => p.id === t.propertyId);
                    if (prop) {
                        t.skipTracedAt = new Date().toISOString();
                        t.touchCount += 1; // Execution increments touch count
                        skipTraces.push({ id: skipTraces.length + 1, contactId: prop.ownerId || 0, clientId, phone1: `555-${randomInt(100,999)}-${randomInt(1000,9999)}`, phone1Type: randomPick(['Mobile', 'Landline']), provider: 'Clearbit', cost: estimate.rate, createdAt: new Date().toISOString() });
                    }
                } else {
                    t.touchCount += 1; // Even already traced records in batch get a touch increment
                }
            });
        } else {
            // If no trace but standard batch, still increment touch counts
            const targetTracks = clientRecordTrackings
                .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
                .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
                .slice(0, targetBatch.totalRecords);
            targetTracks.forEach(t => t.touchCount += 1);
        }
    } else {
        // Standard batch execution: increment touch counts
        const targetTracks = clientRecordTrackings
            .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
            .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
            .slice(0, targetBatch.totalRecords);
        targetTracks.forEach(t => t.touchCount += 1);
    }

    targetBatch.status = BatchStatus.Downloaded;
    if (!targetBatch.firstDownloadAt) targetBatch.firstDownloadAt = new Date().toISOString();
    targetBatch.downloadCount += 1;
    targetBatch.updatedAt = new Date().toISOString();
    
    console.log(`[ExecuteBatch] Batch ${targetBatch.batchId} execution complete.`);
    return { batch: targetBatch, csvData: [] };
  }
};

initializeDatabase();
