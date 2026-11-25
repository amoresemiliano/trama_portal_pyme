import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, ExternalLink, Info, Search } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { ResourceCategory } from '../../types/domain';

const RESOURCE_CATEGORIES: ('Todos' | ResourceCategory)[] = [
  'Todos',
  'Programas públicos',
  'Programas provinciales',
  'Bancos',
  'Instituciones de desarrollo',
  'Organismos internacionales',
  'Universidades',
  'Cámaras empresariales',
];

export const FundingPage: React.FC = () => {
  const { state, toggleSaveResource } = useTrama();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Todos' | ResourceCategory>(
    (searchParams.get('cat') as ResourceCategory) || 'Todos'
  );

  const activeResources = useMemo(
    () => state.resources.filter((r) => r.status === 'active'),
    [state.resources]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeResources.filter((r) => {
      if (category !== 'Todos' && r.category !== category) return false;
      if (q) {
        return `${r.title} ${r.summary} ${r.institution} ${r.scope} ${r.tags.join(' ')}`
          .toLowerCase()
          .includes(q);
      }
      return true;
    });
  }, [activeResources, category, query]);

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="max-w-3xl space-y-1.5">
            <p className="text-xs font-bold text-[#008777]">Financiamiento y Asistencia Técnica</p>
            <h1 className="text-3xl font-extrabold text-[#17213A] tracking-tight">
              Guía de financiamiento, bancos y recursos institucionales
            </h1>
            <p className="text-sm text-slate-600">
              Explorá referencias de entidades financieras, bancos de desarrollo, organismos
              internacionales, universidades y guías educativas para PyMEs argentinas.
            </p>
          </div>

          {/* Transparent Reference Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#17213A]">Nota de transparencia:</strong> TRAMA no inventa
              subsidios ni líneas vigentes con tasas garantizadas ni implica convenios oficiales con
              las entidades listadas. Cada ficha indica claramente si corresponde a un portal
              institucional de referencia pública (para consultar vigencia oficial) o a una guía
              educativa demo.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por entidad (BNA, BICE, BID, CAF, INTI, SGR, provincial)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-[#00A995] text-white'
                    : 'bg-[#F4F7FB] text-slate-600 hover:text-[#17213A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600">
          <strong className="font-mono text-[#17213A] tabular-nums">{filtered.length}</strong>{' '}
          recursos disponibles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((res) => {
            const isSaved = state.savedResourceIds.includes(res.id);
            return (
              <article
                key={res.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#008777]">
                      {res.category} · {res.resourceType}
                    </span>
                    <span className="text-slate-400">
                      {res.isReferenceInfo ? 'Referencia institucional' : 'Guía demo'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#17213A] leading-snug">{res.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{res.summary}</p>

                  <div className="pt-2 text-xs text-slate-500 space-y-1">
                    <p>
                      <strong className="text-[#17213A]">Entidad:</strong> {res.institution} ·{' '}
                      <strong className="text-[#17213A]">Alcance:</strong> {res.scope}
                    </p>
                    <p>
                      <strong className="text-[#17213A]">Dirigido a:</strong> {res.audience}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 leading-relaxed">
                    {res.disclaimerNote}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => toggleSaveResource(res.id)}
                    className={`h-10 px-4 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                      isSaved
                        ? 'border-[#00A995] bg-[#00A995]/10 text-[#008777]'
                        : 'border-slate-200 text-[#17213A] hover:bg-[#F4F7FB]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Guardado' : 'Guardar recurso'}
                  </button>

                  {res.referenceUrl.startsWith('http') ? (
                    <a
                      href={res.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-4 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      Consultar fuente oficial
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">
                      Disponible en Mi Espacio
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
