import React from 'react';
import { RiskAssessment, EnvironmentalIndicator } from '../../types';
import { formatRiskScore } from '../../types';

interface RiskTrendChartProps {
  assessments: RiskAssessment[];
  indicators: EnvironmentalIndicator[];
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ assessments, indicators }) => {
  const indicatorMap = new Map(indicators.map(i => [i.id, i]));

  // Latest per indicator
  const latestByIndicator = new Map<string, RiskAssessment>();
  assessments.forEach(a => {
    const existing = latestByIndicator.get(a.indicator_id);
    if (!existing || new Date(a.assessed_at) > new Date(existing.assessed_at)) {
      latestByIndicator.set(a.indicator_id, a);
    }
  });

  const uniqueAssessments = Array.from(latestByIndicator.values());

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-base font-semibold text-slate-900 mb-1">Risk Scores by Indicator</h3>
      <p className="text-xs text-slate-500 mb-4">Preliminary heuristic assessments (Not scientifically validated)</p>
      {uniqueAssessments.length === 0 ? (
        <p className="text-sm text-slate-500">No assessment data available.</p>
      ) : (
        <div className="space-y-3">
          {uniqueAssessments.map((a, index) => {
            const indicator = indicatorMap.get(a.indicator_id);
            const name = indicator ? indicator.name : a.indicator_id.slice(0, 8) + '...';
            const scoreVal = a.risk_score !== null && a.risk_score !== undefined ? Number(a.risk_score) * 100 : 0;
            const hasScore = a.risk_score !== null && a.risk_score !== undefined;

            return (
              <div key={index} className="flex items-center gap-3 text-xs">
                <span className="w-36 text-slate-700 font-medium shrink-0 truncate" title={name}>{name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  {hasScore ? (
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, scoreVal))}%` }}
                    />
                  ) : (
                    <div className="bg-gray-200 h-2.5 rounded-full w-full opacity-50" />
                  )}
                </div>
                <span className="w-12 text-right font-medium text-slate-700">
                  {formatRiskScore(a.risk_score)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};