import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useTrama } from '../context/TramaContext';

export const ToastBar: React.FC = () => {
  const { toasts, dismissToast } = useTrama();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.tone === 'success'
            ? CheckCircle2
            : toast.tone === 'warning'
            ? AlertTriangle
            : Info;
        const accent =
          toast.tone === 'success'
            ? 'text-[#00A995]'
            : toast.tone === 'warning'
            ? 'text-[#F4BB45]'
            : 'text-[#2563EB]';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-[#17213A] text-white px-4 py-3 rounded-xl shadow-lg border border-white/10 text-sm"
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${accent}`} />
            <p className="flex-1 leading-snug text-white/95">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Cerrar aviso"
              className="text-white/60 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
