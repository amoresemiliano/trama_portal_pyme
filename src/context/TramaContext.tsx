import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  AppState,
  Company,
  Connection,
  CourseItem,
  EventItem,
  Opportunity,
  OpportunityStatus,
  Organization,
  ResourceItem,
  TaxonomyData,
  User,
  VerificationStatus,
} from '../types/domain';
import {
  createInitialSeedState,
  DEMO_ADMIN_USER_ID,
  DEMO_BUSINESS_USER_ID,
  DEMO_DEFAULT_COMPANY_ID,
} from '../data/seedState';
import { createTramaRepository } from '../repositories/tramaRepository';
import { evaluateCompanyMatch } from '../services/matchingEngine';

export interface ToastNotice {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'warning';
}

interface MatchDecisionResult {
  isMutualMatch: boolean;
  connection?: Connection;
  conversationId?: string;
  targetCompany?: Company;
}

interface TramaContextValue {
  state: AppState;
  isLoading: boolean;
  dataMode: 'demo' | 'api';
  currentUser: User | null;
  activeCompany: Company | null;
  userCompanies: Company[];
  toasts: ToastNotice[];
  notify: (message: string, tone?: ToastNotice['tone']) => void;
  dismissToast: (id: string) => void;

  // Auth & onboarding (demo local simulation)
  loginAsDemoBusiness: () => void;
  loginAsDemoAdmin: () => void;
  loginDemoByEmail: (email: string) => { ok: boolean; error?: string };
  logout: () => void;
  switchActiveCompany: (companyId: string) => void;
  registerUserAndCompany: (payload: {
    user: { fullName: string; email: string; title: string };
    company: Omit<Company, 'id' | 'slug' | 'createdAt' | 'reviews' | 'isDemoData'>;
  }) => { user: User; company: Company };

  // Company & team
  updateCompany: (companyId: string, patch: Partial<Company>) => void;
  addTeamMember: (companyId: string, fullName: string, email: string, title: string) => void;

  // Matching & Messaging
  recordMatchDecision: (targetCompanyId: string, action: 'interested' | 'passed' | 'saved') => MatchDecisionResult;
  resetMatchPasses: () => void;
  startConversationWithCompany: (targetCompanyId: string, contextLabel?: string) => string;
  sendMessage: (conversationId: string, body: string) => void;
  markConversationRead: (conversationId: string) => void;

  // Opportunities
  createOpportunity: (
    payload: Omit<
      Opportunity,
      'id' | 'companyId' | 'companyName' | 'companySlug' | 'interestedCompanyIds' | 'createdAt' | 'isDemoData'
    >
  ) => Opportunity;
  updateOpportunity: (oppId: string, patch: Partial<Opportunity>) => void;
  deleteOpportunity: (oppId: string) => void;
  toggleOpportunityInterest: (oppId: string) => boolean;

  // Bookmarks & participation
  toggleSaveCompany: (companyId: string) => void;
  toggleSaveEvent: (eventId: string) => void;
  toggleRegisterEvent: (eventId: string) => void;
  toggleEnrollCourse: (courseId: string) => void;
  toggleSaveResource: (resourceId: string) => void;
  toggleJoinCommunity: (communityId: string) => void;
  saveDirectorySearch: (label: string, query: string, filters: Record<string, string>) => void;
  deleteSavedSearch: (id: string) => void;

  // Admin actions
  adminSetCompanyVerification: (companyId: string, status: VerificationStatus, note?: string) => void;
  adminToggleCompanyFeatured: (companyId: string) => void;
  adminUpdateCompanyStatus: (companyId: string, status: Company['status']) => void;
  adminToggleUserStatus: (userId: string) => void;
  adminToggleUserRole: (userId: string) => void;
  adminUpdateOpportunityStatus: (oppId: string, status: OpportunityStatus) => void;
  adminCreateEvent: (payload: Omit<EventItem, 'id' | 'isDemoData' | 'status'>) => void;
  adminToggleEventStatus: (eventId: string) => void;
  adminCreateCourse: (payload: Omit<CourseItem, 'id' | 'isDemoData' | 'status'>) => void;
  adminToggleCourseStatus: (courseId: string) => void;
  adminCreateResource: (payload: Omit<ResourceItem, 'id' | 'status'>) => void;
  adminToggleResourceStatus: (resourceId: string) => void;
  adminCreateOrganization: (payload: Omit<Organization, 'id' | 'isReferenceDirectoryEntry' | 'status'>) => void;
  adminToggleOrganizationStatus: (orgId: string) => void;
  adminAddTaxonomyTerm: (group: keyof TaxonomyData, term: string) => void;
  adminRemoveTaxonomyTerm: (group: keyof TaxonomyData, term: string) => void;
  adminResolveModeration: (modId: string, resolution: 'approved' | 'removed', note: string) => void;
  resetDemoData: () => Promise<void>;
}

