import type { PlanTier } from '../types/domain';

export interface PlanEntitlement {
  tier: PlanTier;
  name: string;
  targetAudience: string;
  priceStatusLabel: string;
  billingNote: string;
  description: string;
  accentColor: string;
  limits: {
    maxTeamMembers: number;
    maxActiveOpportunities: number;
    dailyMatchSwipes: number;
    advancedFilters: boolean;
    procurementTools: boolean;
    analyticsAccess: 'basic' | 'advanced' | 'institutional';
    savedSearchesLimit: number;
    featuredDirectoryBoost: boolean;
  };
  features: string[];
}

export const PLAN_ENTITLEMENTS: Record<PlanTier, PlanEntitlement> = {
  free: {
    tier: 'free',
    name: 'Free',
    targetAudience: 'Para PyMEs y emprendedores que dan sus primeros pasos',
    priceStatusLabel: 'Gratis en MVP',
    billingNote: 'Registro gratuito sin tarjeta de crédito',
    description:
      'Presencia completa en el ecosistema TRAMA para visibilizar tu negocio y empezar a generar conexiones reales.',
    accentColor: '#00A995',
    limits: {
      maxTeamMembers: 2,
      maxActiveOpportunities: 3,
      dailyMatchSwipes: 20,
      advancedFilters: true,
      procurementTools: false,
      analyticsAccess: 'basic',
      savedSearchesLimit: 3,
      featuredDirectoryBoost: false,
    },
    features: [
      'Perfil empresarial público y vidriera digital',
      'Presencia en el directorio inteligente de Argentina',
      'Búsqueda básica y por rubro o provincia',
      'Hasta 3 oportunidades comerciales activas',
      'Match B2B con compatibilidad explicable',
      'Acceso a agenda de eventos, cursos y recursos',
    ],
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    targetAudience: 'Para PyMEs en crecimiento comercial activo',
    priceStatusLabel: 'Próximamente',
    billingNote: 'Precios a definir al lanzamiento comercial',
    description:
      'Mayor visibilidad, más oportunidades simultáneas y herramientas de prospección para acelerar ventas y compras.',
    accentColor: '#F26444',
    limits: {
      maxTeamMembers: 5,
      maxActiveOpportunities: 15,
      dailyMatchSwipes: 100,
      advancedFilters: true,
      procurementTools: false,
      analyticsAccess: 'advanced',
      savedSearchesLimit: 15,
      featuredDirectoryBoost: true,
    },
    features: [
      'Perfil avanzado con catálogo extendido y portafolio',
      'Match B2B potenciado con prioridad de descubrimiento',
      'Hasta 15 oportunidades comerciales activas',
      'Analítica de visitas, intereses y conversiones',
      'Búsquedas guardadas ilimitadas con alertas',
      'Hasta 5 integrantes del equipo comercial',
    ],
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    targetAudience: 'Para grandes empresas y áreas de compras corporativas',
    priceStatusLabel: 'A medida',
    billingNote: 'Implementación y onboarding personalizado',
    description:
      'Solución integral para desarrollo de proveedores locales, licitaciones abiertas y gestión de compras B2B.',
    accentColor: '#2563EB',
    limits: {
      maxTeamMembers: 25,
      maxActiveOpportunities: 100,
      dailyMatchSwipes: 999,
      advancedFilters: true,
      procurementTools: true,
      analyticsAccess: 'advanced',
      savedSearchesLimit: 50,
      featuredDirectoryBoost: true,
    },
    features: [
      'Múltiples usuarios y roles de compras por unidad',
      'Herramientas de compras corporativas y desarrollo de proveedores',
      'Gestión de cartera y homologación de proveedores',
      'Analítica avanzada por cadena de valor y región',
      'Publicación destacada de búsquedas corporativas',
      'Integración futura vía API con ERP corporativo',
    ],
  },
  institutional: {
    tier: 'institutional',
    name: 'Institutional',
    targetAudience: 'Para cámaras empresariales, municipios, polos y universidades',
    priceStatusLabel: 'Convenio institucional',
    billingNote: 'Modelo colaborativo para ecosistemas regionales',
    description:
      'Infraestructura digital para mapear, conectar y potenciar redes de socios y entramados productivos locales.',
    accentColor: '#17213A',
    limits: {
      maxTeamMembers: 50,
      maxActiveOpportunities: 200,
      dailyMatchSwipes: 999,
      advancedFilters: true,
      procurementTools: true,
      analyticsAccess: 'institutional',
      savedSearchesLimit: 100,
      featuredDirectoryBoost: true,
    },
    features: [
      'Directorio segmentado de empresas asociadas',
      'Ecosistemas regionales y rondas de negocios digitales',
      'Tableros institucionales con métricas productivas',
      'Difusión de eventos, capacitaciones y asistencia técnica',
      'Espacios de comunidad sectorial moderados',
      'Acompañamiento de implementación junto a Vegen Digital',
    ],
  },
};

export function getPlanEntitlement(tier: PlanTier): PlanEntitlement {
  return PLAN_ENTITLEMENTS[tier] ?? PLAN_ENTITLEMENTS.free;
}

export function canPublishMoreOpportunities(tier: PlanTier, currentActiveCount: number): boolean {
  const entitlement = getPlanEntitlement(tier);
  return currentActiveCount < entitlement.limits.maxActiveOpportunities;
}
