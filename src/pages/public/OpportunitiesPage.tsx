import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, MessageSquare, CheckCircle2, X, Building2 } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { Opportunity, OpportunityCategory } from '../../types/domain';
import { ResilientImage } from '../../components/ResilientImage';
import { OpportunityFormModal } from '../../components/OpportunityFormModal';

const ALL_CATEGORIES: ('Todas' | OpportunityCategory)[] = [
  'Todas',
  'Busco proveedor',
  'Ofrezco productos',
  'Ofrezco servicios',
  'Busco distribuidor',
  'Busco clientes',
  'Busco alianza estratégica',
  'Busco inversión',
  'Necesito tecnología',
  'Compra corporativa',
];

export const OpportunitiesPage: React.FC = () => {
  const {
    state,
    activeCompany,
    currentUser,
    toggleOpportunityInterest,
    startConversationWithCompany,
    loginAsDemoBusiness,
  } = useTrama();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Todas' | OpportunityCategory>(
    (searchParams.get('cat') as OpportunityCategory) || 'Todas'
  );
  const [sector, setSector] = useState('Todos');
  const [province, setProvince] = useState('Todas');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const openParamId = searchParams.get('open');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(
    () => state.opportunities.find((o) => o.id === openParamId) ?? null
  );

  const activeOpportunities = useMemo(
    () => state.opportunities.filter((o) => o.status === 'active'),
    [state.opportunities]
  );

  const provinces = useMemo(
    () => Array.from(new Set(activeOpportunities.map((o) => o.province))).sort(),
    [activeOpportunities]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeOpportunities.filter((o) => {
      if (category !== 'Todas' && o.category !== category) return false;
      if (sector !== 'Todos' && o.sector !== sector) return false;
      if (province !== 'Todas' && o.province !== province) return false;
      if (q) {
        const hay = `${o.title} ${o.description} ${o.companyName} ${o.sector} ${o.province} ${o.tags.join(' ')}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [activeOpportunities, category, sector, province, query]);

  const handlePublishClick = () => {
    if (!currentUser) {
      loginAsDemoBusiness();
    }
    setShowPublishModal(true);
  };

  const handleContactOpportunity = (opp: Opportunity) => {
    if (!currentUser) {
      loginAsDemoBusiness();
    }
    const convId = startConversationWithCompany(opp.companyId, `Oportunidad: ${opp.title.slice(0, 42)}`);
    setSelectedOpp(null);
    navigate(`/espacio/mensajes?conv=${convId}`);
  };

  const myCompId = activeCompany?.id ?? '';

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-bold text-[#F26444]">Mercado de Oportunidades B2B</p>
              <h1 className="text-3xl font-extrabold text-[#17213A] tracking-tight">
                Oportunidades comerciales y pedidos de proveedores
              </h1>
              <p className="text-sm text-slate-600">
                Publicá lo que tu empresa busca u ofrece y conectá directamente con PyMEs y áreas de
                compras en todo el país.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePublishClick}
              className="h-11 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Publicar oportunidad
            </button>
          </div>

          {/* Search & Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por insumo, servicio, empresa o palabra clave..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <select
              aria-label="Filtrar por rubro"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="md:col-span-3 h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Todos">Todos los rubros</option>
              {state.taxonomy.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrar por provincia"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="md:col-span-3 h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Todas">Todas las provincias</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-[#17213A] text-white'
                    : 'bg-[#F4F7FB] text-slate-600 hover:text-[#17213A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <p className="text-sm text-slate-600">
          <strong className="font-mono text-[#17213A] tabular-nums">{filtered.length}</strong>{' '}
          oportunidades abiertas
        </p>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-[#17213A]">Sin oportunidades en este filtro</h3>
            <p className="text-sm text-slate-500">
              Probá otra categoría o publicá vos la primera oportunidad para este sector.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('Todas');
                setSector('Todos');
                setProvince('Todas');
                setQuery('');
              }}
              className="h-10 px-5 rounded-xl bg-[#17213A] text-white text-xs font-semibold cursor-pointer"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((opp) => {
              const isInterested = opp.interestedCompanyIds.includes(myCompId);
              return (
                <article
                  key={opp.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
                >
                  <div className="aspect-[16/9] bg-[#F4F7FB] relative">
                    <ResilientImage
                      src={opp.coverImage}
                      alt={opp.title}
                      className="w-full h-full object-cover"
                    />
                    {opp.isCorporateProcurement && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#17213A] text-[#F4BB45] text-[11px] font-bold">
                        Compra corporativa (Demo)
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-[#F26444]">{opp.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{opp.province}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOpp(opp)}
                        className="text-left text-base font-bold text-[#17213A] hover:text-[#2563EB] leading-snug cursor-pointer"
                      >
                        {opp.title}
                      </button>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="pt-2 text-xs text-slate-500 space-y-1">
                        <p className="truncate">
                          <span className="font-medium text-[#17213A]">Empresa:</span>{' '}
                          <Link
                            to={`/empresa/${opp.companySlug}`}
                            className="hover:text-[#2563EB] hover:underline"
                          >
                            {opp.companyName}
                          </Link>
                        </p>
                        {opp.budget && (
                          <p className="truncate">
                            <span className="font-medium text-[#17213A]">Referencia:</span>{' '}
                            {opp.budget}
                          </p>
                        )}
                        <p className="font-mono text-[11px] text-slate-400 tabular-nums">
                          Cierre: {opp.deadline} · {opp.interestedCompanyIds.length} interesadas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleOpportunityInterest(opp.id)}
                        className={`flex-1 h-10 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          isInterested
                            ? 'bg-[#00A995] text-white'
                            : 'bg-[#F4F7FB] text-[#17213A] hover:bg-[#17213A] hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isInterested ? 'Interés enviado' : 'Me interesa'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOpp(opp)}
                        className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#17213A] hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer"
                      >
                        Detalle
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <div
          className="fixed inset-0 z-50 bg-[#17213A]/55 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="h-44 relative bg-[#F4F7FB]">
              <ResilientImage
                src={selectedOpp.coverImage}
                alt={selectedOpp.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                aria-label="Cerrar detalle"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 text-[#17213A] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 sm:p-7 space-y-4">
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#F26444]">{selectedOpp.category}</span>
                <span>·</span>
                <span>{selectedOpp.sector}</span>
                <span>·</span>
                <span>{selectedOpp.location}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#17213A] leading-snug">
                {selectedOpp.title}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedOpp.description}</p>

              <div className="p-4 rounded-2xl bg-[#F4F7FB] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Empresa publicante</span>
                  <Link
                    to={`/empresa/${selectedOpp.companySlug}`}
                    onClick={() => setSelectedOpp(null)}
                    className="font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    {selectedOpp.companyName}
                  </Link>
                </div>
                <div>
                  <span className="text-slate-400 block">Presupuesto / volumen</span>
                  <span className="font-semibold text-[#17213A] mt-0.5 block">
                    {selectedOpp.budget ?? 'A definir con oferentes'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Fecha límite</span>
                  <span className="font-mono font-semibold text-[#17213A] tabular-nums">
                    {selectedOpp.deadline}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Etiquetas</span>
                  <span className="text-slate-600">{selectedOpp.tags.join(' · ')}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => toggleOpportunityInterest(selectedOpp.id)}
                  className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-[#17213A] hover:bg-slate-50 cursor-pointer"
                >
                  {selectedOpp.interestedCompanyIds.includes(myCompId)
                    ? 'Interés registrado'
                    : 'Registrar interés'}
                </button>
                <button
                  type="button"
                  onClick={() => handleContactOpportunity(selectedOpp)}
                  className="h-11 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contactar empresa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPublishModal && <OpportunityFormModal onClose={() => setShowPublishModal(false)} />}
    </div>
  );
};
