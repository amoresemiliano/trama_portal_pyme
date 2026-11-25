import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'motion/react';
import {
  X,
  Heart,
  Bookmark,
  ArrowUpRight,
  CheckCircle2,
  MessageSquare,
  RotateCcw,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { useTrama } from '../context/TramaContext';
import { getRankedMatchesForCompany, type MatchEvaluation } from '../services/matchingEngine';
import { ResilientImage } from './ResilientImage';
import { getIndustryAccent } from '../data/mediaAssets';
import type { Company } from '../types/domain';

interface MatchDeckExperienceProps {
  compact?: boolean;
}

export const MatchDeckExperience: React.FC<MatchDeckExperienceProps> = ({ compact = false }) => {
  const {
    state,
    activeCompany,
    currentUser,
    switchActiveCompany,
    recordMatchDecision,
    resetMatchPasses,
    loginAsDemoBusiness,
  } = useTrama();
  const navigate = useNavigate();

  const [sectorFilter, setSectorFilter] = useState<string>('Todos');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [mutualMatchModal, setMutualMatchModal] = useState<{
    targetCompany: Company;
    conversationId: string;
    score: number;
    reasons: string[];
  } | null>(null);

  const sourceCompany = activeCompany ?? state.companies[0];

  // Companies already decided (interested or passed) or already connected
  const excludedIds = useMemo(() => {
    const ids = new Set<string>();
    if (!sourceCompany) return ids;
    ids.add(sourceCompany.id);
    for (const d of state.matchDecisions) {
      if (d.fromCompanyId === sourceCompany.id && (d.action === 'interested' || d.action === 'passed')) {
        ids.add(d.toCompanyId);
      }
    }
    for (const c of state.connections) {
      if (c.companyAId === sourceCompany.id) ids.add(c.companyBId);
      if (c.companyBId === sourceCompany.id) ids.add(c.companyAId);
    }
    return ids;
  }, [sourceCompany, state.matchDecisions, state.connections]);

  const rankedCandidates = useMemo(() => {
    if (!sourceCompany) return [];
    const ranked = getRankedMatchesForCompany(sourceCompany, state.companies, excludedIds);
    if (sectorFilter === 'Todos') return ranked;
    return ranked.filter((m) => m.company.industry === sectorFilter);
  }, [sourceCompany, state.companies, excludedIds, sectorFilter]);

  const currentMatch: MatchEvaluation | undefined = rankedCandidates[0];
  const nextMatch: MatchEvaluation | undefined = rankedCandidates[1];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [30, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -30], [1, 0]);

  const handleAction = (action: 'interested' | 'passed' | 'saved') => {
    if (!currentMatch) return;
    if (action === 'saved') {
      recordMatchDecision(currentMatch.company.id, 'saved');
      return;
    }

    setExitDirection(action === 'interested' ? 'right' : 'left');
    const result = recordMatchDecision(currentMatch.company.id, action);

    window.setTimeout(() => {
      setExitDirection(null);
      setShowBreakdown(false);
      x.set(0);
      if (result.isMutualMatch && result.targetCompany && result.conversationId) {
        setMutualMatchModal({
          targetCompany: result.targetCompany,
          conversationId: result.conversationId,
          score: currentMatch.score,
          reasons: currentMatch.reasons,
        });
      }
    }, 180);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 110) {
      handleAction('interested');
    } else if (info.offset.x < -110) {
      handleAction('passed');
    }
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (mutualMatchModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleAction('interested');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleAction('passed');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!sourceCompany) return null;

  const isSavedCurrent = currentMatch
    ? state.savedCompanyIds.includes(currentMatch.company.id)
    : false;

  return (
    <div className="space-y-6">
      {/* Context Bar: Which company are we matching from + Industry filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0"
            style={{ backgroundColor: sourceCompany.brandColor }}
          >
            {sourceCompany.logoInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Buscando aliados complementarios para
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#17213A] text-sm truncate">
                {sourceCompany.name}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 truncate">
                Necesita: {sourceCompany.needs[0]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!currentUser && (
            <select
              aria-label="Probar Match desde empresa demo"
              value={sourceCompany.id}
              onChange={(e) => switchActiveCompany(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-[#F4F7FB] text-xs font-medium text-[#17213A]"
            >
              {state.companies.slice(0, 12).map((c) => (
                <option key={c.id} value={c.id}>
                  Probar como: {c.name}
                </option>
              ))}
            </select>
          )}

          <div className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-white">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Filtrar candidatas por rubro"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="text-xs font-medium text-[#17213A] bg-transparent focus:outline-none"
            >
              <option value="Todos">Todos los rubros ({rankedCandidates.length})</option>
              {state.taxonomy.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split: Interactive Swipe Deck + Compatibility Intelligence Panel */}
      <div className={`grid grid-cols-1 ${compact ? 'xl:grid-cols-12' : 'lg:grid-cols-12'} gap-8 items-start`}>
        {/* Card Stack Column */}
        <div className={compact ? 'xl:col-span-7' : 'lg:col-span-7'}>
          {!currentMatch ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7FB] text-[#2563EB] flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#17213A]">
                Ya recorriste todas las empresas de este filtro
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Podés volver a explorar las empresas que pasaste, cambiar el rubro o visitar el
                directorio completo.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSectorFilter('Todos');
                    resetMatchPasses();
                  }}
                  className="h-11 px-5 rounded-xl bg-[#17213A] text-white text-sm font-semibold hover:bg-[#2563EB] transition-colors cursor-pointer"
                >
                  Restaurar candidatas
                </button>
                <Link
                  to="/directorio"
                  className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-[#17213A] inline-flex items-center hover:bg-[#F4F7FB]"
                >
                  Explorar directorio
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Swipeable Deck Area */}
              <div className="relative min-h-[540px] sm:min-h-[560px]">
                {/* Underlay Next Card preview */}
                {nextMatch && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-3 top-3 bottom-0 bg-white border border-slate-200 rounded-3xl opacity-60 scale-[0.97] pointer-events-none overflow-hidden"
                  >
                    <div className="h-56 bg-[#F4F7FB]">
                      <ResilientImage
                        src={nextMatch.company.coverImage}
                        alt={nextMatch.company.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Active Draggable Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMatch.company.id}
                    style={{ x, rotate }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.85}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      x: exitDirection === 'right' ? 320 : exitDirection === 'left' ? -320 : 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* Visual Swipe Stamps */}
                    <motion.div
                      style={{ opacity: likeOpacity }}
                      className="pointer-events-none absolute top-6 left-6 z-20 px-4 py-1.5 rounded-xl bg-[#00A995] text-white font-extrabold text-sm tracking-wide uppercase -rotate-6"
                    >
                      Me interesa
                    </motion.div>
                    <motion.div
                      style={{ opacity: passOpacity }}
                      className="pointer-events-none absolute top-6 right-6 z-20 px-4 py-1.5 rounded-xl bg-[#17213A] text-white font-extrabold text-sm tracking-wide uppercase rotate-6"
                    >
                      Pasar
                    </motion.div>

                    {/* Cover Image + Compatibility Banner */}
                    <div className="relative h-60 sm:h-64 bg-[#F4F7FB]">
                      <ResilientImage
                        src={currentMatch.company.coverImage}
                        alt={currentMatch.company.name}
                        accentColor={getIndustryAccent(currentMatch.company.industry)}
                        className="w-full h-full object-cover pointer-events-none"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17213A]/85 via-[#17213A]/20 to-transparent" />

                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2 text-right shadow-sm">
                        <p className="text-[11px] font-medium text-slate-500 leading-none">
                          Compatibilidad
                        </p>
                        <p className="text-xl font-extrabold text-[#008777] font-mono tabular-nums leading-tight mt-0.5">
                          {currentMatch.score}%
                        </p>
                      </div>

                      <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3.5 text-white">
                        <div
                          className="w-12 h-12 rounded-2xl text-white font-extrabold text-base flex items-center justify-center ring-2 ring-white/90 shrink-0"
                          style={{ backgroundColor: currentMatch.company.brandColor }}
                        >
                          {currentMatch.company.logoInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs text-white/85">
                            <span>{currentMatch.company.industry}</span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {currentMatch.company.location.city},{' '}
                              {currentMatch.company.location.province}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight truncate flex items-center gap-1.5">
                            <span>{currentMatch.company.name}</span>
                            {currentMatch.company.verificationStatus === 'verified_demo' && (
                              <CheckCircle2 className="w-5 h-5 text-[#00A995] shrink-0" />
                            )}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {currentMatch.company.shortDescription}
                      </p>

                      {/* Explainable Compatibility Highlight */}
                      <div className="p-4 rounded-2xl bg-[#F4F7FB] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[#17213A]">
                            ¿Por qué hacen buen match?
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowBreakdown((v) => !v)}
                            className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            {showBreakdown ? 'Ocultar cálculo' : 'Ver detalle'}
                          </button>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {currentMatch.reasons.map((reason, idx) => (
                            <li key={idx} className="leading-relaxed">
                              · {reason}
                            </li>
                          ))}
                        </ul>

                        {showBreakdown && (
                          <div className="pt-3 mt-2 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                            <div>
                              <span className="block text-slate-400">Necesidades/Oferta (35%)</span>
                              <strong className="font-mono text-[#17213A] tabular-nums">
                                {currentMatch.breakdown.complementaryNeedsScore}/35
                              </strong>
                            </div>
                            <div>
                              <span className="block text-slate-400">Cadena de valor (20%)</span>
                              <strong className="font-mono text-[#17213A] tabular-nums">
                                {currentMatch.breakdown.valueChainScore}/20
                              </strong>
                            </div>
                            <div>
                              <span className="block text-slate-400">Objetivos (15%)</span>
                              <strong className="font-mono text-[#17213A] tabular-nums">
                                {currentMatch.breakdown.commercialObjectivesScore}/15
                              </strong>
                            </div>
                            <div>
                              <span className="block text-slate-400">Geografía (10%)</span>
                              <strong className="font-mono text-[#17213A] tabular-nums">
                                {currentMatch.breakdown.geographicScore}/10
                              </strong>
                            </div>
                            <div>
                              <span className="block text-slate-400">Operación (10%)</span>
                              <strong className="font-mono text-[#17213A] tabular-nums">
                                {currentMatch.breakdown.operationalCapabilitiesScore}/10
                              </strong>
                            </div>
                            <div>
                              <span className="block text-slate-400">Intereses/Cert. (10%)</span>
                              <strong className="font-mono text-[#17213A] tabular-nums">
                                {currentMatch.breakdown.sharedInterestsScore}/10
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Offerings & Needs two-column summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
                        <div>
                          <p className="font-bold text-[#17213A] mb-1">Qué ofrece</p>
                          <p className="text-slate-600 leading-relaxed">
                            {currentMatch.company.offerings.slice(0, 2).join(' · ')}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-[#17213A] mb-1">Qué está buscando</p>
                          <p className="text-slate-600 leading-relaxed">
                            {currentMatch.company.needs.slice(0, 2).join(' · ')}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 pt-1">
                        {currentMatch.company.operationType} · {currentMatch.company.commercialModel} ·{' '}
                        {currentMatch.company.exportReadiness} · Cobertura: {currentMatch.company.coverage}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Accessible Action Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleAction('passed')}
                  className="h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Pasar
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('saved')}
                  className={`h-12 px-4 rounded-2xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isSavedCurrent
                      ? 'bg-[#F4BB45]/15 border-[#F4BB45] text-[#17213A]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSavedCurrent ? 'fill-current text-[#D97706]' : ''}`} />
                  Guardar
                </button>
                <Link
                  to={`/empresa/${currentMatch.company.slug}`}
                  className="h-12 px-4 rounded-2xl bg-white border border-slate-200 text-[#17213A] hover:border-[#2563EB] hover:text-[#2563EB] text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  Ver empresa
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleAction('interested')}
                  className="h-12 px-4 rounded-2xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  Me interesa
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                Deslizá la tarjeta hacia la derecha o izquierda, o usá las flechas del teclado ← / →
              </p>
            </div>
          )}
        </div>

        {/* Side Column: Next Best Complementary Matches + How It Works */}
        <div className={`${compact ? 'xl:col-span-5' : 'lg:col-span-5'} space-y-5`}>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#17213A]">Siguientes sugerencias</h3>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {rankedCandidates.length} disponibles
              </span>
            </div>

            {rankedCandidates.slice(1, 5).length === 0 ? (
              <p className="text-xs text-slate-500">
                No hay más sugerencias en cola para este rubro.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {rankedCandidates.slice(1, 5).map((item) => (
                  <div key={item.company.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                        style={{ backgroundColor: item.company.brandColor }}
                      >
                        {item.company.logoInitials}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/empresa/${item.company.slug}`}
                          className="text-sm font-bold text-[#17213A] hover:text-[#2563EB] block truncate"
                        >
                          {item.company.name}
                        </Link>
                        <p className="text-xs text-slate-500 truncate">{item.headlineReason}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#008777] tabular-nums shrink-0">
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-[#17213A]">Cómo prioriza TRAMA Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nuestro motor determinístico no agrupa empresas solo por rubro idéntico: cruza lo que
              tu negocio necesita con las capacidades operativas y la cadena de valor de otras PyMEs.
            </p>
            <div className="space-y-2 pt-1 text-xs">
              {[
                { label: 'Necesidades y oferta complementaria', pct: '35%', color: '#F26444' },
                { label: 'Sinergia en cadena de valor', pct: '20%', color: '#2563EB' },
                { label: 'Objetivos comerciales compatibles', pct: '15%', color: '#00A995' },
                { label: 'Compatibilidad geográfica / cobertura', pct: '10%', color: '#F4BB45' },
                { label: 'Capacidades operativas B2B', pct: '10%', color: '#17213A' },
                { label: 'Intereses, sustentabilidad y certificaciones', pct: '10%', color: '#64748B' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-mono font-semibold text-[#17213A] tabular-nums">
                    {row.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mutual Match Celebration Modal */}
      {mutualMatchModal && (
        <div
          className="fixed inset-0 z-50 bg-[#17213A]/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-modal-title"
        >
          <div className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-[#17213A] text-white p-7 text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center ring-4 ring-white/15"
                  style={{ backgroundColor: sourceCompany.brandColor }}
                >
                  {sourceCompany.logoInitials}
                </div>
                <span className="w-9 h-9 rounded-full bg-[#00A995] text-white flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-current" />
                </span>
                <div
                  className="w-14 h-14 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center ring-4 ring-white/15"
                  style={{ backgroundColor: mutualMatchModal.targetCompany.brandColor }}
                >
                  {mutualMatchModal.targetCompany.logoInitials}
                </div>
              </div>

              <h2 id="match-modal-title" className="text-3xl font-extrabold tracking-tight">
                ¡Hay conexión!
              </h2>
              <p className="text-sm text-slate-300">Dos empresas. Una nueva oportunidad.</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-[#17213A]">
                  {sourceCompany.name} + {mutualMatchModal.targetCompany.name}
                </p>
                <p className="text-xs font-mono font-bold text-[#008777] tabular-nums">
                  {mutualMatchModal.score}% de compatibilidad B2B
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F7FB] text-xs text-slate-600 space-y-1">
                {mutualMatchModal.reasons.slice(0, 2).map((r, i) => (
                  <p key={i}>· {r}</p>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const convId = mutualMatchModal.conversationId;
                    setMutualMatchModal(null);
                    if (!currentUser) {
                      loginAsDemoBusiness();
                    }
                    navigate(`/espacio/mensajes?conv=${convId}`);
                  }}
                  className="w-full h-11 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Iniciar conversación ahora
                </button>
                <button
                  type="button"
                  onClick={() => setMutualMatchModal(null)}
                  className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold cursor-pointer"
                >
                  Seguir descubriendo empresas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
