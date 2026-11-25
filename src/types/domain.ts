export type UserRole = 'business_user' | 'admin';

export type PlanTier = 'free' | 'pro' | 'enterprise' | 'institutional';

export type CompanySize = 'Emprendimiento (1-5)' | 'Micro PyME (6-15)' | 'Pequeña (16-50)' | 'Mediana (51-200)' | 'Gran Empresa (+200)';

export type BusinessOperationType = 'Fabricante' | 'Proveedor de servicios' | 'Comercializadora / Distribuidora' | 'Productor primario' | 'Mixto';

export type CommercialModel = 'B2B' | 'B2C' | 'B2B y B2C';

export type VerificationStatus = 'unverified' | 'pending' | 'verified_demo' | 'rejected';

export type ExportReadiness = 'Mercado local' | 'Listo para exportar' | 'Exportador activo';

export type OpportunityCategory =
  | 'Busco proveedor'
  | 'Ofrezco productos'
  | 'Ofrezco servicios'
  | 'Busco distribuidor'
  | 'Busco clientes'
  | 'Busco alianza estratégica'
  | 'Busco inversión'
  | 'Necesito tecnología'
  | 'Compra corporativa';

export type OpportunityStatus = 'active' | 'paused' | 'closed' | 'under_review';

export type EventFormat = 'Presencial' | 'Online' | 'Híbrido';

export type EventType =
  | 'Ronda de negocios'
  | 'Congreso empresarial'
  | 'Feria comercial'
  | 'Networking'
  | 'Encuentro emprendedor'
  | 'Jornada sectorial';

export type CourseTopic =
  | 'IA y automatización'
  | 'Transformación digital'
  | 'Marketing'
  | 'Finanzas'
  | 'Liderazgo'
  | 'Ventas'
  | 'Comercio exterior'
  | 'Sustentabilidad'
  | 'Emprendedurismo';

export type ResourceCategory =
  | 'Programas públicos'
  | 'Programas provinciales'
  | 'Bancos'
  | 'Instituciones de desarrollo'
  | 'Organismos internacionales'
  | 'Universidades'
  | 'Cámaras empresariales';

export interface GeoLocation {
  country: string;
  province: string;
  city: string;
  region: 'AMBA' | 'Centro' | 'Cuyo' | 'Litoral' | 'NOA' | 'NEA' | 'Patagonia';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  avatarColor: string;
  title: string;
  status: 'active' | 'suspended';
  createdAt: string;
  isDemoRecord: boolean;
}

