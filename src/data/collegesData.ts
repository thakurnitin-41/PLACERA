export interface CollegeItem {
  id: string;
  name: string;
  shortName?: string;
  city: string;
  state: string;
  country: string;
  type: 'University' | 'Institute of Technology' | 'Autonomous' | 'Government / State' | 'Private' | 'Affiliated' | 'International';
  tier?: 'Tier 1 (National Importance / Top NIRF)' | 'Tier 2 (Top State / Established)' | 'Affiliated';
  keywords: string[];
  lat?: number;
  lng?: number;
  distanceKm?: number;
}

export interface CityLocation {
  name: string;
  state: string;
  lat: number;
  lng: number;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'International';
}

export const KNOWN_CITIES: CityLocation[] = [
  // Uttar Pradesh & Delhi NCR
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, region: 'North' },
  { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304, region: 'North' },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, region: 'North' },
  { name: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.4744, lng: 77.5040, region: 'North' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, region: 'North' },
  { name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090, region: 'North' },
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, region: 'North' },
  { name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266, region: 'North' },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, region: 'North' },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, region: 'North' },
  { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880, region: 'North' },
  { name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737, region: 'North' },
  { name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8386, lng: 78.7733, region: 'North' },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, region: 'North' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, region: 'North' },
  { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, region: 'North' },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, region: 'North' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, region: 'North' },
  { name: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685, region: 'North' },
  
  // Uttarakhand & Punjab / Chandigarh / Rajasthan
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, region: 'North' },
  { name: 'Roorkee', state: 'Uttarakhand', lat: 29.8543, lng: 77.8880, region: 'North' },
  { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, region: 'North' },
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, region: 'North' },
  { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, region: 'North' },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, region: 'North' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, region: 'North' },
  { name: 'Pilani', state: 'Rajasthan', lat: 28.3639, lng: 75.6010, region: 'North' },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, region: 'North' },

  // Central India (Madhya Pradesh & Chhattisgarh)
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, region: 'Central' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, region: 'Central' },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, region: 'Central' },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, region: 'Central' },
  { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, region: 'Central' },

  // West & South India
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, region: 'South' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, region: 'West' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, region: 'South' },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, region: 'West' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, region: 'South' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, region: 'West' },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, region: 'West' },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, region: 'West' },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, region: 'South' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, region: 'South' },
  { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, region: 'South' },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, region: 'South' },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, region: 'South' },
  
  // East & North East
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, region: 'East' },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, region: 'East' },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, region: 'East' },
  { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, region: 'East' },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, region: 'East' },
  { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, region: 'East' },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, region: 'East' }
];

export const POPULAR_CITIES = [
  'Meerut',
  'Bareilly',
  'Noida',
  'Greater Noida',
  'Delhi NCR',
  'Lucknow',
  'Kanpur',
  'Agra',
  'Moradabad',
  'Dehradun',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Mumbai',
  'Jaipur',
  'Bhopal',
  'Indore',
  'Chennai',
  'Kolkata',
  'Chandigarh',
  'Patna'
];

