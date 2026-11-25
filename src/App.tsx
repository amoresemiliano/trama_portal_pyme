/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { TramaProvider } from './context/TramaContext';
import { PublicLayout } from './layouts/PublicLayout';
import { WorkspaceLayout } from './layouts/WorkspaceLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Portal (13 pages)
import { HomePage } from './pages/public/HomePage';
import { DirectoryPage } from './pages/public/DirectoryPage';
import { CompanyProfilePage } from './pages/public/CompanyProfilePage';
import { MatchPublicPage } from './pages/public/MatchPublicPage';
import { OpportunitiesPage } from './pages/public/OpportunitiesPage';
import { EventsPage } from './pages/public/EventsPage';
import { TrainingPage } from './pages/public/TrainingPage';
import { FundingPage } from './pages/public/FundingPage';
import { ResourcesHubPage } from './pages/public/ResourcesHubPage';
import { ChambersPage } from './pages/public/ChambersPage';
import { CommunitiesPage } from './pages/public/CommunitiesPage';
import { PricingPage } from './pages/public/PricingPage';
import { AuthOnboardingPage } from './pages/public/AuthOnboardingPage';

// Business Workspace (9 pages)
import { WorkspaceDashboardPage } from './pages/workspace/WorkspaceDashboardPage';
import { WorkspaceProfilePage } from './pages/workspace/WorkspaceProfilePage';
import { WorkspaceMatchPage } from './pages/workspace/WorkspaceMatchPage';
import { WorkspaceConnectionsPage } from './pages/workspace/WorkspaceConnectionsPage';
import { WorkspaceMessagesPage } from './pages/workspace/WorkspaceMessagesPage';
import { WorkspaceOpportunitiesPage } from './pages/workspace/WorkspaceOpportunitiesPage';
import { WorkspaceSavedCompaniesPage } from './pages/workspace/WorkspaceSavedCompaniesPage';
import { WorkspaceAgendaPage } from './pages/workspace/WorkspaceAgendaPage';
import { WorkspaceSettingsPage } from './pages/workspace/WorkspaceSettingsPage';

// Admin Panel (12 pages)
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminOpportunitiesPage } from './pages/admin/AdminOpportunitiesPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminResourcesPage } from './pages/admin/AdminResourcesPage';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { AdminTaxonomyPage } from './pages/admin/AdminTaxonomyPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <TramaProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Portal */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="directorio" element={<DirectoryPage />} />
            <Route path="empresa/:slug" element={<CompanyProfilePage />} />
            <Route path="empresas/:slug" element={<CompanyProfilePage />} />
            <Route path="match" element={<MatchPublicPage />} />
            <Route path="oportunidades" element={<OpportunitiesPage />} />
            <Route path="eventos" element={<EventsPage />} />
            <Route path="capacitacion" element={<TrainingPage />} />
            <Route path="financiamiento" element={<FundingPage />} />
            <Route path="recursos" element={<ResourcesHubPage />} />
            <Route path="camaras" element={<ChambersPage />} />
            <Route path="comunidades" element={<CommunitiesPage />} />
            <Route path="planes" element={<PricingPage />} />
            <Route path="auth" element={<AuthOnboardingPage />} />
          </Route>

          {/* Private Business Workspace */}
          <Route path="/espacio" element={<WorkspaceLayout />}>
            <Route index element={<WorkspaceDashboardPage />} />
            <Route path="perfil" element={<WorkspaceProfilePage />} />
            <Route path="match" element={<WorkspaceMatchPage />} />
            <Route path="conexiones" element={<WorkspaceConnectionsPage />} />
            <Route path="mensajes" element={<WorkspaceMessagesPage />} />
            <Route path="oportunidades" element={<WorkspaceOpportunitiesPage />} />
            <Route path="guardados" element={<WorkspaceSavedCompaniesPage />} />
            <Route path="agenda" element={<WorkspaceAgendaPage />} />
            <Route path="configuracion" element={<WorkspaceSettingsPage />} />
          </Route>

          {/* Administration Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="empresas" element={<AdminCompaniesPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
            <Route path="verificacion" element={<AdminVerificationPage />} />
            <Route path="oportunidades" element={<AdminOpportunitiesPage />} />
            <Route path="eventos" element={<AdminEventsPage />} />
            <Route path="capacitacion" element={<AdminCoursesPage />} />
            <Route path="recursos" element={<AdminResourcesPage />} />
            <Route path="organizaciones" element={<AdminOrganizationsPage />} />
            <Route path="taxonomia" element={<AdminTaxonomyPage />} />
            <Route path="moderacion" element={<AdminModerationPage />} />
            <Route path="analitica" element={<AdminAnalyticsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TramaProvider>
  );
}
