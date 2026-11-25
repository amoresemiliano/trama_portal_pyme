import React, { useMemo } from 'react';
import { useTrama } from '../../context/TramaContext';
import { HorizontalBarChart } from '../../components/AdminCharts';

export const AdminAnalyticsPage: React.FC = () => {
  const { state } = useTrama();

  const analytics = useMemo(() => {
    const oppCategoryMap = new Map<string, number>();
    state.opportunities.forEach((o) => {
      oppCategoryMap.set(o.category, (oppCategoryMap.get(o.category) ?? 0) + 1);
    });
    const oppByCategory = Array.from(oppCategoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({
        label,
        value,
        color: i % 3 === 0 ? '#F26444' : i % 3 === 1 ? '#2563EB' : '#00A995',
      }));

    const exportMap = new Map<string, number>();
    state.companies.forEach((c) => {
      exportMap.set(c.exportReadiness, (exportMap.get(c.exportReadiness) ?? 0) + 1);
    });
    const exportBreakdown = Array.from(exportMap.entries()).map(([label, value], i) => ({
      label,
      value,
      color: i === 0 ? '#00A995' : i === 1 ? '#2563EB' : '#F4BB45',
    }));

    const sizeMap = new Map<string, number>();
    state.companies.forEach((c) => {
      sizeMap.set(c.size, (sizeMap.get(c.size) ?? 0) + 1);
    });
    const sizeBreakdown = Array.from(sizeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: '#2563EB' }));

    const regionMap = new Map<
      string,
      { companies: number; verified: number; exporters: number; opportunities: number }
    >();
    state.companies.forEach((c) => {
      const curr = regionMap.get(c.location.region) ?? {
        companies: 0,
        verified: 0,
        exporters: 0,
        opportunities: 0,
      };
      curr.companies += 1;
      if (c.verificationStatus === 'verified_demo') curr.verified += 1;
      if (c.exportReadiness !== 'Mercado local') curr.exporters += 1;
      regionMap.set(c.location.region, curr);
    });
    state.opportunities.forEach((o) => {
      const comp = state.companies.find((c) => c.id === o.companyId);
      if (comp) {
        const curr = regionMap.get(comp.location.region);
        if (curr) curr.opportunities += 1;
      }
    });

    const regionalSummary = Array.from(regionMap.entries())
      .map(([region, stats]) => ({ region, ...stats }))
      .sort((a, b) => b.companies - a.companies);

    const avgCompat =
      state.connections.length > 0
        ? Math.round(
            state.connections.reduce((sum, c) => sum + c.compatibilityScore, 0) /
              state.connections.length
          )
        : 0;

    const totalInterests = state.opportunities.reduce(
      (sum, o) => sum + o.interestedCompanyIds.length,
      0
    );

    return {
      oppByCategory,
      exportBreakdown,
      sizeBreakdown,
      regionalSummary,
      avgCompat,
      totalInterests,
    };
  }, [state]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#17213A]">Analítica de plataforma</h1>
        <p className="text-sm text-slate-600 mt-1">
          Indicadores calculados directamente sobre los registros activos del ecosistema demo.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Compatibilidad media de matches</p>
          <p className="text-3xl font-bold text-[#2563EB] tabular-nums mt-2">
            {analytics.avgCompat}%
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            Sobre {state.connections.length} conexiones mutuas
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Expresiones de interés B2B</p>
          <p className="text-3xl font-bold text-[#F26444] tabular-nums mt-2">
            {analytics.totalInterests}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            En {state.opportunities.length} oportunidades publicadas
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Tasa de verificación demo</p>
          <p className="text-3xl font-bold text-[#00A995] tabular-nums mt-2">
            {Math.round(
              (state.companies.filter((c) => c.verificationStatus === 'verified_demo').length /
                Math.max(state.companies.length, 1)) *
                100
            )}
            %
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {state.companies.filter((c) => c.verificationStatus === 'verified_demo').length} de{' '}
            {state.companies.length} empresas
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Actividad educativa y agenda</p>
          <p className="text-3xl font-bold text-[#17213A] tabular-nums mt-2">
            {state.events.length + state.courses.length}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {state.events.length} eventos · {state.courses.length} cursos
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          title="Oportunidades por categoría"
          subtitle="Demanda y oferta comercial publicada en TRAMA"
          data={analytics.oppByCategory}
        />
        <div className="space-y-6">
          <HorizontalBarChart
            title="Madurez exportadora"
            subtitle="Perfil de internacionalización de las empresas registradas"
            data={analytics.exportBreakdown}
          />
          <HorizontalBarChart
            title="Tamaño de empresa"
            subtitle="Segmentación por dotación estimada"
            data={analytics.sizeBreakdown}
          />
        </div>
      </div>

      {/* Regional Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#17213A]">Resumen por región argentina</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribución federal de empresas, verificaciones demo, potencial exportador y oportunidades
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Región</th>
                <th className="py-3 px-4 text-right">Empresas</th>
                <th className="py-3 px-4 text-right">Verificadas (demo)</th>
                <th className="py-3 px-4 text-right">Perfil exportador</th>
                <th className="py-3 px-4 text-right">Oportunidades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm tabular-nums">
              {analytics.regionalSummary.map((row) => (
                <tr key={row.region} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-[#17213A]">{row.region}</td>
                  <td className="py-3 px-4 text-right font-mono">{row.companies}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#00A995]">{row.verified}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#2563EB]">{row.exporters}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#F26444]">
                    {row.opportunities}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
