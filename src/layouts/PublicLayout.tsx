import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { useTrama } from '../context/TramaContext';
import { ToastBar } from '../components/ToastBar';

const NAV_ITEMS = [
  { to: '/directorio', label: 'Directorio' },
  { to: '/match', label: 'Match B2B' },
  { to: '/oportunidades', label: 'Oportunidades' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/recursos', label: 'Recursos' },
];

export const PublicLayout: React.FC = () => {
  const { currentUser } = useTrama();
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryCta = !currentUser
    ? { to: '/auth?mode=register', label: 'Sumá tu PyME' }
    : currentUser.role === 'admin'
    ? { to: '/admin', label: 'Panel Admin' }
    : { to: '/espacio', label: 'Mi Espacio' };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17213A]">
      {/* Strictly 3-zone, 1-row Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand mark only */}
          <Link to="/" aria-label="TRAMA Inicio" className="shrink-0">
            <BrandMark />
          </Link>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                    isActive
                      ? 'text-[#17213A] font-semibold border-[#F26444]'
                      : 'border-transparent hover:text-[#17213A] hover:border-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: 1 primary action (+ mobile menu button on small viewports) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={primaryCta.to}
              className="h-10 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors whitespace-nowrap shrink-0"
            >
              {primaryCta.label}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className="md:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-[#17213A] cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-30 bg-white overflow-y-auto border-t border-slate-200 px-5 py-6">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Explorar ecosistema</p>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { to: '/', label: 'Inicio' },
                  { to: '/directorio', label: 'Directorio de empresas' },
                  { to: '/match', label: 'Match B2B' },
                  { to: '/oportunidades', label: 'Oportunidades comerciales' },
                  { to: '/eventos', label: 'Eventos y rondas' },
                  { to: '/capacitacion', label: 'Capacitación y cursos' },
                  { to: '/financiamiento', label: 'Financiamiento y programas' },
                  { to: '/recursos', label: 'Recursos institucionales' },
                  { to: '/camaras', label: 'Cámaras y organizaciones' },
                  { to: '/comunidades', label: 'Comunidades empresariales' },
                  { to: '/planes', label: 'Planes y membresías' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="h-11 px-3 rounded-xl text-base font-medium text-[#17213A] hover:bg-[#F4F7FB] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <p className="text-xs font-semibold text-slate-400">Accesos de plataforma</p>
              <Link
                to="/espacio"
                onClick={() => setMobileOpen(false)}
                className="w-full h-11 rounded-xl bg-[#17213A] text-white text-sm font-semibold flex items-center justify-center"
              >
                Espacio Empresarial (PyME)
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="w-full h-11 rounded-xl border border-slate-200 text-[#17213A] text-sm font-semibold flex items-center justify-center"
              >
                Panel de Administración
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="w-full h-11 rounded-xl bg-[#F4F7FB] text-[#2563EB] text-sm font-semibold flex items-center justify-center"
              >
                Ingresar o registrar mi empresa
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#17213A] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <BrandMark size="lg" inverted />
              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                Conectamos empresas. Multiplicamos oportunidades. El ecosistema digital argentino
                para PyMEs, emprendedores, proveedores, grandes compradores e instituciones.
              </p>
              <p className="text-xs text-slate-400">
                Impulsado por <strong className="text-white font-semibold">Vegen Digital</strong> ·
                Lanzamiento Argentina · Proyección Latinoamérica.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3.5">Negocios</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/directorio" className="hover:text-white transition-colors">
                    Directorio de empresas
                  </Link>
                </li>
                <li>
                  <Link to="/match" className="hover:text-white transition-colors">
                    Match B2B inteligente
                  </Link>
                </li>
                <li>
                  <Link to="/oportunidades" className="hover:text-white transition-colors">
                    Oportunidades comerciales
                  </Link>
                </li>
                <li>
                  <Link to="/planes" className="hover:text-white transition-colors">
                    Planes y membresías
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3.5">Ecosistema</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/eventos" className="hover:text-white transition-colors">
                    Eventos y rondas
                  </Link>
                </li>
                <li>
                  <Link to="/capacitacion" className="hover:text-white transition-colors">
                    Capacitación y cursos
                  </Link>
                </li>
                <li>
                  <Link to="/financiamiento" className="hover:text-white transition-colors">
                    Financiamiento y programas
                  </Link>
                </li>
                <li>
                  <Link to="/camaras" className="hover:text-white transition-colors">
                    Cámaras y organizaciones
                  </Link>
                </li>
                <li>
                  <Link to="/comunidades" className="hover:text-white transition-colors">
                    Comunidades sectoriales
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-3.5">Accesos</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/auth" className="hover:text-white transition-colors">
                    Ingresar / Registrarse
                  </Link>
                </li>
                <li>
                  <Link to="/espacio" className="hover:text-white transition-colors">
                    Espacio Empresarial PyME
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white transition-colors">
                    Panel de Administración
                  </Link>
                </li>
                <li>
                  <Link to="/recursos" className="hover:text-white transition-colors">
                    Centro de recursos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} TRAMA — Powered by Vegen Digital. Entorno MVP con datos
              sintéticos de demostración y persistencia local.
            </p>
            <p>
              Las organizaciones de referencia (CAME, UIA, BNA, BID, etc.) se muestran a título
              informativo sin implicar alianza oficial.
            </p>
          </div>
        </div>
      </footer>

      <ToastBar />
    </div>
  );
};
