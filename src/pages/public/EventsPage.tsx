import React, { useMemo, useState } from 'react';
import { Bookmark, Calendar, CheckCircle2, MapPin, Search, X } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { ResilientImage } from '../../components/ResilientImage';
import type { EventFormat, EventItem, EventType } from '../../types/domain';

const EVENT_TYPES: ('Todos' | EventType)[] = [
  'Todos',
  'Ronda de negocios',
  'Congreso empresarial',
  'Feria comercial',
  'Networking',
  'Encuentro emprendedor',
  'Jornada sectorial',
];

export const EventsPage: React.FC = () => {
  const { state, toggleSaveEvent, toggleRegisterEvent } = useTrama();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'Todos' | EventType>('Todos');
  const [format, setFormat] = useState<'Todos' | EventFormat>('Todos');
  const [province, setProvince] = useState('Todas');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const activeEvents = useMemo(
    () => state.events.filter((e) => e.status === 'active'),
    [state.events]
  );

  const provinces = useMemo(
    () => Array.from(new Set(activeEvents.map((e) => e.province))).sort(),
    [activeEvents]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeEvents.filter((e) => {
      if (type !== 'Todos' && e.type !== type) return false;
      if (format !== 'Todos' && e.format !== format) return false;
      if (province !== 'Todas' && e.province !== province) return false;
      if (q) {
        return `${e.title} ${e.summary} ${e.organizer} ${e.city} ${e.province} ${e.tags.join(' ')}`
          .toLowerCase()
          .includes(q);
      }
      return true;
    });
  }, [activeEvents, type, format, province, query]);

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-bold text-[#F26444]">Agenda Federal de Negocios</p>
            <h1 className="text-3xl font-extrabold text-[#17213A] tracking-tight">
              Eventos, rondas de negocios y ferias comerciales
            </h1>
            <p className="text-sm text-slate-600">
              Conectá cara a cara o en formato virtual con compradores, cámaras empresariales y
              emprendedores de todo el país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por ciudad, sector, ronda de negocios o temática..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <select
              aria-label="Filtrar por formato"
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="md:col-span-3 h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Todos">Todos los formatos</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Híbrido">Híbrido</option>
            </select>
            <select
              aria-label="Filtrar por provincia"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="md:col-span-3 h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Todas">Todas las provincias</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  type === t
                    ? 'bg-[#17213A] text-white'
                    : 'bg-[#F4F7FB] text-slate-600 hover:text-[#17213A]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600">
          <strong className="font-mono text-[#17213A] tabular-nums">{filtered.length}</strong>{' '}
          eventos en agenda (ejemplos demo)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((evt) => {
            const isSaved = state.savedEventIds.includes(evt.id);
            const isRegistered = state.registeredEventIds.includes(evt.id);
            return (
              <article
                key={evt.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
              >
                <div className="relative aspect-[16/10] bg-[#F4F7FB]">
                  <ResilientImage
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSaveEvent(evt.id)}
                    aria-label="Guardar evento"
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
                      isSaved ? 'bg-[#F26444] text-white' : 'bg-white/95 text-[#17213A]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      <span className="font-sans font-bold text-[#F26444]">{evt.type}</span> ·{' '}
                      {evt.date} · {evt.format}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(evt)}
                      className="text-left text-base font-bold text-[#17213A] hover:text-[#2563EB] leading-snug cursor-pointer"
                    >
                      {evt.title}
                    </button>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.summary}
                    </p>
                    <div className="pt-1 text-xs text-slate-500 space-y-1">
                      <p className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {evt.venue} ({evt.city}, {evt.province})
                        </span>
                      </p>
                      <p className="text-slate-400">
                        Organiza: {evt.organizer} · {evt.costLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => toggleRegisterEvent(evt.id)}
                      className={`flex-1 h-10 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isRegistered
                          ? 'bg-[#00A995] text-white'
                          : 'bg-[#17213A] hover:bg-[#F26444] text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isRegistered ? 'Inscripto (Demo)' : 'Inscribirme'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(evt)}
                      className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#17213A] hover:bg-[#F4F7FB] cursor-pointer"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-[#17213A]/55 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="h-44 relative bg-[#F4F7FB]">
              <ResilientImage
                src={selectedEvent.coverImage}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Cerrar"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-[#17213A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs font-bold text-[#F26444]">
                {selectedEvent.type} · {selectedEvent.format}
              </p>
              <h2 className="text-xl font-extrabold text-[#17213A] leading-snug">
                {selectedEvent.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>
              <div className="p-4 rounded-2xl bg-[#F4F7FB] text-xs space-y-1.5 text-slate-600">
                <p className="inline-flex items-center gap-2 font-semibold text-[#17213A]">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  {selectedEvent.date} · {selectedEvent.time}
                </p>
                <p>
                  <strong className="text-[#17213A]">Lugar:</strong> {selectedEvent.venue} —{' '}
                  {selectedEvent.city}, {selectedEvent.province}
                </p>
                <p>
                  <strong className="text-[#17213A]">Organiza:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong className="text-[#17213A]">Acceso:</strong> {selectedEvent.costLabel} ·{' '}
                  {selectedEvent.spotsAvailable} cupos demo
                </p>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleRegisterEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="h-10 px-5 rounded-xl bg-[#F26444] hover:bg-[#D94E2E] text-white text-xs font-bold cursor-pointer"
                >
                  {state.registeredEventIds.includes(selectedEvent.id)
                    ? 'Cancelar inscripción'
                    : 'Confirmar inscripción demo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
