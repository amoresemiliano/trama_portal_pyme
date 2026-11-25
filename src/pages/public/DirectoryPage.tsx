import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Bookmark,
  Trash2,
} from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { CompanyCard } from '../../components/CompanyCard';
import { evaluateCompanyMatch } from '../../services/matchingEngine';

export const DirectoryPage: React.FC = () => {
  const {
    state,
    activeCompany,
    currentUser,
    toggleSaveCompany,
    saveDirectorySearch,
    deleteSavedSearch,
    startConversationWithCompany,
    loginAsDemoBusiness,
  } = useTrama();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [country, setCountry] = useState('Argentina');
  const [province, setProvince] = useState(searchParams.get('provincia') ?? 'Todas');
  const [city, setCity] = useState('Todas');
  const [sector, setSector] = useState(searchParams.get('sector') ?? 'Todos');
  const [size, setSize] = useState('Todos');
  const [operationType, setOperationType] = useState('Todos');
  const [commercialModel, setCommercialModel] = useState('Todos');
  const [exportReadiness, setExportReadiness] = useState('Todos');
  const [verification, setVerification] = useState('Todos');
  const [certification, setCertification] = useState('Todas');
  const [sortBy, setSortBy] = useState<'relevance' | 'compatibility' | 'name' | 'recent'>('relevance');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const publishedCompanies = useMemo(
    () => state.companies.filter((c) => c.status === 'published'),
    [state.companies]
  );

  const provinces = useMemo(
    () => Array.from(new Set(publishedCompanies.map((c) => c.location.province))).sort(),
    [publishedCompanies]
  );

  const cities = useMemo(() => {
    const filteredByProv =
      province === 'Todas'
        ? publishedCompanies
        : publishedCompanies.filter((c) => c.location.province === province);
    return Array.from(new Set(filteredByProv.map((c) => c.location.city))).sort();
  }, [publishedCompanies, province]);

  const compatibilityMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!activeCompany) return map;
    for (const c of publishedCompanies) {
      if (c.id !== activeCompany.id) {
        map.set(c.id, evaluateCompanyMatch(activeCompany, c).score);
      }
    }
    return map;
  }, [activeCompany, publishedCompanies]);

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = publishedCompanies.filter((c) => {
      if (country !== 'Todos' && c.location.country !== country) return false;
      if (province !== 'Todas' && c.location.province !== province) return false;
      if (city !== 'Todas' && c.location.city !== city) return false;
      if (sector !== 'Todos' && c.industry !== sector) return false;
      if (size !== 'Todos' && c.size !== size) return false;
      if (operationType !== 'Todos' && c.operationType !== operationType) return false;
      if (commercialModel !== 'Todos' && c.commercialModel !== commercialModel) return false;
      if (exportReadiness !== 'Todos' && c.exportReadiness !== exportReadiness) return false;
      if (verification === 'verified_demo' && c.verificationStatus !== 'verified_demo') return false;
      if (verification === 'pending' && c.verificationStatus === 'verified_demo') return false;
      if (
        certification !== 'Todas' &&
        !c.certifications.some((cert) => cert.toLowerCase().includes(certification.toLowerCase()))
      ) {
        return false;
      }

      if (q) {
        const haystack = [
          c.name,
          c.industry,
          c.subindustry,
          c.shortDescription,
          c.description,
          c.location.province,
          c.location.city,
          ...c.products,
          ...c.services,
          ...c.capabilities,
          ...c.offerings,
          ...c.needs,
          ...c.commercialObjectives,
          ...c.certifications,
          ...c.sustainabilityCriteria,
          ...c.tags,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'compatibility') {
        return (compatibilityMap.get(b.id) ?? 0) - (compatibilityMap.get(a.id) ?? 0);
      }
      // Relevance: featured + verified + compatibility
      const scoreA = (a.featured ? 15 : 0) + (compatibilityMap.get(a.id) ?? 50);
      const scoreB = (b.featured ? 15 : 0) + (compatibilityMap.get(b.id) ?? 50);
      return scoreB - scoreA;
    });
  }, [
    publishedCompanies,
    query,
    country,
    province,
    city,
    sector,
    size,
    operationType,
    commercialModel,
    exportReadiness,
    verification,
    certification,
    sortBy,
    compatibilityMap,
  ]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (query.trim()) chips.push({ key: 'q', label: `Búsqueda: "${query.trim()}"`, clear: () => setQuery('') });
    if (province !== 'Todas')
      chips.push({
        key: 'prov',
        label: `Provincia: ${province}`,
        clear: () => {
          setProvince('Todas');
          setCity('Todas');
        },
      });
    if (city !== 'Todas') chips.push({ key: 'city', label: `Ciudad: ${city}`, clear: () => setCity('Todas') });
    if (sector !== 'Todos') chips.push({ key: 'sector', label: `Rubro: ${sector}`, clear: () => setSector('Todos') });
    if (size !== 'Todos') chips.push({ key: 'size', label: `Tamaño: ${size}`, clear: () => setSize('Todos') });
    if (operationType !== 'Todos')
      chips.push({ key: 'op', label: `Tipo: ${operationType}`, clear: () => setOperationType('Todos') });
    if (commercialModel !== 'Todos')
      chips.push({ key: 'mod', label: `Modelo: ${commercialModel}`, clear: () => setCommercialModel('Todos') });
    if (exportReadiness !== 'Todos')
      chips.push({ key: 'exp', label: `Exportación: ${exportReadiness}`, clear: () => setExportReadiness('Todos') });
    if (verification !== 'Todos')
      chips.push({
        key: 'ver',
        label: verification === 'verified_demo' ? 'Solo verificadas (demo)' : 'Sin verificar',
        clear: () => setVerification('Todos'),
      });
    if (certification !== 'Todas')
      chips.push({ key: 'cert', label: `Certificación: ${certification}`, clear: () => setCertification('Todas') });
    return chips;
  }, [
    query,
    province,
    city,
    sector,
    size,
    operationType,
    commercialModel,
    exportReadiness,
    verification,
    certification,
  ]);

  const resetAllFilters = () => {
    setQuery('');
    setProvince('Todas');
    setCity('Todas');
    setSector('Todos');
    setSize('Todos');
    setOperationType('Todos');
    setCommercialModel('Todos');
    setExportReadiness('Todos');
    setVerification('Todos');
    setCertification('Todas');
    setSearchParams({});
  };

  const handleSaveCurrentSearch = () => {
    const labelParts = [
      sector !== 'Todos' ? sector : null,
      province !== 'Todas' ? province : null,
      query.trim() ? `"${query.trim()}"` : null,
      exportReadiness !== 'Todos' ? exportReadiness : null,
    ].filter(Boolean);
    saveDirectorySearch(
      labelParts.length > 0 ? labelParts.join(' · ') : 'Directorio general Argentina',
      query,
      {
        ...(sector !== 'Todos' ? { industry: sector } : {}),
        ...(province !== 'Todas' ? { province } : {}),
        ...(exportReadiness !== 'Todos' ? { exportReadiness } : {}),
      }
    );
  };

  const applySavedSearch = (saved: (typeof state.savedSearches)[number]) => {
    setQuery(saved.query);
    setSector(saved.filters.industry ?? 'Todos');
    setProvince(saved.filters.province ?? 'Todas');
    setExportReadiness(saved.filters.exportReadiness ?? 'Todos');
  };

  const handleConnect = (companyId: string) => {
    if (!currentUser) {
      loginAsDemoBusiness();
    }
    const convId = startConversationWithCompany(companyId, 'Contacto desde Directorio');
    navigate(`/espacio/mensajes?conv=${convId}`);
  };

  const filtersForm = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">País</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Argentina">Argentina (Lanzamiento)</option>
          <option value="Todos">Todos (Preparado LATAM)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Provincia</label>
        <select
          value={province}
          onChange={(e) => {
            setProvince(e.target.value);
            setCity('Todas');
          }}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todas">Todas las provincias</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Ciudad</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todas">Todas las ciudades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Sector / Rubro</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todos">Todos los rubros</option>
          {state.taxonomy.industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
          Tipo de proveedor / operación
        </label>
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todos">Todos</option>
          <option value="Fabricante">Fabricante</option>
          <option value="Proveedor de servicios">Proveedor de servicios</option>
          <option value="Comercializadora / Distribuidora">Comercializadora / Distribuidora</option>
          <option value="Productor primario">Productor primario</option>
          <option value="Mixto">Mixto</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Tamaño</label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todos">Todos los tamaños</option>
          <option value="Emprendimiento (1-5)">Emprendimiento (1-5)</option>
          <option value="Micro PyME (6-15)">Micro PyME (6-15)</option>
          <option value="Pequeña (16-50)">Pequeña (16-50)</option>
          <option value="Mediana (51-200)">Mediana (51-200)</option>
          <option value="Gran Empresa (+200)">Gran Empresa (+200)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Modelo comercial</label>
        <select
          value={commercialModel}
          onChange={(e) => setCommercialModel(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todos">B2B y B2C</option>
          <option value="B2B">Solo B2B</option>
          <option value="B2C">Solo B2C</option>
          <option value="B2B y B2C">Híbrido (B2B y B2C)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
          Capacidad exportadora
        </label>
        <select
          value={exportReadiness}
          onChange={(e) => setExportReadiness(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todos">Todas</option>
          <option value="Exportador activo">Exportador activo</option>
          <option value="Listo para exportar">Listo para exportar</option>
          <option value="Mercado local">Mercado local</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
          Certificación / Estándar (demo)
        </label>
        <select
          value={certification}
          onChange={(e) => setCertification(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todas">Cualquiera</option>
          <option value="ISO">Normas ISO</option>
          <option value="BPM">BPM / Alimentaria</option>
          <option value="Gluten">Libre de Gluten Sin TACC</option>
          <option value="FSC">FSC / Sustentable</option>
          <option value="Orgánica">Certificación Orgánica</option>
          <option value="SENASA">SENASA</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Verificación</label>
        <select
          value={verification}
          onChange={(e) => setVerification(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-[#17213A]"
        >
          <option value="Todos">Todas las empresas</option>
          <option value="verified_demo">Verificadas (perfil demo)</option>
          <option value="pending">Pendientes / sin verificar</option>
        </select>
      </div>

      {state.savedSearches.length > 0 && (
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <p className="text-xs font-bold text-[#17213A]">Búsquedas guardadas</p>
          {state.savedSearches.map((saved) => (
            <div
              key={saved.id}
              className="flex items-center justify-between gap-2 text-xs py-1"
            >
              <button
                type="button"
                onClick={() => applySavedSearch(saved)}
                className="text-left text-[#2563EB] hover:underline truncate cursor-pointer"
              >
                {saved.label}
              </button>
              <button
                type="button"
                onClick={() => deleteSavedSearch(saved.id)}
                aria-label="Eliminar búsqueda guardada"
                className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header + Prominent Search */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#2563EB] mb-1">Directorio inteligente B2B</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Descubrí empresas, proveedores y aliados en Argentina
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Buscá por producto, capacidad técnica, necesidad comercial, sustentabilidad o
                provincia.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveCurrentSearch}
              className="h-10 px-4 rounded-xl border border-slate-200 hover:border-[#2563EB] text-xs font-semibold text-[#17213A] inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
              Guardar búsqueda
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: cajas kraft, CNC acero inoxidable, cadena de frío, ERP, Mendoza..."
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-[#17213A] focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden h-12 px-4 rounded-xl border border-slate-200 bg-[#F4F7FB] text-sm font-semibold text-[#17213A] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros ({activeFilters.length})
            </button>
          </div>

          {/* Active Interactive Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeFilters.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="h-8 px-3 rounded-lg bg-[#F4F7FB] hover:bg-slate-200/80 text-xs font-medium text-[#17213A] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{chip.label}</span>
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-semibold text-[#F26444] hover:underline ml-1 cursor-pointer"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        {/* Main Split: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#17213A]">Filtros avanzados</h2>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-[#F26444] hover:underline cursor-pointer"
                >
                  Reiniciar
                </button>
              )}
            </div>
            {filtersForm}
          </aside>

          {/* Mobile Drawer Filters */}
          {mobileFiltersOpen && (
            <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#17213A]">Filtros avanzados</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-xs font-semibold text-[#2563EB]"
                >
                  Listo
                </button>
              </div>
              {filtersForm}
            </div>
          )}

          {/* Results Column */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <p className="text-sm text-slate-600">
                Mostrando{' '}
                <strong className="font-mono text-[#17213A] tabular-nums">
                  {filteredCompanies.length}
                </strong>{' '}
                de {publishedCompanies.length} empresas
              </p>

              <div className="flex items-center gap-3">
                <select
                  aria-label="Ordenar resultados"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium text-[#17213A] bg-white"
                >
                  <option value="relevance">Ordenar: Relevancia</option>
                  <option value="compatibility">Mayor afinidad B2B</option>
                  <option value="name">Nombre A-Z</option>
                  <option value="recent">Más recientes</option>
                </select>

                <div className="flex items-center gap-1 p-1 bg-[#F4F7FB] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLayout('grid')}
                    aria-label="Vista en cuadrícula"
                    className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer ${
                      layout === 'grid' ? 'bg-white text-[#17213A] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('list')}
                    aria-label="Vista en lista"
                    className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer ${
                      layout === 'list' ? 'bg-white text-[#17213A] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {filteredCompanies.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                <h3 className="text-lg font-bold text-[#17213A]">
                  No encontramos empresas con esa combinación de filtros
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Probá ampliar la provincia, quitar una certificación o buscar con un término más
                  general.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-2 h-10 px-5 rounded-xl bg-[#17213A] text-white text-xs font-semibold hover:bg-[#2563EB] cursor-pointer"
                >
                  Ver todas las empresas
                </button>
              </div>
            ) : (
              <div
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                }
              >
                {filteredCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    layout={layout}
                    isSaved={state.savedCompanyIds.includes(company.id)}
                    compatibilityScore={compatibilityMap.get(company.id)}
                    onToggleSave={toggleSaveCompany}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
