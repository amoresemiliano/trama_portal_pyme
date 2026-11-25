import React, { useState } from 'react';
import { Plus, Archive, RotateCcw, X } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { ResourceCategory, ResourceItem } from '../../types/domain';

const CATEGORIES: ResourceCategory[] = [
  'Programas públicos',
  'Programas provinciales',
  'Bancos',
  'Instituciones de desarrollo',
  'Organismos internacionales',
  'Universidades',
  'Cámaras empresariales',
];

export const AdminResourcesPage: React.FC = () => {
  const { state, adminCreateResource, adminToggleResourceStatus } = useTrama();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Programas provinciales');
  const [institution, setInstitution] = useState('');
  const [scope, setScope] = useState('Nacional');
  const [audience, setAudience] = useState('PyMEs industriales y comerciales');
  const [resourceType, setResourceType] = useState<ResourceItem['resourceType']>('Guía de referencia');
  const [referenceUrl, setReferenceUrl] = useState('https://www.argentina.gob.ar');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !institution.trim()) return;
    adminCreateResource({
      title: title.trim(),
      summary: summary.trim() || 'Información referencial sobre herramientas de apoyo y asistencia PyME.',
      category,
      institution: institution.trim(),
      scope,
      audience,
      resourceType,
      referenceUrl: referenceUrl.trim() || 'https://www.argentina.gob.ar',
      isReferenceInfo: true,
      disclaimerNote:
        'Información referencial de muestra. Verificar vigencia y bases en el portal oficial de la entidad.',
      tags: [category, scope],
    });
    setTitle('');
    setInstitution('');
    setSummary('');
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213A]">Financiamiento y recursos institucionales</h1>
          <p className="text-sm text-slate-600 mt-1 tabular-nums">
            {state.resources.filter((r) => r.status === 'active').length} recursos visibles · Siempre
            identificados como información de referencia (sin garantías de vigencia oficial).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="h-10 px-4 rounded-xl bg-[#00A995] hover:bg-[#009280] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancelar' : 'Nuevo recurso'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
        >
          <h2 className="text-base font-bold text-[#17213A]">Agregar ficha de recurso referencial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Guía de líneas para modernización tecnológica PyME"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institución *</label>
              <input
                required
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Ej. Agencia Provincial de Innovación"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceItem['resourceType'])}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Guía de referencia">Guía de referencia</option>
                <option value="Portal institucional">Portal institucional</option>
                <option value="Línea referencial (demo)">Línea referencial (demo)</option>
                <option value="Asistencia técnica">Asistencia técnica</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destinatarios</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL de referencia</label>
              <input
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
            >
              Guardar recurso
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Recurso</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Institución y alcance</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {state.resources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#17213A]">{res.title}</p>
                    <p className="text-xs text-slate-500">{res.resourceType}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">{res.category}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {res.institution} · {res.scope}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    <span className={res.status === 'active' ? 'text-[#00A995]' : 'text-slate-400'}>
                      {res.status === 'active' ? 'Activo' : 'Archivado'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => adminToggleResourceStatus(res.id)}
                      className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {res.status === 'active' ? (
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
