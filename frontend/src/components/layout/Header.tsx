import React from 'react';
import { City } from '../../types';

interface HeaderProps {
  cities: City[];
  currentCity: City | null;
  onCityChange: (cityCode: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cities, currentCity, onCityChange }) => {
  return (
    <header className="bg-slate-900 text-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 shadow-md gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-inner">
          CP
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white block">CityPulse AI</span>
          <span className="text-[11px] text-cyan-400 font-medium tracking-wide uppercase">Urban Intelligence & Risk Command</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>API Connected</span>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="city-select" className="text-xs font-medium text-slate-400 uppercase tracking-wider">City:</label>
          <select
            id="city-select"
            value={currentCity?.city_code || ''}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm font-medium rounded-lg px-3.5 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition shadow-sm"
            disabled={cities.length === 0}
          >
            {cities.map((city) => (
              <option key={city.id} value={city.city_code}>{city.name} ({city.country_code})</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};