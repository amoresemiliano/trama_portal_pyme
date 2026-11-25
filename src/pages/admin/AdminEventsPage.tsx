import React, { useState } from 'react';
import { Plus, Calendar, Archive, RotateCcw, X } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { MEDIA } from '../../data/mediaAssets';
import type { EventFormat, EventType } from '../../types/domain';

const EVENT_TYPES: EventType[] = [
  'Ronda de negocios',
  'Congreso empresarial',
  'Feria comercial',
  'Networking',
  'Encuentro emprendedor',
  'Jornada sectorial',
];

export const AdminEventsPage: React.FC = () => {
  const { state, adminCreateEvent, adminToggleEventStatus } = useTrama();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('Ronda de negocios');
  const [format, setFormat] = useState<EventFormat>('Presencial');
  const [date, setDate] = useState('2026-06-18');
  const [time, setTime] = useState('09:30 hs');
  const [province, setProvince] = useState('Córdoba');
  const [city, setCity] = useState('Córdoba Capital');
  const [venue, setVenue] = useState('Centro de Convenciones');
  const [organizer, setOrganizer] = useState('TRAMA + Cámara Regional (Demo)');
  const [costLabel, setCostLabel] = useState('Gratuito con inscripción');
  const [spotsAvailable, setSpotsAvailable] = useState(80);
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    adminCreateEvent({
      title: title.trim(),
      summary: summary.trim() || 'Encuentro empresarial orientado a vinculación comercial entre PyMEs.',
      description:
        summary.trim() ||
        'Actividad organizada en el ecosistema TRAMA con agenda de reuniones B2B y paneles sectoriales.',
      type,
      format,
      date,
      time,
      province,
      city,
      venue,
      organizer,
      costLabel,
      spotsAvailable,
      tags: [type, province],
      coverImage: MEDIA.EVENTO,
    });
    setTitle('');
    setSummary('');
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213A]">Gestión de eventos y rondas</h1>
          <p className="text-sm text-slate-600 mt-1 tabular-nums">
            {state.events.filter((e) => e.status === 'active').length} activos ·{' '}
            {state.events.length} totales en agenda.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="h-10 px-4 rounded-xl bg-[#F26444] hover:bg-[#DC5133] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancelar' : 'Nuevo evento'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
        >
          <h2 className="text-base font-bold text-[#17213A]">Publicar nuevo evento demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Ronda Multisectorial de Proveedores Litoral"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidad</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as EventFormat)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horario</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Provincia</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad / Sede</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organizador</label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lugar</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Acceso</label>
              <input
                type="text"
                value={costLabel}
                onChange={(e) => setCostLabel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cupos</label>
              <input
                type="number"
                min={10}
                value={spotsAvailable}
                onChange={(e) => setSpotsAvailable(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resumen</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Breve descripción de los objetivos del evento..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
            >
              Guardar y publicar evento
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Evento</th>
                <th className="py-3 px-4">Tipo y modalidad</th>
                <th className="py-3 px-4">Fecha y sede</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {state.events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#17213A]">{ev.title}</p>
                    <p className="text-xs text-slate-500">{ev.organizer}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    {ev.type} · {ev.format}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    <span className="font-mono tabular-nums inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      {ev.date}
                    </span>{' '}
                    · {ev.city}, {ev.province}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    <span className={ev.status === 'active' ? 'text-[#00A995]' : 'text-slate-400'}>
                      {ev.status === 'active' ? 'Activo' : 'Archivado'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => adminToggleEventStatus(ev.id)}
                      className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {ev.status === 'active' ? (
                        <>
                          <Archive className="w-3.5 h-3.5" /> Archivar
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" /> Activar
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
