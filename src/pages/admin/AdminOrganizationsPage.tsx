import React, { useState } from 'react';
import { Plus, Archive, RotateCcw, X } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { Organization } from '../../types/domain';

const ORG_CATEGORIES: Organization['category'][] = [
  'Cámara empresarial',
  'Banco / Desarrollo',
  'Organismo internacional',
  'Polo tecnológico / Sectorial',
  'Universidad',
];

export const AdminOrganizationsPage: React.FC = () => {
  const { state, adminCreateOrganization, adminToggleOrganizationStatus } = useTrama();
  const [showForm, setShowForm] = useState(false);

  const [acronym, setAcronym] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Organization['category']>('Cámara empresarial');
  const [scope, setScope] = useState('Provincial');
  const [province, setProvince] = useState('Santa Fe');
  const [website, setWebsite] = useState('https://');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acronym.trim() || !name.trim()) return;
    adminCreateOrganization({
      acronym: acronym.trim().toUpperCase(),
      name: name.trim(),
      category,
      scope,
      province,
      description:
        description.trim() ||
        'Organización de referencia del ecosistema productivo argentino (sin convenio oficial implícito).',
      focusAreas: [category, province],
      website: website.trim(),
      accentColor: '#2563EB',
    });
    setAcronym('');
    setName('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213A]">Organizaciones y cámaras de referencia</h1>
          <p className="text-sm text-slate-600 mt-1 tabular-nums">
            {state.organizations.filter((o) => o.status === 'active').length} activas de{' '}
            {state.organizations.length} entidades listadas como directorio informativo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="h-10 px-4 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancelar' : 'Nueva organización'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
        >
          <h2 className="text-base font-bold text-[#17213A]">Agregar organización de referencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sigla *</label>
              <input
                required
                type="text"
                value={acronym}
                onChange={(e) => setAcronym(e.target.value)}
                placeholder="Ej. FISFE"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre completo *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Federación Industrial de Santa Fe"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Organization['category'])}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {ORG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alcance</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jurisdicción</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sitio web</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
            >
              Guardar en directorio de referencia
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Organización</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Alcance</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {state.organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#17213A]">
                      {org.acronym} · {org.name}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">{org.description}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">{org.category}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {org.scope} · {org.province}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    <span className={org.status === 'active' ? 'text-[#00A995]' : 'text-slate-400'}>
                      {org.status === 'active' ? 'Activa' : 'Archivada'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => adminToggleOrganizationStatus(org.id)}
                      className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {org.status === 'active' ? (
                        <>
                          <Archive className="w-3.5 h-3.5" /> Archivar
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" /> Activar
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
