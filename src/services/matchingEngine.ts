import type { Company } from '../types/domain';

export interface MatchBreakdown {
  complementaryNeedsScore: number; // max 35
  valueChainScore: number; // max 20
  commercialObjectivesScore: number; // max 15
  geographicScore: number; // max 10
  operationalCapabilitiesScore: number; // max 10
  sharedInterestsScore: number; // max 10
}

export interface MatchEvaluation {
  company: Company;
  score: number; // 0-100
  breakdown: MatchBreakdown;
  headlineReason: string;
  reasons: string[];
  matchedNeedsToOfferings: string[];
  matchedOfferingsToNeeds: string[];
}

/**
 * Value-chain complementarity map: maps an industry to its natural B2B partner industries.
 * Prioritizes cross-industry buyer-supplier and strategic alliance synergies.
 */
const VALUE_CHAIN_SYNERGIES: Record<string, string[]> = {
  'Alimentos y Bebidas': [
    'Packaging y Papel',
    'Logística y Transporte',
    'Gastronomía y Hospitalidad',
    'Agroindustria y Campo',
    'Comercio y Retail',
    'Servicios Creativos y Marketing',
  ],
  'Packaging y Papel': [
    'Alimentos y Bebidas',
    'Gastronomía y Hospitalidad',
    'Comercio y Retail',
    'Textil e Indumentaria',
    'Manufactura e Industria',
    'Logística y Transporte',
  ],
  'Logística y Transporte': [
    'Manufactura e Industria',
    'Alimentos y Bebidas',
    'Agroindustria y Campo',
    'Comercio y Retail',
    'Construcción y Arquitectura',
    'Packaging y Papel',
  ],
  'Manufactura e Industria': [
    'Logística y Transporte',
    'Tecnología y Software',
    'Energía y Sustentabilidad',
    'Construcción y Arquitectura',
    'Agroindustria y Campo',
    'Packaging y Papel',
  ],
  'Gastronomía y Hospitalidad': [
    'Alimentos y Bebidas',
    'Packaging y Papel',
    'Tecnología y Software',
    'Servicios Creativos y Marketing',
    'Textil e Indumentaria',
    'Logística y Transporte',
  ],
  'Tecnología y Software': [
    'Manufactura e Industria',
    'Gastronomía y Hospitalidad',
    'Comercio y Retail',
    'Logística y Transporte',
    'Agroindustria y Campo',
    'Alimentos y Bebidas',
    'Servicios Creativos y Marketing',
  ],
  'Agroindustria y Campo': [
    'Logística y Transporte',
    'Alimentos y Bebidas',
    'Manufactura e Industria',
    'Tecnología y Software',
    'Energía y Sustentabilidad',
    'Packaging y Papel',
  ],
  'Textil e Indumentaria': [
    'Comercio y Retail',
    'Servicios Creativos y Marketing',
    'Packaging y Papel',
    'Logística y Transporte',
    'Gastronomía y Hospitalidad',
  ],
  'Construcción y Arquitectura': [
    'Manufactura e Industria',
    'Logística y Transporte',
    'Energía y Sustentabilidad',
    'Tecnología y Software',
    'Servicios Creativos y Marketing',
  ],
  'Servicios Creativos y Marketing': [
    'Alimentos y Bebidas',
    'Gastronomía y Hospitalidad',
    'Textil e Indumentaria',
    'Comercio y Retail',
    'Tecnología y Software',
    'Packaging y Papel',
  ],
  'Comercio y Retail': [
    'Alimentos y Bebidas',
    'Textil e Indumentaria',
    'Packaging y Papel',
    'Logística y Transporte',
    'Tecnología y Software',
    'Servicios Creativos y Marketing',
  ],
  'Energía y Sustentabilidad': [
    'Manufactura e Industria',
    'Agroindustria y Campo',
    'Construcción y Arquitectura',
    'Logística y Transporte',
    'Alimentos y Bebidas',
  ],
};

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function tokenWords(list: string[]): string[] {
  const stopWords = new Set(['de', 'del', 'la', 'el', 'en', 'para', 'con', 'por', 'los', 'las', 'un', 'una', 'y', 'o']);
  const tokens: string[] = [];
  for (const item of list) {
    const clean = normalizeToken(item);
    tokens.push(clean);
    for (const w of clean.split(/[^a-z0-9]+/)) {
      if (w.length >= 4 && !stopWords.has(w)) {
        tokens.push(w);
      }
    }
  }
  return Array.from(new Set(tokens));
}

