import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { OverviewSummary } from './components/dashboard/OverviewSummary';
import { MonitoringCards } from './components/monitoring/MonitoringCards';
import { RiskAssessmentCard } from './components/risk/RiskAssessmentCard';
import { RiskTrendChart } from './components/charts/RiskTrendChart';
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
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
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
            <OverviewSummary assessments={assessments} />
            <MonitoringCards observations={observations} indicators={indicators} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskAssessmentCard assessments={assessments} indicators={indicators} />
              <RiskTrendChart assessments={assessments} indicators={indicators} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;