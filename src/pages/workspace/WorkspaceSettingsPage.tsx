import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, RotateCcw } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { getPlanEntitlement } from '../../services/entitlements';

export const WorkspaceSettingsPage: React.FC = () => {
  const { state, currentUser, activeCompany, addTeamMember, resetDemoData, dataMode } = useTrama();
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberTitle, setMemberTitle] = useState('');
  const [error, setError] = useState('');

  if (!activeCompany || !currentUser) return null;

  const plan = getPlanEntitlement(activeCompany.planTier);
  const companyMembers = state.memberships
    .filter((m) => m.companyId === activeCompany.id)
    .map((m) => ({
      membership: m,
      user: state.users.find((u) => u.id === m.userId),
    }))
    .filter((row) => Boolean(row.user));

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (memberName.trim().length < 3 || !memberEmail.includes('@')) {
      setError('Ingresá nombre completo y correo válido del integrante.');
      return;
    }
    addTeamMember(activeCompany.id, memberName, memberEmail, memberTitle || 'Equipo comercial');
    setMemberName('');
    setMemberEmail('');
    setMemberTitle('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#17213A]">Configuración de cuenta y equipo</h1>
        <p className="text-sm text-slate-600">
          Administrá usuarios asociados a tu empresa, plan actual y preferencias del entorno MVP.
        </p>
      </div>

      {/* Account info */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-bold text-[#17213A]">Usuario activo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-slate-400">Nombre</p>
            <p className="font-bold text-[#17213A] mt-0.5">{currentUser.fullName}</p>
          </div>
          <div>
            <p className="text-slate-400">Correo</p>
            <p className="font-semibold text-[#17213A] mt-0.5">{currentUser.email}</p>
          </div>
          <div>
            <p className="text-slate-400">Cargo</p>
            <p className="font-semibold text-[#17213A] mt-0.5">{currentUser.title}</p>
          </div>
        </div>
      </section>

      {/* Multi-user company memberships */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#17213A]">
              Equipo de {activeCompany.name}
            </h2>
            <p className="text-xs text-slate-500">
              Modelo multiusuario preparado para equipos comerciales y de compras ({companyMembers.length}{' '}
              de {plan.limits.maxTeamMembers} en plan {plan.name}).
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {companyMembers.map(({ membership, user }) => (
            <div key={membership.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center"
                  style={{ backgroundColor: user?.avatarColor ?? '#17213A' }}
                >
                  {user?.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#17213A]">{user?.fullName}</p>
                  <p className="text-xs text-slate-500">
                    {user?.email} · {user?.title}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 capitalize">
                {membership.memberRole === 'owner' ? 'Titular' : 'Miembro'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMember} className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-xs font-bold text-[#17213A]">Sumar integrante al equipo (demo)</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Nombre completo"
              className="h-10 px-3 rounded-xl border border-slate-200 text-xs"
            />
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="correo@empresa.ar"
              className="h-10 px-3 rounded-xl border border-slate-200 text-xs"
            />
            <input
              type="text"
              value={memberTitle}
              onChange={(e) => setMemberTitle(e.target.value)}
              placeholder="Cargo (ej: Ventas B2B)"
              className="h-10 px-3 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Agregar integrante
          </button>
        </form>
      </section>

      {/* Plan & Persistence info */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#17213A]">Plan actual: {plan.name}</h2>
            <p className="text-xs text-slate-500">{plan.description}</p>
          </div>
          <Link
            to="/planes"
            className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center"
          >
            Comparar planes
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Modo de datos activo:{' '}
            <strong className="text-[#17213A]">
              {dataMode === 'demo' ? 'Demo persistente en navegador (localStorage)' : 'API PHP/MySQL'}
            </strong>
          </p>
          <button
            type="button"
            onClick={() => void resetDemoData()}
            className="h-9 px-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold inline-flex items-center gap-1.5 self-start cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar estado inicial demo
          </button>
        </div>
      </section>
    </div>
  );
};
