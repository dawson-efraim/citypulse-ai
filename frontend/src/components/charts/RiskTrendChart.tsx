import React from 'react';
import { RiskAssessment, EnvironmentalIndicator } from '../../types';
import { formatRiskScore } from '../../types';

interface RiskTrendChartProps {
  assessments: RiskAssessment[];
  indicators: EnvironmentalIndicator[];
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ assessments, indicators }) => {
  const indicatorMap = new Map(indicators.map(i => [i.id, i]));

  const latestByIndicator = new Map<string, RiskAssessment>();
  assessments.forEach(a => {
    const existing = latestByIndicator.get(a.indicator_id);
    if (!existing || new Date(a.assessed_at) > new Date(existing.assessed_at)) {
      latestByIndicator.set(a.indicator_id, a);
    }
  });

  const uniqueAssessments = Array.from(latestByIndicator.values()).sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));

  const getBarColor = (score?: number) => {
    if (score === null || score === undefined) return 'bg-slate-700';
    if (score >= 0.7) return 'bg-red-500';
    if (score >= 0.4) return 'bg-orange-400';
    if (score >= 0.2) return 'bg-yellow-400';
    return 'bg-cyan-500';
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
      <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
        Risk Analytics
      </h3>
      <p className="text-[10px] text-slate-500 mb-6 font-medium tracking-wide uppercase">Preliminary Heuristic Assessment (0-100 Scale)</p>
      
      {uniqueAssessments.length === 0 ? (
        <p className="text-sm text-slate-500">No assessment data available.</p>
      ) : (
        <div className="space-y-4">
          {uniqueAssessments.map((a, index) => {
            const indicator = indicatorMap.get(a.indicator_id);
            const name = indicator ? indicator.name : 'Unknown';
            const scoreVal = a.risk_score !== null && a.risk_score !== undefined ? Number(a.risk_score) * 100 : 0;
            const hasScore = a.risk_score !== null && a.risk_score !== undefined;

            return (
              <div key={index} className="group">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-slate-300">{name}</span>
                  <span className="text-xs font-bold text-white">{formatRiskScore(a.risk_score)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  {hasScore ? (
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getBarColor(a.risk_score)}`}
                      style={{ width: `${Math.min(100, Math.max(0, scoreVal))}%` }}
                    />
                  ) : (
                    <div className="bg-slate-700/50 h-full w-full rounded-full" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};