import type { Company } from '../types/domain';

export interface CompletenessCheck {
  label: string;
  done: boolean;
  weight: number;
}

export interface ProfileCompletenessResult {
  percentage: number;
  checks: CompletenessCheck[];
}

export function calculateProfileCompleteness(company: Company | null | undefined): ProfileCompletenessResult {
  if (!company) {
    return { percentage: 0, checks: [] };
  }

  const checks: CompletenessCheck[] = [
    { label: 'Nombre, rubro y ubicación', done: Boolean(company.name && company.industry && company.location.province), weight: 15 },
    { label: 'Descripción comercial completa', done: company.description.trim().length >= 50, weight: 15 },
    { label: 'Productos o servicios cargados', done: company.products.length + company.services.length >= 2, weight: 15 },
    { label: 'Oferta clara (lo que ofrecés)', done: company.offerings.length >= 1, weight: 15 },
    { label: 'Necesidades definidas para Match B2B', done: company.needs.length >= 1, weight: 15 },
    { label: 'Capacidades operativas y objetivos', done: company.capabilities.length >= 1 && company.commercialObjectives.length >= 1, weight: 10 },
    { label: 'Imagen de portada e identidad visual', done: Boolean(company.coverImage && company.logoInitials), weight: 10 },
    { label: 'Sitio web o email de contacto', done: Boolean(company.contactEmail || company.website), weight: 5 },
  ];

  const percentage = checks.reduce((acc, item) => acc + (item.done ? item.weight : 0), 0);
  return { percentage, checks };
}
