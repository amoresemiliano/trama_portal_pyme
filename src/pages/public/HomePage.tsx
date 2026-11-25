import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  Landmark,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { MEDIA, INDUSTRY_META } from '../../data/mediaAssets';
import { DEMO_SUCCESS_STORIES } from '../../data/seedEcosystem';
import { ResilientImage } from '../../components/ResilientImage';
import { CompanyCard } from '../../components/CompanyCard';

export const HomePage: React.FC = () => {
  const { state, toggleSaveCompany, startConversationWithCompany, currentUser, loginAsDemoBusiness } = useTrama();
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<string>('Todas');

  const publishedCompanies = useMemo(
    () => state.companies.filter((c) => c.status === 'published'),
    [state.companies]
  );

  const featuredCompanies = useMemo(
    () => publishedCompanies.filter((c) => c.featured).slice(0, 6),
    [publishedCompanies]
  );

  const smOpportunities = useMemo(
    () =>
      state.opportunities
        .filter((o) => o.status === 'active' && !o.isCorporateProcurement)
        .slice(0, 4),
    [state.opportunities]
  );

  const corporateOpportunities = useMemo(
    () =>
      state.opportunities
        .filter((o) => o.status === 'active' && o.isCorporateProcurement)
        .slice(0, 4),
    [state.opportunities]
  );

  const provinceStats = useMemo(() => {
    const map = new Map<string, { province: string; region: string; count: number; sampleIndustries: Set<string> }>();
    for (const c of publishedCompanies) {
      const existing = map.get(c.location.province);
      if (existing) {
        existing.count += 1;
        existing.sampleIndustries.add(INDUSTRY_META[c.industry]?.shortLabel ?? c.industry);
      } else {
        map.set(c.location.province, {
          province: c.location.province,
          region: c.location.region,
          count: 1,
          sampleIndustries: new Set([INDUSTRY_META[c.industry]?.shortLabel ?? c.industry]),
        });
      }
    }
    return Array.from(map.values())
      .filter((p) => activeRegion === 'Todas' || p.region === activeRegion)
      .sort((a, b) => b.count - a.count);
  }, [publishedCompanies, activeRegion]);

  const industryStats = useMemo(() => {
    return state.taxonomy.industries.map((ind) => ({
      name: ind,
      count: publishedCompanies.filter((c) => c.industry === ind).length,
      meta: INDUSTRY_META[ind] ?? {
        color: '#2563EB',
        bgTint: '#EFF6FF',
        image: MEDIA.HERO_PYMES,
        shortLabel: ind,
      },
    }));
  }, [state.taxonomy.industries, publishedCompanies]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    navigate(q ? `/directorio?q=${encodeURIComponent(q)}` : '/directorio');
  };

  const handleQuickConnect = (companyId: string) => {
    if (!currentUser) {
      loginAsDemoBusiness();
    }
    const convId = startConversationWithCompany(companyId, 'Contacto desde Inicio TRAMA');
    navigate(`/espacio/mensajes?conv=${convId}`);
  };

  return (
    <div className="bg-white">
      {/* 1. SPECTACULAR ASYMMETRIC EDITORIAL HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F7FB] via-white to-white pt-10 pb-14 lg:pt-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy & Search Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-2">
                <span className="text-[#F26444]">Ecosistema B2B Argentina</span>
                <span aria-hidden="true">·</span>
                <span>Powered by Vegen Digital</span>
                <span aria-hidden="true">·</span>
                <span>Registro gratuito</span>
              </div>

              <h1
                className="font-extrabold text-[#17213A] tracking-tight leading-[1.06]"
                style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.65rem)' }}
              >
                Conectamos empresas.{' '}
                <span className="text-[#F26444]">Multiplicamos oportunidades.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Descubrí clientes, proveedores, aliados estratégicos y recursos para hacer crecer tu
                negocio.
              </p>

              {/* Prominent Working Search Field */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-col sm:flex-row gap-2 max-w-xl"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="¿Qué empresa, producto o servicio estás buscando?"
                    aria-label="Buscar empresas, productos o servicios"
                    className="w-full h-11 text-sm text-[#17213A] placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Buscar
                </button>
              </form>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                <span>Tendencias:</span>
                {['Packaging sustentable', 'Logística refrigerada', 'Mecanizado CNC', 'Alimentos orgánicos'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => navigate(`/directorio?q=${encodeURIComponent(term)}`)}
                      className="text-[#17213A] font-medium hover:text-[#F26444] underline decoration-slate-300 underline-offset-4 cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/directorio"
                  className="h-12 px-6 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  Explorar empresas
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="h-12 px-6 rounded-xl bg-white border border-slate-300 hover:border-[#17213A] text-[#17213A] text-sm font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  Sumá tu PyME gratis
                </Link>
              </div>
            </div>

            {/* Right Asymmetric Photographic Mosaic with Tasteful Floating UI Elements */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-12 gap-3 h-full min-h-[380px] lg:min-h-[470px]">
                <div className="col-span-8 row-span-2 relative rounded-3xl overflow-hidden bg-[#F4F7FB]">
                  <ResilientImage
                    src={MEDIA.HERO_PYMES}
                    alt="Emprendedores y PyMEs argentinas diseñando productos en taller colaborativo"
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17213A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs text-white/80">Conexión activa en TRAMA</p>
                    <p className="text-sm font-bold leading-snug">
                      Altiplano Alimentos (Mendoza) + TerraPack Sustentable (Buenos Aires)
                    </p>
                  </div>
                </div>

                <div className="col-span-4 relative rounded-2xl overflow-hidden bg-[#F4F7FB]">
                  <ResilientImage
                    src={MEDIA.MANUFACTURA}
                    alt="Taller de manufactura CNC en Córdoba"
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                <div className="col-span-4 relative rounded-2xl overflow-hidden bg-[#F4F7FB]">
                  <ResilientImage
                    src={MEDIA.GASTRONOMIA}
                    alt="Cafetería y panadería artesanal en Palermo"
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Floating Match Compatibility Card */}
              <Link
                to="/match"
                className="hidden sm:flex items-center gap-3 absolute -left-4 top-6 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-lg hover:border-[#00A995] transition-colors max-w-[270px]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00A995] text-white flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#17213A] truncate">Match complementario · 95%</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Alimentos busca packaging sustentable
                  </p>
                </div>
              </Link>

              {/* Floating Live Opportunity Card */}
              <Link
                to="/oportunidades"
                className="hidden sm:flex items-center gap-3 absolute -right-2 -bottom-4 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-lg hover:border-[#2563EB] transition-colors max-w-[290px]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F4BB45] text-[#17213A] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#17213A] truncate">
                    {state.opportunities.filter((o) => o.status === 'active').length} oportunidades abiertas
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Incluye compras corporativas y pedidos B2B
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Real KPI Proof Row below the Hero Split */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#17213A] font-mono tabular-nums">
                {publishedCompanies.length}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Empresas activas en el ecosistema demo
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] font-mono tabular-nums">
                {new Set(publishedCompanies.map((c) => c.location.province)).size}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Provincias argentinas representadas
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#F26444] font-mono tabular-nums">
                {state.opportunities.filter((o) => o.status === 'active').length}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Oportunidades comerciales vigentes
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#00A995] font-mono tabular-nums">
                {state.events.length + state.courses.length}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Eventos, rondas y cursos para PyMEs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EMPRESAS QUE MUEVEN LA ECONOMÍA */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold text-[#F26444] mb-1.5">Directorio destacado</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Empresas que mueven la economía
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                PyMEs fabricantes, productores regionales, estudios creativos y operadores logísticos
                listos para construir relaciones comerciales duraderas.
              </p>
            </div>
            <Link
              to="/directorio"
              className="text-sm font-bold text-[#2563EB] hover:text-[#17213A] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              Ver las {publishedCompanies.length} empresas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                isSaved={state.savedCompanyIds.includes(company.id)}
                onToggleSave={toggleSaveCompany}
                onConnect={handleQuickConnect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. TU PRÓXIMA CONEXIÓN ESTÁ ACÁ — B2B MATCH SHOWCASE */}
      <section className="py-16 lg:py-20 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-bold text-[#008777]">Match B2B Inteligente</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17213A] tracking-tight leading-tight">
                Tu próxima conexión está acá
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Cada empresa tiene algo para ofrecer, algo que necesita y oportunidades que todavía
                no descubrió. Deslizá candidatas rankeadas por complementariedad real de cadena de
                valor y cuando el interés es mutuo, abrí conversación al instante.
              </p>

              <div className="space-y-3 pt-1 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#F26444] mt-0.5">01.</span>
                  <p>
                    <strong className="text-[#17213A]">Cruce real de oferta y demanda:</strong>{' '}
                    productores de alimentos conectan con packaging ecológico, logística fría y
                    distribuidores.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#2563EB] mt-0.5">02.</span>
                  <p>
                    <strong className="text-[#17213A]">Compatibilidad explicable:</strong> ves en
                    detalle el porcentaje y los motivos detrás de cada recomendación.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#00A995] mt-0.5">03.</span>
                  <p>
                    <strong className="text-[#17213A]">Sin ruido comercial:</strong> solo se abre
                    mensajería cuando hay interés real o match mutuo.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/match"
                  className="h-12 px-6 rounded-xl bg-[#17213A] hover:bg-[#F26444] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors"
                >
                  Probar Match B2B ahora
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Preview Visual of Complementary Match */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Ejemplo de compatibilidad detectada</p>
                    <p className="text-base font-bold text-[#17213A]">
                      Altiplano Alimentos ↔ TerraPack Sustentable
                    </p>
                  </div>
                  <span className="text-lg font-extrabold font-mono text-[#008777] tabular-nums">
                    95% compatibilidad
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden border border-slate-200">
                    <div className="h-36 bg-[#F4F7FB]">
                      <ResilientImage
                        src={MEDIA.ALIMENTOS}
                        alt="Altiplano Alimentos Mendoza"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-xs font-semibold text-[#F26444]">Alimentos · Mendoza</p>
                      <p className="font-bold text-sm text-[#17213A]">Altiplano Alimentos</p>
                      <p className="text-xs text-slate-600">
                        <strong className="text-[#17213A]">Necesita:</strong> Packaging sustentable
                        y cajas kraft para exportación.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-200">
                    <div className="h-36 bg-[#F4F7FB]">
                      <ResilientImage
                        src={MEDIA.PACKAGING}
                        alt="TerraPack Sustentable Buenos Aires"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-xs font-semibold text-[#00A995]">Packaging · Buenos Aires</p>
                      <p className="font-bold text-sm text-[#17213A]">TerraPack Sustentable</p>
                      <p className="text-xs text-slate-600">
                        <strong className="text-[#17213A]">Ofrece:</strong> Cajas kraft impresas y
                        envases compostables desde 500 u.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-slate-500">
                    Sinergia directa de cadena de valor · Cobertura nacional · Enfoque sustentable
                  </p>
                  <Link
                    to="/match"
                    className="text-xs font-bold text-[#F26444] hover:underline whitespace-nowrap"
                  >
                    Abrir tarjetas de Match →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENCONTRÁ LO QUE TU NEGOCIO NECESITA — COLORFUL INDUSTRY EXPLORER */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold text-[#2563EB] mb-1.5">Explorador sectorial</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Encontrá lo que tu negocio necesita
              </h2>
            </div>
            <Link
              to="/directorio"
              className="text-sm font-bold text-[#17213A] hover:text-[#2563EB] inline-flex items-center gap-1.5"
            >
              Explorar filtros avanzados
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {industryStats.map((ind) => (
              <Link
                key={ind.name}
                to={`/directorio?sector=${encodeURIComponent(ind.name)}`}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center gap-3.5 p-3.5"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#F4F7FB]">
                  <ResilientImage
                    src={ind.meta.image}
                    alt={ind.name}
                    accentColor={ind.meta.color}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#17213A] group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
                    {ind.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
                    {ind.count} empresas
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#17213A] shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OPORTUNIDADES PARA CRECER & GRANDES EMPRESAS BUSCAN PROVEEDORES */}
      <section className="py-16 lg:py-20 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Commercial opportunities */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-[#F26444] mb-1.5">Mercado B2B activo</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                  Oportunidades para crecer
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Pedidos de proveedores, búsqueda de distribuidores, capacidad industrial disponible
                  y alianzas estratégicas.
                </p>
              </div>
              <Link
                to="/oportunidades"
                className="text-sm font-bold text-[#2563EB] hover:text-[#17213A] inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                Ver todas las oportunidades
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {smOpportunities.map((opp) => (
                <article
                  key={opp.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-slate-300 transition-colors"
                >
                  <div className="sm:w-44 h-40 sm:h-auto shrink-0 bg-[#F4F7FB]">
                    <ResilientImage
                      src={opp.coverImage}
                      alt={opp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-[#F26444]">{opp.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{opp.province}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#17213A] mt-1 leading-snug line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 truncate">{opp.companyName}</span>
                      <Link
                        to={`/oportunidades?open=${opp.id}`}
                        className="font-bold text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
                      >
                        Ver detalle →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Corporate procurement spotlight */}
          <div className="bg-[#17213A] text-white rounded-3xl p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#F4BB45]">
                  Compras Corporativas · Ejemplos ficticios demo
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Grandes empresas buscan proveedores
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Convocatorias abiertas de desarrollo de proveedores locales para PyMEs argentinas
                  de alimentos, manufactura, packaging sustentable e infraestructura.
                </p>
              </div>
              <Link
                to="/oportunidades?cat=Compra%20corporativa"
                className="h-11 px-5 rounded-xl bg-[#F4BB45] hover:bg-[#e5ab33] text-[#17213A] text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors"
              >
                Explorar compras corporativas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {corporateOpportunities.map((corp) => (
                <Link
                  key={corp.id}
                  to={`/oportunidades?open=${corp.id}`}
                  className="bg-white/6 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="font-semibold text-[#F4BB45]">{corp.sector}</span>
                      <span aria-hidden="true">·</span>
                      <span>Cierre {corp.deadline}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                      {corp.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2">{corp.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
                    <span className="truncate">{corp.companyName}</span>
                    <span className="font-semibold text-white whitespace-nowrap shrink-0">
                      Postular →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. ARGENTINA EMPRENDE — PROVINCES & ECONOMIC REGIONS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold text-[#008777] mb-1.5">Cobertura federal</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Argentina emprende
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Explorá polos productivos, industrias regionales y proveedores en cada provincia.
              </p>
            </div>

            {/* Interactive Region Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F7FB] rounded-xl">
              {['Todas', 'AMBA', 'Centro', 'Litoral', 'Cuyo', 'NOA', 'NEA', 'Patagonia'].map(
                (reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setActiveRegion(reg)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      activeRegion === reg
                        ? 'bg-white text-[#17213A] shadow-sm'
                        : 'text-slate-600 hover:text-[#17213A]'
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {provinceStats.map((prov) => (
              <Link
                key={prov.province}
                to={`/directorio?provincia=${encodeURIComponent(prov.province)}`}
                className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#2563EB] transition-colors flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-slate-400">{prov.region}</p>
                    <h3 className="text-lg font-bold text-[#17213A] group-hover:text-[#2563EB] transition-colors mt-0.5">
                      {prov.province}
                    </h3>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#17213A] tabular-nums">
                    {prov.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {Array.from(prov.sampleIndustries).slice(0, 3).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CAPACITACIÓN, FINANCIAMIENTO Y EVENTOS — THREE PILLARS */}
      <section className="py-16 lg:py-20 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Capacitate para dar el próximo paso */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-[#2563EB] mb-1.5">Formación continua</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                  Capacitate para dar el próximo paso
                </h2>
              </div>
              <Link
                to="/capacitacion"
                className="text-sm font-bold text-[#2563EB] hover:text-[#17213A] inline-flex items-center gap-1.5"
              >
                Explorar los {state.courses.length} cursos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.courses.slice(0, 3).map((course) => (
                <Link
                  key={course.id}
                  to={`/capacitacion?topic=${encodeURIComponent(course.topic)}`}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors flex flex-col"
                >
                  <div className="aspect-[16/10] bg-[#F4F7FB] overflow-hidden">
                    <ResilientImage
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-[#2563EB]">{course.topic}</span> ·{' '}
                        {course.format}
                      </p>
                      <h3 className="text-base font-bold text-[#17213A] mt-1.5 leading-snug group-hover:text-[#2563EB] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{course.summary}</p>
                    </div>
                    <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                      {course.duration} · {course.costLabel}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Financiamiento y beneficios */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-[#008777] mb-1.5">
                  Guía referencial · Sin afiliación oficial declarada
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                  Financiamiento y beneficios
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Directorio orientativo de bancos, SGR, organismos internacionales, programas
                  provinciales y asistencia técnica para PyMEs.
                </p>
              </div>
              <Link
                to="/financiamiento"
                className="text-sm font-bold text-[#008777] hover:text-[#17213A] inline-flex items-center gap-1.5"
              >
                Ver todos los recursos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {state.resources.slice(0, 4).map((res) => (
                <Link
                  key={res.id}
                  to={`/financiamiento?cat=${encodeURIComponent(res.category)}`}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#00A995] transition-colors flex flex-col justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#008777]">{res.category}</p>
                    <h3 className="text-sm font-bold text-[#17213A] mt-1.5 leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {res.summary}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    {res.institution} · {res.scope}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Próximos eventos */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-[#F26444] mb-1.5">Agenda empresarial</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                  Próximos eventos
                </h2>
              </div>
              <Link
                to="/eventos"
                className="text-sm font-bold text-[#F26444] hover:text-[#17213A] inline-flex items-center gap-1.5"
              >
                Ver calendario completo ({state.events.length})
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.events.slice(0, 3).map((evt) => (
                <Link
                  key={evt.id}
                  to={`/eventos?id=${evt.id}`}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors flex flex-col"
                >
                  <div className="aspect-[16/10] relative bg-[#F4F7FB] overflow-hidden">
                    <ResilientImage
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 font-mono tabular-nums">
                        {evt.date} · {evt.format} · {evt.province}
                      </p>
                      <h3 className="text-base font-bold text-[#17213A] mt-1.5 leading-snug group-hover:text-[#F26444] transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{evt.summary}</p>
                    </div>
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                      {evt.type} · {evt.costLabel}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. ORGANIZACIONES QUE IMPULSAN A LAS PYMES */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold text-[#2563EB] mb-1.5">
                Directorio institucional de referencia (sin implicar convenio oficial)
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Organizaciones que impulsan a las PyMEs
              </h2>
            </div>
            <Link
              to="/camaras"
              className="text-sm font-bold text-[#2563EB] hover:text-[#17213A] inline-flex items-center gap-1.5"
            >
              Ver las {state.organizations.length} instituciones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {state.organizations.slice(0, 10).map((org) => (
              <Link
                key={org.id}
                to="/camaras"
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-colors flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-base font-extrabold tracking-tight"
                    style={{ color: org.accentColor, fontFamily: 'var(--font-display)' }}
                  >
                    {org.acronym}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">{org.scope}</span>
                </div>
                <p className="text-xs font-medium text-[#17213A] line-clamp-2 leading-snug">
                  {org.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HISTORIAS QUE INSPIRAN (FICTIONAL DEMO EXAMPLES CLEARLY MARKED) */}
      <section className="py-16 lg:py-20 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold text-[#F26444] mb-1.5">
              Casos ilustrativos ficticios de demostración
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
              Historias que inspiran
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Ejemplos demostrativos de cómo las conexiones complementarias entre PyMEs argentinas
              generan ahorros, nuevos clientes y crecimiento regional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {DEMO_SUCCESS_STORIES.map((story) => (
              <article
                key={story.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-[#F4F7FB]">
                  <ResilientImage
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-[#008777]">{story.sector}</span> ·{' '}
                      {story.province} · Caso demo ficticio
                    </p>
                    <h3 className="text-lg font-bold text-[#17213A] leading-snug">{story.title}</h3>
                    <p className="text-xs font-semibold text-[#2563EB]">{story.outcomeMetric}</p>
                    <p className="text-sm text-slate-600 italic leading-relaxed">
                      “{story.quote}”
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs">
                    <p className="font-bold text-[#17213A]">{story.personName}</p>
                    <p className="text-slate-500">{story.personRole}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CONVERSION CTA */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#17213A] rounded-3xl p-8 sm:p-12 lg:p-14 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-bold text-[#F4BB45]">Sumate gratis al MVP de TRAMA</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Tu empresa merece nuevas oportunidades en toda Argentina
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Publicá tu perfil empresarial en minutos, descubrí socios complementarios con Match
                B2B y accedé a oportunidades comerciales, eventos y capacitaciones.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/auth?mode=register"
                className="h-12 px-7 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                Registrar mi PyME gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/planes"
                className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold inline-flex items-center whitespace-nowrap transition-colors"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
