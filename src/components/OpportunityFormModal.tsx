import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Opportunity, OpportunityCategory } from '../types/domain';
import { useTrama } from '../context/TramaContext';
import { getIndustryImage } from '../data/mediaAssets';

const CATEGORIES: OpportunityCategory[] = [
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

const PROVINCES = [
  'CABA',
  'Buenos Aires',
  'Córdoba',
  'Santa Fe',
  'Mendoza',
  'Tucumán',
  'Salta',
  'Neuquén',
  'Río Negro',
  'Entre Ríos',
  'Misiones',
  'San Juan',
  'Chubut',
  'San Luis',
];

interface OpportunityFormModalProps {
  initial?: Opportunity | null;
  onClose: () => void;
}

export const OpportunityFormModal: React.FC<OpportunityFormModalProps> = ({
  initial,
  onClose,
}) => {
  const { state, activeCompany, createOpportunity, updateOpportunity } = useTrama();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState<OpportunityCategory>(
    initial?.category ?? 'Busco proveedor'
  );
  const [sector, setSector] = useState(
    initial?.sector ?? activeCompany?.industry ?? state.taxonomy.industries[0]
  );
  const [province, setProvince] = useState(
    initial?.province ?? activeCompany?.location.province ?? 'Buenos Aires'
  );
  const [location, setLocation] = useState(
    initial?.location ?? `${activeCompany?.location.city ?? 'Buenos Aires'}, ${activeCompany?.location.province ?? 'Buenos Aires'}`
  );
  const [budget, setBudget] = useState(initial?.budget ?? '');
  const [deadline, setDeadline] = useState(initial?.deadline ?? '2026-12-30');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [tagsRaw, setTagsRaw] = useState(initial?.tags.join(', ') ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 10) {
      setError('Ingresá un título descriptivo de al menos 10 caracteres.');
      return;
    }
    if (description.trim().length < 25) {
      setError('Agregá una descripción clara (mínimo 25 caracteres) para recibir mejores contactos.');
      return;
    }

    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (initial) {
      updateOpportunity(initial.id, {
        title: title.trim(),
        category,
        sector,
        province,
        location: location.trim() || province,
        budget: budget.trim() || undefined,
        deadline,
        description: description.trim(),
        tags: tags.length > 0 ? tags : [sector.toLowerCase().split(' ')[0]],
        isCorporateProcurement: category === 'Compra corporativa',
      });
    } else {
      createOpportunity({
        title: title.trim(),
        category,
        sector,
        province,
        location: location.trim() || province,
        budget: budget.trim() || undefined,
        deadline,
        description: description.trim(),
        tags: tags.length > 0 ? tags : [sector.toLowerCase().split(' ')[0]],
        status: 'active',
        isCorporateProcurement: category === 'Compra corporativa',
        coverImage: getIndustryImage(sector),
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#17213A]/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17213A]">
              {initial ? 'Editar oportunidad comercial' : 'Publicar nueva oportunidad comercial'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publicando como <strong>{activeCompany?.name ?? 'Tu empresa'}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Título de la oportunidad *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Buscamos proveedor de cajas kraft impresas para envíos nacionales"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Rubro</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {state.taxonomy.industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Provincia</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                Cobertura / Ubicación
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Mendoza (recibimos propuestas de todo el país)"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                Presupuesto o volumen estimado (opcional)
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ej: 5.000 unidades mensuales / A cotizar"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                Fecha límite de propuestas
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Descripción y requisitos *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detallá qué necesitás u ofrecés, cantidades, plazos y criterios importantes."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="packaging, sustentable, exportacion"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              {initial ? 'Guardar cambios' : 'Publicar oportunidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
