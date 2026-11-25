import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { PLAN_ENTITLEMENTS } from '../../services/entitlements';
import type { PlanTier } from '../../types/domain';

const ORDERED_PLANS: PlanTier[] = ['free', 'pro', 'enterprise', 'institutional'];

export const PricingPage: React.FC = () => {
  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold text-[#F26444]">Modelo Freemium TRAMA</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17213A] tracking-tight">
            Empezá gratis hoy. Escalá a medida que tu empresa crece.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            En esta etapa MVP el registro y publicación para PyMEs es 100% gratuito. La arquitectura
            de membresías ya está preparada para acompañar desde emprendimientos hasta grandes
            compradores y cámaras empresariales.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {ORDERED_PLANS.map((tier) => {
            const plan = PLAN_ENTITLEMENTS[tier];
            const isHighlighted = tier === 'pro';
            return (
              <div
                key={tier}
                className={`rounded-3xl p-6 flex flex-col justify-between gap-6 border ${
                  isHighlighted
                    ? 'bg-[#17213A] text-white border-[#17213A]'
                    : 'bg-white text-[#17213A] border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p
                      className="text-xs font-bold"
                      style={{ color: isHighlighted ? '#F4BB45' : plan.accentColor }}
                    >
                      {plan.name}
                    </p>
                    <p
                      className={`text-xs leading-snug ${
                        isHighlighted ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {plan.targetAudience}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-current/10">
                    <p className="text-2xl font-extrabold tracking-tight">{plan.priceStatusLabel}</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isHighlighted ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {plan.billingNote}
                    </p>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      isHighlighted ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <ul className="space-y-2.5 pt-2 text-xs">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: isHighlighted ? '#00A995' : plan.accentColor }}
                        />
                        <span className={isHighlighted ? 'text-slate-200' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/auth?mode=register"
                  className={`h-11 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors ${
                    isHighlighted
                      ? 'bg-[#F26444] hover:bg-[#D94E2E] text-white'
                      : tier === 'free'
                      ? 'bg-[#00A995] hover:bg-[#008777] text-white'
                      : 'bg-[#F4F7FB] hover:bg-[#17213A] hover:text-white text-[#17213A]'
                  }`}
                >
                  {tier === 'free' ? 'Crear cuenta gratis' : 'Solicitar acceso anticipado'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Concrete Limits Matrix */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 overflow-x-auto">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#17213A]">
              Matriz técnica de capacidades y límites (Entitlements)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sin cobros ni pasarela de pagos activa en el MVP. Los valores reflejan la arquitectura
              de permisos centralizada en la plataforma.
            </p>
          </div>
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 pr-4 font-semibold">Capacidad</th>
                {ORDERED_PLANS.map((t) => (
                  <th key={t} className="py-3 px-4 font-bold text-[#17213A]">
                    {PLAN_ENTITLEMENTS[t].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 pr-4 font-medium">Integrantes por empresa</td>
                {ORDERED_PLANS.map((t) => (
                  <td key={t} className="py-3 px-4 font-mono tabular-nums">
                    Hasta {PLAN_ENTITLEMENTS[t].limits.maxTeamMembers}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Oportunidades activas simultáneas</td>
                {ORDERED_PLANS.map((t) => (
                  <td key={t} className="py-3 px-4 font-mono tabular-nums">
                    {PLAN_ENTITLEMENTS[t].limits.maxActiveOpportunities}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Búsquedas guardadas</td>
                {ORDERED_PLANS.map((t) => (
                  <td key={t} className="py-3 px-4 font-mono tabular-nums">
                    {PLAN_ENTITLEMENTS[t].limits.savedSearchesLimit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Herramientas de compras corporativas</td>
                {ORDERED_PLANS.map((t) => (
                  <td key={t} className="py-3 px-4">
                    {PLAN_ENTITLEMENTS[t].limits.procurementTools ? 'Incluidas' : 'No incluido'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Nivel de analítica</td>
                {ORDERED_PLANS.map((t) => (
                  <td key={t} className="py-3 px-4 capitalize">
                    {PLAN_ENTITLEMENTS[t].limits.analyticsAccess === 'basic'
                      ? 'Básica'
                      : PLAN_ENTITLEMENTS[t].limits.analyticsAccess === 'advanced'
                      ? 'Avanzada'
                      : 'Institucional'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
