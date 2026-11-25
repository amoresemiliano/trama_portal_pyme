import React, { useState } from 'react';
import { CheckCircle2, Trash2, Clock, Flag } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';

export const AdminModerationPage: React.FC = () => {
  const { state, adminResolveModeration } = useTrama();
  const [notes, setNotes] = useState<Record<string, string>>({});

  const pending = state.moderationQueue.filter((m) => m.status === 'pending');
  const resolved = state.moderationQueue.filter((m) => m.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#17213A]">Moderación y registro de auditoría</h1>
        <p className="text-sm text-slate-600 mt-1 tabular-nums">
          {pending.length} casos pendientes · {resolved.length} resueltos ·{' '}
          {state.auditLogs.length} eventos registrados en auditoría.
        </p>
      </div>

      {/* Pending queue */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#17213A]">Cola de moderación pendiente</h2>
          <span className="text-xs font-mono text-[#F26444] tabular-nums">
            {pending.length} pendientes
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="py-8 text-center space-y-1.5">
            <Flag className="w-7 h-7 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-[#17213A]">No quedan reportes sin resolver.</p>
            <p className="text-xs text-slate-500">
              Las nuevas empresas creadas desde el onboarding también aparecen acá para control.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pending.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#17213A]">
                    {item.entityTitle}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      · Tipo: {item.entityType}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600">{item.reason}</p>
                  <p className="text-xs text-slate-400">
                    Origen: {item.reportedBy} · {item.createdAt}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:w-[420px]">
                  <input
                    type="text"
                    value={notes[item.id] ?? ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Nota de resolución..."
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      adminResolveModeration(
                        item.id,
                        'approved',
                        notes[item.id]?.trim() || 'Revisado y aprobado por administración.'
                      )
                    }
                    className="h-9 px-3 rounded-lg bg-[#00A995] hover:bg-[#009280] text-white text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      adminResolveModeration(
                        item.id,
                        'removed',
                        notes[item.id]?.trim() || 'Rechazado o cerrado en moderación.'
                      )
                    }
                    className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-[#F26444] text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved history */}
      {resolved.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-[#17213A]">Casos resueltos</h2>
          <div className="divide-y divide-slate-100 text-xs">
            {resolved.map((item) => (
              <div key={item.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-[#17213A]">{item.entityTitle}</span>
                  <span className="text-slate-500"> · {item.resolutionNote ?? item.reason}</span>
                </div>
                <span
                  className={`font-semibold ${
                    item.status === 'approved' ? 'text-[#00A995]' : 'text-[#F26444]'
                  }`}
                >
                  {item.status === 'approved' ? 'Aprobado' : 'Removido / Rechazado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Audit Log */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#17213A]">Bitácora de auditoría administrativa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-2.5 px-4">Fecha y hora</th>
                <th className="py-2.5 px-4">Administrador</th>
                <th className="py-2.5 px-4">Acción</th>
                <th className="py-2.5 px-4">Objetivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {state.auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.createdAt}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#17213A]">{log.actorName}</td>
                  <td className="py-2.5 px-4 text-slate-700">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-600">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
