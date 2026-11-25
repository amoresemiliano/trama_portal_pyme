import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, CheckCircle2, ExternalLink } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { Company } from '../../types/domain';

const VERIFICATION_LABEL: Record<Company['verificationStatus'], string> = {
  verified_demo: 'Verificada (demo)',
  pending: 'Pendiente',
  unverified: 'Sin verificar',
  rejected: 'Rechazada',
};

const STATUS_LABEL: Record<Company['status'], string> = {
  published: 'Publicada',
  draft: 'Borrador',
  archived: 'Archivada',
};

export const AdminCompaniesPage: React.FC = () => {
  const {
    state,
    adminToggleCompanyFeatured,
    adminUpdateCompanyStatus,
    adminSetCompanyVerification,
  } = useTrama();

  const [query, setQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.companies.filter((c) => {
      if (industryFilter && c.industry !== industryFilter) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.location.province.toLowerCase().includes(q) ||
        c.location.city.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
      );
    });
  }, [state.companies, query, industryFilter, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213A]">Gestión de empresas</h1>
          <p className="text-sm text-slate-600 mt-1 tabular-nums">
            {filtered.length} de {state.companies.length} empresas listadas en el directorio TRAMA.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar empresa, ciudad o provincia..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#2563EB]"
        >
          <option value="">Todas las industrias</option>
          {state.taxonomy.industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#2563EB]"
        >
          <option value="">Todos los estados</option>
          <option value="published">Publicada</option>
          <option value="draft">Borrador</option>
          <option value="archived">Archivada</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Industria y ubicación</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Verificación</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: c.brandColor }}
                      >
                        {c.logoInitials}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#17213A] truncate max-w-[200px]">
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-500">{c.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <p className="font-medium text-slate-700">{c.industry}</p>
                    <p className="text-slate-500">
                      {c.location.city}, {c.location.province}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs uppercase font-mono text-slate-600">
                    {c.planTier}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <span
                      className={`font-semibold ${
                        c.verificationStatus === 'verified_demo'
                          ? 'text-[#00A995]'
                          : c.verificationStatus === 'pending'
                          ? 'text-[#D97706]'
                          : c.verificationStatus === 'rejected'
                          ? 'text-[#F26444]'
                          : 'text-slate-500'
                      }`}
                    >
                      {VERIFICATION_LABEL[c.verificationStatus]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      aria-label={`Estado de ${c.name}`}
                      value={c.status}
                      onChange={(e) =>
                        adminUpdateCompanyStatus(c.id, e.target.value as Company['status'])
                      }
                      className="h-8 px-2 rounded-lg border border-slate-200 text-xs bg-white text-[#17213A]"
                    >
                      {(['published', 'draft', 'archived'] as const).map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABEL[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => adminToggleCompanyFeatured(c.id)}
                        title={c.featured ? 'Quitar destacado' : 'Destacar empresa'}
                        className={`h-8 px-2.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1 cursor-pointer ${
                          c.featured
                            ? 'border-[#F4BB45] bg-[#FFFBEB] text-[#B45309]'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${c.featured ? 'fill-[#F4BB45]' : ''}`} />
                        {c.featured ? 'Destacada' : 'Destacar'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          adminSetCompanyVerification(
                            c.id,
                            c.verificationStatus === 'verified_demo' ? 'unverified' : 'verified_demo',
                            'Actualizado desde gestión de empresas'
                          )
                        }
                        title="Alternar verificación demo"
                        className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A995]" />
                        {c.verificationStatus === 'verified_demo' ? 'Quitar' : 'Verificar'}
                      </button>
                      <Link
                        to={`/empresa/${c.slug}`}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-[#2563EB] inline-flex items-center justify-center"
                        title="Ver perfil público"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
