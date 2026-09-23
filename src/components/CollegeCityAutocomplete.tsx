import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  School, 
  GraduationCap, 
  X, 
  Navigation, 
  Compass, 
  Loader2, 
  Globe2, 
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { 
  COLLEGES_DATABASE, 
  POPULAR_CITIES, 
  KNOWN_CITIES, 
  CollegeItem, 
  searchColleges, 
  findNearestCity 
} from '../data/collegesData';

interface CollegeCityAutocompleteProps {
  collegeName: string;
  cityName?: string;
  onChangeCollege: (name: string) => void;
  onChangeCity?: (city: string) => void;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  showCityInput?: boolean;
}

export const CollegeCityAutocomplete: React.FC<CollegeCityAutocompleteProps> = ({
  collegeName,
  cityName = '',
  onChangeCollege,
  onChangeCity,
  required = true,
  disabled = false,
  id = 'college-autocomplete-input',
  label = 'College / University Name',
  showCityInput = true,
}) => {
  const [query, setQuery] = useState(collegeName);
  const [city, setCity] = useState(cityName);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCityPill, setSelectedCityPill] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsMessage, setGpsMessage] = useState<string>('');
  const [showAllCitiesModal, setShowAllCitiesModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with external prop updates
  useEffect(() => {
    setQuery(collegeName);
  }, [collegeName]);

  useEffect(() => {
    setCity(cityName);
  }, [cityName]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect GPS location
  const handleDetectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('locating');
    setGpsMessage('Acquiring real-time GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });

        let detectedCityName = '';
        let detectedState = '';

        // Try reverse geocoding via OpenStreetMap
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (resp.ok) {
            const data = await resp.json();
            const addr = data.address || {};
            detectedCityName = addr.city || addr.town || addr.district || addr.county || addr.state_district || '';
            detectedState = addr.state || '';
          }
        } catch {
          // Fallback to offline nearest city calculation
        }

        if (!detectedCityName) {
          const nearest = findNearestCity(lat, lng);
          detectedCityName = nearest.city.name;
          detectedState = nearest.city.state;
        }

        setGpsStatus('success');
        setGpsMessage(`GPS Detected: ${detectedCityName}${detectedState ? `, ${detectedState}` : ''}`);
        
        // Auto-update city
        setCity(detectedCityName);
        if (onChangeCity) {
          onChangeCity(detectedCityName);
        }
        setSelectedCityPill(detectedCityName);
        setIsOpen(true);
      },
      (err) => {
        console.warn('GPS location error:', err);
        // Fallback default city helper
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsMessage('Location permission denied. Please select or type your city manually.');
        } else {
          setGpsMessage('Could not retrieve GPS position. Select from all cities below.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Compute matched suggestions based on query, city filter, and GPS location
  const suggestions = useMemo(() => {
    const effectiveCityFilter = selectedCityPill || (city ? city : undefined);
    return searchColleges(query, effectiveCityFilter, userLocation || undefined);
  }, [query, city, selectedCityPill, userLocation]);

  const handleSelectCollege = (college: CollegeItem) => {
    setQuery(college.name);
    onChangeCollege(college.name);

    if (onChangeCity) {
      setCity(college.city);
      onChangeCity(college.city);
    }
    setIsOpen(false);
  };

  const handleCityPillClick = (cityNameToFilter: string) => {
    if (selectedCityPill === cityNameToFilter) {
      setSelectedCityPill(null);
    } else {
      setSelectedCityPill(cityNameToFilter);
      if (onChangeCity && !city) {
        setCity(cityNameToFilter);
        onChangeCity(cityNameToFilter);
      }
    }
    setIsOpen(true);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onChangeCollege(val);
    setIsOpen(true);

    // If user types a known city, prioritize it
    const lower = val.toLowerCase().trim();
    const matchedCity = KNOWN_CITIES.find(
      c => c.name.toLowerCase() === lower || lower.startsWith(c.name.toLowerCase())
    );
    if (matchedCity) {
      setSelectedCityPill(matchedCity.name);
      if (onChangeCity) {
        setCity(matchedCity.name);
        onChangeCity(matchedCity.name);
      }
    }
  };

  const handleCityInputChange = (val: string) => {
    setCity(val);
    if (onChangeCity) onChangeCity(val);
    setSelectedCityPill(val ? val : null);
    setIsOpen(true);
  };

  const handleUseCustomCollege = () => {
    onChangeCollege(query);
    if (onChangeCity && city) {
      onChangeCity(city);
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Location Detection Notification Banner */}
      {gpsStatus !== 'idle' && (
        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
          gpsStatus === 'locating' 
            ? 'bg-blue-50 border-blue-200 text-blue-800' 
            : gpsStatus === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            {gpsStatus === 'locating' && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            {gpsStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {gpsStatus === 'error' && <AlertCircle className="w-4 h-4 text-amber-600" />}
            <span className="font-medium">{gpsMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setGpsStatus('idle')}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* College Name Input */}
        <div className={`relative ${showCityInput ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor={id} className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{label}</span>
              {required && <span className="text-red-500">*</span>}
            </label>
            <span className="text-[10px] text-indigo-600 font-medium hidden sm:inline">
              ⚡ Global Directory (Any City / GPS)
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              id={id}
              required={required}
              disabled={disabled}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Type any college or university (e.g. MIET Meerut, MJPRU Bareilly, JIIT, IIT)..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 transition-all"
            />
            <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  onChangeCollege('');
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* City Input with GPS Quick Trigger */}
        {showCityInput && (
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Campus City / Location</span>
              </label>
              
              <button
                type="button"
                onClick={handleDetectGpsLocation}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200"
                title="Detect Campus Location via GPS"
              >
                <Navigation className="w-2.5 h-2.5" />
                <span>GPS Locate</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={city}
                disabled={disabled}
                onChange={(e) => handleCityInputChange(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder="e.g. Meerut, Bareilly, Noida, Lucknow"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown Suggestions Panel */}
      {isOpen && (
        <div className="bg-white border border-indigo-200 rounded-2xl shadow-xl p-3 space-y-2.5 z-30 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Quick City Filters Bar with GPS trigger and Meerut / Bareilly prominent badges */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filter by Campus City:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCityPill(null);
                  setIsOpen(true);
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  !selectedCityPill
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                🌐 All India / Global
              </button>

              <button
                type="button"
                onClick={handleDetectGpsLocation}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-2.5 h-2.5 text-emerald-600" />
                <span>📍 Use GPS</span>
              </button>

              {/* Priority Cities including Meerut, Bareilly, Noida, Lucknow, etc. */}
              {POPULAR_CITIES.slice(0, 8).map(cName => {
                const isSelected = selectedCityPill?.toLowerCase() === cName.toLowerCase() || city?.toLowerCase() === cName.toLowerCase();
                return (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => handleCityPillClick(cName)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    📍 {cName}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowAllCitiesModal(true)}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                + More Cities
              </button>
            </div>
          </div>

          {/* College Results List */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {suggestions.length > 0 ? (
              suggestions.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => handleSelectCollege(col)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/80 border border-transparent hover:border-indigo-200 transition-all flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">
                        {col.name}
                      </span>
                      {col.tier && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {col.tier.includes('Tier 1') ? '★ Tier 1' : 'Top Tier'}
                        </span>
                      )}
                      {col.distanceKm !== undefined && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                          <Navigation className="w-2.5 h-2.5" />
                          <span>{col.distanceKm} km away</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{col.city}, {col.state}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 font-mono text-[10px]">{col.type}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                    <span className="text-[10px] font-bold mr-1">Select</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-600 space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    No directory preset found for "{query}".
                  </p>
                  <p className="text-[11px] text-slate-500">
                    You can register and proceed with your custom institution from anywhere across the globe.
                  </p>
                </div>

                {query.trim() && (
                  <button
                    type="button"
                    onClick={handleUseCustomCollege}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Use "{query}" ({city || 'Custom Location'})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar Controls */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Showing {suggestions.length} institutions (Supports any Indian & Global location)</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close Suggestions
            </button>
          </div>
        </div>
      )}

      {/* All Cities Selector Modal */}
      {showAllCitiesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Select Campus City / Region</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllCitiesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select your educational hub to instantly browse all colleges and affiliated engineering institutes:
            </p>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
              {KNOWN_CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    handleCityPillClick(c.name);
                    setCity(c.name);
                    if (onChangeCity) onChangeCity(c.name);
                    setShowAllCitiesModal(false);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    city.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.state}</div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedCityPill(null);
                  setShowAllCitiesModal(false);
                }}
                className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                Clear City Filter (Show All)
              </button>

              <button
                type="button"
                onClick={() => setShowAllCitiesModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
