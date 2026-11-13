import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { OverviewSummary } from './components/dashboard/OverviewSummary';
import { MonitoringCards } from './components/monitoring/MonitoringCards';
import { RiskAssessmentCard } from './components/risk/RiskAssessmentCard';
import { RiskTrendChart } from './components/charts/RiskTrendChart';
import { CityMap } from './components/map/CityMap';
import { useCityMonitoring } from './hooks/useCityMonitoring';
import { fetchIndicators } from './services/api';
import { EnvironmentalIndicator } from './types';

export const App: React.FC = () => {
  const [selectedCityCode, setSelectedCityCode] = useState<string>('kuala-lumpur');
  const { cities, currentCity, assessments, observations, loading, error } = useCityMonitoring(selectedCityCode);
  const [indicators, setIndicators] = useState<EnvironmentalIndicator[]>([]);

  useEffect(() => {
    fetchIndicators()
      .then(res => setIndicators(res.data || []))
      .catch(err => console.error('Failed to fetch indicators:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
      <Header
        cities={cities}
        currentCity={currentCity}
        onCityChange={setSelectedCityCode}
      />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}
        {loading && cities.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview KPI Section */}
            <OverviewSummary assessments={assessments} />
            
            {/* Three Column Layout: Map | Telemetry | Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Geographic Map */}
              <div className="lg:col-span-1">
                <CityMap currentCity={currentCity} cities={cities} />
              </div>
              
              {/* Center Column: Environmental Telemetry */}
              <div className="lg:col-span-1 min-w-0">
                <MonitoringCards observations={observations} indicators={indicators} />
              </div>
              
              {/* Right Column: Risk Assessment */}
              <div className="lg:col-span-1 min-w-0">
                <RiskAssessmentCard assessments={assessments} indicators={indicators} />
              </div>
            </div>
            
            {/* Bottom Section: Risk Analytics Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskTrendChart assessments={assessments} indicators={indicators} />
              <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
                <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  System Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-sm font-medium text-white">API Connection</span>
                    <span className="flex items-center gap-2 text-emerald-400 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-sm font-medium text-white">Data Freshness</span>
                    <span className="text-cyan-400 font-medium">Live</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-sm font-medium text-white">Last Sync</span>
                    <span className="text-slate-400 font-mono text-sm">{currentCity?.name ? new Date().toLocaleTimeString() : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="text-sm font-medium text-white">Cities Monitored</span>
                    <span className="text-white font-bold">{cities.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;