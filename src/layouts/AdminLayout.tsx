import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Users,
  ShieldCheck,
  Briefcase,
  Calendar,
  GraduationCap,
  Landmark,
  Network,
  Tags,
  Flag,
  PieChart,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { useTrama } from '../context/TramaContext';
import { ToastBar } from '../components/ToastBar';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Tablero general', icon: BarChart3, end: true },
  { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/verificacion', label: 'Verificación', icon: ShieldCheck },
  { to: '/admin/oportunidades', label: 'Oportunidades', icon: Briefcase },
  { to: '/admin/eventos', label: 'Eventos', icon: Calendar },
  { to: '/admin/capacitacion', label: 'Capacitación', icon: GraduationCap },
  { to: '/admin/recursos', label: 'Financiamiento y recursos', icon: Landmark },
  { to: '/admin/organizaciones', label: 'Organizaciones', icon: Network },
  { to: '/admin/taxonomia', label: 'Taxonomía y etiquetas', icon: Tags },
  { to: '/admin/moderacion', label: 'Moderación', icon: Flag },
  { to: '/admin/analitica', label: 'Analítica', icon: PieChart },
];

export const AdminLayout: React.FC = () => {
  const { currentUser, state, loginAsDemoAdmin, logout, resetDemoData } = useTrama();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pendingVerifications = state.companies.filter((c) => c.verificationStatus === 'pending').length;
  const pendingModeration = state.moderationQueue.filter((m) => m.status === 'pending').length;

  const activeNav =
    ADMIN_LINKS.find((l) =>
      l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
    ) ?? ADMIN_LINKS[0];

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
          <BrandMark />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#17213A]">Panel de Administración TRAMA</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Esta área está reservada para administradores autorizados del ecosistema. Desde acá se
              gestionan empresas, verificaciones, moderación, eventos, cursos y métricas.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F7FB] text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-[#17213A]">Simulación de rol administrador (Modo Demo)</p>
            <p>
              En producción este acceso se valida server-side en PHP/MySQL. Para evaluar el MVP podés
              ingresar con la cuenta demo <strong>Sofía Méndez (Admin)</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={loginAsDemoAdmin}
              className="flex-1 h-11 px-5 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Ingresar como Admin Demo
            </button>
            <Link
              to="/"
              className="flex-1 h-11 px-5 rounded-xl border border-slate-200 text-[#17213A] text-sm font-semibold inline-flex items-center justify-center hover:bg-slate-50"
            >
              Volver al portal
            </Link>
          </div>
        </div>
        <ToastBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#17213A] flex">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#17213A] text-white shrink-0 sticky top-0 h-screen">
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" aria-label="TRAMA Inicio">
            <BrandMark size="sm" inverted />
          </Link>
          <span className="text-xs font-medium text-slate-400">Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_LINKS.map((item) => {
            const Icon = item.icon;
            const count =
              item.to === '/admin/verificacion'
                ? pendingVerifications
                : item.to === '/admin/moderacion'
                ? pendingModeration
                : 0;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `h-9 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <span className="inline-flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {count > 0 && (
                  <span className="font-mono text-xs text-[#F4BB45] tabular-nums">{count}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1 text-xs">
          <Link
            to="/espacio"
            className="h-9 px-3 rounded-lg text-slate-300 hover:bg-white/8 flex items-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5" />
            Espacio PyME
          </Link>
          <Link
            to="/"
            className="h-9 px-3 rounded-lg text-slate-300 hover:bg-white/8 flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Portal público
          </Link>
          <button
            type="button"
            onClick={() => void resetDemoData()}
            className="w-full h-9 px-3 rounded-lg text-slate-300 hover:bg-white/8 flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar datos demo
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full h-9 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-[#17213A]/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[#17213A] text-white h-full flex flex-col z-10">
            <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between">
              <BrandMark size="sm" inverted />
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/75"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {ADMIN_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `h-10 px-3 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                        isActive ? 'bg-[#2563EB] text-white' : 'text-slate-300 hover:bg-white/8'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú de administración"
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-[#17213A]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline">Administración</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-bold text-[#17213A] truncate">{activeNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
            <span className="hidden sm:inline font-medium">{currentUser.fullName}</span>
            <Link
              to="/"
              className="h-9 px-3.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center whitespace-nowrap"
            >
              Ver portal
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
