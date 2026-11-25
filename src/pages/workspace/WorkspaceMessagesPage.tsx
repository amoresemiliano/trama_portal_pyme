import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';

export const WorkspaceMessagesPage: React.FC = () => {
  const { state, activeCompany, sendMessage, markConversationRead } = useTrama();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = useState('');

  const myConversations = useMemo(() => {
    if (!activeCompany) return [];
    return state.conversations
      .filter((cv) => cv.participantCompanyIds.includes(activeCompany.id))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [state.conversations, activeCompany]);

  const requestedConvId = searchParams.get('conv');
  const selectedConvId =
    myConversations.find((c) => c.id === requestedConvId)?.id ?? myConversations[0]?.id ?? null;

  const selectedConv = myConversations.find((c) => c.id === selectedConvId) ?? null;

  useEffect(() => {
    if (selectedConvId) {
      markConversationRead(selectedConvId);
    }
  }, [selectedConvId, markConversationRead]);

  const selectedMessages = useMemo(() => {
    if (!selectedConvId) return [];
    return state.messages
      .filter((m) => m.conversationId === selectedConvId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [state.messages, selectedConvId]);

  if (!activeCompany) return null;

  const getPartner = (participantIds: [string, string]) => {
    const otherId = participantIds.find((id) => id !== activeCompany.id) ?? participantIds[0];
    return state.companies.find((c) => c.id === otherId);
  };

  const selectedPartner = selectedConv ? getPartner(selectedConv.participantCompanyIds) : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !draft.trim()) return;
    sendMessage(selectedConvId, draft);
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#17213A]">Mensajería B2B</h1>
        <p className="text-sm text-slate-600">
          Conversaciones comerciales directas con tus conexiones y contactos de oportunidades.
        </p>
      </div>

      {myConversations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-[#17213A]">Sin conversaciones todavía</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Iniciá un chat desde Match B2B, el Directorio o cualquier Oportunidad comercial.
          </p>
          <Link
            to="/espacio/match"
            className="inline-flex h-10 px-5 rounded-xl bg-[#F26444] text-white text-xs font-bold items-center"
          >
            Ir a Match B2B
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
          {/* Conversation List */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto max-h-[540px]">
            {myConversations.map((conv) => {
              const partner = getPartner(conv.participantCompanyIds);
              const convMsgs = state.messages.filter((m) => m.conversationId === conv.id);
              const lastMsg = convMsgs[convMsgs.length - 1];
              const unread = convMsgs.filter(
                (m) => !m.read && m.senderCompanyId !== activeCompany.id
              ).length;
              const isSelected = conv.id === selectedConvId;

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSearchParams({ conv: conv.id })}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F4F7FB]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                    style={{ backgroundColor: partner?.brandColor ?? '#17213A' }}
                  >
                    {partner?.logoInitials ?? 'EM'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#17213A] truncate">
                        {partner?.name ?? 'Empresa'}
                      </p>
                      {unread > 0 && (
                        <span className="font-mono text-xs font-bold text-[#F26444] tabular-nums">
                          {unread}
                        </span>
                      )}
                    </div>
                    {conv.contextLabel && (
                      <p className="text-[11px] font-medium text-[#008777] truncate">
                        {conv.contextLabel}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.body : 'Conversación lista para iniciar'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Thread */}
          <div className="md:col-span-8 flex flex-col h-[540px]">
            {selectedPartner && selectedConv && (
              <>
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                      style={{ backgroundColor: selectedPartner.brandColor }}
                    >
                      {selectedPartner.logoInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#17213A] truncate">
                        {selectedPartner.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {selectedPartner.industry} · {selectedPartner.location.province}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/empresa/${selectedPartner.slug}`}
                    className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    Ver empresa
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F4F7FB]/50">
                  {selectedMessages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-500">
                      Enviá el primer mensaje para presentarte y proponer una reunión comercial.
                    </div>
                  ) : (
                    selectedMessages.map((msg) => {
                      const isMine = msg.senderCompanyId === activeCompany.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              isMine
                                ? 'bg-[#17213A] text-white rounded-br-sm'
                                : 'bg-white border border-slate-200 text-[#17213A] rounded-bl-sm'
                            }`}
                          >
                            <p className="text-[11px] font-semibold opacity-70 mb-1">
                              {msg.senderUserName}
                            </p>
                            <p>{msg.body}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 px-1 tabular-nums">
                            {msg.createdAt.slice(0, 16).replace('T', ' ')}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-slate-200 bg-white flex items-center gap-2.5"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Escribí un mensaje para ${selectedPartner.name}...`}
                    className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="h-11 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] disabled:opacity-40 text-white text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
