import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { calculateProfileCompleteness } from '../../services/profileCompleteness';
import type { BusinessOperationType, CommercialModel, CompanySize, ExportReadiness } from '../../types/domain';

export const WorkspaceProfilePage: React.FC = () => {
  const { state, activeCompany, updateCompany } = useTrama();

  const [name, setName] = useState(activeCompany?.name ?? '');
  const [tagline, setTagline] = useState(activeCompany?.tagline ?? '');
  const [description, setDescription] = useState(activeCompany?.description ?? '');
  const [history, setHistory] = useState(activeCompany?.history ?? '');
  const [industry, setIndustry] = useState(activeCompany?.industry ?? state.taxonomy.industries[0]);
  const [subindustry, setSubindustry] = useState(activeCompany?.subindustry ?? '');
  const [size, setSize] = useState<CompanySize>(activeCompany?.size ?? 'Micro PyME (6-15)');
  const [operationType, setOperationType] = useState<BusinessOperationType>(
    activeCompany?.operationType ?? 'Fabricante'
  );
  const [commercialModel, setCommercialModel] = useState<CommercialModel>(
    activeCompany?.commercialModel ?? 'B2B'
  );
  const [exportReadiness, setExportReadiness] = useState<ExportReadiness>(
    activeCompany?.exportReadiness ?? 'Mercado local'
  );
  const [coverage, setCoverage] = useState(activeCompany?.coverage ?? '');
  const [website, setWebsite] = useState(activeCompany?.website ?? '');
  const [contactEmail, setContactEmail] = useState(activeCompany?.contactEmail ?? '');
  const [productsRaw, setProductsRaw] = useState(activeCompany?.products.join(', ') ?? '');
  const [servicesRaw, setServicesRaw] = useState(activeCompany?.services.join(', ') ?? '');
  const [offeringsRaw, setOfferingsRaw] = useState(activeCompany?.offerings.join(', ') ?? '');
  const [needsRaw, setNeedsRaw] = useState(activeCompany?.needs.join(', ') ?? '');
  const [capabilitiesRaw, setCapabilitiesRaw] = useState(activeCompany?.capabilities.join(', ') ?? '');
  const [objectivesRaw, setObjectivesRaw] = useState(
    activeCompany?.commercialObjectives.join(', ') ?? ''
  );

  if (!activeCompany) return null;

  const completeness = calculateProfileCompleteness(activeCompany);

  const splitList = (raw: string) =>
    raw
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(activeCompany.id, {
      name: name.trim() || activeCompany.name,
      tagline: tagline.trim(),
      shortDescription: tagline.trim(),
      description: description.trim(),
      history: history.trim(),
      industry,
      subindustry: subindustry.trim(),
      size,
      operationType,
      commercialModel,
      exportReadiness,
      coverage: coverage.trim(),
      website: website.trim(),
      contactEmail: contactEmail.trim(),
      products: splitList(productsRaw),
      services: splitList(servicesRaw),
      offerings: splitList(offeringsRaw),
      needs: splitList(needsRaw),
      capabilities: splitList(capabilitiesRaw),
      commercialObjectives: splitList(objectivesRaw),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213A]">Mi perfil empresarial</h1>
          <p className="text-sm text-slate-600">
            Mantené actualizada tu oferta y necesidades para mejorar tus coincidencias en Match B2B.
          </p>
        </div>
        <Link
          to={`/empresa/${activeCompany.slug}`}
          className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#17213A] hover:border-[#2563EB] inline-flex items-center gap-1.5 self-start"
        >
          Ver perfil público
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Completeness Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#17213A]">Nivel de completitud</span>
          <span className="font-mono font-bold text-[#008777] tabular-nums">
            {completeness.percentage}%
          </span>
        </div>
        <div className="h-2 bg-[#F4F7FB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00A995] rounded-full"
            style={{ width: `${completeness.percentage}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
          {completeness.checks.map((c) => (
            <span
              key={c.label}
              className={`text-xs inline-flex items-center gap-1 ${
                c.done ? 'text-[#008777] font-medium' : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Nombre comercial
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Titular corto
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Industria</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {state.taxonomy.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Subrubro</label>
            <input
              type="text"
              value={subindustry}
              onChange={(e) => setSubindustry(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Cobertura</label>
            <input
              type="text"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Tamaño</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as CompanySize)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="Emprendimiento (1-5)">Emprendimiento (1-5)</option>
              <option value="Micro PyME (6-15)">Micro PyME (6-15)</option>
              <option value="Pequeña (16-50)">Pequeña (16-50)</option>
              <option value="Mediana (51-200)">Mediana (51-200)</option>
              <option value="Gran Empresa (+200)">Gran Empresa (+200)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Operación</label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as BusinessOperationType)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="Fabricante">Fabricante</option>
              <option value="Proveedor de servicios">Proveedor de servicios</option>
              <option value="Comercializadora / Distribuidora">Comercializadora / Distribuidora</option>
              <option value="Productor primario">Productor primario</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Modelo</label>
            <select
              value={commercialModel}
              onChange={(e) => setCommercialModel(e.target.value as CommercialModel)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
              <option value="B2B y B2C">B2B y B2C</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Exportación</label>
            <select
              value={exportReadiness}
              onChange={(e) => setExportReadiness(e.target.value as ExportReadiness)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs bg-white"
            >
              <option value="Mercado local">Mercado local</option>
              <option value="Listo para exportar">Listo para exportar</option>
              <option value="Exportador activo">Exportador activo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Descripción comercial
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Historia de la empresa
            </label>
            <textarea
              rows={3}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-[#008777] mb-1.5">
              Qué ofrecés (separado por comas)
            </label>
            <textarea
              rows={2}
              value={offeringsRaw}
              onChange={(e) => setOfferingsRaw(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#F26444] mb-1.5">
              Qué necesitás hoy (clave para Match B2B)
            </label>
            <textarea
              rows={2}
              value={needsRaw}
              onChange={(e) => setNeedsRaw(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Productos</label>
            <input
              type="text"
              value={productsRaw}
              onChange={(e) => setProductsRaw(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Servicios</label>
            <input
              type="text"
              value={servicesRaw}
              onChange={(e) => setServicesRaw(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Capacidades técnicas
            </label>
            <input
              type="text"
              value={capabilitiesRaw}
              onChange={(e) => setCapabilitiesRaw(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Objetivos comerciales
            </label>
            <input
              type="text"
              value={objectivesRaw}
              onChange={(e) => setObjectivesRaw(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">Sitio web</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
              Correo de contacto comercial
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="h-11 px-6 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Guardar cambios del perfil
          </button>
        </div>
      </form>
    </div>
  );
};
