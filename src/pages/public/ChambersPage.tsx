import React, { useMemo, useState } from 'react';
import { ExternalLink, Info, Search } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { Organization } from '../../types/domain';

const ORG_CATEGORIES: ('Todas' | Organization['category'])[] = [
  'Todas',
  'Cámara empresarial',
  'Banco / Desarrollo',
  'Organismo internacional',
  'Polo tecnológico / Sectorial',
  'Universidad',
];

export const ChambersPage: React.FC = () => {
  const { state } = useTrama();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Todas' | Organization['category']>('Todas');

  const activeOrgs = useMemo(
    () => state.organizations.filter((o) => o.status === 'active'),
    [state.organizations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeOrgs.filter((o) => {
      if (category !== 'Todas' && o.category !== category) return false;
      if (q) {
        return `${o.acronym} ${o.name} ${o.description} ${o.scope} ${o.focusAreas.join(' ')}`
          .toLowerCase()
          .includes(q);
      }
      return true;
    });
  }, [activeOrgs, category, query]);

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="max-w-3xl space-y-1.5">
            <p className="text-xs font-bold text-[#2563EB]">Mapa Institucional Argentino y Regional</p>
            <h1 className="text-3xl font-extrabold text-[#17213A] tracking-tight">
              Cámaras empresariales, bancos y organizaciones de referencia
            </h1>
            <p className="text-sm text-slate-600">
              Conocé las principales instituciones que acompañan al sector productivo, las PyMEs, la
              industria, el comercio y la exportación.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F7FB] border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#17213A]">Directorio informativo de referencia:</strong> La
              inclusión de CAME, UIA, CAC, ADIMRA, FEBA, IDEA, Banco Nación, BICE, BID, CAF y otras
              entidades tiene fines estrictamente orientativos para las PyMEs y no implica alianza,
              patrocinio ni representación oficial.
            </p>
          </div>

          <div className="relative max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por sigla, nombre o área de enfoque..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {ORG_CATEGORIES.map((cat) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((org) => (
            <article
              key={org.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="h-11 px-3.5 rounded-xl text-white font-extrabold text-sm inline-flex items-center justify-center tracking-wide"
                    style={{ backgroundColor: org.accentColor, fontFamily: 'var(--font-display)' }}
                  >
                    {org.acronym}
                  </div>
                  <span className="text-xs text-slate-400 text-right">
                    {org.category} · {org.scope}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#17213A] leading-snug">{org.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{org.description}</p>
                <p className="text-xs text-slate-500 pt-1">
                  <strong className="text-[#17213A]">Ejes:</strong> {org.focusAreas.join(' · ')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Ficha de referencia</span>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                >
                  Sitio oficial
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
