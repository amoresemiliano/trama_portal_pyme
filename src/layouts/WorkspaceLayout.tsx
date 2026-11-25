import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  HeartHandshake,
  Users,
  MessageSquare,
  Briefcase,
  Bookmark,
  Calendar,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { useTrama } from '../context/TramaContext';
import { ToastBar } from '../components/ToastBar';

const WORKSPACE_LINKS = [
  { to: '/espacio', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/espacio/perfil', label: 'Mi perfil empresarial', icon: Building2 },
  { to: '/espacio/match', label: 'Match B2B', icon: HeartHandshake },
  { to: '/espacio/conexiones', label: 'Conexiones', icon: Users },
  { to: '/espacio/mensajes', label: 'Mensajería', icon: MessageSquare },
  { to: '/espacio/oportunidades', label: 'Mis oportunidades', icon: Briefcase },
  { to: '/espacio/guardados', label: 'Empresas guardadas', icon: Bookmark },
  { to: '/espacio/agenda', label: 'Eventos y recursos', icon: Calendar },
  { to: '/espacio/configuracion', label: 'Configuración', icon: Settings },
];

export const WorkspaceLayout: React.FC = () => {
  const { currentUser, activeCompany, userCompanies, switchActiveCompany, state, loginAsDemoBusiness, logout } = useTrama();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadMessagesCount = activeCompany
    ? state.messages.filter(
        (m) =>
          !m.read &&
          m.senderCompanyId !== activeCompany.id &&
          state.conversations.some(
            (cv) => cv.id === m.conversationId && cv.participantCompanyIds.includes(activeCompany.id)
          )
      ).length
    : 0;

  const activeNav =
    WORKSPACE_LINKS.find((l) =>
      l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
    ) ?? WORKSPACE_LINKS[0];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
          <BrandMark />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#17213A]">Ingresá a tu Espacio Empresarial</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gestioná el perfil de tu empresa, descubrí matches complementarios, respondé mensajes
              y publicá oportunidades comerciales en toda Argentina.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F7FB] text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-[#17213A]">Acceso rápido de demostración local</p>
            <p>
              Podés probar el espacio de inmediato con la empresa demo <strong>Altiplano Alimentos</strong> o registrar tu propia empresa gratis.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={loginAsDemoBusiness}
              className="flex-1 h-11 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Entrar como PyME demo
            </button>
            <Link
              to="/auth?mode=register"
              className="flex-1 h-11 px-5 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
            >
              Registrar mi PyME
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-[#17213A] inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al portal público
            </Link>
            <Link to="/auth" className="text-[#2563EB] font-medium hover:underline">
              Iniciar sesión con correo
            </Link>
          </div>
        </div>
        <ToastBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#17213A] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <Link to="/" aria-label="Volver al portal público">
            <BrandMark size="sm" />
          </Link>
        </div>

        {/* Active company selector */}
        {activeCompany && (
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0"
                style={{ backgroundColor: activeCompany.brandColor }}
              >
                {activeCompany.logoInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#17213A] truncate">{activeCompany.name}</p>
                <p className="text-xs text-slate-500 truncate">{activeCompany.location.province}</p>
              </div>
            </div>
            {userCompanies.length > 1 && (
              <select
                aria-label="Cambiar empresa activa"
                value={activeCompany.id}
                onChange={(e) => switchActiveCompany(e.target.value)}
                className="mt-2.5 w-full h-9 px-2.5 text-xs rounded-lg border border-slate-200 bg-[#F4F7FB] text-[#17213A]"
              >
                {userCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {WORKSPACE_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `h-10 px-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#17213A] text-white'
                      : 'text-slate-600 hover:bg-[#F4F7FB] hover:text-[#17213A]'
                  }`
                }
              >
                <span className="inline-flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.to === '/espacio/mensajes' && unreadMessagesCount > 0 && (
                  <span className="text-xs font-mono font-bold text-[#F26444] tabular-nums">
                    {unreadMessagesCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <Link
            to="/"
            className="h-9 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-[#F4F7FB] flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Portal público
          </Link>
          <Link
            to="/admin"
            className="h-9 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-[#F4F7FB] flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            Panel Admin
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full h-9 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-[#D94E2E] hover:bg-red-50 flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión demo
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-[#17213A]/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col z-10">
            <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
              <BrandMark size="sm" />
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {WORKSPACE_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `h-11 px-3 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
                        isActive ? 'bg-[#17213A] text-white' : 'text-slate-700 hover:bg-[#F4F7FB]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200 space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="block text-sm font-medium text-slate-600 py-1"
              >
                ← Volver al portal público
              </Link>
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className="block text-sm font-medium text-[#2563EB] py-1"
              >
                Ir a Panel Admin
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir navegación del espacio"
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-[#17213A]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline whitespace-nowrap">Espacio PyME</span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>
              <span className="font-bold text-[#17213A] truncate">{activeNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeCompany && (
              <Link
                to={`/empresa/${activeCompany.slug}`}
                className="hidden sm:inline-flex h-9 px-3.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] items-center whitespace-nowrap"
              >
                Ver perfil público
              </Link>
            )}
            <Link
              to="/espacio/oportunidades?new=1"
              className="h-9 px-4 rounded-lg bg-[#F26444] hover:bg-[#D94E2E] text-white text-xs font-semibold inline-flex items-center whitespace-nowrap transition-colors"
            >
              Publicar oportunidad
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastBar />
    </div>
  );
};
