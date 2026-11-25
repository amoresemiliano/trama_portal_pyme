import React, { useMemo, useState } from 'react';
import { Search, Shield, UserCheck, UserX } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';

export const AdminUsersPage: React.FC = () => {
  const { state, currentUser, adminToggleUserRole, adminToggleUserStatus } = useTrama();
  const [query, setQuery] = useState('');

  const usersWithCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.users
      .map((u) => {
        const companyNames = state.memberships
          .filter((m) => m.userId === u.id)
          .map((m) => state.companies.find((c) => c.id === m.companyId)?.name)
          .filter(Boolean) as string[];
        return { user: u, companyNames };
      })
      .filter(({ user, companyNames }) => {
        if (!q) return true;
        return (
          user.fullName.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          companyNames.some((n) => n.toLowerCase().includes(q))
        );
      });
  }, [state.users, state.memberships, state.companies, query]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#17213A]">Gestión de usuarios y roles</h1>
        <p className="text-sm text-slate-600 mt-1 tabular-nums">
          {state.users.length} cuentas registradas en el entorno demo · Control de acceso y estado.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o empresa..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Empresas vinculadas</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Alta</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {usersWithCompanies.map(({ user, companyNames }) => {
                const isSelf = currentUser?.id === user.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                          style={{ backgroundColor: user.avatarColor }}
                        >
                          {user.avatarInitials}
                        </span>
                        <div>
                          <p className="font-semibold text-[#17213A]">
                            {user.fullName}{' '}
                            {isSelf && <span className="text-xs font-normal text-slate-400">(Vos)</span>}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.email} · {user.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {companyNames.length > 0 ? companyNames.join(', ') : 'Sin empresa asignada'}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">
                      <span className={user.role === 'admin' ? 'text-[#2563EB]' : 'text-slate-700'}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuario PyME'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">
                      <span className={user.status === 'active' ? 'text-[#00A995]' : 'text-[#F26444]'}>
                        {user.status === 'active' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 tabular-nums">
                      {user.createdAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => adminToggleUserRole(user.id)}
                          className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                          {user.role === 'admin' ? 'Pasar a PyME' : 'Hacer Admin'}
                        </button>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => adminToggleUserStatus(user.id)}
                          className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                        >
                          {user.status === 'active' ? (
                            <>
                              <UserX className="w-3.5 h-3.5 text-[#F26444]" />
                              Suspender
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-[#00A995]" />
                              Reactivar
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
