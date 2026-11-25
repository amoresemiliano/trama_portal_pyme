import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, GraduationCap, Landmark, Trash2 } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';

export const WorkspaceAgendaPage: React.FC = () => {
  const {
    state,
    toggleSaveEvent,
    toggleRegisterEvent,
    toggleEnrollCourse,
    toggleSaveResource,
  } = useTrama();

  const savedEvents = state.events.filter(
    (e) => state.savedEventIds.includes(e.id) || state.registeredEventIds.includes(e.id)
  );
  const enrolledCourses = state.courses.filter((c) => state.enrolledCourseIds.includes(c.id));
  const savedResources = state.resources.filter((r) => state.savedResourceIds.includes(r.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#17213A]">Eventos, cursos y recursos</h1>
        <p className="text-sm text-slate-600">
          Tu agenda personal de rondas de negocios, capacitaciones y guías de financiamiento.
        </p>
      </div>

      {/* Events */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#17213A] inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F26444]" />
            Eventos guardados e inscripciones ({savedEvents.length})
          </h2>
          <Link to="/eventos" className="text-xs font-bold text-[#2563EB] hover:underline">
            Explorar agenda
          </Link>
        </div>
        {savedEvents.length === 0 ? (
          <p className="text-xs text-slate-500">Todavía no guardaste eventos.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {savedEvents.map((evt) => {
              const registered = state.registeredEventIds.includes(evt.id);
              return (
                <div
                  key={evt.id}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-mono text-slate-500 tabular-nums">
                      {evt.date} · {evt.format} · {evt.province}
                      {registered ? ' · Inscripto (Demo)' : ''}
                    </p>
                    <p className="text-sm font-bold text-[#17213A]">{evt.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRegisterEvent(evt.id)}
                      className="h-8 px-3 rounded-lg bg-[#F4F7FB] text-xs font-semibold text-[#17213A] hover:bg-slate-200/80 cursor-pointer"
                    >
                      {registered ? 'Cancelar inscripción' : 'Inscribirme'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaveEvent(evt.id)}
                      aria-label="Quitar evento"
                      className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Courses */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#17213A] inline-flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            Mis cursos ({enrolledCourses.length})
          </h2>
          <Link to="/capacitacion" className="text-xs font-bold text-[#2563EB] hover:underline">
            Ver catálogo
          </Link>
        </div>
        {enrolledCourses.length === 0 ? (
          <p className="text-xs text-slate-500">Todavía no te anotaste en cursos.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {enrolledCourses.map((crs) => (
              <div
                key={crs.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-[#2563EB] font-semibold">
                    {crs.topic} · {crs.duration}
                  </p>
                  <p className="text-sm font-bold text-[#17213A]">{crs.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEnrollCourse(crs.id)}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer shrink-0"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resources */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#17213A] inline-flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#00A995]" />
            Recursos y financiamiento guardados ({savedResources.length})
          </h2>
          <Link to="/financiamiento" className="text-xs font-bold text-[#008777] hover:underline">
            Explorar guías
          </Link>
        </div>
        {savedResources.length === 0 ? (
          <p className="text-xs text-slate-500">No guardaste recursos todavía.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {savedResources.map((res) => (
              <div
                key={res.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-[#008777] font-semibold">
                    {res.category} · {res.institution}
                  </p>
                  <p className="text-sm font-bold text-[#17213A]">{res.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSaveResource(res.id)}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer shrink-0"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