export interface CompanyMembership {
  id: string;
  userId: string;
  companyId: string;
  memberRole: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface CompanyReview {
  id: string;
  authorName: string;
  authorCompany: string;
  rating: number;
  comment: string;
  createdAt: string;
  isDemoReview: true;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  description: string;
  history: string;
  foundedYear: number;
  logoInitials: string;
  brandColor: string;
  coverImage: string;
  portfolioImages: string[];
  industry: string;
  subindustry: string;
  location: GeoLocation;
  coverage: string;
  size: CompanySize;
  operationType: BusinessOperationType;
  commercialModel: CommercialModel;
  exportReadiness: ExportReadiness;
  products: string[];
  services: string[];
  capabilities: string[];
  offerings: string[];
  needs: string[];
  commercialObjectives: string[];
  certifications: string[];
  sustainabilityCriteria: string[];
  tags: string[];
  website: string;
  contactEmail: string;
  phone: string;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  planTier: PlanTier;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  reviews: CompanyReview[];
  createdAt: string;
  isDemoData: boolean;
}

export interface Opportunity {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  sector: string;
  location: string;
  province: string;
  budget?: string;
  deadline: string;
  tags: string[];
  status: OpportunityStatus;
  isCorporateProcurement: boolean;
  interestedCompanyIds: string[];
  coverImage: string;
  createdAt: string;
  isDemoData: boolean;
}

export interface MatchDecision {
  id: string;
  fromCompanyId: string;
  toCompanyId: string;
  action: 'interested' | 'passed' | 'saved';
  createdAt: string;
}

export interface Connection {
  id: string;
  companyAId: string;
  companyBId: string;
  compatibilityScore: number;
  reasons: string[];
  createdAt: string;
  status: 'active' | 'archived';
}

export interface Message {
  id: string;
  conversationId: string;
  senderCompanyId: string;
  senderUserName: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantCompanyIds: [string, string];
  contextLabel?: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  type: EventType;
  format: EventFormat;
  date: string;
  time: string;
  province: string;
  city: string;
  venue: string;
  organizer: string;
  costLabel: string;
  spotsAvailable: number;
  tags: string[];
  coverImage: string;
  status: 'active' | 'archived';
  isDemoData: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  summary: string;
  topic: CourseTopic;
  provider: string;
  instructor: string;
  duration: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  format: 'On-demand' | 'En vivo' | 'Híbrido';
  costLabel: string;
  certificateIncluded: boolean;
  tags: string[];
  coverImage: string;
  status: 'active' | 'archived';
  isDemoData: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  institution: string;
  scope: string;
  audience: string;
  resourceType: 'Guía de referencia' | 'Portal institucional' | 'Línea referencial (demo)' | 'Asistencia técnica';
  referenceUrl: string;
  isReferenceInfo: boolean;
  disclaimerNote: string;
  tags: string[];
  status: 'active' | 'archived';
}

export interface Organization {
  id: string;
  acronym: string;
  name: string;
  category: 'Cámara empresarial' | 'Banco / Desarrollo' | 'Organismo internacional' | 'Polo tecnológico / Sectorial' | 'Universidad';
  scope: string;
  province: string;
  description: string;
  focusAreas: string[];
  website: string;
  accentColor: string;
  isReferenceDirectoryEntry: true;
  status: 'active' | 'archived';
}

export interface Community {
  id: string;
  name: string;
  sector: string;
  region: string;
  description: string;
  memberCountDemo: number;
  topics: string[];
  accentColor: string;
  recentTopicTitle: string;
  recentTopicAuthor: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  companiesInvolved: string;
  province: string;
  sector: string;
  beforeSummary: string;
  outcomeMetric: string;
  quote: string;
  personName: string;
  personRole: string;
  image: string;
  isFictionalDemoCase: true;
}

export interface SavedSearch {
  id: string;
  label: string;
  query: string;
  filters: Record<string, string>;
  createdAt: string;
}

export interface ModerationItem {
  id: string;
  entityType: 'company' | 'opportunity' | 'review';
  entityId: string;
  entityTitle: string;
  reason: string;
  reportedBy: string;
  status: 'pending' | 'approved' | 'removed';
  createdAt: string;
  resolutionNote?: string;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface TaxonomyData {
  industries: string[];
  capabilities: string[];
  needs: string[];
  tags: string[];
  certifications: string[];
}

export interface AppState {
  schemaVersion: number;
  currentUserId: string | null;
  activeCompanyId: string | null;
  users: User[];
  memberships: CompanyMembership[];
  companies: Company[];
  opportunities: Opportunity[];
  matchDecisions: MatchDecision[];
  connections: Connection[];
  conversations: Conversation[];
  messages: Message[];
  events: EventItem[];
  courses: CourseItem[];
  resources: ResourceItem[];
  organizations: Organization[];
  communities: Community[];
  savedCompanyIds: string[];
  savedEventIds: string[];
  registeredEventIds: string[];
  enrolledCourseIds: string[];
  savedResourceIds: string[];
  joinedCommunityIds: string[];
  savedSearches: SavedSearch[];
  moderationQueue: ModerationItem[];
  auditLogs: AuditLogEntry[];
  taxonomy: TaxonomyData;
  /** Companies that pre-expressed demo mutual interest so users experience instant mutual matches */
  preInterestedCompanyIds: string[];
}
