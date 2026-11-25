import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, GraduationCap, Landmark, Network, Users, Layers } from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { MEDIA } from '../../data/mediaAssets';
import { ResilientImage } from '../../components/ResilientImage';

export const ResourcesHubPage: React.FC = () => {
  const { state } = useTrama();

  const sections = [
    {
      title: 'Financiamiento y programas',
      description: 'Directorio de referencia de bancos públicos, BICE, SGR, organismos internacionales y programas provinciales.',
      count: `${state.resources.length} recursos`,
      to: '/financiamiento',
      icon: Landmark,
      color: '#00A995',
    },
    {
      title: 'Capacitación y cursos',
      description: 'Formación práctica en IA, transformación digital, comercio exterior, ventas B2B, finanzas y liderazgo.',
      count: `${state.courses.length} cursos`,
      to: '/capacitacion',
      icon: GraduationCap,
      color: '#2563EB',
    },
    {
      title: 'Eventos y rondas de negocios',
      description: 'Agenda federal de congresos, ferias sectoriales, desayunos B2B y encuentros emprendedores.',
      count: `${state.events.length} eventos`,
      to: '/eventos',
      icon: Calendar,
      color: '#F26444',
    },
    {
      title: 'Cámaras y organizaciones',
      description: 'Referencia de CAME, UIA, CAC, ADIMRA, FEBA, IDEA, universidades y polos tecnológicos de Argentina.',
      count: `${state.organizations.length} instituciones`,
      to: '/camaras',
      icon: Network,
      color: '#17213A',
    },
    {
      title: 'Comunidades empresariales',
      description: 'Espacios temáticos por sector y región para compartir fletes, buenas prácticas y consultas reales.',
      count: `${state.communities.length} comunidades`,
      to: '/comunidades',
      icon: Users,
      color: '#D97706',
    },
    {
      title: 'Planes y membresías',
      description: 'Estructura freemium pensada para emprendedores, PyMEs en expansión, grandes compradores e instituciones.',
      count: '4 niveles',
      to: '/planes',
      icon: Layers,
      color: '#2563EB',
    },
  ];

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center space-y-4">
            <p className="text-xs font-bold text-[#008777]">Centro de Recursos Institucionales</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17213A] tracking-tight leading-tight">
              Todo lo que acompaña el crecimiento de tu PyME en un solo lugar
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Además de conectar empresas, TRAMA centraliza el acceso a formación ejecutiva, agenda
              de negocios, financiamiento orientativo, cámaras empresarias y comunidades sectoriales.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/financiamiento"
                className="h-11 px-5 rounded-xl bg-[#00A995] hover:bg-[#008777] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors"
              >
                Explorar financiamiento
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/capacitacion"
                className="h-11 px-5 rounded-xl border border-slate-200 text-[#17213A] hover:bg-[#F4F7FB] text-sm font-semibold inline-flex items-center"
              >
                Ver cursos
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 min-h-[260px] bg-[#F4F7FB]">
            <ResilientImage
              src={MEDIA.CAPACITACION}
              alt="Seminario y capacitación para PyMEs argentinas"
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.to}
                to={sec.to}
                className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: sec.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400 tabular-nums">
                      {sec.count}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#17213A] group-hover:text-[#2563EB] transition-colors">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{sec.description}</p>
                </div>
                <span className="text-xs font-bold text-[#2563EB] inline-flex items-center gap-1">
                  Ingresar <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
