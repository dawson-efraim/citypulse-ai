import React from 'react';
import { RiskAssessment } from '../../types';
import { formatRiskScore } from '../../types';

interface OverviewSummaryProps {
  assessments: RiskAssessment[];
}

export const OverviewSummary: React.FC<OverviewSummaryProps> = ({ assessments }) => {
  if (assessments.length === 0) return null;

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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Risk Level</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-white">{formatRiskScore(avgRisk)}</p>
          <p className="text-sm font-medium text-slate-500">/ 100</p>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${avgRisk > 0.7 ? 'bg-red-500' : avgRisk > 0.4 ? 'bg-orange-400' : 'bg-cyan-500'}`}
            style={{ width: `${Math.min(100, (avgRisk * 100))}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm group">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg confidence</p>
        <p className="text-3xl font-black text-cyan-500 mt-1">{(avgConfidence * 100).toFixed(0)}%</p>
        <p className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">Based on {confAnalyzed.length} verified metrics</p>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Insufficient Data</p>
        <p className="text-3xl font-black text-slate-200 mt-1">{insufficientCount}</p>
        <p className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">Lacking telemetry streams</p>
      </div>

      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Indicators</p>
        <p className="text-3xl font-black text-white mt-1">{uniqueAssessments.length}</p>
        <p className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">Total streams monitored</p>
      </div>
    </section>
  );
};