import React from 'react';
import { RiskAssessment } from '../../types';

interface OverviewSummaryProps {
  assessments: RiskAssessment[];
}

export const OverviewSummary: React.FC<OverviewSummaryProps> = ({ assessments }) => {
  const analyzed = assessments.filter(a => a.risk_score !== null && a.risk_score !== undefined);
  const avgRisk = analyzed.length > 0
    ? Math.round((analyzed.reduce((acc, curr) => acc + (curr.risk_score || 0), 0) / analyzed.length) * 100)
    : 0;

  const confList = assessments.filter(a => a.confidence !== null && a.confidence !== undefined);
  const avgConf = confList.length > 0
    ? Math.round((confList.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / confList.length) * 100)
    : 0;

  const insufficientCount = assessments.filter(a => a.status === 'insufficient_data' || a.risk_score === null || a.risk_score === undefined).length;
  const activeCount = analyzed.length;

  // AQI style gauge color
  const getGaugeColor = (score: number) => {
    if (score >= 70) return 'text-red-500 border-red-500/20 bg-red-500/10';
    if (score >= 40) return 'text-orange-400 border-orange-500/20 bg-orange-500/10';
    if (score >= 20) return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
    return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall Risk Score with Gauge Style */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between relative overflow-hidden group">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Risk Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{avgRisk}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {avgRisk > 60 ? 'High Alert' : avgRisk > 30 ? 'Moderate' : 'Stable'}
          </span>
        </div>
        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-sm ${getGaugeColor(avgRisk)}`}>
          {avgRisk}%
        </div>
      </div>

      {/* Average Confidence */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Average Confidence</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{avgConf}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Model confidence metric</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold">
          AI
        </div>
      </div>

      {/* Insufficient Data */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Insufficient Data</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-400 tracking-tight">{insufficientCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Pending telemetry</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 font-bold">
          —
        </div>
      </div>

      {/* Active Indicators */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Indicators</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{activeCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Monitored parameters</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
          ✓
        </div>
      </div>
    </div>
  );
};