function findComplementaryMatches(needs: string[], offeringsAndCaps: string[]): string[] {
  const offeringTokens = tokenWords(offeringsAndCaps);
  const matches: string[] = [];
  for (const need of needs) {
    const needWords = tokenWords([need]);
    const hit = needWords.some((nw) =>
      offeringTokens.some((ot) => ot === nw || (nw.length >= 5 && (ot.includes(nw) || nw.includes(ot))))
    );
    if (hit) {
      matches.push(need);
    }
  }
  return matches;
}

/**
 * Deterministic, explainable B2B compatibility scoring engine.
 * Weighting:
 *  - Complementary needs and offerings: 35%
 *  - Industry / value-chain relevance: 20%
 *  - Commercial objectives: 15%
 *  - Geographic compatibility: 10%
 *  - Operational capabilities: 10%
 *  - Shared interests & certifications: 10%
 */
export function evaluateCompanyMatch(source: Company, candidate: Company): MatchEvaluation {
  const sourceSupply = [...source.offerings, ...source.products, ...source.services, ...source.capabilities];
  const candidateSupply = [...candidate.offerings, ...candidate.products, ...candidate.services, ...candidate.capabilities];

  // 1. Complementary needs and offerings (35%)
  const sourceNeedsMetByCandidate = findComplementaryMatches(source.needs, candidateSupply);
  const candidateNeedsMetBySource = findComplementaryMatches(candidate.needs, sourceSupply);

  const totalNeedMatches = sourceNeedsMetByCandidate.length + candidateNeedsMetBySource.length;
  let complementaryNeedsScore = 8;
  if (totalNeedMatches >= 4) complementaryNeedsScore = 35;
  else if (totalNeedMatches === 3) complementaryNeedsScore = 31;
  else if (totalNeedMatches === 2) complementaryNeedsScore = 26;
  else if (totalNeedMatches === 1) complementaryNeedsScore = 19;

  // Bonus if mutual two-way complementarity exists
  if (sourceNeedsMetByCandidate.length > 0 && candidateNeedsMetBySource.length > 0) {
    complementaryNeedsScore = Math.min(35, complementaryNeedsScore + 4);
  }

  // 2. Industry / value-chain relevance (20%)
  const synergiesA = VALUE_CHAIN_SYNERGIES[source.industry] ?? [];
  const synergiesB = VALUE_CHAIN_SYNERGIES[candidate.industry] ?? [];
  const isDirectSynergy = synergiesA.includes(candidate.industry) || synergiesB.includes(source.industry);
  let valueChainScore = 7;
  if (isDirectSynergy && source.industry !== candidate.industry) {
    valueChainScore = 20;
  } else if (source.industry === candidate.industry && source.operationType !== candidate.operationType) {
    valueChainScore = 15;
  } else if (source.industry === candidate.industry) {
    valueChainScore = 11;
  }

  // 3. Commercial objectives alignment (15%)
  const objA = source.commercialObjectives.map(normalizeToken);
  const objB = candidate.commercialObjectives.map(normalizeToken);
  let commercialObjectivesScore = 6;

  const aSeeksSuppliers = objA.some((o) => o.includes('proveedor') || o.includes('insumo'));
  const bSeeksClients = objB.some((o) => o.includes('cliente') || o.includes('expand') || o.includes('venta') || o.includes('canal'));
  const aSeeksClients = objA.some((o) => o.includes('cliente') || o.includes('venta') || o.includes('distribuidor'));
  const bSeeksSuppliers = objB.some((o) => o.includes('proveedor') || o.includes('alianza') || o.includes('distribuidor'));
  const bothExport =
    (source.exportReadiness !== 'Mercado local' && candidate.exportReadiness !== 'Mercado local') ||
    (objA.some((o) => o.includes('export')) && objB.some((o) => o.includes('export')));

  if ((aSeeksSuppliers && bSeeksClients) || (aSeeksClients && bSeeksSuppliers)) {
    commercialObjectivesScore = 14;
  } else if (bothExport) {
    commercialObjectivesScore = 13;
  } else if (objA.some((x) => objB.includes(x))) {
    commercialObjectivesScore = 11;
  }

  if (aSeeksSuppliers && bSeeksClients && aSeeksClients && bSeeksSuppliers) {
    commercialObjectivesScore = 15;
  }

  // 4. Geographic compatibility (10%)
  let geographicScore = 5;
  const candidateNational =
    normalizeToken(candidate.coverage).includes('todo el pais') ||
    normalizeToken(candidate.coverage).includes('nacional') ||
    normalizeToken(candidate.coverage).includes('latam');
  const sourceNational =
    normalizeToken(source.coverage).includes('todo el pais') ||
    normalizeToken(source.coverage).includes('nacional');

  if (source.location.province === candidate.location.province) {
    geographicScore = 10;
  } else if (source.location.region === candidate.location.region) {
    geographicScore = 9;
  } else if (candidateNational || sourceNational) {
    geographicScore = 8;
  }

  // 5. Operational capabilities & B2B fit (10%)
  let operationalCapabilitiesScore = 6;
  if (candidate.commercialModel !== 'B2C' && source.commercialModel !== 'B2C') {
    operationalCapabilitiesScore += 2;
  }
  if (candidate.capabilities.length >= 3) {
    operationalCapabilitiesScore += 1;
  }
  if (candidate.verificationStatus === 'verified_demo') {
    operationalCapabilitiesScore += 1;
  }
  operationalCapabilitiesScore = Math.min(10, operationalCapabilitiesScore);

  // 6. Shared interests, sustainability & certifications (10%)
  const sharedTags = source.tags.filter((t) =>
    candidate.tags.some((ct) => normalizeToken(ct) === normalizeToken(t))
  );
  const sharedSust = source.sustainabilityCriteria.filter((s) =>
    candidate.sustainabilityCriteria.some((cs) => normalizeToken(cs) === normalizeToken(s))
  );
  let sharedInterestsScore = 4;
  if (sharedSust.length > 0 && sharedTags.length > 0) sharedInterestsScore = 10;
  else if (sharedSust.length > 0 || sharedTags.length >= 2) sharedInterestsScore = 8;
  else if (sharedTags.length === 1 || candidate.certifications.length > 0) sharedInterestsScore = 6;

  const score = Math.min(
    99,
    Math.max(
      42,
      Math.round(
        complementaryNeedsScore +
          valueChainScore +
          commercialObjectivesScore +
          geographicScore +
          operationalCapabilitiesScore +
          sharedInterestsScore
      )
    )
  );

  // Build explainable Spanish reasons
  const reasons: string[] = [];

  if (sourceNeedsMetByCandidate.length > 0) {
    reasons.push(
      `Responde a tu necesidad de "${sourceNeedsMetByCandidate[0]}" con su oferta en ${candidate.subindustry}.`
    );
  }
  if (candidateNeedsMetBySource.length > 0) {
    reasons.push(
      `${candidate.name} busca "${candidateNeedsMetBySource[0]}", área en la que tu empresa tiene oferta activa.`
    );
  }
  if (isDirectSynergy && source.industry !== candidate.industry) {
    reasons.push(
      `Fuerte complementariedad en cadena de valor entre ${source.industry} y ${candidate.industry}.`
    );
  }
  if (source.location.province === candidate.location.province) {
    reasons.push(`Operan en la misma provincia (${candidate.location.province}), agilizando logística y reuniones.`);
  } else if (candidateNational) {
    reasons.push(`Tiene cobertura operativa en ${candidate.coverage}, compatible con tu ubicación en ${source.location.province}.`);
  }
  if (sharedSust.length > 0) {
    reasons.push(`Comparten enfoque sustentable: ${sharedSust[0]}.`);
  } else if (bothExport) {
    reasons.push('Ambas empresas tienen perfil orientado a exportación y expansión regional.');
  }

  if (reasons.length < 2) {
    reasons.push(`Perfil ${candidate.operationType.toLowerCase()} con operación ${candidate.commercialModel} listo para acuerdos comerciales.`);
  }

  const headlineReason =
    sourceNeedsMetByCandidate.length > 0
      ? `Complementa tu necesidad: ${sourceNeedsMetByCandidate[0]}`
      : candidateNeedsMetBySource.length > 0
      ? `Potencial cliente interesado en tu oferta`
      : isDirectSynergy
      ? `Sinergia directa de cadena de valor (${candidate.industry})`
      : `Alineación comercial y geográfica en ${candidate.location.province}`;

  return {
    company: candidate,
    score,
    breakdown: {
      complementaryNeedsScore,
      valueChainScore,
      commercialObjectivesScore,
      geographicScore,
      operationalCapabilitiesScore,
      sharedInterestsScore,
    },
    headlineReason,
    reasons: reasons.slice(0, 3),
    matchedNeedsToOfferings: sourceNeedsMetByCandidate,
    matchedOfferingsToNeeds: candidateNeedsMetBySource,
  };
}

export function getRankedMatchesForCompany(
  source: Company,
  allCompanies: Company[],
  excludedIds: Set<string> = new Set()
): MatchEvaluation[] {
  return allCompanies
    .filter((c) => c.id !== source.id && c.status === 'published' && !excludedIds.has(c.id))
    .map((candidate) => evaluateCompanyMatch(source, candidate))
    .sort((a, b) => b.score - a.score);
}
