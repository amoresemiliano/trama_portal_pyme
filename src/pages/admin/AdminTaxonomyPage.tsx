import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { TaxonomyData } from '../../types/domain';

const GROUPS: { key: keyof TaxonomyData; title: string; subtitle: string }[] = [
  {
    key: 'industries',
    title: 'Industrias y sectores',
    subtitle: 'Rubros principales utilizados en el directorio y filtros.',
  },
  {
    key: 'capabilities',
    title: 'Capacidades productivas',
    subtitle: 'Habilidades operativas que alimentan el motor de Match B2B.',
  },
  {
    key: 'needs',
    title: 'Necesidades comerciales',
    subtitle: 'Demandas frecuentes que cruzan con ofertas complementarias.',
  },
  {
    key: 'certifications',
    title: 'Certificaciones y sellos',
    subtitle: 'Normas de calidad, inocuidad y sustentabilidad.',
  },
  {
    key: 'tags',
    title: 'Etiquetas del ecosistema',
    subtitle: 'Palabras clave para mejorar la descubribilidad.',
  },
];

export const AdminTaxonomyPage: React.FC = () => {
  const { state, adminAddTaxonomyTerm, adminRemoveTaxonomyTerm } = useTrama();
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const handleAdd = (group: keyof TaxonomyData, e: React.FormEvent) => {
    e.preventDefault();
    const val = (inputs[group] ?? '').trim();
    if (!val) return;
    adminAddTaxonomyTerm(group, val);
    setInputs((prev) => ({ ...prev, [group]: '' }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#17213A]">Taxonomía y etiquetas</h1>
        <p className="text-sm text-slate-600 mt-1">
          Vocabulario estructurado que potencia la búsqueda inteligente y la compatibilidad B2B.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {GROUPS.map((group) => {
          const items = state.taxonomy[group.key];
          return (
            <div
              key={group.key}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-[#17213A]">{group.title}</h2>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    {items.length} términos
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{group.subtitle}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F7FB] text-xs font-medium text-[#17213A]"
                    >
                      {term}
                      <button
                        type="button"
                        aria-label={`Quitar ${term}`}
                        onClick={() => adminRemoveTaxonomyTerm(group.key, term)}
                        className="text-slate-400 hover:text-[#F26444] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => handleAdd(group.key, e)} className="flex gap-2 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  value={inputs[group.key] ?? ''}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [group.key]: e.target.value }))}
                  placeholder={`Agregar término en ${group.title.toLowerCase()}...`}
                  className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  className="h-9 px-3 rounded-lg bg-[#17213A] hover:bg-[#2563EB] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};
