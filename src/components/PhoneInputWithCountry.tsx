import React, { useState, useEffect, useRef } from 'react';
import { Phone, CheckCircle2, ChevronDown, Search, Globe, AlertCircle, ShieldCheck } from 'lucide-react';

export interface CountryCodeInfo {
  code: string; // e.g. "+91"
  iso: string;  // e.g. "IN"
  name: string; // e.g. "India"
  flag: string; // e.g. "🇮🇳"
  formatHint: string; // e.g. "10 digits (e.g. 98765 43210)"
  minDigits: number;
  maxDigits: number;
  pattern?: RegExp;
}

export const COUNTRIES_LIST: CountryCodeInfo[] = [
  { code: '+91', iso: 'IN', name: 'India', flag: '🇮🇳', formatHint: '10 digits (e.g. 98765 43210)', minDigits: 10, maxDigits: 10, pattern: /^[6-9]\d{9}$/ },
  { code: '+1', iso: 'US', name: 'United States', flag: '🇺🇸', formatHint: '10 digits (e.g. 202 555 0191)', minDigits: 10, maxDigits: 10 },
  { code: '+44', iso: 'GB', name: 'United Kingdom', flag: '🇬🇧', formatHint: '10-11 digits (e.g. 7911 123456)', minDigits: 10, maxDigits: 11 },
  { code: '+1', iso: 'CA', name: 'Canada', flag: '🇨🇦', formatHint: '10 digits (e.g. 416 555 0184)', minDigits: 10, maxDigits: 10 },
  { code: '+971', iso: 'AE', name: 'United Arab Emirates (UAE)', flag: '🇦🇪', formatHint: '9 digits (e.g. 50 123 4567)', minDigits: 9, maxDigits: 9 },
  { code: '+65', iso: 'SG', name: 'Singapore', flag: '🇸🇬', formatHint: '8 digits (e.g. 8123 4567)', minDigits: 8, maxDigits: 8 },
  { code: '+61', iso: 'AU', name: 'Australia', flag: '🇦🇺', formatHint: '9 digits (e.g. 412 345 678)', minDigits: 9, maxDigits: 9 },
  { code: '+49', iso: 'DE', name: 'Germany', flag: '🇩🇪', formatHint: '10-11 digits (e.g. 151 23456789)', minDigits: 10, maxDigits: 11 },
  { code: '+33', iso: 'FR', name: 'France', flag: '🇫🇷', formatHint: '9 digits (e.g. 6 12 34 56 78)', minDigits: 9, maxDigits: 9 },
  { code: '+81', iso: 'JP', name: 'Japan', flag: '🇯🇵', formatHint: '10 digits (e.g. 90 1234 5678)', minDigits: 10, maxDigits: 10 },
  { code: '+966', iso: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', formatHint: '9 digits (e.g. 50 123 4567)', minDigits: 9, maxDigits: 9 },
  { code: '+880', iso: 'BD', name: 'Bangladesh', flag: '🇧🇩', formatHint: '10 digits (e.g. 1712 345678)', minDigits: 10, maxDigits: 10 },
  { code: '+977', iso: 'NP', name: 'Nepal', flag: '🇳🇵', formatHint: '10 digits (e.g. 984 1234567)', minDigits: 10, maxDigits: 10 },
  { code: '+94', iso: 'LK', name: 'Sri Lanka', flag: '🇱🇰', formatHint: '9 digits (e.g. 71 234 5678)', minDigits: 9, maxDigits: 9 },
  { code: '+60', iso: 'MY', name: 'Malaysia', flag: '🇲🇾', formatHint: '9-10 digits (e.g. 12 345 6789)', minDigits: 9, maxDigits: 10 },
  { code: '+62', iso: 'ID', name: 'Indonesia', flag: '🇮🇩', formatHint: '10-12 digits (e.g. 812 3456 7890)', minDigits: 10, maxDigits: 12 },
  { code: '+55', iso: 'BR', name: 'Brazil', flag: '🇧🇷', formatHint: '11 digits (e.g. 11 91234 5678)', minDigits: 11, maxDigits: 11 },
  { code: '+27', iso: 'ZA', name: 'South Africa', flag: '🇿🇦', formatHint: '9 digits (e.g. 82 123 4567)', minDigits: 9, maxDigits: 9 },
  { code: '+64', iso: 'NZ', name: 'New Zealand', flag: '🇳🇿', formatHint: '9 digits (e.g. 21 123 4567)', minDigits: 9, maxDigits: 9 },
  { code: '+353', iso: 'IE', name: 'Ireland', flag: '🇮🇪', formatHint: '9 digits (e.g. 85 123 4567)', minDigits: 9, maxDigits: 9 },
  { code: '+31', iso: 'NL', name: 'Netherlands', flag: '🇳🇱', formatHint: '9 digits (e.g. 6 12345678)', minDigits: 9, maxDigits: 9 },
  { code: '+41', iso: 'CH', name: 'Switzerland', flag: '🇨🇭', formatHint: '9 digits (e.g. 78 123 45 67)', minDigits: 9, maxDigits: 9 },
  { code: '+46', iso: 'SE', name: 'Sweden', flag: '🇸🇪', formatHint: '9 digits (e.g. 70 123 45 67)', minDigits: 9, maxDigits: 9 }
];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullPhoneNumber: string) => void;
  required?: boolean;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  required = true,
  id = 'phone-input-country',
  className = '',
  disabled = false
}) => {
  // Parse existing value or default to India (+91)
  const parsePhoneValue = (val: string) => {
    if (!val) return { country: COUNTRIES_LIST[0], localNum: '' };
    const cleaned = val.trim();
    
    // Check if starts with any country code
    for (const c of COUNTRIES_LIST) {
      if (cleaned.startsWith(c.code)) {
        const local = cleaned.slice(c.code.length).replace(/[\s\-()]/g, '');
        return { country: c, localNum: local };
      }
    }
    
    // Check if raw numbers starting with 91
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      return { country: COUNTRIES_LIST[0], localNum: cleaned.slice(2).replace(/[\s\-()]/g, '') };
    }

    // Default to India if local number provided
    return { country: COUNTRIES_LIST[0], localNum: cleaned.replace(/[\s\-()]/g, '') };
  };

  const initialParsed = parsePhoneValue(value);
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeInfo>(initialParsed.country);
  const [phoneNumber, setPhoneNumber] = useState<string>(initialParsed.localNum);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync when value prop changes externally
  useEffect(() => {
    const parsed = parsePhoneValue(value);
    setSelectedCountry(parsed.country);
    setPhoneNumber(parsed.localNum);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle phone input changes with auto-detection of prefixes like "+91", "+1", "+44", etc.
  const handleInputChange = (rawInput: string) => {
    let input = rawInput.trim();

    // Check if user is typing a '+' with a country code
    if (input.startsWith('+')) {
      for (const country of COUNTRIES_LIST) {
        if (input.startsWith(country.code)) {
          const digitsAfter = input.slice(country.code.length).replace(/\D/g, '');
          setSelectedCountry(country);
          setPhoneNumber(digitsAfter);
          const full = digitsAfter ? `${country.code} ${digitsAfter}` : country.code;
          onChange(full);
          return;
        }
      }
    }

    // If starts with 91 followed by 10 digits
    if (input.startsWith('91') && input.length === 12 && /^\d+$/.test(input)) {
      const india = COUNTRIES_LIST[0];
      const digits = input.slice(2);
      setSelectedCountry(india);
      setPhoneNumber(digits);
      onChange(`${india.code} ${digits}`);
      return;
    }

    // Only allow digits in local number
    const cleanDigits = input.replace(/\D/g, '');
    setPhoneNumber(cleanDigits);
    const full = cleanDigits ? `${selectedCountry.code} ${cleanDigits}` : '';
    onChange(full);
  };

  const handleCountrySelect = (country: CountryCodeInfo) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchFilter('');
    const full = phoneNumber ? `${country.code} ${phoneNumber}` : '';
    onChange(full);
  };

  // Validation logic
  const isIndia = selectedCountry.code === '+91';
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  
  let isValid = false;
  let validationMessage = '';

  if (cleanDigits.length === 0) {
    isValid = false;
    validationMessage = `Enter ${selectedCountry.name} mobile number`;
  } else if (isIndia) {
    if (cleanDigits.length === 10) {
      if (/^[6-9]/.test(cleanDigits)) {
        isValid = true;
        validationMessage = 'Verified Indian Mobile Number (+91 format valid)';
      } else {
        isValid = false;
        validationMessage = 'Indian mobile numbers usually start with 6, 7, 8, or 9';
      }
    } else {
      isValid = false;
      validationMessage = `India numbers must be exactly 10 digits (${cleanDigits.length}/10 entered)`;
    }
  } else {
    if (cleanDigits.length >= selectedCountry.minDigits && cleanDigits.length <= selectedCountry.maxDigits) {
      isValid = true;
      validationMessage = `Verified ${selectedCountry.name} phone number format`;
    } else {
      isValid = false;
      validationMessage = `Expected ${selectedCountry.formatHint} (${cleanDigits.length} entered)`;
    }
  }

  // Filter countries
  const filteredCountries = COUNTRIES_LIST.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.code.includes(searchFilter) ||
    c.iso.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="relative flex items-center">
        {/* Country Selector Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            id="country-code-selector-btn"
            className="h-9.5 px-2.5 bg-slate-100 hover:bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl flex items-center gap-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
            title="Click to select country code"
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-mono font-bold text-slate-900">{selectedCountry.code}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Search Header */}
              <div className="p-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search country or code (e.g. India, +91, US)..."
                  className="w-full text-xs bg-transparent border-none outline-none text-slate-800"
                  autoFocus
                />
              </div>

              {/* Quick Pin for India & Top Countries */}
              <div className="p-1.5 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-indigo-900 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-600" />
                  <span>Popular Country Codes:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCountrySelect(COUNTRIES_LIST[0])}
                  className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-indigo-700 font-bold hover:bg-indigo-100 cursor-pointer"
                >
                  🇮🇳 India (+91)
                </button>
              </div>

              {/* Countries List */}
              <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-50">
                {filteredCountries.map((c) => (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full p-2 flex items-center justify-between text-left text-xs rounded-lg transition-colors cursor-pointer ${
                      selectedCountry.iso === c.iso && selectedCountry.code === c.code
                        ? 'bg-indigo-50 text-indigo-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 shrink-0 ml-2">
                      {c.code}
                    </span>
                  </button>
                ))}

                {filteredCountries.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local Number Input */}
        <div className="relative flex-1">
          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="tel"
            id={id}
            required={required}
            disabled={disabled}
            value={phoneNumber}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={isIndia ? '98765 43210 (or type +91...)' : selectedCountry.formatHint}
            className={`w-full h-9.5 pl-8.5 pr-20 border border-slate-300 rounded-r-xl text-xs font-mono font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
              isValid ? 'border-emerald-400 bg-emerald-50/10' : cleanDigits.length > 0 ? 'border-amber-400' : ''
            }`}
          />

          {/* Direct Country Identifier Pill inside Input */}
          <div className="absolute right-2.5 top-2 flex items-center gap-1 pointer-events-none">
            {isValid ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{selectedCountry.iso} Verified</span>
              </span>
            ) : isIndia ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md">
                <span>🇮🇳 India</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">
                <span>{selectedCountry.iso}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Status Banner / Dynamic Feedback */}
      <div className="flex items-center justify-between text-[11px] px-1">
        <div className="flex items-center gap-1.5">
          {isValid ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isIndia ? '✓ Verified India (+91) Mobile Number' : `✓ Verified ${selectedCountry.name} Number`}</span>
            </span>
          ) : cleanDigits.length > 0 ? (
            <span className="text-amber-700 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>{validationMessage}</span>
            </span>
          ) : (
            <span className="text-slate-500 flex items-center gap-1">
              <span>{selectedCountry.flag} Country: <strong>{selectedCountry.name} ({selectedCountry.code})</strong></span>
            </span>
          )}
        </div>

        <span className="text-slate-400 font-mono text-[10px]">
          {cleanDigits.length > 0 ? `${cleanDigits.length} digits` : selectedCountry.formatHint}
        </span>
      </div>
    </div>
  );
};
