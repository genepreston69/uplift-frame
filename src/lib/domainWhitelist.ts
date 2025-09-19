// Domain whitelist configuration for external link security
export const WHITELISTED_DOMAINS = [
  // Government sites
  'gov',
  'wv.gov',
  'ssa.gov',
  'hhs.gov',
  'dol.gov',
  'va.gov',
  'fda.gov',
  'cdc.gov',
  'nih.gov',
  'medicare.gov',
  'medicaid.gov',
  
  // Educational institutions
  'edu',
  'wvu.edu',
  'marshall.edu',
  
  // Trusted non-profits and organizations
  'unitedway.org',
  'redcross.org',
  'goodwill.org',
  'salvationarmy.org',
  'catholiccharitiesusa.org',
  '211.org',
  'benefits.gov',
  'healthfinder.gov',
  
  // Major healthcare providers
  'camc.org',
  'wvumedicine.org',
  'monhealth.org',
  
  // Trusted service providers
  'servicesnow.com',
  'workforcewv.org',
  'dhhr.wv.gov',
  
  // Common trusted domains
  'wikipedia.org',
  'wikimedia.org'
];

export const isWhitelistedDomain = (url: string): boolean => {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    
    return WHITELISTED_DOMAINS.some(whitelistedDomain => {
      // Handle top-level domains like .gov, .edu
      if (whitelistedDomain.startsWith('.') || !whitelistedDomain.includes('.')) {
        return domain.endsWith(`.${whitelistedDomain}`) || domain === whitelistedDomain;
      }
      
      // Handle full domains
      return domain === whitelistedDomain || domain.endsWith(`.${whitelistedDomain}`);
    });
  } catch {
    return false;
  }
};

export const getDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
};

export const getDomainStatus = (url: string): 'verified' | 'warning' | 'blocked' => {
  const isWhitelisted = isWhitelistedDomain(url);
  
  if (isWhitelisted) {
    return 'verified';
  }
  
  // You could add additional logic here for different warning levels
  return 'warning';
};