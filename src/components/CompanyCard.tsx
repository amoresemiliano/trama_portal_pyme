import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2, ArrowUpRight, MessageSquare } from 'lucide-react';
import type { Company } from '../types/domain';
import { ResilientImage } from './ResilientImage';
import { getIndustryAccent } from '../data/mediaAssets';

interface CompanyCardProps {
  company: Company;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onConnect?: (id: string) => void;
  compatibilityScore?: number;
  layout?: 'grid' | 'list';
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  isSaved,
  onToggleSave,
  onConnect,
  compatibilityScore,
  layout = 'grid',
}) => {
  const accent = getIndustryAccent(company.industry);
  const isVerifiedDemo = company.verificationStatus === 'verified_demo';

  if (layout === 'list') {
    return (
      <article className="group flex flex-col sm:flex-row bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-colors hover:border-slate-300">
        <Link
          to={`/empresa/${company.slug}`}
          className="relative sm:w-60 h-44 sm:h-auto shrink-0 overflow-hidden bg-[#F4F7FB]"
        >
          <ResilientImage
            src={company.coverImage}
            alt={`${company.name} — ${company.industry}`}
            accentColor={accent}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="flex-1 p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0"
                  style={{ backgroundColor: company.brandColor, fontFamily: 'var(--font-display)' }}
                >
                  {company.logoInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold" style={{ color: accent }}>
                      {company.industry}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">
                      {company.location.city}, {company.location.province}
                    </span>
                    {isVerifiedDemo && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-[#008777] font-medium whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Demo verificado
                        </span>
                      </>
                    )}
                  </div>
                  <Link
                    to={`/empresa/${company.slug}`}
                    className="block text-lg font-bold text-[#17213A] hover:text-[#2563EB] transition-colors truncate mt-0.5"
                  >
                    {company.name}
                  </Link>
                </div>
              </div>

              {typeof compatibilityScore === 'number' && (
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#008777] tabular-nums">
                    {compatibilityScore}% afinidad
                  </span>
                </div>
              )}
            </div>

            <p className="mt-2.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {company.shortDescription}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span className="font-medium text-[#17213A]">Ofrece:</span>
              <span>{company.offerings.slice(0, 2).join(' · ')}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>{company.operationType}</span>
              <span aria-hidden="true">·</span>
              <span>{company.commercialModel}</span>
              <span aria-hidden="true">·</span>
              <span>{company.exportReadiness}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 truncate">
              {company.tags.slice(0, 4).join(' / ')}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onToggleSave(company.id)}
                aria-label={isSaved ? 'Quitar de guardados' : 'Guardar empresa'}
                className={`h-9 px-3 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSaved
                    ? 'border-[#F26444]/40 bg-[#F26444]/8 text-[#D94E2E]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Guardada' : 'Guardar'}
              </button>
              {onConnect && (
                <button
                  type="button"
                  onClick={() => onConnect(company.id)}
                  className="h-9 px-3.5 rounded-lg border border-slate-200 text-xs font-medium text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                  Conectar
                </button>
              )}
              <Link
                to={`/empresa/${company.slug}`}
                className="h-9 px-3.5 rounded-lg bg-[#17213A] text-white text-xs font-semibold hover:bg-[#2563EB] inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
              >
                Ver perfil
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-300 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F7FB]">
        <Link to={`/empresa/${company.slug}`} className="block w-full h-full">
          <ResilientImage
            src={company.coverImage}
            alt={`${company.name} en ${company.location.province}`}
            accentColor={accent}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#17213A]/75 via-[#17213A]/25 to-transparent" />
        </Link>

        <button
          type="button"
          onClick={() => onToggleSave(company.id)}
          aria-label={isSaved ? 'Quitar de guardados' : 'Guardar empresa'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[#F26444] text-white'
              : 'bg-white/95 text-[#17213A] hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 pointer-events-none">
          <div
            className="w-10 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shadow-sm ring-2 ring-white/90"
            style={{ backgroundColor: company.brandColor, fontFamily: 'var(--font-display)' }}
          >
            {company.logoInitials}
          </div>
          {typeof compatibilityScore === 'number' && (
            <span className="px-2.5 py-1 rounded-md bg-white/95 text-[#008777] text-xs font-bold tabular-nums">
              {compatibilityScore}% afinidad
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold truncate" style={{ color: accent }}>
              {company.industry}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{company.location.province}</span>
          </div>

          <Link
            to={`/empresa/${company.slug}`}
            className="mt-1.5 flex items-center gap-1.5 text-[17px] font-bold text-[#17213A] hover:text-[#2563EB] transition-colors leading-snug"
          >
            <span className="truncate">{company.name}</span>
            {isVerifiedDemo && (
              <CheckCircle2
                className="w-4 h-4 text-[#00A995] shrink-0"
                aria-label="Perfil demo verificado"
              />
            )}
          </Link>

          <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {company.shortDescription}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p className="truncate">
              <span className="font-medium text-[#17213A]">Capacidades: </span>
              {company.capabilities.slice(0, 2).join(' · ')}
            </p>
            <p className="truncate text-slate-400">
              {company.operationType} · {company.commercialModel} · {company.exportReadiness}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/empresa/${company.slug}`}
            className="flex-1 h-10 px-3 rounded-xl bg-[#F4F7FB] text-[#17213A] hover:bg-[#17213A] hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            Ver perfil
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          {onConnect && (
            <button
              type="button"
              onClick={() => onConnect(company.id)}
              className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#17213A] hover:border-[#2563EB] hover:text-[#2563EB] inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Conectar
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
