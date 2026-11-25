import React, { useState } from 'react';
import { Plus, Archive, RotateCcw, X } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { MEDIA } from '../../data/mediaAssets';
import type { CourseItem, CourseTopic } from '../../types/domain';

const TOPICS: CourseTopic[] = [
  'IA y automatización',
  'Transformación digital',
  'Marketing',
  'Finanzas',
  'Liderazgo',
  'Ventas',
  'Comercio exterior',
  'Sustentabilidad',
  'Emprendedurismo',
];

export const AdminCoursesPage: React.FC = () => {
  const { state, adminCreateCourse, adminToggleCourseStatus } = useTrama();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<CourseTopic>('IA y automatización');
  const [provider, setProvider] = useState('Academia TRAMA (Demo)');
  const [instructor, setInstructor] = useState('Lic. Laura Ferreyra');
  const [duration, setDuration] = useState('6 horas');
  const [level, setLevel] = useState<CourseItem['level']>('Intermedio');
  const [format, setFormat] = useState<CourseItem['format']>('On-demand');
  const [costLabel, setCostLabel] = useState('Incluido en membresía demo');
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    adminCreateCourse({
      title: title.trim(),
      summary: summary.trim() || 'Programa práctico orientado a equipos comerciales y dirección PyME.',
      topic,
      provider,
      instructor,
      duration,
      level,
      format,
      costLabel,
      certificateIncluded: true,
      tags: [topic, level],
      coverImage: MEDIA.CAPACITACION,
    });
    setTitle('');
    setSummary('');
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213A]">Catálogo de capacitación</h1>
          <p className="text-sm text-slate-600 mt-1 tabular-nums">
            {state.courses.filter((c) => c.status === 'active').length} cursos activos ·{' '}
            {state.courses.length} en catálogo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancelar' : 'Nuevo curso'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
        >
          <h2 className="text-base font-bold text-[#17213A]">Agregar programa de capacitación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Costos y presupuestos para PyMEs industriales"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Temática</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as CourseTopic)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institución / Proveedor</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Docente</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duración</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nivel</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseItem['level'])}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Inicial">Inicial</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidad</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as CourseItem['format'])}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="On-demand">On-demand</option>
                <option value="En vivo">En vivo</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Condición</label>
              <input
                type="text"
                value={costLabel}
                onChange={(e) => setCostLabel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resumen</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#00A995] hover:bg-[#009280] text-white text-xs font-semibold cursor-pointer"
            >
              Publicar curso
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F4F7FB] text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Curso</th>
                <th className="py-3 px-4">Temática</th>
                <th className="py-3 px-4">Modalidad y duración</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {state.courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[#17213A]">{course.title}</p>
                    <p className="text-xs text-slate-500">
                      {course.provider} · {course.instructor}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">{course.topic}</td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {course.format} · {course.duration} · {course.level}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    <span className={course.status === 'active' ? 'text-[#00A995]' : 'text-slate-400'}>
                      {course.status === 'active' ? 'Activo' : 'Archivado'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => adminToggleCourseStatus(course.id)}
                      className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {course.status === 'active' ? (
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
