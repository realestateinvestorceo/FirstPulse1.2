import { 
  User, Partner, Client, Property, Contact, 
  Role, ClientStatus, SubscriptionTier, AuthResponse,
  DistressSignal, ClientRecordTracking, Lane, TrackingStatus, SourceType,
  SuppressionList, Transaction, WeeklyBatch, BatchStatus, BatchRecord,
  County, SystemDefault, PartnerConfiguration, ClientSettings, SkipTrace
} from '../types';

/**
 * MOCK BACKEND SERVICE
 * This service simulates the Node.js + Sequelize + SQLite backend functionality.
 * It handles data seeding, authentication, and data retrieval in browser memory.
 */

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
const COUNTIES = [
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

const runScoringEngine = () => {
  console.log("Running Scoring Engine...");
  
  // Scoring for Demo Investor (ID 201)
  const investorId = 201;
  const targetProperties = properties; // In a real app, this would be filtered by market/buybox
  
  let trackingIdCounter = 1;

  clientRecordTrackings = targetProperties.map(property => {
    // 1. Calculate Base Score
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

    // 2. Determine Lane (Blitz > Chase > Nurture)
    if (hasBlitz) highestPriorityLane = 'Blitz';
    else if (hasChase) highestPriorityLane = 'Chase';
    else highestPriorityLane = 'Nurture';

    // 3. Effective Score (Initial touchCount is 0, so equals baseScore)
    // Formula: effective = base * 0.5^touchCount
    const touchCount = 0; 
    const effectiveScore = baseScore * Math.pow(0.5, touchCount);

    // Randomize Source Type for demo visual variety
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
      finalAllocationPoints: Number((effectiveScore * 100).toFixed(2)), // Simple mapping for demo
      touchCount: touchCount,
      sourceType: sourceType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
  
  // Seed some records in Cooldown
  const cooldownIds = [5, 12, 18, 25];
  clientRecordTrackings.forEach(t => {
      if (cooldownIds.includes(t.propertyId)) {
          t.status = TrackingStatus.CoolingDown;
          t.cooldownStartAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(); // 15 days ago
          t.cooldownEndAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 165).toISOString(); // 5.5 months left
          t.touchCount = 12; // Maxed out
      }
  });

  // Seed one Skip Trace record to show history
  const tracedPropId = 99;
  const tracedProp = properties.find(p => p.id === tracedPropId);
  const tracedTracking = clientRecordTrackings.find(t => t.propertyId === tracedPropId);
  if (tracedProp && tracedTracking) {
      tracedTracking.skipTracedAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(); // 2 months ago
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

  console.log(`Scored ${clientRecordTrackings.length} records for Client ${investorId}`);
};

export const initializeDatabase = () => {
  if (users.length > 0) return; // Already seeded

  console.log('Seeding Database...');

  // 1. Users
  users = [
    {
      id: 1, email: 'admin@firstpulse.ai', role: 'admin', firstName: 'System', lastName: 'Admin', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      id: 2, email: 'partner@firstpulse.ai', role: 'partner', partnerId: 101, firstName: 'Alex', lastName: 'Partner', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    {
      id: 3, email: 'investor@firstpulse.ai', role: 'investor', clientId: 201, firstName: 'Sarah', lastName: 'Investor', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    },
    // Adding user for second client for impersonation testing
    {
      id: 4, email: 'mike@flip.com', role: 'investor', clientId: 202, firstName: 'Mike', lastName: 'Flipper', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }
  ];

  // 2. Partners
  partners = [
    { id: 101, name: 'Growth Marketing LLC', email: 'alex@growth.com', phone: '555-0101', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

  // 3. Clients
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

  // 4. Properties (100 items)
  for (let i = 1; i <= 100; i++) {
    const loc = randomPick(COUNTIES);
    // Assign ownerId between 1 and 20
    const ownerId = randomInt(1, 20);
    properties.push({
      id: i,
      clientId: i % 3 === 0 ? 201 : 202, // Distribute randomly
      ownerId: ownerId,
      fips: loc.state === 'IL' ? '17031' : '48201',
      addressLine1: `${randomInt(100, 9999)} ${randomPick(STREET_NAMES)} ${randomPick(['St', 'Ave', 'Blvd', 'Dr'])}`,
      addressCity: loc.city,
      addressState: loc.state,
      addressPostalCode: (loc.zipBase + randomInt(1, 99)).toString(),
      propertyType: randomPick(PROPERTY_TYPES),
      tags: randomTags(),
      estimatedValue: randomInt(150000, 850000),
      equityPercent: randomInt(10, 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // 5. Contacts (20 items)
  for (let i = 1; i <= 20; i++) {
    const loc = randomPick(COUNTIES);
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
  
  // 6. Distress Signals
  seedDistressSignals();

  // 7. Counties
  seedCounties();

  // 8. System Defaults
  seedSystemDefaults();

  // 9. Partner Config & Client Settings
  seedPartnerConfig();
  seedClientSettings();

  // 10. Run Scoring Engine
  runScoringEngine();

  // 11. Suppression Lists
  suppressionLists = [
    { id: 1, clientId: 201, fileName: 'Do Not Call - Global.csv', suppressionType: 'phone', recordCount: 8200, isActive: true, createdAt: new Date().toISOString() },
    { id: 2, clientId: 201, fileName: 'Litigator Scrub.csv', suppressionType: 'owner_name', recordCount: 450, isActive: true, createdAt: new Date().toISOString() },
    { id: 3, clientId: 201, fileName: 'Previous Buyers.csv', suppressionType: 'address', recordCount: 3753, isActive: true, createdAt: new Date().toISOString() }
  ];

  // 12. Transactions
  transactions = [
    { id: 1, clientId: 201, protocolEvent: "INITIAL WALLET LOADING", settlementAmount: 500.00, timestamp: "2025-12-26T02:38:00" }
  ];

  // 13. Weekly Batches (Seed one historical)
  weeklyBatches = [
    {
      id: 1,
      clientId: 201,
      batchId: '201-2025-40',
      weekStart: '2025-09-28',
      weekEnd: '2025-10-04',
      totalRecords: 1200,
      freshCount: 300,
      repeatCount: 850,
      queueCount: 50,
      blitzCount: 200,
      chaseCount: 400,
      nurtureCount: 600,
      skipTraceCount: 300,
      skipTraceCost: 18.00,
      duplicateContactsAvoided: 45,
      status: BatchStatus.Downloaded,
      generatedAt: '2025-10-02T01:00:00',
      firstDownloadAt: '2025-10-02T01:00:00',
      downloadCount: 1,
      createdAt: '2025-10-02T01:00:00',
      updatedAt: '2025-10-02T01:00:00'
    }
  ];
};

// --- Mock API Methods ---

export const api = {
  login: async (email: string): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');

    return {
      token: `fake-jwt-token-${user.id}-${Date.now()}`,
      user
    };
  },

  getStats: async () => {
    return {
      userCount: users.length,
      partnerCount: partners.length,
      clientCount: clients.length,
      propertyCount: properties.length
    };
  },

  getInvestorStats: async (clientId: number) => {
      // Aggregate stats for dashboard
      const tracks = clientRecordTrackings.filter(t => t.clientId === clientId);
      const active = tracks.filter(t => t.status === TrackingStatus.Active).length;
      const cooldown = tracks.filter(t => t.status === TrackingStatus.CoolingDown).length;
      const removed = tracks.filter(t => t.status.toString().includes('Removed')).length;
      return { active, cooldown, removed };
  },
  
  // -- Admin Methods --

  getPartners: async () => {
    return partners;
  },

  getAllClients: async () => {
    return clients;
  },

  getCounties: async () => {
    return counties;
  },

  getSystemDefaults: async () => {
    return systemDefaults;
  },

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
    if (signal) {
      Object.assign(signal, updates);
    }
    return signal;
  },

  // -- Partner Methods --

  getPartnerConfig: async (partnerId: number) => {
    return partnerConfigurations.filter(c => c.partnerId === partnerId);
  },

  updatePartnerConfig: async (partnerId: number, key: string, value: string) => {
    const existing = partnerConfigurations.find(c => c.partnerId === partnerId && c.settingKey === key);
    if (existing) {
      existing.settingValue = value;
      existing.updatedAt = new Date().toISOString();
      return existing;
    } else {
      const newConfig = {
        id: partnerConfigurations.length + 1,
        partnerId,
        settingKey: key,
        settingValue: value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      partnerConfigurations.push(newConfig);
      return newConfig;
    }
  },

  getClientSettings: async (clientId: number) => {
    const settings = clientSettingsStore.find(s => s.clientId === clientId);
    if (!settings) {
       // Return default if not found
       return {
          clientId,
          buyBox: { counties: [], propertyTypes: [], maxPrice: 500000, minEquity: 30, excludedZips: '' },
          cadence: { blitzDays: 14, blitzMaxTouches: 12, chaseDays: 30, chaseMaxTouches: 18, nurtureDays: 45, nurtureMaxTouches: 10 }
       };
    }
    return settings;
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
    return {
      token: `fake-impersonation-token-${user.id}-${Date.now()}`,
      user
    };
  },

  // -- Batch Generation Logic --
  
  generateWeeklyBatch: async (clientId: number) => {
     await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

     const client = clients.find(c => c.id === clientId);
     if (!client) throw new Error("Client not found");

     // 1. Get Settings
     const settings = await api.getClientSettings(clientId);

     // 2. Get All Properties (Simulated DB Query)
     const allProperties = await api.getProperties();

     // 3. Filter Properties by Buy Box
     const eligibleProperties = allProperties.filter(p => {
        // County Check
        if (settings.buyBox.counties.length > 0 && !settings.buyBox.counties.includes(p.fips)) return false;
        
        // Price Check
        if (p.estimatedValue > settings.buyBox.maxPrice) return false;
        
        // Equity Check
        if (p.equityPercent < settings.buyBox.minEquity) return false;

        // Property Type Check (if set)
        if (settings.buyBox.propertyTypes.length > 0 && p.propertyType && !settings.buyBox.propertyTypes.includes(p.propertyType)) return false;

        // Zip Exclusion (Simple check)
        if (settings.buyBox.excludedZips && settings.buyBox.excludedZips.includes(p.addressPostalCode)) return false;
        
        return true;
     });

     // 4. Score & Track Eligible Properties
     // In a real app, this would upsert ClientRecordTracking. Here we simulate updating our in-memory store.
     const trackedRecords: ClientRecordTracking[] = [];
     const now = new Date();
     
     eligibleProperties.forEach(prop => {
        let tracking = clientRecordTrackings.find(t => t.clientId === clientId && t.propertyId === prop.id);
        
        // Calculate Score (Simplified)
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
        
        // Create new if not exists
        if (!tracking) {
            tracking = {
                id: clientRecordTrackings.length + 1,
                clientId,
                propertyId: prop.id,
                lane,
                status: TrackingStatus.Active,
                baseScore,
                effectiveScore: baseScore,
                finalAllocationPoints: baseScore * 100,
                touchCount: 0,
                sourceType: 'Fresh',
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
            };
            clientRecordTrackings.push(tracking);
        } else {
            // Update existing
            tracking.baseScore = baseScore;
            tracking.lane = lane;
            tracking.effectiveScore = baseScore * Math.pow(0.5, tracking.touchCount);
            tracking.finalAllocationPoints = tracking.effectiveScore * 100;
        }

        // --- Cooldown Logic ---
        
        // Check Cooldown Exit
        if (tracking.status === TrackingStatus.CoolingDown) {
            if (tracking.cooldownEndAt && new Date(tracking.cooldownEndAt) <= now) {
                // Exit Cooldown
                tracking.status = TrackingStatus.Active;
                tracking.cooldownStartAt = undefined;
                tracking.cooldownEndAt = undefined;
                tracking.touchCount = 0; // Reset touches on re-entry (re-enters as Fresh)
            }
        }

        // Check Cooldown Entry (only if Active)
        if (tracking.status === TrackingStatus.Active) {
            let maxTouches = 10; // Default
            if (tracking.lane === 'Blitz') maxTouches = settings.cadence.blitzMaxTouches;
            if (tracking.lane === 'Chase') maxTouches = settings.cadence.chaseMaxTouches;
            if (tracking.lane === 'Nurture') maxTouches = settings.cadence.nurtureMaxTouches;

            const scoreFloor = 0.10; // 0.10 points floor
            
            if (tracking.touchCount >= maxTouches || tracking.finalAllocationPoints < scoreFloor) {
                tracking.status = TrackingStatus.CoolingDown;
                tracking.cooldownStartAt = now.toISOString();
                // 6 months cooldown
                const endDate = new Date(now);
                endDate.setMonth(endDate.getMonth() + 6);
                tracking.cooldownEndAt = endDate.toISOString();
            }
        }

        trackedRecords.push(tracking);
     });

     // 5. Categorize & Filter for Batch Inclusion
     const candidates = trackedRecords.filter(t => {
         if (t.status !== TrackingStatus.Active) return false; // Exclude CoolingDown, Removed, etc.
         
         // Fresh
         if (t.touchCount === 0) return true;
         
         // Repeat (Eligible Time Check)
         if (t.nextEligibleAt && new Date(t.nextEligibleAt) <= now) return true;
         
         return false;
     });

     // 6. Deduplication (Group by Owner)
     const recordsByOwner = new Map<number, ClientRecordTracking[]>();
     candidates.forEach(record => {
       const prop = properties.find(p => p.id === record.propertyId);
       const ownerId = prop?.ownerId || 0;
       if (!recordsByOwner.has(ownerId)) recordsByOwner.set(ownerId, []);
       recordsByOwner.get(ownerId)!.push(record);
     });

     const finalSelection: ClientRecordTracking[] = [];
     
     recordsByOwner.forEach((records) => {
         // Pick highest score
         records.sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints);
         finalSelection.push(records[0]);
     });

     // 7. Limit by Capacity
     finalSelection.sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints);
     const batchRecordsList = finalSelection.slice(0, client.weeklyCapacity);

     if (batchRecordsList.length === 0) {
         throw new Error("No eligible records found for batch generation.");
     }

     // 8. Create Batch
     const weekNum = Math.floor(now.getDate() / 7) + 1;
     const newBatch: WeeklyBatch = {
        id: weeklyBatches.length + 1,
        clientId,
        batchId: `${clientId}-${now.getFullYear()}-W${weekNum}-${Date.now()}`,
        weekStart: now.toISOString().split('T')[0],
        weekEnd: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalRecords: batchRecordsList.length,
        freshCount: batchRecordsList.filter(r => r.touchCount === 0).length,
        repeatCount: batchRecordsList.filter(r => r.touchCount > 0).length,
        queueCount: candidates.length - batchRecordsList.length, // Rough queue est
        blitzCount: batchRecordsList.filter(r => r.lane === 'Blitz').length,
        chaseCount: batchRecordsList.filter(r => r.lane === 'Chase').length,
        nurtureCount: batchRecordsList.filter(r => r.lane === 'Nurture').length,
        skipTraceCount: 0,
        skipTraceCost: 0,
        duplicateContactsAvoided: candidates.length - finalSelection.length,
        status: BatchStatus.Generated,
        generatedAt: now.toISOString(),
        downloadCount: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
     };
     weeklyBatches.push(newBatch);

     // 9. Update Client
     if (!client.firstBatchGeneratedAt) {
         client.firstBatchGeneratedAt = now.toISOString();
     }

     return newBatch;
  },

  // -- Skip Trace Logic --

  getBatchSkipTraceEstimates: async (clientId: number) => {
      // Find the generated batch
      const batch = weeklyBatches
        .filter(b => b.clientId === clientId && b.status === BatchStatus.Generated)
        .sort((a, b) => b.id - a.id)[0];
      
      if (!batch) return null;

      // Get partner rate
      const client = clients.find(c => c.id === clientId);
      const partnerConfigs = await api.getPartnerConfig(client?.partnerId || 0);
      const rateStr = partnerConfigs.find(c => c.settingKey === 'skip_trace_rate')?.settingValue;
      const rate = rateStr ? parseFloat(rateStr) : 0.06; // Fallback default

      // Find records in this batch (simulated - normally queries BatchRecords table)
      // Since we don't persist BatchRecords in memory store for this mock fully linked to tracking,
      // we'll approximate based on "Active" records limited by capacity that match the batch profile.
      // For the mock, let's just grab the active records up to batch size.
      const activeTracks = clientRecordTrackings
        .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
        .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
        .slice(0, batch.totalRecords);

      // Check eligibility (not traced or traced > 6 months ago)
      const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 180);
      const eligibleCount = activeTracks.filter(t => 
         !t.skipTracedAt || new Date(t.skipTracedAt) < sixMonthsAgo
      ).length;

      const alreadyTracedCount = batch.totalRecords - eligibleCount;

      return {
          eligibleCount,
          alreadyTracedCount,
          rate,
          totalCost: eligibleCount * rate
      };
  },

  // -- Existing Methods --

  getClients: async (partnerId?: number) => {
    if (partnerId) return clients.filter(c => c.partnerId === partnerId);
    return clients;
  },
  
  getClientById: async (clientId: number) => {
    return clients.find(c => c.id === clientId);
  },

  getProperties: async (clientId?: number) => {
    // Return properties with a small delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Join with Tracking Data if clientId is provided (simulating a join)
    if (clientId) {
      const clientProps = properties; // In real app, filter by market
      return clientProps.map(p => {
        const tracking = clientRecordTrackings.find(t => t.propertyId === p.id && t.clientId === clientId);
        return {
          ...p,
          _tracking: tracking // Attach tracking data for frontend use if needed
        };
      });
    }
    return properties;
  },

  getTrackingRecords: async (clientId: number) => {
     return clientRecordTrackings.filter(t => t.clientId === clientId);
  },
  
  getDistressSignals: async () => {
      return distressSignals;
  },

  getSuppressionLists: async (clientId: number) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return suppressionLists.filter(s => s.clientId === clientId);
  },

  getTransactions: async (clientId: number) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return transactions.filter(t => t.clientId === clientId);
  },

  getWeeklyBatches: async (clientId: number) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return weeklyBatches.filter(b => b.clientId === clientId).sort((a,b) => b.id - a.id);
  },

  executeWeeklyBatch: async (clientId: number, options?: { skipTrace: boolean }) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Processing delay

    let targetBatch = weeklyBatches
        .filter(b => b.clientId === clientId && b.status === BatchStatus.Generated)
        .sort((a,b) => b.id - a.id)[0]; // Get latest generated
    
    if (!targetBatch) {
        // Fallback: Generate one if missing (Legacy/Demo convenience)
        targetBatch = await api.generateWeeklyBatch(clientId);
    }

    const client = clients.find(c => c.id === clientId);
    if (!client) throw new Error("Client not found");

    // -- Skip Trace Execution --
    if (options?.skipTrace) {
        const estimate = await api.getBatchSkipTraceEstimates(clientId);
        if (estimate && estimate.eligibleCount > 0) {
            if (client.skipTraceWalletBalance < estimate.totalCost) {
                throw new Error("Insufficient wallet balance for skip tracing.");
            }

            // Deduct Balance
            client.skipTraceWalletBalance -= estimate.totalCost;
            transactions.push({
                id: transactions.length + 1,
                clientId,
                protocolEvent: 'SKIP TRACE BATCH ENRICHMENT',
                settlementAmount: -estimate.totalCost,
                timestamp: new Date().toISOString()
            });

            // Update Batch Stats
            targetBatch.skipTraceCount = estimate.eligibleCount;
            targetBatch.skipTraceCost = estimate.totalCost;

            // Simulate Data Creation (Create SkipTrace records and update Tracking)
            const activeTracks = clientRecordTrackings
                .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
                .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
                .slice(0, targetBatch.totalRecords);

            const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 180);

            activeTracks.forEach(t => {
                if (!t.skipTracedAt || new Date(t.skipTracedAt) < sixMonthsAgo) {
                    const prop = properties.find(p => p.id === t.propertyId);
                    if (prop) {
                        t.skipTracedAt = new Date().toISOString();
                        
                        skipTraces.push({
                            id: skipTraces.length + 1,
                            contactId: prop.ownerId || 0,
                            clientId,
                            phone1: `555-${randomInt(100,999)}-${randomInt(1000,9999)}`,
                            phone1Type: randomPick(['Mobile', 'Landline']),
                            phone2: `555-${randomInt(100,999)}-${randomInt(1000,9999)}`,
                            phone2Type: randomPick(['Mobile', 'VoIP']),
                            email1: `owner${prop.ownerId}@example.com`,
                            provider: 'Clearbit',
                            cost: estimate.rate,
                            createdAt: new Date().toISOString()
                        });
                    }
                }
            });
        }
    }

    // Mark as Downloaded
    targetBatch.status = BatchStatus.Downloaded;
    if (!targetBatch.firstDownloadAt) targetBatch.firstDownloadAt = new Date().toISOString();
    targetBatch.downloadCount += 1;
    targetBatch.updatedAt = new Date().toISOString();

    // Generate CSV data for return
    const csvRows: any[] = [];
    
    // Re-simulate grabbing eligible properties
    const activeTracks = clientRecordTrackings
        .filter(t => t.clientId === clientId && t.status === TrackingStatus.Active)
        .sort((a,b) => b.finalAllocationPoints - a.finalAllocationPoints)
        .slice(0, targetBatch.totalRecords);

    activeTracks.forEach((t) => {
        const prop = properties.find(p => p.id === t.propertyId);
        const contact = contacts.find(c => c.id === prop?.ownerId);
        const trace = skipTraces.find(st => st.contactId === contact?.id && st.clientId === clientId);
        
        csvRows.push({
            PropertyAddress: prop?.addressLine1,
            City: prop?.addressCity,
            State: prop?.addressState,
            Zip: prop?.addressPostalCode,
            OwnerName: contact?.fullName || 'Unknown', 
            Lane: t.lane,
            Score: t.finalAllocationPoints,
            Signals: prop?.tags.join(' | '),
            // Add Phone Columns
            Phone1: trace?.phone1 || '',
            Phone1Type: trace?.phone1Type || '',
            Phone2: trace?.phone2 || '',
            Phone2Type: trace?.phone2Type || '',
            Email: trace?.email1 || ''
        });
    });

    return { batch: targetBatch, csvData: csvRows };
  }
};

// Initialize on load
initializeDatabase();