export const COLLEGES_DATABASE: CollegeItem[] = [
  // ==================== MEERUT ====================
  {
    id: 'miet-meerut',
    name: 'Meerut Institute of Engineering and Technology (MIET)',
    shortName: 'MIET Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['meerut', 'miet', 'nh-58', 'bypass', 'aktu', 'up', 'engineering', 'ncr'],
    lat: 28.9667,
    lng: 77.6366
  },
  {
    id: 'ccsu-meerut',
    name: 'Chaudhary Charan Singh University (CCSU Meerut)',
    shortName: 'CCS University Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['meerut', 'ccsu', 'ccs university', 'chaudhary charan singh', 'up', 'scriet'],
    lat: 28.9723,
    lng: 77.7408
  },
  {
    id: 'shobhit-university-meerut',
    name: 'Shobhit Institute of Engineering & Technology (Shobhit University)',
    shortName: 'Shobhit University Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['meerut', 'shobhit', 'shobhit university', 'modipuram', 'up', 'engineering'],
    lat: 29.0681,
    lng: 77.7121
  },
  {
    id: 'subharti-university-meerut',
    name: 'Swami Vivekanand Subharti University (SVSU Meerut)',
    shortName: 'Subharti University Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['meerut', 'subharti', 'svsu', 'site', 'subharti engineering', 'nh-58', 'up'],
    lat: 28.9806,
    lng: 77.6277
  },
  {
    id: 'iimt-university-meerut',
    name: 'IIMT University, Meerut',
    shortName: 'IIMT University Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['meerut', 'iimt', 'iimt university', 'ganga nagar', 'up', 'engineering'],
    lat: 28.9958,
    lng: 77.7788
  },
  {
    id: 'dewan-institute-meerut',
    name: 'Dewan V.S. Group of Institutions (DVSI Meerut)',
    shortName: 'Dewan College Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['meerut', 'dewan', 'dewan vs', 'dvit', 'aktu', 'up', 'delhi road'],
    lat: 28.9328,
    lng: 77.6187
  },
  {
    id: 'bit-meerut',
    name: 'Bharat Institute of Technology (BIT Meerut)',
    shortName: 'BIT Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['meerut', 'bit', 'bharat institute', 'partapur', 'bypass', 'aktu', 'up'],
    lat: 28.9248,
    lng: 77.6254
  },
  {
    id: 'neelkanth-meerut',
    name: 'Neelkanth Group of Educational Institutions',
    shortName: 'Neelkanth Meerut',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['meerut', 'neelkanth', 'ngei', 'pawanpuri', 'up'],
    lat: 29.0435,
    lng: 77.7291
  },

  // ==================== BAREILLY ====================
  {
    id: 'mjpru-bareilly',
    name: 'Mahatma Jyotiba Phule Rohilkhand University (MJPRU)',
    shortName: 'MJPRU Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['bareilly', 'mjpru', 'rohilkhand', 'rohilkhand university', 'up', 'fet mjpru', 'engineering'],
    lat: 28.3742,
    lng: 79.4475
  },
  {
    id: 'invertis-university-bareilly',
    name: 'Invertis University, Bareilly',
    shortName: 'Invertis Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['bareilly', 'invertis', 'invertis university', 'nh-24', 'up', 'engineering', 'management'],
    lat: 28.3079,
    lng: 79.5222
  },
  {
    id: 'srms-cet-bareilly',
    name: 'Shri Ram Murti Smarak College of Engineering & Technology (SRMS CET)',
    shortName: 'SRMS CET Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['bareilly', 'srms', 'srms cet', 'shri ram murti', 'ram murti', 'nainital road', 'aktu', 'up'],
    lat: 28.4682,
    lng: 79.4312
  },
  {
    id: 'future-institute-bareilly',
    name: 'Future Institute of Engineering and Technology (FIET)',
    shortName: 'Future Institute Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['bareilly', 'future', 'fiet', 'future institute', 'nh-24', 'aktu', 'up'],
    lat: 28.3189,
    lng: 79.5083
  },
  {
    id: 'kcmt-bareilly',
    name: 'Khandelwal College of Management Science and Technology (KCMT)',
    shortName: 'KCMT Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['bareilly', 'kcmt', 'khandelwal', 'kalapur', 'up', 'mjpru'],
    lat: 28.3912,
    lng: 79.4189
  },
  {
    id: 'rbmi-bareilly',
    name: 'Rakshpal Bahadur Management Institute (RBMI Group)',
    shortName: 'RBMI Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['bareilly', 'rbmi', 'rakshpal bahadur', 'budaun road', 'up'],
    lat: 28.3298,
    lng: 79.3975
  },
  {
    id: 'ana-college-bareilly',
    name: 'ANA College of Engineering and Management',
    shortName: 'ANA Bareilly',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['bareilly', 'ana', 'ana college', 'delhi road', 'up'],
    lat: 28.4012,
    lng: 79.3512
  },

  // ==================== MORADABAD ====================
  {
    id: 'tmu-moradabad',
    name: 'Teerthanker Mahaveer University (TMU Moradabad)',
    shortName: 'TMU Moradabad',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['moradabad', 'tmu', 'teerthanker', 'nh-24', 'delhi road', 'up', 'engineering'],
    lat: 28.8242,
    lng: 78.6588
  },
  {
    id: 'mit-moradabad',
    name: 'Moradabad Institute of Technology (MIT Moradabad)',
    shortName: 'MIT Moradabad',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['moradabad', 'mit', 'ram ganga vihar', 'aktu', 'up'],
    lat: 28.8682,
    lng: 78.7512
  },

  // ==================== AGRA, MATHURA & ALIGARH ====================
  {
    id: 'gla-university-mathura',
    name: 'GLA University, Mathura',
    shortName: 'GLA University Mathura',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['mathura', 'gla', 'gla university', 'chaumuha', 'nh-2', 'delhi agra highway', 'up'],
    lat: 27.6057,
    lng: 77.5933
  },
  {
    id: 'dei-agra',
    name: 'Dayalbagh Educational Institute (DEI Agra)',
    shortName: 'DEI Dayalbagh Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['agra', 'dei', 'dayalbagh', 'dayalbagh educational institute', 'up'],
    lat: 27.2285,
    lng: 78.0125
  },
  {
    id: 'rbs-agra',
    name: 'Raja Balwant Singh Engineering Technical Campus (RBS Bichpuri)',
    shortName: 'RBS College Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['agra', 'rbs', 'bichpuri', 'raja balwant singh', 'aktu', 'up'],
    lat: 27.1852,
    lng: 77.8967
  },
  {
    id: 'anand-eng-agra',
    name: 'Anand Engineering College (SGI Agra)',
    shortName: 'Anand Engg Agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Affiliated',
    keywords: ['agra', 'anand', 'sgi', 'sharda group', 'keetham', 'nh-2', 'up'],
    lat: 27.2489,
    lng: 77.8512
  },
  {
    id: 'amu-aligarh',
    name: 'Aligarh Muslim University (AMU / ZHCOET)',
    shortName: 'AMU Aligarh',
    city: 'Aligarh',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['aligarh', 'amu', 'zakir husain', 'zhcet', 'central university', 'up'],
    lat: 27.9152,
    lng: 78.0772
  },

  // ==================== KANPUR ====================
  {
    id: 'iit-kanpur',
    name: 'Indian Institute of Technology Kanpur (IIT Kanpur)',
    shortName: 'IIT Kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['kanpur', 'iitk', 'iit', 'kalyanpur', 'up', 'premier', 'nirf top 5'],
    lat: 26.5123,
    lng: 80.2329
  },
  {
    id: 'hbtu-kanpur',
    name: 'Harcourt Butler Technical University (HBTU Kanpur)',
    shortName: 'HBTU Kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['kanpur', 'hbtu', 'hbti', 'nawabganj', 'heritage', 'up'],
    lat: 26.4952,
    lng: 80.3155
  },
  {
    id: 'psit-kanpur',
    name: 'Pranveer Singh Institute of Technology (PSIT Kanpur)',
    shortName: 'PSIT Kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['kanpur', 'psit', 'pranveer singh', 'bhauti', 'nh-2', 'aktu', 'up'],
    lat: 26.4485,
    lng: 80.1985
  },
  {
    id: 'uiet-kanpur',
    name: 'University Institute of Engineering and Technology (UIET CSJMU Kanpur)',
    shortName: 'UIET Kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['kanpur', 'uiet', 'csjmu', 'kalyanpur', 'kanpur university', 'up'],
    lat: 26.4998,
    lng: 80.2612
  },

  // ==================== LUCKNOW ====================
  {
    id: 'iet-lucknow',
    name: 'Institute of Engineering and Technology (IET Lucknow)',
    shortName: 'IET Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['lucknow', 'iet', 'aktu', 'sitapur road', 'up', 'state government'],
    lat: 26.9142,
    lng: 80.9412
  },
  {
    id: 'iiit-lucknow',
    name: 'Indian Institute of Information Technology Lucknow (IIIT Lucknow)',
    shortName: 'IIIT Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['lucknow', 'iiit', 'iiitl', 'chak ganjaria', 'cgc', 'up'],
    lat: 26.7958,
    lng: 81.0264
  },
  {
    id: 'bbdu-lucknow',
    name: 'Babu Banarasi Das University (BBDU / BBDNITM)',
    shortName: 'BBD Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['lucknow', 'bbd', 'bbdu', 'babu banarasi das', 'faizabad road', 'up'],
    lat: 26.8898,
    lng: 81.0582
  },
  {
    id: 'amity-lucknow',
    name: 'Amity University, Lucknow Campus',
    shortName: 'Amity Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['lucknow', 'amity', 'malhaur', 'gomti nagar', 'up'],
    lat: 26.8582,
    lng: 81.0412
  },
  {
    id: 'srmcem-lucknow',
    name: 'Shri Ramswaroop Memorial College of Engineering and Management (SRMCEM)',
    shortName: 'SRMCEM Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['lucknow', 'srmcem', 'srmu', 'tiwariganj', 'faizabad road', 'aktu', 'up'],
    lat: 26.9012,
    lng: 81.0745
  },
  {
    id: 'integral-university-lucknow',
    name: 'Integral University, Lucknow',
    shortName: 'Integral University Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['lucknow', 'integral', 'kursi road', 'dasauli', 'up'],
    lat: 26.9585,
    lng: 80.9985
  },

  // ==================== PRAYAGRAJ / ALLAHABAD & VARANASI ====================
  {
    id: 'mnnit-allahabad',
    name: 'Motilal Nehru National Institute of Technology Allahabad (MNNIT Prayagraj)',
    shortName: 'MNNIT Allahabad',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['prayagraj', 'allahabad', 'mnnit', 'nit', 'teliarganj', 'up'],
    lat: 25.4925,
    lng: 81.8633
  },
  {
    id: 'iiit-allahabad',
    name: 'Indian Institute of Information Technology Allahabad (IIIT-A)',
    shortName: 'IIIT Allahabad',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['prayagraj', 'allahabad', 'iiit', 'iiita', 'jhalwa', 'up'],
    lat: 25.4298,
    lng: 81.7712
  },
  {
    id: 'ucer-prayagraj',
    name: 'United College of Engineering and Research (UCER Prayagraj)',
    shortName: 'United College Prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Affiliated',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['prayagraj', 'allahabad', 'ucer', 'united group', 'naini', 'aktu', 'up'],
    lat: 25.3812,
    lng: 81.8685
  },
  {
    id: 'iit-bhu-varanasi',
    name: 'Indian Institute of Technology (BHU) Varanasi',
    shortName: 'IIT BHU Varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['varanasi', 'bhu', 'iit bhu', 'kashi', 'banaras', 'up'],
    lat: 25.2677,
    lng: 82.9913
  },

  // ==================== GORAKHPUR & JHANSI ====================
  {
    id: 'mmmut-gorakhpur',
    name: 'Madan Mohan Malaviya University of Technology (MMMUT Gorakhpur)',
    shortName: 'MMMUT Gorakhpur',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['gorakhpur', 'mmmut', 'mmmec', 'malaviya', 'deoria road', 'up'],
    lat: 26.7312,
    lng: 83.4335
  },
  {
    id: 'biet-jhansi',
    name: 'Bundelkhand Institute of Engineering and Technology (BIET Jhansi)',
    shortName: 'BIET Jhansi',
    city: 'Jhansi',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['jhansi', 'biet', 'bundelkhand', 'kanpur road', 'aktu', 'up'],
    lat: 25.4612,
    lng: 78.6185
  },

  // ==================== NOIDA & GREATER NOIDA ====================
  {
    id: 'jiit-noida-62',
    name: 'Jaypee Institute of Information Technology (JIIT)',
    shortName: 'JIIT Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['noida', 'jaypee', 'jiit', 'sector 62', 'sector 128', 'up', 'delhi ncr', 'engineering'],
    lat: 28.6298,
    lng: 77.3712
  },
  {
    id: 'amity-university-noida',
    name: 'Amity University, Noida',
    shortName: 'Amity Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'amity', 'sector 125', 'delhi ncr', 'up', 'engineering', 'management'],
    lat: 28.5448,
    lng: 77.3325
  },
  {
    id: 'jssate-noida',
    name: 'JSS Academy of Technical Education (JSSATE)',
    shortName: 'JSS Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'jss', 'jssate', 'sector 62', 'aktu', 'up', 'delhi ncr'],
    lat: 28.6152,
    lng: 77.3585
  },
  {
    id: 'bennett-university-gnoida',
    name: 'Bennett University (Times Group)',
    shortName: 'Bennett Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'greater noida', 'bennett', 'times', 'up', 'delhi ncr'],
    lat: 28.4512,
    lng: 77.5842
  },
  {
    id: 'galgotias-university-gnoida',
    name: 'Galgotias University',
    shortName: 'Galgotias Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'greater noida', 'galgotias', 'gu', 'yamuna expressway', 'delhi ncr', 'up'],
    lat: 28.3685,
    lng: 77.5412
  },
  {
    id: 'galgotias-college-gnoida',
    name: 'Galgotias College of Engineering and Technology (GCET)',
    shortName: 'GCET Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'greater noida', 'gcet', 'galgotias college', 'knowledge park', 'delhi ncr', 'up'],
    lat: 28.4612,
    lng: 77.4985
  },
  {
    id: 'gl-bajaj-gnoida',
    name: 'GL Bajaj Institute of Technology and Management',
    shortName: 'GL Bajaj Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'greater noida', 'gl bajaj', 'glbitm', 'knowledge park', 'delhi ncr', 'up'],
    lat: 28.4712,
    lng: 77.4912
  },
  {
    id: 'niet-gnoida',
    name: 'Noida Institute of Engineering and Technology (NIET)',
    shortName: 'NIET Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'greater noida', 'niet', 'knowledge park', 'delhi ncr', 'up'],
    lat: 28.4635,
    lng: 77.4895
  },
  {
    id: 'shiv-nadar-university-gnoida',
    name: 'Shiv Nadar University (SNU)',
    shortName: 'SNU Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['noida', 'greater noida', 'shiv nadar', 'snu', 'dadri', 'delhi ncr', 'up'],
    lat: 28.5285,
    lng: 77.5742
  },
  {
    id: 'sharda-university-gnoida',
    name: 'Sharda University',
    shortName: 'Sharda Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['noida', 'greater noida', 'sharda', 'knowledge park', 'delhi ncr', 'up'],
    lat: 28.4735,
    lng: 77.4835
  },
  {
    id: 'akgec-ghaziabad-ncr',
    name: 'Ajay Kumar Garg Engineering College (AKGEC)',
    shortName: 'AKGEC Ghaziabad / Delhi NCR',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['ghaziabad', 'noida', 'delhi ncr', 'akgec', 'ajay kumar garg', 'aktu', 'up'],
    lat: 28.6758,
    lng: 77.5025
  },
  {
    id: 'abes-ghaziabad-ncr',
    name: 'ABES Engineering College',
    shortName: 'ABES Ghaziabad / Delhi NCR',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['ghaziabad', 'noida', 'delhi ncr', 'abes', 'abesec', 'nh24', 'crossings republik', 'up'],
    lat: 28.6358,
    lng: 77.4472
  },
  {
    id: 'kiet-ghaziabad-ncr',
    name: 'KIET Group of Institutions',
    shortName: 'KIET Ghaziabad / Delhi NCR',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['ghaziabad', 'noida', 'delhi ncr', 'kiet', 'krishna institute', 'muradnagar', 'up'],
    lat: 28.7525,
    lng: 77.4985
  },

  // ==================== DELHI NCR & NEW DELHI ====================
  {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi (IIT Delhi)',
    shortName: 'IIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['delhi', 'new delhi', 'iit', 'iitd', 'hauz khas', 'delhi ncr', 'premier'],
    lat: 28.5458,
    lng: 77.1925
  },
  {
    id: 'dtu-delhi',
    name: 'Delhi Technological University (DTU / DCE)',
    shortName: 'DTU Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['delhi', 'dtu', 'dce', 'bawana', 'rohini', 'delhi ncr', 'engineering'],
    lat: 28.7495,
    lng: 77.1185
  },
  {
    id: 'nsut-delhi',
    name: 'Netaji Subhas University of Technology (NSUT / NSIT)',
    shortName: 'NSUT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['delhi', 'nsut', 'nsit', 'dwarka', 'delhi ncr'],
    lat: 28.6095,
    lng: 77.0365
  },
  {
    id: 'iiit-delhi',
    name: 'Indraprastha Institute of Information Technology Delhi (IIIT-Delhi)',
    shortName: 'IIIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['delhi', 'iiit', 'iiitd', 'okhla', 'delhi ncr', 'computer science'],
    lat: 28.5435,
    lng: 77.2725
  },
  {
    id: 'mait-delhi',
    name: 'Maharaja Agrasen Institute of Technology (MAIT)',
    shortName: 'MAIT Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    type: 'Affiliated',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['delhi', 'mait', 'ipu', 'ggsipu', 'rohini', 'delhi ncr'],
    lat: 28.7185,
    lng: 77.0685
  },

  // ==================== DEHRADUN & UTTARAKHAND ====================
  {
    id: 'iit-roorkee',
    name: 'Indian Institute of Technology Roorkee (IIT Roorkee)',
    shortName: 'IIT Roorkee',
    city: 'Roorkee',
    state: 'Uttarakhand',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['roorkee', 'iit', 'iitr', 'thomason', 'uttarakhand'],
    lat: 29.8649,
    lng: 77.8967
  },
  {
    id: 'upes-dehradun',
    name: 'UPES University (University of Petroleum and Energy Studies)',
    shortName: 'UPES Dehradun',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['dehradun', 'upes', 'bidholi', 'kandoli', 'energy', 'uttarakhand'],
    lat: 30.4158,
    lng: 77.9685
  },
  {
    id: 'graphic-era-dehradun',
    name: 'Graphic Era (Deemed to be University)',
    shortName: 'Graphic Era Dehradun',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['dehradun', 'graphic era', 'geu', 'clement town', 'uttarakhand'],
    lat: 30.2685,
    lng: 78.0075
  },
  {
    id: 'dit-university-dehradun',
    name: 'DIT University (Dehradun Institute of Technology)',
    shortName: 'DIT Dehradun',
    city: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    type: 'University',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['dehradun', 'dit', 'mussoorie diversion', 'makkawala', 'uttarakhand'],
    lat: 30.3985,
    lng: 78.0775
  },

  // ==================== BENGALURU ====================
  {
    id: 'iisc-bangalore',
    name: 'Indian Institute of Science (IISc Bangalore)',
    shortName: 'IISc Bangalore',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bengaluru', 'bangalore', 'iisc', 'science', 'research', 'karnataka'],
    lat: 13.0219,
    lng: 77.5671
  },
  {
    id: 'iiit-bangalore',
    name: 'International Institute of Information Technology Bangalore (IIIT-B)',
    shortName: 'IIIT Bangalore',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bengaluru', 'bangalore', 'iiit', 'iiitb', 'electronic city', 'karnataka'],
    lat: 12.8407,
    lng: 77.6635
  },
  {
    id: 'rvce-bangalore',
    name: 'RV College of Engineering (RVCE)',
    shortName: 'RVCE Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bengaluru', 'bangalore', 'rvce', 'rv', 'mysore road', 'karnataka'],
    lat: 12.9238,
    lng: 77.4987
  },
  {
    id: 'bmsce-bangalore',
    name: 'BMS College of Engineering (BMSCE)',
    shortName: 'BMSCE Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bengaluru', 'bangalore', 'bmsce', 'bms', 'basavanagudi', 'karnataka'],
    lat: 12.9410,
    lng: 77.5655
  },
  {
    id: 'msrit-bangalore',
    name: 'M.S. Ramaiah Institute of Technology (MSRIT)',
    shortName: 'Ramaiah Institute Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bengaluru', 'bangalore', 'msrit', 'ramaiah', 'mathikere', 'karnataka'],
    lat: 13.0305,
    lng: 77.5649
  },
  {
    id: 'pes-university-bangalore',
    name: 'PES University (PESU)',
    shortName: 'PES University Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bengaluru', 'bangalore', 'pes', 'pesu', 'pesit', 'ring road', 'electronic city'],
    lat: 12.9352,
    lng: 77.5358
  },

  // ==================== PUNE ====================
  {
    id: 'coep-pune',
    name: 'COEP Technological University (College of Engineering Pune)',
    shortName: 'COEP Pune',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['pune', 'coep', 'shivajinagar', 'maharashtra', 'heritage', 'engineering'],
    lat: 18.5298,
    lng: 73.8565
  },
  {
    id: 'pict-pune',
    name: 'Pune Institute of Computer Technology (PICT)',
    shortName: 'PICT Pune',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['pune', 'pict', 'dhankawadi', 'computer science', 'maharashtra'],
    lat: 18.4575,
    lng: 73.8508
  },
  {
    id: 'vit-pune',
    name: 'Vishwakarma Institute of Technology (VIT Pune)',
    shortName: 'VIT Pune',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['pune', 'vit', 'vishwakarma', 'bibwewadi', 'maharashtra'],
    lat: 18.4635,
    lng: 73.8682
  },

  // ==================== HYDERABAD ====================
  {
    id: 'iit-hyderabad',
    name: 'Indian Institute of Technology Hyderabad (IIT Hyderabad)',
    shortName: 'IIT Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['hyderabad', 'iit', 'iith', 'kandi', 'sangareddy', 'telangana'],
    lat: 17.5947,
    lng: 78.1230
  },
  {
    id: 'iiit-hyderabad',
    name: 'International Institute of Information Technology Hyderabad (IIIT-H)',
    shortName: 'IIIT Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['hyderabad', 'iiit', 'iiith', 'gachibowli', 'telangana', 'coding'],
    lat: 17.4455,
    lng: 78.3489
  },
  {
    id: 'bits-hyderabad',
    name: 'BITS Pilani - Hyderabad Campus',
    shortName: 'BITS Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['hyderabad', 'bits', 'bits pilani', 'shamirpet', 'telangana'],
    lat: 17.5449,
    lng: 78.5718
  },
  {
    id: 'cbit-hyderabad',
    name: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    shortName: 'CBIT Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['hyderabad', 'cbit', 'gandipet', 'ou', 'telangana'],
    lat: 17.3912,
    lng: 78.3185
  },

  // ==================== MUMBAI ====================
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay (IIT Bombay)',
    shortName: 'IIT Bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['mumbai', 'iit', 'iitb', 'powai', 'maharashtra', 'premier'],
    lat: 19.1334,
    lng: 72.9133
  },
  {
    id: 'vjti-mumbai',
    name: 'Veermata Jijabai Technological Institute (VJTI)',
    shortName: 'VJTI Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['mumbai', 'vjti', 'matunga', 'maharashtra'],
    lat: 19.0222,
    lng: 72.8561
  },
  {
    id: 'spit-mumbai',
    name: 'Sardar Patel Institute of Technology (SPIT)',
    shortName: 'SPIT Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['mumbai', 'spit', 'andheri', 'bhavans', 'maharashtra'],
    lat: 19.1235,
    lng: 72.8365
  },

  // ==================== CHENNAI & TAMIL NADU ====================
  {
    id: 'iit-madras',
    name: 'Indian Institute of Technology Madras (IIT Madras)',
    shortName: 'IIT Madras',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['chennai', 'iit', 'iitm', 'adyar', 'tamil nadu', 'nirf 1'],
    lat: 12.9915,
    lng: 80.2337
  },
  {
    id: 'vit-vellore',
    name: 'Vellore Institute of Technology (VIT Vellore / Chennai)',
    shortName: 'VIT Vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['vellore', 'chennai', 'vit', 'viteee', 'tamil nadu'],
    lat: 12.9698,
    lng: 79.1559
  },
  {
    id: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli (NIT Trichy)',
    shortName: 'NIT Trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['trichy', 'tiruchirappalli', 'nit', 'nitt', 'tamil nadu'],
    lat: 10.7589,
    lng: 78.8132
  },

  // ==================== MADHYA PRADESH (BHOPAL & INDORE) ====================
  {
    id: 'manit-bhopal',
    name: 'Maulana Azad National Institute of Technology (MANIT Bhopal)',
    shortName: 'MANIT Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bhopal', 'manit', 'nit bhopal', 'mact', 'mp'],
    lat: 23.2162,
    lng: 77.4062
  },
  {
    id: 'lnct-bhopal',
    name: 'Lakshmi Narain College of Technology (LNCT Bhopal)',
    shortName: 'LNCT Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['bhopal', 'lnct', 'kalchuri', 'raishen road', 'mp'],
    lat: 23.2458,
    lng: 77.5185
  },
  {
    id: 'iit-indore',
    name: 'Indian Institute of Technology Indore (IIT Indore)',
    shortName: 'IIT Indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['indore', 'iit', 'iiti', 'simrol', 'mp'],
    lat: 22.5204,
    lng: 75.9207
  },
  {
    id: 'sgsits-indore',
    name: 'Shri Govindram Seksaria Institute of Technology and Science (SGSITS)',
    shortName: 'SGSITS Indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['indore', 'sgsits', 'gs', 'park road', 'mp'],
    lat: 22.7258,
    lng: 75.8712
  },
  {
    id: 'iet-davv-indore',
    name: 'Institute of Engineering & Technology, DAVV (IET DAVV)',
    shortName: 'IET DAVV Indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 2 (Top State / Established)',
    keywords: ['indore', 'iet davv', 'devi ahilya', 'khandwa road', 'mp'],
    lat: 22.6812,
    lng: 75.8785
  },

  // ==================== RAJASTHAN & PUNJAB ====================
  {
    id: 'mnit-jaipur',
    name: 'Malaviya National Institute of Technology Jaipur (MNIT)',
    shortName: 'MNIT Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['jaipur', 'mnit', 'nit', 'jln marg', 'rajasthan'],
    lat: 26.8640,
    lng: 75.8108
  },
  {
    id: 'lnmiit-jaipur',
    name: 'The LNM Institute of Information Technology (LNMIIT)',
    shortName: 'LNMIIT Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    type: 'Autonomous',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['jaipur', 'lnmiit', 'lnm', 'jamdoli', 'rajasthan'],
    lat: 26.9363,
    lng: 75.9235
  },
  {
    id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science (BITS Pilani)',
    shortName: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['pilani', 'bits', 'bitsat', 'rajasthan', 'premier'],
    lat: 28.3639,
    lng: 75.6010
  },
  {
    id: 'thapar-university',
    name: 'Thapar Institute of Engineering and Technology (TIET Patiala)',
    shortName: 'Thapar University Patiala',
    city: 'Patiala',
    state: 'Punjab',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['patiala', 'chandigarh', 'thapar', 'tiet', 'punjab'],
    lat: 30.3540,
    lng: 76.3685
  },
  {
    id: 'pec-chandigarh',
    name: 'Punjab Engineering College (PEC Chandigarh)',
    shortName: 'PEC Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['chandigarh', 'pec', 'sector 12', 'punjab engineering college'],
    lat: 30.7658,
    lng: 76.7865
  },

  // ==================== EAST & BIHAR / JHARKHAND / ODISHA ====================
  {
    id: 'iit-kharagpur',
    name: 'Indian Institute of Technology Kharagpur (IIT KGP)',
    shortName: 'IIT Kharagpur',
    city: 'Kharagpur',
    state: 'West Bengal',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['kharagpur', 'kolkata', 'iit', 'iitkgp', 'west bengal'],
    lat: 22.3149,
    lng: 87.3105
  },
  {
    id: 'jadavpur-university',
    name: 'Jadavpur University (JU Kolkata)',
    shortName: 'Jadavpur University Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    type: 'Government / State',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['kolkata', 'jadavpur', 'ju', 'calcutta', 'west bengal'],
    lat: 22.4989,
    lng: 88.3712
  },
  {
    id: 'iit-patna',
    name: 'Indian Institute of Technology Patna (IIT Patna)',
    shortName: 'IIT Patna',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['patna', 'iit', 'iitp', 'bihta', 'bihar'],
    lat: 25.5358,
    lng: 84.8512
  },
  {
    id: 'nit-patna',
    name: 'National Institute of Technology Patna (NIT Patna)',
    shortName: 'NIT Patna',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    type: 'Institute of Technology',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['patna', 'nit', 'nitp', 'ashok rajpath', 'bihar'],
    lat: 25.6205,
    lng: 85.1725
  },
  {
    id: 'bit-mesra',
    name: 'Birla Institute of Technology, Mesra (BIT Mesra Ranchi)',
    shortName: 'BIT Mesra Ranchi',
    city: 'Ranchi',
    state: 'Jharkhand',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['ranchi', 'bit mesra', 'mesra', 'jharkhand'],
    lat: 23.4245,
    lng: 85.4385
  },
  {
    id: 'kiit-bhubaneswar',
    name: 'Kalinga Institute of Industrial Technology (KIIT Bhubaneswar)',
    shortName: 'KIIT University Bhubaneswar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    type: 'University',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['bhubaneswar', 'kiit', 'patia', 'odisha'],
    lat: 20.3535,
    lng: 85.8185
  },

  // ==================== INTERNATIONAL ====================
  {
    id: 'stanford-university',
    name: 'Stanford University',
    shortName: 'Stanford',
    city: 'Stanford, California',
    state: 'California',
    country: 'United States',
    type: 'International',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['usa', 'california', 'stanford', 'bay area', 'silicon valley', 'international'],
    lat: 37.4275,
    lng: -122.1697
  },
  {
    id: 'mit-usa',
    name: 'Massachusetts Institute of Technology (MIT)',
    shortName: 'MIT Cambridge',
    city: 'Cambridge, Massachusetts',
    state: 'Massachusetts',
    country: 'United States',
    type: 'International',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['usa', 'mit', 'cambridge', 'boston', 'international'],
    lat: 42.3601,
    lng: -71.0942
  },
  {
    id: 'oxford-university',
    name: 'University of Oxford',
    shortName: 'Oxford UK',
    city: 'Oxford',
    state: 'England',
    country: 'United Kingdom',
    type: 'International',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['uk', 'oxford', 'britain', 'international'],
    lat: 51.7548,
    lng: -1.2544
  },
  {
    id: 'nus-singapore',
    name: 'National University of Singapore (NUS)',
    shortName: 'NUS Singapore',
    city: 'Singapore',
    state: 'Singapore',
    country: 'Singapore',
    type: 'International',
    tier: 'Tier 1 (National Importance / Top NIRF)',
    keywords: ['singapore', 'nus', 'asia', 'international'],
    lat: 1.2966,
    lng: 103.7764
  }
];

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Find nearest city from GPS coordinates
export function findNearestCity(lat: number, lng: number): { city: CityLocation; distanceKm: number } {
  let nearestCity = KNOWN_CITIES[0];
  let minDistance = Infinity;

  for (const c of KNOWN_CITIES) {
    const dist = calculateDistanceKm(lat, lng, c.lat, c.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = c;
    }
  }

  return { city: nearestCity, distanceKm: minDistance };
}

