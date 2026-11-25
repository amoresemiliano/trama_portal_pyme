import React from 'react';
import { Link } from 'react-router-dom';
import { MatchDeckExperience } from '../../components/MatchDeckExperience';
import { useTrama } from '../../context/TramaContext';

export const MatchPublicPage: React.FC = () => {
  const { currentUser } = useTrama();

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-bold text-[#F26444]">Match B2B Inteligente</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17213A] tracking-tight">
              Descubrí tu próximo proveedor, cliente o aliado estratégico
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Evaluamos necesidades complementarias, cadena de valor y cobertura en Argentina para
              mostrarte conexiones con verdadero potencial comercial.
            </p>
          </div>
          {!currentUser && (
            <Link
              to="/auth?mode=register"
              className="h-11 px-5 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-sm font-semibold inline-flex items-center whitespace-nowrap shrink-0 transition-colors"
            >
              Personalizar con mi PyME
            </Link>
          )}
        </div>

        <MatchDeckExperience />
      </div>
    </div>
  );
};
