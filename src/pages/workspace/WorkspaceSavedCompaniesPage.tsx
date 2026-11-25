import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrama } from '../../context/TramaContext';
import { CompanyCard } from '../../components/CompanyCard';

export const WorkspaceSavedCompaniesPage: React.FC = () => {
  const { state, toggleSaveCompany, startConversationWithCompany } = useTrama();
  const navigate = useNavigate();

  const savedCompanies = state.companies.filter((c) => state.savedCompanyIds.includes(c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#17213A]">Empresas guardadas</h1>
        <p className="text-sm text-slate-600">
          Seguí de cerca a proveedores, potenciales clientes o aliados estratégicos que te interesaron.
        </p>
      </div>

      {savedCompanies.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <h2 className="text-lg font-bold text-[#17213A]">Tu lista de guardados está vacía</h2>
          <p className="text-sm text-slate-500">
            Explorá el directorio o Match B2B y tocá “Guardar” para armar tu cartera de contactos.
          </p>
          <Link
            to="/directorio"
            className="inline-flex h-10 px-5 rounded-xl bg-[#17213A] text-white text-xs font-bold items-center"
          >
            Explorar directorio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isSaved
              onToggleSave={toggleSaveCompany}
              onConnect={(id) => {
                const convId = startConversationWithCompany(id, 'Desde empresas guardadas');
                navigate(`/espacio/mensajes?conv=${convId}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
