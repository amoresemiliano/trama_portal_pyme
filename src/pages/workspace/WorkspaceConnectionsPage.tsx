import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowUpRight, HeartHandshake } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';

export const WorkspaceConnectionsPage: React.FC = () => {
  const { state, activeCompany, startConversationWithCompany } = useTrama();
  const navigate = useNavigate();

  const connections = useMemo(() => {
    if (!activeCompany) return [];
    return state.connections
      .filter((c) => c.companyAId === activeCompany.id || c.companyBId === activeCompany.id)
      .map((conn) => {
        const partnerId =
          conn.companyAId === activeCompany.id ? conn.companyBId : conn.companyAId;
        const partner = state.companies.find((c) => c.id === partnerId);
        return { conn, partner };
      })
      .filter((item): item is { conn: typeof item.conn; partner: NonNullable<typeof item.partner> } =>
        Boolean(item.partner)
      );
  }, [state.connections, state.companies, activeCompany]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17213A]">Conexiones empresariales</h1>
          <p className="text-sm text-slate-600">
            Empresas con las que ya tenés interés mutuo confirmado en TRAMA.
          </p>
        </div>
        <Link
          to="/espacio/match"
          className="h-10 px-4 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-xs font-bold inline-flex items-center gap-1.5 self-start"
        >
          <HeartHandshake className="w-4 h-4" />
          Descubrir más matches
        </Link>
      </div>

      {connections.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <h2 className="text-lg font-bold text-[#17213A]">Todavía no tenés conexiones mutuas</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Ingresá a Match B2B y marcá “Me interesa” en empresas complementarias para generar tu
            primera conexión comercial.
          </p>
          <Link
            to="/espacio/match"
            className="inline-flex h-10 px-5 rounded-xl bg-[#17213A] text-white text-xs font-semibold items-center"
          >
            Ir a Match B2B
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {connections.map(({ conn, partner }) => (
            <article
              key={conn.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: partner.brandColor }}
                    >
                      {partner.logoInitials}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/empresa/${partner.slug}`}
                        className="text-base font-bold text-[#17213A] hover:text-[#2563EB] truncate block"
                      >
                        {partner.name}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">
                        {partner.industry} · {partner.location.city}, {partner.location.province}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-[#008777] tabular-nums shrink-0">
                    {conn.compatibilityScore}%
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{partner.shortDescription}</p>

                <div className="p-3 rounded-xl bg-[#F4F7FB] text-xs text-slate-600 space-y-1">
                  {conn.reasons.slice(0, 2).map((r, i) => (
                    <p key={i}>· {r}</p>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const convId = startConversationWithCompany(partner.id, 'Conexión B2B');
                    navigate(`/espacio/mensajes?conv=${convId}`);
                  }}
                  className="flex-1 h-10 px-4 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Enviar mensaje
                </button>
                <Link
                  to={`/empresa/${partner.slug}`}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center gap-1"
                >
                  Perfil
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
