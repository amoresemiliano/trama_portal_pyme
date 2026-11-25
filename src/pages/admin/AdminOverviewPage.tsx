import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Briefcase,
  Handshake,
  ShieldCheck,
  Flag,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { ActivityTrendChart, HorizontalBarChart } from '../../components/AdminCharts';

export const AdminOverviewPage: React.FC = () => {
  const { state } = useTrama();

  const metrics = useMemo(() => {
    const publishedCompanies = state.companies.filter((c) => c.status === 'published').length;
    const verifiedCompanies = state.companies.filter((c) => c.verificationStatus === 'verified_demo').length;
    const pendingVerification = state.companies.filter((c) => c.verificationStatus === 'pending').length;
    const activeOpportunities = state.opportunities.filter((o) => o.status === 'active').length;
    const pendingModeration = state.moderationQueue.filter((m) => m.status === 'pending').length;

    const provinceCounts = new Map<string, number>();
    const industryCounts = new Map<string, number>();
    state.companies.forEach((c) => {
      provinceCounts.set(c.location.province, (provinceCounts.get(c.location.province) ?? 0) + 1);
      industryCounts.set(c.industry, (industryCounts.get(c.industry) ?? 0) + 1);
    });

    const topProvinces = Array.from(provinceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([label, value], i) => ({
        label,
        value,
        color: i === 0 ? '#2563EB' : i === 1 ? '#F26444' : i === 2 ? '#00A995' : '#64748B',
      }));

    const topIndustries = Array.from(industryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([label, value], i) => ({
        label,
        value,
        color: i % 3 === 0 ? '#00A995' : i % 3 === 1 ? '#2563EB' : '#F26444',
      }));

    const baseCompanies = Math.max(state.companies.length - 18, 12);
    const trendPoints = [
      { label: 'Oct', companies: Math.round(baseCompanies * 0.45), matches: 4 },
      { label: 'Nov', companies: Math.round(baseCompanies * 0.62), matches: 7 },
      { label: 'Dic', companies: Math.round(baseCompanies * 0.78), matches: 11 },
      { label: 'Ene', companies: Math.round(baseCompanies * 0.9), matches: 14 },
      { label: 'Feb', companies: state.companies.length - 4, matches: state.connections.length + 12 },
      { label: 'Mar', companies: state.companies.length, matches: state.connections.length + 18 },
    ];

    return {
      publishedCompanies,
      verifiedCompanies,
      pendingVerification,
      activeOpportunities,
      pendingModeration,
      topProvinces,
      topIndustries,
      trendPoints,
    };
  }, [state]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213A]">Tablero general del ecosistema</h1>
          <p className="text-sm text-slate-600 mt-1">
            Métricas consolidadas en tiempo real del entorno demo de TRAMA (persistido en navegador).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/verificacion"
            className="h-9 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verificaciones ({metrics.pendingVerification})
          </Link>
          <Link
            to="/admin/moderacion"
            className="h-9 px-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#17213A] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5 text-[#F26444]" />
            Moderación ({metrics.pendingModeration})
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Empresas registradas</span>
            <Building2 className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-3xl font-bold text-[#17213A] tabular-nums mt-2">
            {state.companies.length}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {metrics.publishedCompanies} publicadas · {metrics.verifiedCompanies} verificadas (demo)
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Usuarios activos</span>
            <Users className="w-4 h-4 text-[#00A995]" />
          </div>
          <p className="text-3xl font-bold text-[#17213A] tabular-nums mt-2">
            {state.users.filter((u) => u.status === 'active').length}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {state.users.length} totales · {state.memberships.length} vínculos empresa
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Oportunidades activas</span>
            <Briefcase className="w-4 h-4 text-[#F26444]" />
          </div>
          <p className="text-3xl font-bold text-[#17213A] tabular-nums mt-2">
            {metrics.activeOpportunities}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {state.opportunities.length} totales ·{' '}
            {state.opportunities.filter((o) => o.isCorporateProcurement).length} compras corporativas
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Matches y conversaciones</span>
            <Handshake className="w-4 h-4 text-[#F4BB45]" />
          </div>
          <p className="text-3xl font-bold text-[#17213A] tabular-nums mt-2">
            {state.connections.length}
          </p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {state.conversations.length} chats activos · {state.messages.length} mensajes
          </p>
        </div>
      </div>

      {/* Charts */}
      <ActivityTrendChart
        title="Evolución del ecosistema (datos demo)"
        subtitle="Crecimiento acumulado de empresas y conexiones B2B generadas en el entorno de demostración"
        points={metrics.trendPoints}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          title="Empresas por provincia (Top 7)"
          subtitle="Distribución federal del directorio activo"
          data={metrics.topProvinces}
        />
        <HorizontalBarChart
          title="Empresas por industria (Top 7)"
          subtitle="Sectores productivos con mayor presencia"
          data={metrics.topIndustries}
          defaultColor="#00A995"
        />
      </div>

      {/* Bottom split: Action Queues & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#17213A]">Colas pendientes de revisión</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Empresas solicitando verificación demo y reportes de moderación
              </p>
            </div>
            <Link
              to="/admin/verificacion"
              className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              Gestionar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {state.companies
              .filter((c) => c.verificationStatus === 'pending')
              .slice(0, 4)
              .map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#17213A] truncate">{c.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {c.industry} · {c.location.city}, {c.location.province}
                    </p>
                  </div>
                  <Link
                    to="/admin/verificacion"
                    className="text-xs font-semibold text-[#2563EB] hover:underline shrink-0"
                  >
                    Revisar
                  </Link>
                </div>
              ))}
            {metrics.pendingVerification === 0 && (
              <p className="py-4 text-xs text-slate-500">
                No hay solicitudes de verificación pendientes en este momento.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#17213A]">Registro de auditoría reciente</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Últimas acciones administrativas registradas en el sistema
              </p>
            </div>
            <Link
              to="/admin/moderacion"
              className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
            >
              Ver todo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {state.auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-[#17213A] truncate">
                    {log.action}: <span className="font-normal text-slate-600">{log.target}</span>
                  </p>
                  <p className="text-slate-500 mt-0.5">{log.actorName}</p>
                </div>
                <span className="text-slate-400 font-mono shrink-0 inline-flex items-center gap-1 tabular-nums">
                  <Clock className="w-3 h-3" />
                  {log.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