// Universal Global College Search with optional GPS location ranking
export function searchColleges(
  query: string,
  cityFilter?: string,
  userLocation?: { lat: number; lng: number }
): CollegeItem[] {
  const cleanQuery = (query || '').trim().toLowerCase();
  const cleanCity = (cityFilter || '').trim().toLowerCase();

  // If user has GPS location, annotate all colleges with distance
  let list = COLLEGES_DATABASE.map(col => {
    if (userLocation && col.lat && col.lng) {
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, col.lat, col.lng);
      return { ...col, distanceKm: dist };
    }
    return { ...col };
  });

  // If query is empty and no city filter, show nearby colleges if GPS available, otherwise top colleges
  if (!cleanQuery && !cleanCity) {
    if (userLocation) {
      return [...list].sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999)).slice(0, 15);
    }
    return list.slice(0, 12);
  }

  // Filter matching items
  const filtered = list.filter(college => {
    // City filter check (flexible substring match)
    const matchesCityFilter =
      !cleanCity ||
      college.city.toLowerCase().includes(cleanCity) ||
      cleanCity.includes(college.city.toLowerCase()) ||
      college.keywords.some(k => k.includes(cleanCity));

    if (!cleanQuery) return matchesCityFilter;

    // Search query matches
    const matchesName = college.name.toLowerCase().includes(cleanQuery);
    const matchesShort = college.shortName?.toLowerCase().includes(cleanQuery);
    const matchesCity = college.city.toLowerCase().includes(cleanQuery);
    const matchesState = college.state.toLowerCase().includes(cleanQuery);
    const matchesKeywords = college.keywords.some(k => k.includes(cleanQuery));

    const matchesSearch = matchesName || matchesShort || matchesCity || matchesState || matchesKeywords;

    // If query itself mentions the city (e.g. user typed "Meerut"), treat as strong match
    return matchesCityFilter && matchesSearch;
  });

  // Smart Ranking:
  // 1. Exact Name/ShortName match
  // 2. Query starts with Name/ShortName
  // 3. City matches query
  // 4. Closest distance (if GPS available)
  return filtered.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aShort = (a.shortName || '').toLowerCase();
    const bShort = (b.shortName || '').toLowerCase();

    // Exact matches
    if (aShort === cleanQuery || aName === cleanQuery) return -1;
    if (bShort === cleanQuery || bName === cleanQuery) return 1;

    // Starts with match
    const aStarts = aName.startsWith(cleanQuery) || aShort.startsWith(cleanQuery);
    const bStarts = bName.startsWith(cleanQuery) || bShort.startsWith(cleanQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    // City matches query
    const aCityMatch = a.city.toLowerCase() === cleanQuery;
    const bCityMatch = b.city.toLowerCase() === cleanQuery;
    if (aCityMatch && !bCityMatch) return -1;
    if (!aCityMatch && bCityMatch) return 1;

    // Distance if GPS present
    if (userLocation && a.distanceKm !== undefined && b.distanceKm !== undefined) {
      return a.distanceKm - b.distanceKm;
    }

    return 0;
  });
}
