import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { OpportunityFormModal } from '../../components/OpportunityFormModal';
import type { Opportunity } from '../../types/domain';
import { getPlanEntitlement } from '../../services/entitlements';

export const WorkspaceOpportunitiesPage: React.FC = () => {
  const { state, activeCompany, updateOpportunity, deleteOpportunity } = useTrama();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(searchParams.get('new') === '1');
  const [editing, setEditing] = useState<Opportunity | null>(null);

  const myOpportunities = useMemo(() => {
    if (!activeCompany) return [];
    return state.opportunities.filter((o) => o.companyId === activeCompany.id);
  }, [state.opportunities, activeCompany]);

  if (!activeCompany) return null;

  const plan = getPlanEntitlement(activeCompany.planTier);
  const activeCount = myOpportunities.filter((o) => o.status === 'active').length;

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    if (searchParams.get('new')) setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213A]">Mis oportunidades comerciales</h1>
          <p className="text-sm text-slate-600">
            Creá, editá y gestioná tus búsquedas de proveedores, clientes, distribuidores o alianzas.
            Plan {plan.name}:{' '}
            <span className="font-mono font-semibold text-[#17213A] tabular-nums">
              {activeCount}/{plan.limits.maxActiveOpportunities}
            </span>{' '}
            activas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="h-11 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center gap-2 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva oportunidad
        </button>
      </div>

      {myOpportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <h2 className="text-lg font-bold text-[#17213A]">
            Aún no publicaste oportunidades comerciales
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Publicá lo que necesitás comprar o lo que ofrecés al mercado B2B para recibir
            propuestas directas de otras PyMEs argentinas.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-10 px-5 rounded-xl bg-[#17213A] text-white text-xs font-bold cursor-pointer"
          >
            Publicar mi primera oportunidad
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myOpportunities.map((opp) => (
            <article
              key={opp.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-[#F26444]">{opp.category}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{opp.sector}</span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={`font-semibold ${
                      opp.status === 'active'
                        ? 'text-[#008777]'
                        : opp.status === 'paused'
                        ? 'text-[#D97706]'
                        : 'text-slate-500'
                    }`}
                  >
                    {opp.status === 'active'
                      ? 'Activa'
                      : opp.status === 'paused'
                      ? 'Pausada'
                      : 'Cerrada'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#17213A]">{opp.title}</h2>
                <p className="text-xs text-slate-600 line-clamp-2">{opp.description}</p>
                <p className="text-xs text-slate-400 font-mono tabular-nums">
                  Cierre: {opp.deadline} · {opp.interestedCompanyIds.length} empresas interesadas
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(opp);
                    setModalOpen(true);
                  }}
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateOpportunity(opp.id, {
                      status: opp.status === 'active' ? 'paused' : 'active',
                    })
                  }
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-[#F4F7FB] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {opp.status === 'active' ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" /> Pausar
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-[#008777]" /> Activar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => deleteOpportunity(opp.id)}
                  className="h-9 px-3 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && <OpportunityFormModal initial={editing} onClose={closeModal} />}
    </div>
  );
};
