import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, GraduationCap, Search } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { ResilientImage } from '../../components/ResilientImage';
import type { CourseTopic } from '../../types/domain';

const TOPICS: ('Todos' | CourseTopic)[] = [
  'Todos',
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

export const TrainingPage: React.FC = () => {
  const { state, toggleEnrollCourse } = useTrama();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<'Todos' | CourseTopic>(
    (searchParams.get('topic') as CourseTopic) || 'Todos'
  );
  const [level, setLevel] = useState('Todos');

  const activeCourses = useMemo(
    () => state.courses.filter((c) => c.status === 'active'),
    [state.courses]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeCourses.filter((c) => {
      if (topic !== 'Todos' && c.topic !== topic) return false;
      if (level !== 'Todos' && c.level !== level) return false;
      if (q) {
        return `${c.title} ${c.summary} ${c.provider} ${c.instructor} ${c.topic}`
          .toLowerCase()
          .includes(q);
      }
      return true;
    });
  }, [activeCourses, topic, level, query]);

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-bold text-[#2563EB]">Capacitación y Formación PyME</p>
            <h1 className="text-3xl font-extrabold text-[#17213A] tracking-tight">
              Cursos prácticos para profesionalizar y escalar tu negocio
            </h1>
            <p className="text-sm text-slate-600">
              Inteligencia artificial aplicada, finanzas, comercio exterior, ventas B2B,
              sustentabilidad y liderazgo para dueños y equipos PyME.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar curso por tema, habilidad o docente..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <select
              aria-label="Filtrar por nivel"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="md:col-span-4 h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="Todos">Todos los niveles</option>
              <option value="Inicial">Nivel Inicial</option>
              <option value="Intermedio">Nivel Intermedio</option>
              <option value="Avanzado">Nivel Avanzado</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  topic === t
                    ? 'bg-[#2563EB] text-white'
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
          cursos disponibles en catálogo demo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => {
            const isEnrolled = state.enrolledCourseIds.includes(course.id);
            return (
              <article
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
              >
                <div className="aspect-[16/10] bg-[#F4F7FB]">
                  <ResilientImage
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-[#2563EB]">{course.topic}</span> ·{' '}
                      {course.level} · {course.format}
                    </p>
                    <h2 className="text-base font-bold text-[#17213A] leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">{course.summary}</p>
                    <div className="pt-2 text-xs text-slate-500 space-y-0.5">
                      <p>
                        <strong className="text-[#17213A]">Docente:</strong> {course.instructor}
                      </p>
                      <p className="text-slate-400">
                        {course.provider} · {course.duration}
                      </p>
                      <p className="text-slate-400">
                        {course.costLabel}
                        {course.certificateIncluded ? ' · Incluye certificado (demo)' : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleEnrollCourse(course.id)}
                    className={`w-full h-10 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isEnrolled
                        ? 'bg-[#00A995] text-white'
                        : 'bg-[#17213A] hover:bg-[#2563EB] text-white'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Inscripto en Mi Espacio
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        Anotarme al curso
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
