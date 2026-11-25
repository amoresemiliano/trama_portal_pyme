import React from 'react';
import { CheckCircle2, Users, MessageCircle } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';

export const CommunitiesPage: React.FC = () => {
  const { state, toggleJoinCommunity } = useTrama();

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-2 max-w-none">
          <p className="text-xs font-bold text-[#F26444]">Comunidades Sectoriales y Regionales</p>
          <h1 className="text-3xl font-extrabold text-[#17213A] tracking-tight">
            Espacios de intercambio real entre PyMEs y emprendedores
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Sumate a grupos por industria o región para compartir cargas logísticas, recomendar
            proveedores confiables y resolver desafíos cotidianos junto a pares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.communities.map((com) => {
            const joined = state.joinedCommunityIds.includes(com.id);
            const displayMembers = com.memberCountDemo + (joined ? 1 : 0);

            return (
              <article
                key={com.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold" style={{ color: com.accentColor }}>
                      {com.sector} · {com.region}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 font-mono tabular-nums">
                      <Users className="w-3.5 h-3.5" />
                      {displayMembers} (demo)
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#17213A]">{com.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{com.description}</p>

                  <p className="text-xs text-slate-500">
                    <strong className="text-[#17213A]">Temas frecuentes:</strong>{' '}
                    {com.topics.join(' · ')}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#F4F7FB] text-xs space-y-1">
                    <p className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Conversación destacada (demo)
                    </p>
                    <p className="font-semibold text-[#17213A]">“{com.recentTopicTitle}”</p>
                    <p className="text-slate-500">Iniciada por {com.recentTopicAuthor}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleJoinCommunity(com.id)}
                  className={`w-full h-11 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    joined
                      ? 'bg-[#00A995] text-white'
                      : 'bg-[#17213A] hover:bg-[#2563EB] text-white'
                  }`}
                >
                  {joined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Ya sos miembro de esta comunidad
                    </>
                  ) : (
                    'Unirme a la comunidad'
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
