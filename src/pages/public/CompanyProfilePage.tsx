import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Heart,
  MapPin,
  Briefcase,
  ShieldAlert,
  Star,
} from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { ResilientImage } from '../../components/ResilientImage';
import { evaluateCompanyMatch } from '../../services/matchingEngine';
import { getIndustryAccent } from '../../data/mediaAssets';

export const CompanyProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    state,
    activeCompany,
    currentUser,
    toggleSaveCompany,
    recordMatchDecision,
    startConversationWithCompany,
    loginAsDemoBusiness,
    notify,
  } = useTrama();

  const company = useMemo(
    () => state.companies.find((c) => c.slug === slug || c.id === slug),
    [state.companies, slug]
  );

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#17213A]">Empresa no encontrada</h1>
        <p className="text-sm text-slate-600">
          El perfil que buscás no existe o fue archivado en el entorno demo.
        </p>
        <Link
          to="/directorio"
          className="inline-flex h-11 px-5 rounded-xl bg-[#17213A] text-white text-sm font-semibold items-center"
        >
          Volver al directorio
        </Link>
      </div>
    );
  }

  const accent = getIndustryAccent(company.industry);
  const isSaved = state.savedCompanyIds.includes(company.id);
  const isOwnCompany = activeCompany?.id === company.id;
  const companyOpportunities = state.opportunities.filter(
    (o) => o.companyId === company.id && o.status === 'active'
  );
  const matchEval =
    activeCompany && !isOwnCompany ? evaluateCompanyMatch(activeCompany, company) : null;

  const handleMessage = () => {
    if (!currentUser) {
      loginAsDemoBusiness();
    }
    const convId = startConversationWithCompany(company.id, `Contacto con ${company.name}`);
    navigate(`/espacio/mensajes?conv=${convId}`);
  };

  const handleExpressInterest = () => {
    if (!currentUser) {
      loginAsDemoBusiness();
    }
    const res = recordMatchDecision(company.id, 'interested');
    if (res.isMutualMatch && res.conversationId) {
      notify(`¡Hay conexión con ${company.name}! Ya podés conversar en Mensajería.`);
      navigate(`/espacio/mensajes?conv=${res.conversationId}`);
    }
  };

  return (
    <div className="bg-[#F4F7FB] pb-16">
      {/* Large Editorial Cover */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-[#17213A] overflow-hidden">
        <ResilientImage
          src={company.coverImage}
          alt={company.name}
          accentColor={accent}
          className="w-full h-full object-cover opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17213A]/90 via-[#17213A]/35 to-transparent" />
        <div className="absolute top-5 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/directorio"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/95 text-[#17213A] text-xs font-semibold hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al directorio
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-6">
        {/* Identity Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: company.brandColor, fontFamily: 'var(--font-display)' }}
              >
                {company.logoInitials}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold" style={{ color: accent }}>
                    {company.industry}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{company.subindustry}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {company.location.city}, {company.location.province}, {company.location.country}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight flex flex-wrap items-center gap-2.5">
                  <span>{company.name}</span>
                  {company.verificationStatus === 'verified_demo' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#008777]">
                      <CheckCircle2 className="w-4 h-4" />
                      Verificado (Demo)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                      <ShieldAlert className="w-4 h-4 text-slate-400" />
                      No verificado oficialmente
                    </span>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{company.tagline}</p>

                <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>{company.operationType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{company.commercialModel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{company.size}</span>
                  <span aria-hidden="true">·</span>
                  <span>{company.exportReadiness}</span>
                  <span aria-hidden="true">·</span>
                  <span>Fundada en {company.foundedYear}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {!isOwnCompany ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleSaveCompany(company.id)}
                    className={`h-11 px-4 rounded-xl border text-sm font-semibold inline-flex items-center gap-2 cursor-pointer ${
                      isSaved
                        ? 'border-[#F26444] text-[#D94E2E] bg-[#F26444]/8'
                        : 'border-slate-200 text-[#17213A] hover:bg-[#F4F7FB]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Guardada' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleExpressInterest}
                    className="h-11 px-4 rounded-xl bg-[#00A995] hover:bg-[#008777] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                    Me interesa (Match)
                  </button>
                  <button
                    type="button"
                    onClick={handleMessage}
                    className="h-11 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contactar
                  </button>
                </>
              ) : (
                <Link
                  to="/espacio/perfil"
                  className="h-11 px-5 rounded-xl bg-[#17213A] text-white text-sm font-bold inline-flex items-center"
                >
                  Editar mi perfil
                </Link>
              )}
            </div>
          </div>

          {company.isDemoData && (
            <p className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
              Perfil sintético de demostración de TRAMA: verificaciones, certificaciones y reseñas
              ilustran el funcionamiento del ecosistema MVP.
            </p>
          )}
        </div>

        {/* Content Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* About & History */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
              <h2 className="text-lg font-bold text-[#17213A]">Sobre la empresa</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {company.description}
              </p>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#17213A] mb-1.5">Historia y recorrido</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{company.history}</p>
              </div>
            </section>

            {/* What it offers vs What it needs */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#008777]">Propuesta comercial</p>
                  <h2 className="text-lg font-bold text-[#17213A]">Qué ofrece</h2>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {company.offerings.map((item) => (
                      <li key={item} className="leading-snug">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 md:border-l md:border-slate-100 md:pl-8">
                  <p className="text-xs font-bold text-[#F26444]">Oportunidades de alianza</p>
                  <h2 className="text-lg font-bold text-[#17213A]">Qué necesita hoy</h2>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {company.needs.map((item) => (
                      <li key={item} className="leading-snug">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Products, Services & Capabilities */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-base font-bold text-[#17213A] mb-2.5">Productos</h2>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    {company.products.map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#17213A] mb-2.5">Servicios</h2>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    {company.services.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-bold text-[#17213A] mb-2.5">
                    Capacidades técnicas y operativas
                  </h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    {company.capabilities.map((cap) => (
                      <li key={cap}>· {cap}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17213A] mb-2.5">
                    Intereses y objetivos comerciales
                  </h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    {company.commercialObjectives.map((obj) => (
                      <li key={obj}>· {obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Portfolio Gallery */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
              <h2 className="text-lg font-bold text-[#17213A]">Galería y entorno productivo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {company.portfolioImages.map((img, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F7FB]">
                    <ResilientImage
                      src={img}
                      alt={`${company.name} imagen ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Active Company Opportunities */}
            {companyOpportunities.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#17213A]">
                    Oportunidades comerciales activas
                  </h2>
                  <Link
                    to="/oportunidades"
                    className="text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    Ver mercado B2B
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {companyOpportunities.map((opp) => (
                    <div key={opp.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-[#F26444]">{opp.category}</span> · Cierre{' '}
                        {opp.deadline}
                      </p>
                      <Link
                        to={`/oportunidades?open=${opp.id}`}
                        className="text-base font-bold text-[#17213A] hover:text-[#2563EB] block"
                      >
                        {opp.title}
                      </Link>
                      <p className="text-sm text-slate-600">{opp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Demo Reviews */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-[#17213A]">Referencias y reputación</h2>
                <span className="text-xs text-slate-400">
                  Reseñas sintéticas de demostración
                </span>
              </div>
              {company.reviews.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Aún no hay referencias comerciales cargadas para esta empresa demo.
                </p>
              ) : (
                <div className="space-y-4">
                  {company.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#F4F7FB] space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-[#17213A]">{rev.authorName}</span>
                          <span className="text-slate-500"> · {rev.authorCompany}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-[#17213A]">
                          <Star className="w-3.5 h-3.5 fill-[#F4BB45] text-[#F4BB45]" />
                          {rev.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                      <p className="text-[11px] text-slate-400">
                        Publicado el {rev.createdAt} · Reseña demo
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Compatibility Box */}
            {matchEval && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Afinidad con tu empresa</p>
                  <span className="text-xl font-extrabold font-mono text-[#008777] tabular-nums">
                    {matchEval.score}%
                  </span>
                </div>
                <p className="text-sm font-bold text-[#17213A]">{matchEval.headlineReason}</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {matchEval.reasons.map((r, idx) => (
                    <li key={idx}>· {r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Operational Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 text-sm">
              <h3 className="text-base font-bold text-[#17213A]">Ficha operativa</h3>
              <dl className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-slate-400">Cobertura geográfica</dt>
                    <dd className="font-semibold text-[#17213A] mt-0.5">{company.coverage}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-slate-400">Exportación</dt>
                    <dd className="font-semibold text-[#17213A] mt-0.5">
                      {company.exportReadiness}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <dt className="text-slate-400">Sitio web (demo)</dt>
                    <dd className="font-semibold text-[#2563EB] truncate mt-0.5">
                      {company.website}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <dt className="text-slate-400">Correo comercial</dt>
                    <dd className="font-semibold text-[#17213A] truncate mt-0.5">
                      {company.contactEmail}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-slate-400">Teléfono de contacto (demo)</dt>
                    <dd className="font-mono font-semibold text-[#17213A] mt-0.5">
                      {company.phone}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Certifications & Sustainability */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#17213A] mb-2">
                  Certificaciones declaradas (Demo)
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {company.certifications.length > 0 ? (
                    company.certifications.map((c) => <li key={c}>· {c}</li>)
                  ) : (
                    <li className="text-slate-400">Sin certificaciones cargadas.</li>
                  )}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#17213A] mb-2">
                  Criterios de sustentabilidad
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {company.sustainabilityCriteria.map((s) => (
                    <li key={s}>· {s}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#17213A] mb-1.5">Etiquetas</h3>
                <p className="text-xs text-slate-500">{company.tags.join(' · ')}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
