import React from 'react';
import { RiskAssessment, EnvironmentalIndicator } from '../../types';
import { getSeverityColor, formatRiskScore, formatTimestamp } from '../../types';

interface RiskAssessmentCardProps {
  assessments: RiskAssessment[];
  indicators: EnvironmentalIndicator[];
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({ assessments, indicators }) => {
  if (assessments.length === 0) return null;

  const indicatorMap = new Map(indicators.map(i => [i.id, i]));

  // Group assessments by indicator_id and take the latest per indicator
  const latestByIndicator = new Map<string, RiskAssessment>();
  assessments.forEach(a => {
    const existing = latestByIndicator.get(a.indicator_id);
    if (!existing || new Date(a.assessed_at) > new Date(existing.assessed_at)) {
      latestByIndicator.set(a.indicator_id, a);
    }
  });

  const uniqueAssessments = Array.from(latestByIndicator.values());
  const analyzed = uniqueAssessments.filter(a => a.status === 'analyzed' || (a.risk_score !== null && a.risk_score !== undefined));
  const insufficient = uniqueAssessments.filter(a => a.status === 'insufficient_data' || a.risk_score === null || a.risk_score === undefined);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-base font-semibold text-slate-900 mb-1">Risk Assessments</h3>
      <p className="text-xs text-slate-500 mb-4">Latest heuristic assessment per indicator (0–100 scale)</p>
      
      {analyzed.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Analyzed Indicators</p>
          <ul className="space-y-2">
            {analyzed.map((assessment) => {
              const indicator = indicatorMap.get(assessment.indicator_id);
              const name = indicator ? indicator.name : assessment.indicator_id.slice(0, 8) + '...';
              return (
                <li key={assessment.id || assessment.indicator_id} className="text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 px-3 py-2 rounded gap-1">
                  <div>
                    <span className="font-medium text-slate-900">{name}</span>
                    {assessment.assessed_at && (
                      <span className="block text-[10px] text-slate-400">{formatTimestamp(assessment.assessed_at)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {assessment.confidence !== undefined && assessment.confidence !== null && (
                      <span className="text-xs text-slate-500">{(assessment.confidence * 100).toFixed(0)}% conf</span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(assessment.severity as any)}`}>
                      {formatRiskScore(assessment.risk_score)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {insufficient.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Insufficient Data</p>
          <ul className="space-y-2">
            {insufficient.map((assessment) => {
              const indicator = indicatorMap.get(assessment.indicator_id);
              const name = indicator ? indicator.name : assessment.indicator_id.slice(0, 8) + '...';
              return (
                <li key={assessment.id || assessment.indicator_id} className="text-sm text-slate-700 flex items-center justify-between bg-slate-50 px-3 py-2 rounded">
                  <div>
                    <span className="font-medium text-slate-900">{name}</span>
                    <span className="block text-[10px] text-slate-400">Insufficient Data</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                    —
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};