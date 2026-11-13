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
    <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
      <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
        Indicator Risk Assessment
      </h3>
      
      {analyzed.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Verified Analytics</p>
          <ul className="space-y-3">
            {analyzed.map((assessment) => {
              const indicator = indicatorMap.get(assessment.indicator_id);
              const name = indicator ? indicator.name : 'Unknown Indicator';
              const severityClass = assessment.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                   assessment.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                   assessment.severity === 'moderate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <li key={assessment.id} className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{formatTimestamp(assessment.assessed_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{Math.round((assessment.confidence || 0) * 100)}% Conf</span>
                    <span className={`px-3 py-1 rounded-md text-xs font-bold border ${severityClass}`}>
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
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">Insufficient Data</p>
          <ul className="space-y-2">
            {insufficient.map((assessment) => {
              const indicator = indicatorMap.get(assessment.indicator_id);
              return (
                <li key={assessment.id} className="flex items-center justify-between bg-slate-950/30 p-3 rounded-lg border border-dashed border-slate-800">
                  <span className="text-sm font-medium text-slate-400">{indicator?.name || 'Unknown'}</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">No Data</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};