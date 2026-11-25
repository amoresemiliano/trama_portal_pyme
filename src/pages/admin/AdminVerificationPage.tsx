import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import type { VerificationStatus } from '../../types/domain';

export const AdminVerificationPage: React.FC = () => {
  const { state, adminSetCompanyVerification } = useTrama();
  const [tab, setTab] = useState<'pending' | 'unverified' | 'verified_demo' | 'rejected'>('pending');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const counts = useMemo(
    () => ({
      pending: state.companies.filter((c) => c.verificationStatus === 'pending').length,
      unverified: state.companies.filter((c) => c.verificationStatus === 'unverified').length,
      verified_demo: state.companies.filter((c) => c.verificationStatus === 'verified_demo').length,
      rejected: state.companies.filter((c) => c.verificationStatus === 'rejected').length,
    }),
    [state.companies]
  );

  const list = useMemo(
    () => state.companies.filter((c) => c.verificationStatus === tab),
    [state.companies, tab]
  );

  const handleDecision = (companyId: string, nextStatus: VerificationStatus) => {
    const defaultNote =
      nextStatus === 'verified_demo'
        ? 'Validación documental simulada aprobada en entorno demo.'
        : nextStatus === 'rejected'
        ? 'Falta documentación respaldatoria para completar la verificación.'
        : 'Reingresada a cola de revisión.';
    adminSetCompanyVerification(companyId, nextStatus, notes[companyId]?.trim() || defaultNote);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#17213A]">Verificación de empresas</h1>
        <p className="text-sm text-slate-600 mt-1">
          Flujo de validación comercial demo. Las empresas aprobadas muestran el sello transparente{' '}
          <strong>Verificada (demo)</strong>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {(
          [
            { key: 'pending', label: 'Pendientes', count: counts.pending },
            { key: 'unverified', label: 'Sin solicitar', count: counts.unverified },
            { key: 'verified_demo', label: 'Verificadas (demo)', count: counts.verified_demo },
            { key: 'rejected', label: 'Rechazadas', count: counts.rejected },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
              tab === item.key
                ? 'bg-[#17213A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-[#17213A]">
            No hay empresas en esta bandeja de verificación.
          </p>
          <p className="text-xs text-slate-500">
            Cambiá de pestaña para revisar otras empresas del directorio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {list.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/empresa/${company.slug}`}
                    className="text-base font-bold text-[#17213A] hover:text-[#2563EB]"
                  >
                    {company.name}
                  </Link>
                  <span className="text-xs text-slate-500">· {company.legalName}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {company.industry} · {company.location.city}, {company.location.province} ·{' '}
                  {company.size} · {company.contactEmail}
                </p>
                {company.verificationNote && (
                  <p className="text-xs text-slate-500 bg-[#F4F7FB] rounded-lg px-3 py-2">
                    Última nota: {company.verificationNote}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:w-[440px]">
                <input
                  type="text"
                  value={notes[company.id] ?? ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [company.id]: e.target.value }))}
                  placeholder="Nota de revisión (opcional)..."
                  className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#2563EB]"
                />
                {company.verificationStatus !== 'verified_demo' && (
                  <button
                    type="button"
                    onClick={() => handleDecision(company.id, 'verified_demo')}
                    className="h-9 px-3 rounded-lg bg-[#00A995] hover:bg-[#009280] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aprobar
                  </button>
                )}
                {company.verificationStatus !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleDecision(company.id, 'rejected')}
                    className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-[#F26444] text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Rechazar
                  </button>
                )}
                {company.verificationStatus !== 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleDecision(company.id, 'pending')}
                    className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Pendiente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
