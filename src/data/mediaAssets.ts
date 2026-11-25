export const MEDIA = {
  HERO_PYMES: '/src/assets/images/hero_argentina_pymes_1795270213274.jpg',
  MANUFACTURA: '/src/assets/images/ind_manufactura_metal_1795270212963.jpg',
  ALIMENTOS: '/src/assets/images/ind_alimentos_agro_1795270214147.jpg',
  GASTRONOMIA: '/src/assets/images/ind_gastronomia_cafe_1795270213330.jpg',
  TECNOLOGIA: '/src/assets/images/ind_tecnologia_software_1795270212895.jpg',
  LOGISTICA: '/src/assets/images/ind_logistica_transporte_1795270212968.jpg',
  TEXTIL: '/src/assets/images/ind_textil_diseno_1795270212300.jpg',
  AGRO: '/src/assets/images/ind_agro_campo_1795270212663.jpg',
  PACKAGING: '/src/assets/images/ind_packaging_sustentable_1795270212653.jpg',
  CONSTRUCCION: '/src/assets/images/ind_construccion_arq_1795270213141.jpg',
  EVENTO: '/src/assets/images/event_ronda_negocios_1795270213212.jpg',
  CAPACITACION: '/src/assets/images/training_capacitacion_1795270212414.jpg',
} as const;

export const INDUSTRY_META: Record<
  string,
  { color: string; bgTint: string; image: string; shortLabel: string }
> = {
  'Alimentos y Bebidas': {
    color: '#F26444',
    bgTint: '#FFF1ED',
    image: MEDIA.ALIMENTOS,
    shortLabel: 'Alimentos',
  },
  'Manufactura e Industria': {
    color: '#2563EB',
    bgTint: '#EFF6FF',
    image: MEDIA.MANUFACTURA,
    shortLabel: 'Manufactura',
  },
  'Tecnología y Software': {
    color: '#2563EB',
    bgTint: '#EFF6FF',
    image: MEDIA.TECNOLOGIA,
    shortLabel: 'Tecnología',
  },
  'Packaging y Papel': {
    color: '#00A995',
    bgTint: '#ECFDF9',
    image: MEDIA.PACKAGING,
    shortLabel: 'Packaging',
  },
  'Logística y Transporte': {
    color: '#17213A',
    bgTint: '#F1F5F9',
    image: MEDIA.LOGISTICA,
    shortLabel: 'Logística',
  },
  'Agroindustria y Campo': {
    color: '#00A995',
    bgTint: '#ECFDF9',
    image: MEDIA.AGRO,
    shortLabel: 'Agroindustria',
  },
  'Gastronomía y Hospitalidad': {
    color: '#F26444',
    bgTint: '#FFF1ED',
    image: MEDIA.GASTRONOMIA,
    shortLabel: 'Gastronomía',
  },
  'Textil e Indumentaria': {
    color: '#D97706',
    bgTint: '#FFFBEB',
    image: MEDIA.TEXTIL,
    shortLabel: 'Textil',
  },
  'Construcción y Arquitectura': {
    color: '#2563EB',
    bgTint: '#EFF6FF',
    image: MEDIA.CONSTRUCCION,
    shortLabel: 'Construcción',
  },
  'Servicios Creativos y Marketing': {
    color: '#F26444',
    bgTint: '#FFF1ED',
    image: MEDIA.HERO_PYMES,
    shortLabel: 'Servicios Creativos',
  },
  'Comercio y Retail': {
    color: '#D97706',
    bgTint: '#FFFBEB',
    image: MEDIA.GASTRONOMIA,
    shortLabel: 'Comercio',
  },
  'Energía y Sustentabilidad': {
    color: '#00A995',
    bgTint: '#ECFDF9',
    image: MEDIA.AGRO,
    shortLabel: 'Sustentabilidad',
  },
};

export function getIndustryAccent(industry: string): string {
  return INDUSTRY_META[industry]?.color ?? '#2563EB';
}

export function getIndustryImage(industry: string): string {
  return INDUSTRY_META[industry]?.image ?? MEDIA.HERO_PYMES;
}
