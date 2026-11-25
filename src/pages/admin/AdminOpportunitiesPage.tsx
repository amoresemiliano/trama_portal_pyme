import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Building2 } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { OpportunityStatus } from '../../types/domain';

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  active: 'Activa',
  paused: 'Pausada',
  under_review: 'En revisión',
  closed: 'Cerrada',
};

export const AdminOpportunitiesPage: React.FC = () => {
  const { state, adminUpdateOpportunityStatus, deleteOpportunity } = useTrama();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(state.opportunities.map((o) => o.category))),
    [state.opportunities]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.opportunities.filter((o) => {
      if (categoryFilter && o.category !== categoryFilter) return false;
      if (statusFilter && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        o.companyName.toLowerCase().includes(q) ||
        o.sector.toLowerCase().includes(q) ||
        o.province.toLowerCase().includes(q)
      );
    });
  }, [state.opportunities, query, categoryFilter, statusFilter]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#17213A]">Gestión de oportunidades comerciales</h1>
        <p className="text-sm text-slate-600 mt-1 tabular-nums">
          {filtered.length} de {state.opportunities.length} publicaciones activas, en revisión o
          cerradas.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar título, empresa o provincia..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
        >
          <option value="">Todos los estados</option>
          {(Object.keys(STATUS_LABELS) as OpportunityStatus[]).map((st) => (
            <option key={st} value={st}>
              {STATUS_LABELS[st]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Oportunidad</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Interés</th>
                <th className="py-3 px-4">Cierre</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#17213A] line-clamp-1">{opp.title}</p>
                    <p className="text-xs text-slate-500">
                      {opp.sector} · {opp.province}
                      {opp.isCorporateProcurement ? ' · Compra corporativa (demo)' : ''}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <Link
                      to={`/empresa/${opp.companySlug}`}
                      className="font-medium text-[#2563EB] hover:underline inline-flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {opp.companyName}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">{opp.category}</td>
                  <td className="py-3 px-4 text-xs font-mono tabular-nums text-[#17213A]">
                    {opp.interestedCompanyIds.length}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-500">
                    {opp.deadline}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      aria-label={`Estado de ${opp.title}`}
                      value={opp.status}
                      onChange={(e) =>
                        adminUpdateOpportunityStatus(opp.id, e.target.value as OpportunityStatus)
                      }
                      className="h-8 px-2 rounded-lg border border-slate-200 text-xs bg-white text-[#17213A]"
                    >
                      {(Object.keys(STATUS_LABELS) as OpportunityStatus[]).map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteOpportunity(opp.id)}
                      title="Eliminar oportunidad"
                      className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-[#F26444] hover:border-red-200 inline-flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
