import React from 'react';
import { MatchDeckExperience } from '../../components/MatchDeckExperience';

export const WorkspaceMatchPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#17213A]">Match B2B para tu empresa</h1>
        <p className="text-sm text-slate-600">
          Deslizá o usá los botones para evaluar empresas complementarias. Cuando el interés es
          mutuo, se habilita la conversación directa.
        </p>
      </div>
      <MatchDeckExperience compact />
    </div>
  );
};