const TramaContext = createContext<TramaContextValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function nowStamp(): string {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
}

export const TramaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repository = useMemo(() => createTramaRepository(), []);
  const [state, setState] = useState<AppState>(() => createInitialSeedState());
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  useEffect(() => {
    let active = true;
    repository.loadState(createInitialSeedState).then((loaded) => {
      if (active) {
        setState(loaded);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [repository]);

  const updateState = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = updater(prev);
        void repository.saveState(next);
        return next;
      });
    },
    [repository]
  );

  const notify = useCallback((message: string, tone: ToastNotice['tone'] = 'success') => {
    const id = makeId('toast');
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const userCompanies = useMemo(() => {
    if (!currentUser) {
      const def = state.companies.find((c) => c.id === state.activeCompanyId) ?? state.companies[0];
      return def ? [def] : [];
    }
    const memberCompanyIds = state.memberships
      .filter((m) => m.userId === currentUser.id)
      .map((m) => m.companyId);
    const list = state.companies.filter((c) => memberCompanyIds.includes(c.id));
    if (list.length > 0) return list;
    const fallback = state.companies.find((c) => c.id === state.activeCompanyId) ?? state.companies[0];
    return fallback ? [fallback] : [];
  }, [currentUser, state.memberships, state.companies, state.activeCompanyId]);

  const activeCompany = useMemo(() => {
    return (
      state.companies.find((c) => c.id === state.activeCompanyId) ??
      userCompanies[0] ??
      state.companies[0] ??
      null
    );
  }, [state.companies, state.activeCompanyId, userCompanies]);

  const appendAudit = (prev: AppState, action: string, target: string): AppState['auditLogs'] => {
    const actor = prev.users.find((u) => u.id === prev.currentUserId)?.fullName ?? 'Administración TRAMA';
    return [
      { id: makeId('aud'), actorName: actor, action, target, createdAt: nowStamp() },
      ...prev.auditLogs,
    ];
  };

  const loginAsDemoBusiness = useCallback(() => {
    updateState((prev) => {
      const memberComp =
        prev.memberships.find((m) => m.userId === DEMO_BUSINESS_USER_ID)?.companyId ??
        DEMO_DEFAULT_COMPANY_ID;
      return {
        ...prev,
        currentUserId: DEMO_BUSINESS_USER_ID,
        activeCompanyId: memberComp,
      };
    });
    notify('Ingresaste al espacio demo como Martín Echeverría (Altiplano Alimentos).', 'info');
  }, [updateState, notify]);

  const loginAsDemoAdmin = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      currentUserId: DEMO_ADMIN_USER_ID,
    }));
    notify('Ingresaste en modo Administrador Demo (Sofía Méndez).', 'info');
  }, [updateState, notify]);

  const loginDemoByEmail = useCallback(
    (email: string) => {
      const normalized = email.trim().toLowerCase();
      const found = state.users.find((u) => u.email.toLowerCase() === normalized);
      if (!found) {
        return {
          ok: false,
          error: 'No encontramos ese correo en el entorno demo. Usá los accesos demo o creá tu cuenta gratis.',
        };
      }
      if (found.status === 'suspended') {
        return { ok: false, error: 'Esta cuenta demo se encuentra suspendida por administración.' };
      }
      updateState((prev) => {
        const firstComp =
          prev.memberships.find((m) => m.userId === found.id)?.companyId ?? prev.activeCompanyId;
        return {
          ...prev,
          currentUserId: found.id,
          activeCompanyId: firstComp,
        };
      });
      notify(`Bienvenido/a, ${found.fullName}.`);
      return { ok: true };
    },
    [state.users, updateState, notify]
  );

  const logout = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      currentUserId: null,
    }));
    notify('Cerraste sesión del entorno demo.', 'info');
  }, [updateState, notify]);

  const switchActiveCompany = useCallback(
    (companyId: string) => {
      updateState((prev) => ({ ...prev, activeCompanyId: companyId }));
    },
    [updateState]
  );

  const registerUserAndCompany: TramaContextValue['registerUserAndCompany'] = useCallback(
    ({ user, company }) => {
      const userId = makeId('usr');
      const companyId = makeId('comp');
      const initials = user.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('') || 'US';

      const newUser: User = {
        id: userId,
        fullName: user.fullName.trim(),
        email: user.email.trim().toLowerCase(),
        role: 'business_user',
        avatarInitials: initials,
        avatarColor: '#2563EB',
        title: user.title.trim() || 'Fundador / Dirección',
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
        isDemoRecord: true,
      };

      const baseSlug = slugify(company.name) || 'mi-empresa';
      const uniqueSlug = state.companies.some((c) => c.slug === baseSlug)
        ? `${baseSlug}-${companyId.slice(-4)}`
        : baseSlug;

      const newCompany: Company = {
        ...company,
        id: companyId,
        slug: uniqueSlug,
        createdAt: new Date().toISOString().slice(0, 10),
        reviews: [],
        isDemoData: true,
      };

      updateState((prev) => ({
        ...prev,
        currentUserId: userId,
        activeCompanyId: companyId,
        users: [newUser, ...prev.users],
        companies: [newCompany, ...prev.companies],
        memberships: [
          {
            id: makeId('mem'),
            userId,
            companyId,
            memberRole: 'owner',
            joinedAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.memberships,
        ],
        moderationQueue: [
          {
            id: makeId('mod'),
            entityType: 'company',
            entityId: companyId,
            entityTitle: newCompany.name,
            reason: 'Nueva empresa registrada desde onboarding — pendiente de revisión.',
            reportedBy: 'Alta automática',
            status: 'pending',
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.moderationQueue,
        ],
      }));

      notify(`¡${newCompany.name} ya está publicada en el ecosistema TRAMA!`);
      return { user: newUser, company: newCompany };
    },
    [state.companies, updateState, notify]
  );

  const updateCompany = useCallback(
    (companyId: string, patch: Partial<Company>) => {
      updateState((prev) => ({
        ...prev,
        companies: prev.companies.map((c) => (c.id === companyId ? { ...c, ...patch } : c)),
      }));
      notify('Perfil empresarial actualizado y guardado.');
    },
    [updateState, notify]
  );

  const addTeamMember = useCallback(
    (companyId: string, fullName: string, email: string, title: string) => {
      const userId = makeId('usr');
      const initials =
        fullName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() ?? '')
          .join('') || 'EQ';
      updateState((prev) => ({
        ...prev,
        users: [
          ...prev.users,
          {
            id: userId,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            role: 'business_user',
            avatarInitials: initials,
            avatarColor: '#00A995',
            title: title.trim() || 'Integrante comercial',
            status: 'active',
            createdAt: new Date().toISOString().slice(0, 10),
            isDemoRecord: true,
          },
        ],
        memberships: [
          ...prev.memberships,
          {
            id: makeId('mem'),
            userId,
            companyId,
            memberRole: 'member',
            joinedAt: new Date().toISOString().slice(0, 10),
          },
        ],
      }));
      notify(`Se sumó a ${fullName} al equipo de tu empresa.`);
    },
    [updateState, notify]
  );

  const recordMatchDecision = useCallback(
    (targetCompanyId: string, action: 'interested' | 'passed' | 'saved'): MatchDecisionResult => {
      const source = activeCompany;
      const target = state.companies.find((c) => c.id === targetCompanyId);
      if (!source || !target) return { isMutualMatch: false };

      const evaluation = evaluateCompanyMatch(source, target);
      const alreadyConnected = state.connections.some(
        (conn) =>
          (conn.companyAId === source.id && conn.companyBId === target.id) ||
          (conn.companyAId === target.id && conn.companyBId === source.id)
      );

      // Mutual match triggers when target pre-expressed demo interest OR high complementary compatibility (>=76)
      const isMutual =
        action === 'interested' &&
        !alreadyConnected &&
        (state.preInterestedCompanyIds.includes(target.id) || evaluation.score >= 76);

      let createdConnection: Connection | undefined;
      let createdConvId: string | undefined;

      if (isMutual) {
        createdConnection = {
          id: makeId('conn'),
          companyAId: source.id,
          companyBId: target.id,
          compatibilityScore: evaluation.score,
          reasons: evaluation.reasons,
          createdAt: new Date().toISOString(),
          status: 'active',
        };

        const existingConv = state.conversations.find(
          (cv) =>
            cv.participantCompanyIds.includes(source.id) &&
            cv.participantCompanyIds.includes(target.id)
        );
        createdConvId = existingConv?.id ?? makeId('conv');
      }

      updateState((prev) => {
        const nextSaved =
          action === 'saved'
            ? Array.from(new Set([...prev.savedCompanyIds, target.id]))
            : prev.savedCompanyIds;

        const nextDecisions = [
          ...prev.matchDecisions.filter(
            (d) => !(d.fromCompanyId === source.id && d.toCompanyId === target.id)
          ),
          {
            id: makeId('md'),
            fromCompanyId: source.id,
            toCompanyId: target.id,
            action,
            createdAt: new Date().toISOString(),
          },
        ];

        if (!isMutual || !createdConnection || !createdConvId) {
          return {
            ...prev,
            savedCompanyIds: nextSaved,
            matchDecisions: nextDecisions,
          };
        }

        const existingConv = prev.conversations.find((cv) => cv.id === createdConvId);
        const nextConversations = existingConv
          ? prev.conversations
          : [
              {
                id: createdConvId,
                participantCompanyIds: [source.id, target.id] as [string, string],
                contextLabel: `Match B2B · ${evaluation.score}% compatibilidad`,
                updatedAt: new Date().toISOString(),
              },
              ...prev.conversations,
            ];

        const introMessage = {
          id: makeId('msg'),
          conversationId: createdConvId,
          senderCompanyId: target.id,
          senderUserName: `Equipo ${target.name}`,
          body: `¡Hola equipo de ${source.name}! Qué buena conexión en TRAMA. Vimos gran complementariedad entre nuestras empresas (${evaluation.headlineReason.toLowerCase()}). ¿Coordinamos una breve reunión esta semana?`,
          createdAt: new Date().toISOString(),
          read: false,
        };

        return {
          ...prev,
          savedCompanyIds: nextSaved,
          matchDecisions: nextDecisions,
          connections: [createdConnection, ...prev.connections],
          conversations: nextConversations,
          messages: existingConv ? prev.messages : [...prev.messages, introMessage],
        };
      });

      if (action === 'saved') {
        notify(`Guardaste a ${target.name} en tus empresas favoritas.`);
      } else if (action === 'interested' && !isMutual) {
        notify(`Enviaste interés comercial a ${target.name}.`);
      }

      return {
        isMutualMatch: isMutual,
        connection: createdConnection,
        conversationId: createdConvId,
        targetCompany: target,
      };
    },
    [activeCompany, state.companies, state.connections, state.conversations, state.preInterestedCompanyIds, updateState, notify]
  );

  const resetMatchPasses = useCallback(() => {
    if (!activeCompany) return;
    updateState((prev) => ({
      ...prev,
      matchDecisions: prev.matchDecisions.filter(
        (d) => !(d.fromCompanyId === activeCompany.id && d.action === 'passed')
      ),
    }));
    notify('Se restauraron las empresas descartadas para explorar nuevamente.', 'info');
  }, [activeCompany, updateState, notify]);

  const startConversationWithCompany = useCallback(
    (targetCompanyId: string, contextLabel?: string): string => {
      const sourceId = activeCompany?.id ?? DEMO_DEFAULT_COMPANY_ID;
      const existing = state.conversations.find(
        (c) =>
          c.participantCompanyIds.includes(sourceId) &&
          c.participantCompanyIds.includes(targetCompanyId)
      );
      if (existing) return existing.id;

      const convId = makeId('conv');
      const target = state.companies.find((c) => c.id === targetCompanyId);
      updateState((prev) => ({
        ...prev,
        conversations: [
          {
            id: convId,
            participantCompanyIds: [sourceId, targetCompanyId],
            contextLabel: contextLabel ?? `Contacto directo · ${target?.industry ?? 'B2B'}`,
            updatedAt: new Date().toISOString(),
          },
          ...prev.conversations,
        ],
      }));
      return convId;
    },
    [activeCompany, state.conversations, state.companies, updateState]
  );

  const sendMessage = useCallback(
    (conversationId: string, body: string) => {
      const clean = body.trim();
      if (!clean || !activeCompany) return;
      const senderLabel = currentUser
        ? `${currentUser.fullName} (${activeCompany.name})`
        : `Equipo ${activeCompany.name}`;
      const now = new Date().toISOString();

      updateState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: makeId('msg'),
            conversationId,
            senderCompanyId: activeCompany.id,
            senderUserName: senderLabel,
            body: clean,
            createdAt: now,
            read: true,
          },
        ],
        conversations: prev.conversations
          .map((cv) => (cv.id === conversationId ? { ...cv, updatedAt: now } : cv))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      }));
    },
    [activeCompany, currentUser, updateState]
  );

  const markConversationRead = useCallback(
    (conversationId: string) => {
      if (!activeCompany) return;
      updateState((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.conversationId === conversationId && m.senderCompanyId !== activeCompany.id
            ? { ...m, read: true }
            : m
        ),
      }));
    },
    [activeCompany, updateState]
  );

  const createOpportunity: TramaContextValue['createOpportunity'] = useCallback(
    (payload) => {
      const comp = activeCompany ?? state.companies[0];
      const newOpp: Opportunity = {
        ...payload,
        id: makeId('opp'),
        companyId: comp.id,
        companyName: comp.name,
        companySlug: comp.slug,
        interestedCompanyIds: [],
        createdAt: new Date().toISOString().slice(0, 10),
        isDemoData: true,
      };
      updateState((prev) => ({
        ...prev,
        opportunities: [newOpp, ...prev.opportunities],
      }));
      notify('Oportunidad comercial publicada con éxito.');
      return newOpp;
    },
    [activeCompany, state.companies, updateState, notify]
  );

  const updateOpportunity = useCallback(
    (oppId: string, patch: Partial<Opportunity>) => {
      updateState((prev) => ({
        ...prev,
        opportunities: prev.opportunities.map((o) => (o.id === oppId ? { ...o, ...patch } : o)),
      }));
      notify('Oportunidad actualizada.');
    },
    [updateState, notify]
  );

  const deleteOpportunity = useCallback(
    (oppId: string) => {
      updateState((prev) => ({
        ...prev,
        opportunities: prev.opportunities.filter((o) => o.id !== oppId),
      }));
      notify('Oportunidad eliminada.', 'info');
    },
    [updateState, notify]
  );

  const toggleOpportunityInterest = useCallback(
    (oppId: string) => {
      const myId = activeCompany?.id ?? DEMO_DEFAULT_COMPANY_ID;
      let added = false;
      updateState((prev) => ({
        ...prev,
        opportunities: prev.opportunities.map((o) => {
          if (o.id !== oppId) return o;
          const exists = o.interestedCompanyIds.includes(myId);
          added = !exists;
          return {
            ...o,
            interestedCompanyIds: exists
              ? o.interestedCompanyIds.filter((id) => id !== myId)
              : [...o.interestedCompanyIds, myId],
          };
        }),
      }));
      notify(added ? 'Expresaste interés comercial en esta oportunidad.' : 'Retiraste tu interés.');
      return added;
    },
    [activeCompany, updateState, notify]
  );

  const toggleSaveCompany = useCallback(
    (companyId: string) => {
      const exists = state.savedCompanyIds.includes(companyId);
      updateState((prev) => ({
        ...prev,
        savedCompanyIds: exists
          ? prev.savedCompanyIds.filter((id) => id !== companyId)
          : [...prev.savedCompanyIds, companyId],
      }));
      notify(exists ? 'Empresa quitada de guardados.' : 'Empresa guardada en tu lista.', 'info');
    },
    [state.savedCompanyIds, updateState, notify]
  );

  const toggleSaveEvent = useCallback(
    (eventId: string) => {
      const exists = state.savedEventIds.includes(eventId);
      updateState((prev) => ({
        ...prev,
        savedEventIds: exists
          ? prev.savedEventIds.filter((id) => id !== eventId)
          : [...prev.savedEventIds, eventId],
      }));
      notify(exists ? 'Evento quitado de guardados.' : 'Evento guardado en tu agenda.', 'info');
    },
    [state.savedEventIds, updateState, notify]
  );

  const toggleRegisterEvent = useCallback(
    (eventId: string) => {
      const exists = state.registeredEventIds.includes(eventId);
      updateState((prev) => ({
        ...prev,
        registeredEventIds: exists
          ? prev.registeredEventIds.filter((id) => id !== eventId)
          : [...prev.registeredEventIds, eventId],
        savedEventIds: exists
          ? prev.savedEventIds
          : Array.from(new Set([...prev.savedEventIds, eventId])),
      }));
      notify(exists ? 'Inscripción cancelada.' : '¡Inscripción demo confirmada! Lo ves en tu agenda.');
    },
    [state.registeredEventIds, updateState, notify]
  );

  const toggleEnrollCourse = useCallback(
    (courseId: string) => {
      const exists = state.enrolledCourseIds.includes(courseId);
      updateState((prev) => ({
        ...prev,
        enrolledCourseIds: exists
          ? prev.enrolledCourseIds.filter((id) => id !== courseId)
          : [...prev.enrolledCourseIds, courseId],
      }));
      notify(exists ? 'Curso quitado de tu lista.' : 'Te anotaste al curso en tu espacio PyME.');
    },
    [state.enrolledCourseIds, updateState, notify]
  );

  const toggleSaveResource = useCallback(
    (resourceId: string) => {
      const exists = state.savedResourceIds.includes(resourceId);
      updateState((prev) => ({
        ...prev,
        savedResourceIds: exists
          ? prev.savedResourceIds.filter((id) => id !== resourceId)
          : [...prev.savedResourceIds, resourceId],
      }));
      notify(exists ? 'Recurso quitado de guardados.' : 'Recurso guardado en tu espacio.', 'info');
    },
    [state.savedResourceIds, updateState, notify]
  );

  const toggleJoinCommunity = useCallback(
    (communityId: string) => {
      const exists = state.joinedCommunityIds.includes(communityId);
      updateState((prev) => ({
        ...prev,
        joinedCommunityIds: exists
          ? prev.joinedCommunityIds.filter((id) => id !== communityId)
          : [...prev.joinedCommunityIds, communityId],
      }));
      notify(exists ? 'Saliste de la comunidad.' : 'Te sumaste a la comunidad empresarial.');
    },
    [state.joinedCommunityIds, updateState, notify]
  );

  const saveDirectorySearch = useCallback(
    (label: string, query: string, filters: Record<string, string>) => {
      updateState((prev) => ({
        ...prev,
        savedSearches: [
          {
            id: makeId('ss'),
            label: label.trim() || 'Búsqueda guardada',
            query,
            filters,
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.savedSearches,
        ],
      }));
      notify('Búsqueda guardada en el directorio.');
    },
    [updateState, notify]
  );

  const deleteSavedSearch = useCallback(
    (id: string) => {
      updateState((prev) => ({
        ...prev,
        savedSearches: prev.savedSearches.filter((s) => s.id !== id),
      }));
    },
    [updateState]
  );

  // Admin actions
  const adminSetCompanyVerification = useCallback(
    (companyId: string, status: VerificationStatus, note?: string) => {
      const target = state.companies.find((c) => c.id === companyId);
      updateState((prev) => ({
        ...prev,
        companies: prev.companies.map((c) =>
          c.id === companyId ? { ...c, verificationStatus: status, verificationNote: note } : c
        ),
        auditLogs: appendAudit(
          prev,
          `Cambió verificación a ${status}`,
          target?.name ?? companyId
        ),
      }));
      notify(`Estado de verificación actualizado para ${target?.name ?? 'empresa'}.`);
    },
    [state.companies, updateState, notify]
  );

  const adminToggleCompanyFeatured = useCallback(
    (companyId: string) => {
      const target = state.companies.find((c) => c.id === companyId);
      updateState((prev) => ({
        ...prev,
        companies: prev.companies.map((c) =>
          c.id === companyId ? { ...c, featured: !c.featured } : c
        ),
        auditLogs: appendAudit(prev, 'Actualizó estado destacado', target?.name ?? companyId),
      }));
    },
    [state.companies, updateState]
  );

  const adminUpdateCompanyStatus = useCallback(
    (companyId: string, status: Company['status']) => {
      const target = state.companies.find((c) => c.id === companyId);
      updateState((prev) => ({
        ...prev,
        companies: prev.companies.map((c) => (c.id === companyId ? { ...c, status } : c)),
        auditLogs: appendAudit(prev, `Estado de empresa: ${status}`, target?.name ?? companyId),
      }));
      notify(`Estado actualizado a ${status}.`, 'info');
    },
    [state.companies, updateState, notify]
  );

  const adminToggleUserStatus = useCallback(
    (userId: string) => {
      const target = state.users.find((u) => u.id === userId);
      updateState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
        ),
        auditLogs: appendAudit(prev, 'Cambió estado de usuario', target?.fullName ?? userId),
      }));
    },
    [state.users, updateState]
  );

  const adminToggleUserRole = useCallback(
    (userId: string) => {
      const target = state.users.find((u) => u.id === userId);
      updateState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === userId
            ? { ...u, role: u.role === 'admin' ? 'business_user' : 'admin' }
            : u
        ),
        auditLogs: appendAudit(prev, 'Actualizó rol de usuario', target?.fullName ?? userId),
      }));
    },
    [state.users, updateState]
  );

  const adminUpdateOpportunityStatus = useCallback(
    (oppId: string, status: OpportunityStatus) => {
      const target = state.opportunities.find((o) => o.id === oppId);
      updateState((prev) => ({
        ...prev,
        opportunities: prev.opportunities.map((o) => (o.id === oppId ? { ...o, status } : o)),
        auditLogs: appendAudit(prev, `Oportunidad -> ${status}`, target?.title ?? oppId),
      }));
      notify('Estado de oportunidad actualizado.');
    },
    [state.opportunities, updateState, notify]
  );

  const adminCreateEvent: TramaContextValue['adminCreateEvent'] = useCallback(
    (payload) => {
      updateState((prev) => ({
        ...prev,
        events: [{ ...payload, id: makeId('evt'), status: 'active', isDemoData: true }, ...prev.events],
        auditLogs: appendAudit(prev, 'Creó evento', payload.title),
      }));
      notify('Evento creado y publicado en agenda.');
    },
    [updateState, notify]
  );

  const adminToggleEventStatus = useCallback(
    (eventId: string) => {
      updateState((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === eventId ? { ...e, status: e.status === 'active' ? 'archived' : 'active' } : e
        ),
      }));
    },
    [updateState]
  );

  const adminCreateCourse: TramaContextValue['adminCreateCourse'] = useCallback(
    (payload) => {
      updateState((prev) => ({
        ...prev,
        courses: [{ ...payload, id: makeId('crs'), status: 'active', isDemoData: true }, ...prev.courses],
        auditLogs: appendAudit(prev, 'Publicó curso', payload.title),
      }));
      notify('Curso agregado al catálogo.');
    },
    [updateState, notify]
  );

  const adminToggleCourseStatus = useCallback(
    (courseId: string) => {
      updateState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId ? { ...c, status: c.status === 'active' ? 'archived' : 'active' } : c
        ),
      }));
    },
    [updateState]
  );

  const adminCreateResource: TramaContextValue['adminCreateResource'] = useCallback(
    (payload) => {
      updateState((prev) => ({
        ...prev,
        resources: [{ ...payload, id: makeId('res'), status: 'active' }, ...prev.resources],
        auditLogs: appendAudit(prev, 'Agregó recurso', payload.title),
      }));
      notify('Recurso publicado.');
    },
    [updateState, notify]
  );

  const adminToggleResourceStatus = useCallback(
    (resourceId: string) => {
      updateState((prev) => ({
        ...prev,
        resources: prev.resources.map((r) =>
          r.id === resourceId ? { ...r, status: r.status === 'active' ? 'archived' : 'active' } : r
        ),
      }));
    },
    [updateState]
  );

  const adminCreateOrganization: TramaContextValue['adminCreateOrganization'] = useCallback(
    (payload) => {
      updateState((prev) => ({
        ...prev,
        organizations: [
          { ...payload, id: makeId('org'), isReferenceDirectoryEntry: true, status: 'active' },
          ...prev.organizations,
        ],
        auditLogs: appendAudit(prev, 'Agregó organización de referencia', payload.name),
      }));
      notify('Organización agregada al directorio de referencia.');
    },
    [updateState, notify]
  );

  const adminToggleOrganizationStatus = useCallback(
    (orgId: string) => {
      updateState((prev) => ({
        ...prev,
        organizations: prev.organizations.map((o) =>
          o.id === orgId ? { ...o, status: o.status === 'active' ? 'archived' : 'active' } : o
        ),
      }));
    },
    [updateState]
  );

  const adminAddTaxonomyTerm = useCallback(
    (group: keyof TaxonomyData, term: string) => {
      const clean = term.trim();
      if (!clean) return;
      updateState((prev) => ({
        ...prev,
        taxonomy: {
          ...prev.taxonomy,
          [group]: Array.from(new Set([...prev.taxonomy[group], clean])),
        },
        auditLogs: appendAudit(prev, `Agregó término en ${group}`, clean),
      }));
      notify(`Término "${clean}" agregado a la taxonomía.`);
    },
    [updateState, notify]
  );

  const adminRemoveTaxonomyTerm = useCallback(
    (group: keyof TaxonomyData, term: string) => {
      updateState((prev) => ({
        ...prev,
        taxonomy: {
          ...prev.taxonomy,
          [group]: prev.taxonomy[group].filter((t) => t !== term),
        },
        auditLogs: appendAudit(prev, `Quitó término en ${group}`, term),
      }));
    },
    [updateState]
  );

  const adminResolveModeration = useCallback(
    (modId: string, resolution: 'approved' | 'removed', note: string) => {
      const item = state.moderationQueue.find((m) => m.id === modId);
      updateState((prev) => {
        let nextCompanies = prev.companies;
        let nextOpps = prev.opportunities;

        if (item?.entityType === 'company') {
          nextCompanies = prev.companies.map((c) =>
            c.id === item.entityId
              ? {
                  ...c,
                  verificationStatus: resolution === 'approved' ? 'verified_demo' : 'rejected',
                  verificationNote: note || (resolution === 'approved' ? 'Aprobado en demo' : 'Rechazado en moderación'),
                }
              : c
          );
        } else if (item?.entityType === 'opportunity' && resolution === 'removed') {
          nextOpps = prev.opportunities.map((o) =>
            o.id === item.entityId ? { ...o, status: 'closed' } : o
          );
        }

        return {
          ...prev,
          companies: nextCompanies,
          opportunities: nextOpps,
          moderationQueue: prev.moderationQueue.map((m) =>
            m.id === modId ? { ...m, status: resolution, resolutionNote: note } : m
          ),
          auditLogs: appendAudit(
            prev,
            resolution === 'approved' ? 'Aprobó en moderación' : 'Rechazó / removió en moderación',
            item?.entityTitle ?? modId
          ),
        };
      });
      notify('Caso de moderación resuelto y registrado en auditoría.');
    },
    [state.moderationQueue, updateState, notify]
  );

  const resetDemoData = useCallback(async () => {
    const fresh = await repository.resetState(createInitialSeedState);
    setState(fresh);
    notify('Datos de demostración restaurados al estado inicial.', 'info');
  }, [repository, notify]);

  const value: TramaContextValue = {
    state,
    isLoading,
    dataMode: repository.mode,
    currentUser,
    activeCompany,
    userCompanies,
    toasts,
    notify,
    dismissToast,
    loginAsDemoBusiness,
    loginAsDemoAdmin,
    loginDemoByEmail,
    logout,
    switchActiveCompany,
    registerUserAndCompany,
    updateCompany,
    addTeamMember,
    recordMatchDecision,
    resetMatchPasses,
    startConversationWithCompany,
    sendMessage,
    markConversationRead,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    toggleOpportunityInterest,
    toggleSaveCompany,
    toggleSaveEvent,
    toggleRegisterEvent,
    toggleEnrollCourse,
    toggleSaveResource,
    toggleJoinCommunity,
    saveDirectorySearch,
    deleteSavedSearch,
    adminSetCompanyVerification,
    adminToggleCompanyFeatured,
    adminUpdateCompanyStatus,
    adminToggleUserStatus,
    adminToggleUserRole,
    adminUpdateOpportunityStatus,
    adminCreateEvent,
    adminToggleEventStatus,
    adminCreateCourse,
    adminToggleCourseStatus,
    adminCreateResource,
    adminToggleResourceStatus,
    adminCreateOrganization,
    adminToggleOrganizationStatus,
    adminAddTaxonomyTerm,
    adminRemoveTaxonomyTerm,
    adminResolveModeration,
    resetDemoData,
  };

  return <TramaContext.Provider value={value}>{children}</TramaContext.Provider>;
};

export function useTrama(): TramaContextValue {
  const ctx = useContext(TramaContext);
  if (!ctx) {
    throw new Error('useTrama must be used within a TramaProvider');
  }
  return ctx;
}
