import React from 'react';
import { RiskAssessment } from '../../types';
import { formatRiskScore } from '../../types';

interface OverviewSummaryProps {
  assessments: RiskAssessment[];
}

export const OverviewSummary: React.FC<OverviewSummaryProps> = ({ assessments }) => {
  if (assessments.length === 0) return null;

  // Latest per indicator
  const latestByIndicator = new Map<string, RiskAssessment>();
  assessments.forEach(a => {
    const existing = latestByIndicator.get(a.indicator_id);
    if (!existing || new Date(a.assessed_at) > new Date(existing.assessed_at)) {
      latestByIndicator.set(a.indicator_id, a);
    }
  });

  const uniqueAssessments = Array.from(latestByIndicator.values());
  const analyzed = uniqueAssessments.filter(a => a.risk_score !== null && a.risk_score !== undefined);
  
  const avgRisk = analyzed.length > 0 
    ? analyzed.reduce((sum, a) => sum + (a.risk_score || 0), 0) / analyzed.length 
    : 0;
  
  const confAnalyzed = analyzed.filter(a => a.confidence !== null && a.confidence !== undefined);
  const avgConfidence = confAnalyzed.length > 0
    ? confAnalyzed.reduce((sum, a) => sum + (a.confidence || 0), 0) / confAnalyzed.length
    : 0;

  const insufficientCount = uniqueAssessments.filter(a => a.status === 'insufficient_data' || a.risk_score === null || a.risk_score === undefined).length;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase">Overall Risk Score</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{formatRiskScore(avgRisk)} / 100</p>
        <p className="text-[10px] text-slate-400 mt-1">Heuristic aggregate across active indicators</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase">Avg Confidence</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{(avgConfidence * 100).toFixed(0)}%</p>
        <p className="text-[10px] text-slate-400 mt-1">Excludes null confidence records</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase">Insufficient Data</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{insufficientCount}</p>
        <p className="text-[10px] text-slate-400 mt-1">Indicators lacking recent telemetry</p>
      </div>
    </section>
  );
};