import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  HeartHandshake,
  MessageSquare,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Landmark,
} from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { calculateProfileCompleteness } from '../../services/profileCompleteness';
import { getRankedMatchesForCompany } from '../../services/matchingEngine';
import { ResilientImage } from '../../components/ResilientImage';

export const WorkspaceDashboardPage: React.FC = () => {
  const { state, activeCompany, currentUser, startConversationWithCompany } = useTrama();
  const navigate = useNavigate();

  const completeness = useMemo(
    () => calculateProfileCompleteness(activeCompany),
    [activeCompany]
  );

  const myConnections = useMemo(() => {
    if (!activeCompany) return [];
    return state.connections.filter(
      (c) => c.companyAId === activeCompany.id || c.companyBId === activeCompany.id
    );
  }, [state.connections, activeCompany]);

  const myConversations = useMemo(() => {
    if (!activeCompany) return [];
    return state.conversations.filter((cv) => cv.participantCompanyIds.includes(activeCompany.id));
  }, [state.conversations, activeCompany]);

  const unreadMessages = useMemo(() => {
    if (!activeCompany) return 0;
    const convIds = new Set(myConversations.map((c) => c.id));
    return state.messages.filter(
      (m) => convIds.has(m.conversationId) && !m.read && m.senderCompanyId !== activeCompany.id
    ).length;
  }, [state.messages, myConversations, activeCompany]);

  const myOpportunities = useMemo(() => {
    if (!activeCompany) return [];
    return state.opportunities.filter((o) => o.companyId === activeCompany.id);
  }, [state.opportunities, activeCompany]);

  const recommendedMatches = useMemo(() => {
    if (!activeCompany) return [];
    const connectedIds = new Set<string>([activeCompany.id]);
    myConnections.forEach((c) => {
      connectedIds.add(c.companyAId);
      connectedIds.add(c.companyBId);
    });
    return getRankedMatchesForCompany(activeCompany, state.companies, connectedIds).slice(0, 4);
  }, [activeCompany, state.companies, myConnections]);

  const savedEvents = useMemo(
    () => state.events.filter((e) => state.savedEventIds.includes(e.id)).slice(0, 3),
    [state.events, state.savedEventIds]
  );

  const suggestedCourses = useMemo(
    () => state.courses.filter((c) => c.status === 'active').slice(0, 3),
    [state.courses]
  );

  const relevantResources = useMemo(
    () => state.resources.filter((r) => r.status === 'active').slice(0, 3),
    [state.resources]
  );

  if (!activeCompany) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner + Profile Completeness */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2">
          <p className="text-xs font-bold text-[#F26444]">
            Hola, {currentUser?.fullName} · {activeCompany.name}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
            Estas son las oportunidades para tu empresa.
          </h1>
          <p className="text-sm text-slate-600">
            Todo tu ecosistema de conexiones, mensajes, oportunidades y recursos ordenado en un solo
            lugar.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <Link
              to="/espacio/match"
              className="h-10 px-4 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <HeartHandshake className="w-4 h-4" />
              Explorar Match B2B
            </Link>
            <Link
              to="/espacio/oportunidades?new=1"
              className="h-10 px-4 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Publicar oportunidad
            </Link>
          </div>
        </div>

        {/* Profile Completeness Panel */}
        <div className="lg:col-span-5 bg-[#F4F7FB] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#17213A]">Completitud del perfil empresarial</span>
            <span className="font-mono font-extrabold text-[#008777] tabular-nums">
              {completeness.percentage}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A995] rounded-full transition-all duration-300"
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">
            {completeness.percentage >= 90
              ? '¡Tu perfil está excelente y optimizado para Match B2B!'
              : 'Completá necesidades y capacidades para recibir mejores recomendaciones.'}
          </p>
          <Link
            to="/espacio/perfil"
            className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
          >
            Editar perfil empresarial <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Derived KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/espacio/conexiones"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Conexiones activas</span>
            <HeartHandshake className="w-4 h-4 text-[#00A995]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#17213A] tabular-nums mt-2">
            {myConnections.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Matches mutuos confirmados</p>
        </Link>

        <Link
          to="/espacio/mensajes"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Mensajes</span>
            <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#17213A] tabular-nums mt-2">
            {myConversations.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {unreadMessages > 0 ? `${unreadMessages} sin leer` : 'Conversaciones activas'}
          </p>
        </Link>

        <Link
          to="/espacio/oportunidades"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Mis oportunidades</span>
            <Briefcase className="w-4 h-4 text-[#F26444]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#17213A] tabular-nums mt-2">
            {myOpportunities.filter((o) => o.status === 'active').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Publicadas actualmente</p>
        </Link>

        <Link
          to="/espacio/guardados"
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Empresas guardadas</span>
            <Bookmark className="w-4 h-4 text-[#D97706]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#17213A] tabular-nums mt-2">
            {state.savedCompanyIds.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">En tu lista de seguimiento</p>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Recommended Companies + Recent Messages */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recommended Companies */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-[#17213A]">
                  Empresas recomendadas para {activeCompany.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Seleccionadas según tus necesidades y complementariedad en cadena de valor.
                </p>
              </div>
              <Link
                to="/espacio/match"
                className="text-xs font-bold text-[#F26444] hover:underline whitespace-nowrap"
              >
                Abrir Match →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedMatches.map((item) => (
                <div
                  key={item.company.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-28 relative bg-[#F4F7FB]">
                    <ResilientImage
                      src={item.company.coverImage}
                      alt={item.company.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 text-[#008777] text-xs font-mono font-bold tabular-nums">
                      {item.score}%
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500">
                        {item.company.industry} · {item.company.location.province}
                      </p>
                      <Link
                        to={`/empresa/${item.company.slug}`}
                        className="text-sm font-bold text-[#17213A] hover:text-[#2563EB] block truncate mt-0.5"
                      >
                        {item.company.name}
                      </Link>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {item.headlineReason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        to={`/empresa/${item.company.slug}`}
                        className="flex-1 h-9 rounded-lg bg-[#F4F7FB] text-[#17213A] text-xs font-semibold flex items-center justify-center hover:bg-slate-200/70"
                      >
                        Ver perfil
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          const convId = startConversationWithCompany(
                            item.company.id,
                            `Recomendación ${item.score}%`
                          );
                          navigate(`/espacio/mensajes?conv=${convId}`);
                        }}
                        className="h-9 px-3 rounded-lg bg-[#17213A] text-white text-xs font-semibold hover:bg-[#2563EB] cursor-pointer"
                      >
                        Escribir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested Courses & Relevant Funding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#17213A] inline-flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                  Cursos sugeridos
                </h2>
                <Link to="/capacitacion" className="text-xs font-semibold text-[#2563EB] hover:underline">
                  Ver todos
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {suggestedCourses.map((crs) => (
                  <Link
                    key={crs.id}
                    to="/capacitacion"
                    className="block py-2.5 first:pt-0 last:pb-0 group"
                  >
                    <p className="text-xs font-bold text-[#17213A] group-hover:text-[#2563EB] leading-snug">
                      {crs.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {crs.topic} · {crs.duration}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#17213A] inline-flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#00A995]" />
                  Financiamiento y guías
                </h2>
                <Link to="/financiamiento" className="text-xs font-semibold text-[#008777] hover:underline">
                  Explorar
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {relevantResources.map((res) => (
                  <Link
                    key={res.id}
                    to="/financiamiento"
                    className="block py-2.5 first:pt-0 last:pb-0 group"
                  >
                    <p className="text-xs font-bold text-[#17213A] group-hover:text-[#008777] leading-snug">
                      {res.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {res.category} · {res.scope}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right 4 Columns: Saved Events & Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#17213A] inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F26444]" />
                Tu agenda de eventos
              </h2>
              <Link to="/espacio/agenda" className="text-xs font-semibold text-[#2563EB] hover:underline">
                Ver agenda
              </Link>
            </div>
            {savedEvents.length === 0 ? (
              <p className="text-xs text-slate-500">
                Todavía no guardaste eventos.{' '}
                <Link to="/eventos" className="text-[#2563EB] font-semibold hover:underline">
                  Explorar próximos eventos
                </Link>
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedEvents.map((evt) => (
                  <div key={evt.id} className="py-2.5 first:pt-0 last:pb-0">
                    <p className="text-[11px] font-mono text-[#F26444] tabular-nums">
                      {evt.date} · {evt.province}
                    </p>
                    <p className="text-xs font-bold text-[#17213A] mt-0.5 leading-snug">
                      {evt.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-bold text-[#17213A]">Actividad reciente</h2>
            <div className="space-y-3 text-xs">
              {myConnections.slice(0, 3).map((conn) => {
                const otherId =
                  conn.companyAId === activeCompany.id ? conn.companyBId : conn.companyAId;
                const other = state.companies.find((c) => c.id === otherId);
                return (
                  <div key={conn.id} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00A995] shrink-0 mt-0.5" />
                    <p className="text-slate-600 leading-snug">
                      Nueva conexión mutua con{' '}
                      <strong className="text-[#17213A]">{other?.name ?? 'Empresa'}</strong> (
                      {conn.compatibilityScore}% afinidad).
                    </p>
                  </div>
                );
              })}
              {myOpportunities.slice(0, 2).map((opp) => (
                <div key={opp.id} className="flex items-start gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <p className="text-slate-600 leading-snug">
                    Oportunidad activa: <strong className="text-[#17213A]">{opp.title}</strong> (
                    {opp.interestedCompanyIds.length} interesadas).
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
