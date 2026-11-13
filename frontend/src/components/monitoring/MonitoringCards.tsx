import React from 'react';
import { Observation, EnvironmentalIndicator } from '../../types';
import { formatSafeNumber } from '../../utils';

const INDICATOR_ICONS: Record<string, React.ReactNode> = {
  temperature: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  humidity: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22h8a2 2 0 002-2v-6a2 2 0 00-2-2h-2.42a6 6 0 00-1.172-12.36L15.5 7.5 17 9l1.5-1.5L21 12l-2.5 4.5-1.5-1.5-1.5 1.5L13 18.5l-1.5 1.5a6 6 0 001.172 12.36H20a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h8z" /></svg>,
  wind_speed: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" /></svg>,
  rainfall: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15.174V21a2 2 0 002 2h14a2 2 0 002-2v-5.826m-12 0h12m-12 0a10 10 0 014.993-8.593 9.997 9.997 0 015.996 0 10 10 0 014.993 8.593m-12 0V21a2 2 0 002 2h14a2 2 0 002-2v-5.826" /></svg>,
  pm25: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  pm10: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
};

const INDICATOR_UNITS: Record<string, string> = {
  temperature: '°C',
  humidity: '%',
  wind_speed: 'km/h',
  rainfall: 'mm',
  pm25: 'µg/m³',
  pm10: 'µg/m³',
};

interface MonitoringCardsProps {
  observations: Observation[];
  indicators: EnvironmentalIndicator[];
}

export const MonitoringCards: React.FC<MonitoringCardsProps> = ({ observations, indicators }) => {
  const indicatorMap = new Map(indicators.map(i => [i.id, i]));

  // Get latest observation per indicator
  const latestByIndicator = new Map<string, Observation>();
  observations.forEach(obs => {
    const existing = latestByIndicator.get(obs.indicator_id);
    if (!existing || new Date(obs.observed_at) > new Date(existing.observed_at)) {
      latestByIndicator.set(obs.indicator_id, obs);
    }
  });

  const telemetry = Array.from(latestByIndicator.entries())
    .map(([indicatorId, obs]) => {
      const indicator = indicatorMap.get(indicatorId);
      return indicator ? { ...obs, indicator } : null;
    })
    .filter((x): x is { indicator: EnvironmentalIndicator; value: number; observed_at: string } => x !== null)
    .sort((a, b) => a.indicator.name.localeCompare(b.indicator.name));

  if (telemetry.length === 0) return null;

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
      <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
        Environmental Telemetry
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetry.map(({ indicator, value, observed_at }) => {
          const unit = INDICATOR_UNITS[indicator.name] || '';
          const icon = INDICATOR_ICONS[indicator.name] || (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          );

          return (
            <div key={indicator.id} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors duration-200 group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-700 text-cyan-400">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{indicator.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{new Date(observed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                <span className="text-2xl font-bold text-white tabular-nums">{formatSafeNumber(value)}</span>
                <span className="text-xs text-slate-500 font-medium">{unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};