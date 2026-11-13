import React from 'react';
import { Observation, EnvironmentalIndicator } from '../../types';
import { formatSafeNumber } from '../../utils';

interface MonitoringCardsProps {
  observations: Observation[];
  indicators: EnvironmentalIndicator[];
}

export const MonitoringCards: React.FC<MonitoringCardsProps> = ({ observations, indicators }) => {
  if (observations.length === 0) return null;

  const indicatorMap = new Map(indicators.map(i => [i.id, i]));
  const latestByIndicator = new Map<string, Observation>();
  observations.forEach(obs => {
    if (!latestByIndicator.has(obs.indicator_id) || new Date(obs.observed_at) > new Date(latestByIndicator.get(obs.indicator_id)!.observed_at)) {
      latestByIndicator.set(obs.indicator_id, obs);
    }
  });

  const cards = Array.from(latestByIndicator.entries()).map(([indicatorId, obs]) => {
    const indicator = indicatorMap.get(indicatorId);
    const label = indicator ? indicator.name : 'Unknown';
    const unit = indicator ? indicator.unit : '';
    const value = obs.value !== undefined && obs.value !== null ? formatSafeNumber(obs.value) : '—';
    const isError = obs.status !== 'active';

    return (
      <div key={indicatorId} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          <span className={`h-2 w-2 rounded-full ${isError ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <p className="text-2xl font-black text-white">{value}</p>
          <p className="text-xs text-slate-500 font-medium">{unit}</p>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase">{indicator?.category || 'General'}</p>
      </div>
    );
  });

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
        Environmental Telemetry
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards}
      </div>
    </div>
  );
};