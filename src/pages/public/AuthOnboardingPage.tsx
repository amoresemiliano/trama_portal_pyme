import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useTrama } from '../../context/TramaContext';
import { MEDIA, getIndustryImage } from '../../data/mediaAssets';
import { ResilientImage } from '../../components/ResilientImage';
import type {
  BusinessOperationType,
  CommercialModel,
  CompanySize,
  ExportReadiness,
  GeoLocation,
} from '../../types/domain';

const PROVINCES: { name: string; region: GeoLocation['region'] }[] = [
  { name: 'CABA', region: 'AMBA' },
  { name: 'Buenos Aires', region: 'AMBA' },
  { name: 'Córdoba', region: 'Centro' },
  { name: 'Santa Fe', region: 'Litoral' },
  { name: 'Mendoza', region: 'Cuyo' },
  { name: 'Tucumán', region: 'NOA' },
  { name: 'Salta', region: 'NOA' },
  { name: 'Neuquén', region: 'Patagonia' },
  { name: 'Río Negro', region: 'Patagonia' },
  { name: 'Entre Ríos', region: 'Litoral' },
  { name: 'Misiones', region: 'NEA' },
  { name: 'San Juan', region: 'Cuyo' },
  { name: 'Chubut', region: 'Patagonia' },
  { name: 'San Luis', region: 'Cuyo' },
];

const BRAND_COLORS = ['#F26444', '#2563EB', '#00A995', '#17213A', '#D97706'];

const COVER_OPTIONS = [
  { label: 'Taller colaborativo PyME', src: MEDIA.HERO_PYMES },
  { label: 'Alimentos y producción', src: MEDIA.ALIMENTOS },
  { label: 'Manufactura y metalmecánica', src: MEDIA.MANUFACTURA },
  { label: 'Gastronomía y comercio', src: MEDIA.GASTRONOMIA },
  { label: 'Tecnología y oficina', src: MEDIA.TECNOLOGIA },
  { label: 'Logística y distribución', src: MEDIA.LOGISTICA },
  { label: 'Packaging sustentable', src: MEDIA.PACKAGING },
  { label: 'Textil y diseño', src: MEDIA.TEXTIL },
  { label: 'Agroindustria y campo', src: MEDIA.AGRO },
  { label: 'Construcción modular', src: MEDIA.CONSTRUCCION },
];

export const AuthOnboardingPage: React.FC = () => {
  const { state, loginAsDemoBusiness, loginAsDemoAdmin, loginDemoByEmail, registerUserAndCompany } =
    useTrama();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );

  // Login state
  const [loginEmail, setLoginEmail] = useState('martin@altiplano-demo.ar');
  const [loginPassword, setLoginPassword] = useState('demo1234');
  const [loginError, setLoginError] = useState('');

  // Multi-step Registration state (0 = User account, 1..6 = 6-step Company registration)
  const [step, setStep] = useState<number>(0);
  const [formError, setFormError] = useState('');

  // Step 0: User
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userTitle, setUserTitle] = useState('Fundador / Dirección');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Step 1: Company identity
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [province, setProvince] = useState('Buenos Aires');
  const [city, setCity] = useState('');
  const [coverage, setCoverage] = useState('Todo el país');
  const [foundedYear, setFoundedYear] = useState('2021');

  // Step 2: Industry and activities
  const [industry, setIndustry] = useState(state.taxonomy.industries[0]);
  const [subindustry, setSubindustry] = useState('');
  const [size, setSize] = useState<CompanySize>('Micro PyME (6-15)');
  const [operationType, setOperationType] = useState<BusinessOperationType>('Fabricante');
  const [commercialModel, setCommercialModel] = useState<CommercialModel>('B2B');
  const [exportReadiness, setExportReadiness] = useState<ExportReadiness>('Mercado local');

  // Step 3: Products & services
  const [productsRaw, setProductsRaw] = useState('');
  const [servicesRaw, setServicesRaw] = useState('');
  const [capabilitiesRaw, setCapabilitiesRaw] = useState('');
  const [offeringsRaw, setOfferingsRaw] = useState('');

  // Step 4: Needs & commercial objectives
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Packaging sustentable y cajas kraft',
    'Logística nacional y carga consolidada',
  ]);
  const [customNeed, setCustomNeed] = useState('');
  const [objectivesRaw, setObjectivesRaw] = useState(
    'Conseguir nuevos clientes B2B, Encontrar proveedores confiables'
  );
  const [sustainabilityRaw, setSustainabilityRaw] = useState('Producción responsable local');

  // Step 5: Visual identity & presentation
  const [brandColor, setBrandColor] = useState(BRAND_COLORS[0]);
  const [coverImage, setCoverImage] = useState<string>(MEDIA.HERO_PYMES);
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const completenessPreview = useMemo(() => {
    let score = 20;
    if (companyName.trim().length >= 2) score += 15;
    if (tagline.trim().length >= 8) score += 10;
    if (subindustry.trim().length >= 3) score += 10;
    if (productsRaw.trim() || servicesRaw.trim()) score += 15;
    if (offeringsRaw.trim()) score += 10;
    if (selectedNeeds.length > 0 || customNeed.trim()) score += 10;
    if (description.trim().length >= 30) score += 10;
    return Math.min(100, score);
  }, [companyName, tagline, subindustry, productsRaw, servicesRaw, offeringsRaw, selectedNeeds, customNeed, description]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Completá correo electrónico y contraseña para continuar.');
      return;
    }
    const res = loginDemoByEmail(loginEmail);
    if (!res.ok) {
      setLoginError(res.error ?? 'Error al ingresar.');
      return;
    }
    const user = state.users.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    navigate(user?.role === 'admin' ? '/admin' : '/espacio');
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const validateAndAdvance = () => {
    setFormError('');
    if (step === 0) {
      if (fullName.trim().length < 3) return setFormError('Ingresá tu nombre y apellido completo.');
      if (!userEmail.includes('@')) return setFormError('Ingresá un correo electrónico válido.');
      if (userPassword.length < 6)
        return setFormError('Elegí una contraseña de al menos 6 caracteres (simulación demo).');
      if (!acceptTerms) return setFormError('Debés aceptar los términos de uso del entorno MVP.');
    }
    if (step === 1) {
      if (companyName.trim().length < 2) return setFormError('Ingresá el nombre de tu empresa.');
      if (tagline.trim().length < 8)
        return setFormError('Agregá una frase corta que resuma a qué se dedica tu negocio.');
      if (city.trim().length < 2) return setFormError('Indicá la ciudad o localidad.');
    }
    if (step === 2) {
      if (subindustry.trim().length < 2)
        return setFormError('Indicá tu subrubro o especialidad principal.');
      setCoverImage(getIndustryImage(industry));
    }
    if (step === 3) {
      if (!productsRaw.trim() && !servicesRaw.trim())
        return setFormError('Cargá al menos un producto o servicio principal.');
      if (!offeringsRaw.trim())
        return setFormError('Contanos qué ofrecés para que el motor de Match te recomiende.');
    }
    if (step === 4) {
      if (selectedNeeds.length === 0 && !customNeed.trim())
        return setFormError('Elegí o escribí al menos una necesidad comercial de tu empresa.');
    }
    if (step === 5) {
      if (description.trim().length < 25)
        return setFormError('Escribí una presentación de al menos 25 caracteres.');
    }
    setStep((s) => Math.min(6, s + 1));
  };

  const handlePublishRegistration = () => {
    const splitList = (raw: string) =>
      raw
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

    const provMeta = PROVINCES.find((p) => p.name === province) ?? PROVINCES[0];
    const allNeeds = [...selectedNeeds, ...splitList(customNeed)];
    const initials =
      companyName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('') || 'PY';

    registerUserAndCompany({
      user: {
        fullName,
        email: userEmail,
        title: userTitle,
      },
      company: {
        name: companyName.trim(),
        legalName: `${companyName.trim()} (Registro Demo)`,
        tagline: tagline.trim(),
        shortDescription: tagline.trim(),
        description: description.trim(),
        history: `Empresa registrada en el MVP de TRAMA en ${city.trim()}, ${province}.`,
        foundedYear: Number(foundedYear) || 2021,
        logoInitials: initials,
        brandColor,
        coverImage,
        portfolioImages: [coverImage, getIndustryImage(industry), MEDIA.HERO_PYMES],
        industry,
        subindustry: subindustry.trim(),
        location: {
          country: 'Argentina',
          province: provMeta.name,
          city: city.trim(),
          region: provMeta.region,
        },
        coverage: coverage.trim() || province,
        size,
        operationType,
        commercialModel,
        exportReadiness,
        products: splitList(productsRaw),
        services: splitList(servicesRaw),
        capabilities:
          splitList(capabilitiesRaw).length > 0
            ? splitList(capabilitiesRaw)
            : ['Atención personalizada B2B', 'Producción flexible PyME'],
        offerings: splitList(offeringsRaw),
        needs: allNeeds,
        commercialObjectives: splitList(objectivesRaw),
        certifications: [],
        sustainabilityCriteria: splitList(sustainabilityRaw),
        tags: [
          industry.toLowerCase().split(' ')[0],
          province.toLowerCase().replace(/\s+/g, '-'),
          operationType.toLowerCase().split(' ')[0],
        ],
        website: website.trim() || 'https://miempresa.demo-trama.ar',
        contactEmail: userEmail.trim().toLowerCase(),
        phone: '+54 9 11 5500-0100',
        verificationStatus: 'pending',
        planTier: 'free',
        featured: false,
        status: 'published',
      },
    });

    navigate('/espacio');
  };

  const STEP_LABELS = [
    'Tu cuenta',
    '1. Identidad',
    '2. Industria',
    '3. Oferta',
    '4. Necesidades',
    '5. Imagen',
    '6. Publicación',
  ];

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10 lg:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Mode Switch Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#F26444]">Acceso al Ecosistema TRAMA</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
              {mode === 'login' ? 'Ingresá a tu cuenta' : 'Sumá tu PyME gratis en minutos'}
            </h1>
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-[#17213A] text-white' : 'text-slate-600 hover:text-[#17213A]'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#F26444] text-white'
                  : 'text-slate-600 hover:text-[#17213A]'
              }`}
            >
              Registrar mi empresa
            </button>
          </div>
        </div>

        {/* Transparent Local Demo Authentication Notice */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#17213A]">Simulación local de demostración:</strong> El inicio
            de sesión y registro del MVP persisten en tu navegador para probar toda la experiencia
            end-to-end. En producción se conectan con autenticación server-side PHP/MySQL con hash
            seguro de contraseñas.
          </p>
        </div>

        {mode === 'login' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Standard Demo Login Form */}
            <form
              onSubmit={handleLoginSubmit}
              className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-[#17213A]">Ingresar con correo electrónico</h2>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                  Contraseña (simulación demo)
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Ingresar al espacio
              </button>
            </form>

            {/* Quick Role Demo Presets */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-[#17213A]">Accesos rápidos de evaluación</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Probá cualquiera de los perfiles precargados con 1 clic para explorar el Workspace
                PyME o el Panel de Administración.
              </p>

              <button
                type="button"
                onClick={() => {
                  loginAsDemoBusiness();
                  navigate('/espacio');
                }}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-[#F26444] text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F26444] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#17213A]">PyME Demo · Altiplano Alimentos</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Martín Echeverría · Mendoza · Matches, mensajes y oportunidades activas.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  navigate('/admin');
                }}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-[#2563EB] text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#17213A] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#17213A]">Administrador Demo · TRAMA</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sofía Méndez · Verificación de empresas, moderación, eventos y analítica.
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-STEP ONBOARDING (User Registration + 6-step Company Creation) */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Progress Bar & Completeness */}
            <div className="space-y-3 pb-5 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#17213A]">
                  Paso {step + 1} de {STEP_LABELS.length}: {STEP_LABELS[step]}
                </span>
                <span className="font-mono font-semibold text-[#008777] tabular-nums">
                  Completitud del perfil: {completenessPreview}%
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {STEP_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className={`h-2 rounded-full transition-colors ${
                      i <= step ? 'bg-[#F26444]' : 'bg-slate-200'
                    }`}
                    title={label}
                  />
                ))}
              </div>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {formError}
              </div>
            )}

            {/* Step 0: User Registration */}
            {step === 0 && (
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-xl font-bold text-[#17213A]">
                  Primero creá tu usuario responsable
                </h2>
                <p className="text-sm text-slate-500">
                  Luego podrás invitar a otros integrantes de tu equipo comercial o de compras.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Nombre y apellido *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Carolina Morales"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Cargo / Rol en la empresa
                    </label>
                    <input
                      type="text"
                      value={userTitle}
                      onChange={(e) => setUserTitle(e.target.value)}
                      placeholder="Ej: Socia Gerente"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Correo electrónico laboral *
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="carolina@tuempresa.com.ar"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
                <label className="flex items-start gap-2.5 text-xs text-slate-600 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#F26444]"
                  />
                  <span>
                    Acepto los términos de uso del ecosistema TRAMA y comprendo que el MVP opera en
                    modo demostración local con persistencia en mi navegador.
                  </span>
                </label>
              </div>
            )}

            {/* Step 1: Company Identity */}
            {step === 1 && (
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-xl font-bold text-[#17213A]">Paso 1: Identidad de tu empresa</h2>
                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Nombre comercial de la empresa *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej: Dulces Serranos de Córdoba"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Titular corto (¿qué hace tu empresa en una línea?) *
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Ej: Alfajores artesanales y dulces regionales para dietéticas y hoteles"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Provincia *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Ciudad / Localidad *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej: Villa General Belgrano"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Cobertura geográfica
                    </label>
                    <input
                      type="text"
                      value={coverage}
                      onChange={(e) => setCoverage(e.target.value)}
                      placeholder="Ej: Todo el país / Córdoba y Santa Fe"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Año de fundación
                    </label>
                    <input
                      type="number"
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Industry & Activities */}
            {step === 2 && (
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-xl font-bold text-[#17213A]">
                  Paso 2: Industria y perfil operativo
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Industria principal
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      {state.taxonomy.industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Subindustria / Especialidad *
                    </label>
                    <input
                      type="text"
                      value={subindustry}
                      onChange={(e) => setSubindustry(e.target.value)}
                      placeholder="Ej: Pastelería regional / CNC industrial"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Tipo de operación
                    </label>
                    <select
                      value={operationType}
                      onChange={(e) => setOperationType(e.target.value as BusinessOperationType)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option value="Fabricante">Fabricante</option>
                      <option value="Proveedor de servicios">Proveedor de servicios</option>
                      <option value="Comercializadora / Distribuidora">
                        Comercializadora / Distribuidora
                      </option>
                      <option value="Productor primario">Productor primario</option>
                      <option value="Mixto">Mixto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Tamaño del equipo
                    </label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value as CompanySize)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option value="Emprendimiento (1-5)">Emprendimiento (1-5)</option>
                      <option value="Micro PyME (6-15)">Micro PyME (6-15)</option>
                      <option value="Pequeña (16-50)">Pequeña (16-50)</option>
                      <option value="Mediana (51-200)">Mediana (51-200)</option>
                      <option value="Gran Empresa (+200)">Gran Empresa (+200)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Modelo comercial
                    </label>
                    <select
                      value={commercialModel}
                      onChange={(e) => setCommercialModel(e.target.value as CommercialModel)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option value="B2B">B2B (a empresas)</option>
                      <option value="B2C">B2C (consumidor final)</option>
                      <option value="B2B y B2C">Ambos (B2B y B2C)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                      Capacidad exportadora
                    </label>
                    <select
                      value={exportReadiness}
                      onChange={(e) => setExportReadiness(e.target.value as ExportReadiness)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option value="Mercado local">Mercado local</option>
                      <option value="Listo para exportar">Listo para exportar</option>
                      <option value="Exportador activo">Exportador activo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Products & Services */}
            {step === 3 && (
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-xl font-bold text-[#17213A]">
                  Paso 3: Qué ofrecés al ecosistema
                </h2>
                <p className="text-sm text-slate-500">
                  Separá los ítems con comas. Esta información potencia las búsquedas en el
                  directorio y tu puntaje en Match B2B.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Productos principales *
                  </label>
                  <input
                    type="text"
                    value={productsRaw}
                    onChange={(e) => setProductsRaw(e.target.value)}
                    placeholder="Ej: Dulces artesanales sin azúcar, Alfajores premium, Cajas de regalo"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Servicios (opcional)
                  </label>
                  <input
                    type="text"
                    value={servicesRaw}
                    onChange={(e) => setServicesRaw(e.target.value)}
                    placeholder="Ej: Producción marca propia, Regalos corporativos personalizados"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Oferta clave para otras empresas (lo que ofrecés) *
                  </label>
                  <input
                    type="text"
                    value={offeringsRaw}
                    onChange={(e) => setOfferingsRaw(e.target.value)}
                    placeholder="Ej: Alimentos gourmet mayoristas para cafeterías, hoteles y dietéticas"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Capacidades técnicas / operativas
                  </label>
                  <input
                    type="text"
                    value={capabilitiesRaw}
                    onChange={(e) => setCapabilitiesRaw(e.target.value)}
                    placeholder="Ej: Habilitación RNE, Producción hasta 15.000 unidades mensuales"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Needs & Commercial Objectives */}
            {step === 4 && (
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-xl font-bold text-[#17213A]">
                  Paso 4: Qué necesitás hoy para crecer
                </h2>
                <p className="text-sm text-slate-500">
                  Seleccioná las necesidades actuales de tu empresa. Nuestro motor de Match buscará
                  proveedores y aliados que resuelvan exactamente estos puntos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {state.taxonomy.needs.map((need) => {
                    const active = selectedNeeds.includes(need);
                    return (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleNeed(need)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#00A995] bg-[#00A995]/10 text-[#17213A] font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-[#F4F7FB]'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {need}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Otras necesidades específicas (opcional)
                  </label>
                  <input
                    type="text"
                    value={customNeed}
                    onChange={(e) => setCustomNeed(e.target.value)}
                    placeholder="Ej: Etiquetas resistentes a humedad, Frascos de vidrio 250cc"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Objetivos comerciales
                  </label>
                  <input
                    type="text"
                    value={objectivesRaw}
                    onChange={(e) => setObjectivesRaw(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Prácticas de sustentabilidad (opcional)
                  </label>
                  <input
                    type="text"
                    value={sustainabilityRaw}
                    onChange={(e) => setSustainabilityRaw(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Images & Presentation */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[#17213A]">
                  Paso 5: Imagen y presentación de tu perfil
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-2">
                    Color identificador de marca
                  </label>
                  <div className="flex items-center gap-3">
                    {BRAND_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setBrandColor(hex)}
                        aria-label={`Color ${hex}`}
                        className={`w-9 h-9 rounded-xl transition-transform cursor-pointer ${
                          brandColor === hex ? 'ring-2 ring-offset-2 ring-[#17213A] scale-105' : ''
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-2">
                    Elegí una foto de portada representativa
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {COVER_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setCoverImage(opt.src)}
                        className={`rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                          coverImage === opt.src ? 'border-[#F26444]' : 'border-transparent'
                        }`}
                      >
                        <div className="aspect-[4/3] bg-[#F4F7FB]">
                          <ResilientImage
                            src={opt.src}
                            alt={opt.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[11px] font-medium p-1.5 truncate text-[#17213A]">
                          {opt.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Descripción completa de la empresa *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contá quiénes son, cómo trabajan, qué los diferencia y con qué tipo de empresas buscan conectar."
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213A] mb-1.5">
                    Sitio web o red comercial (opcional)
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://tuempresa.com.ar"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Preview & Publication */}
            {step === 6 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#17213A]">
                    Paso 6: Vista previa antes de publicar
                  </h2>
                  <p className="text-sm text-slate-600">
                    Así se verá tu perfil en el directorio de TRAMA y en las recomendaciones de
                    Match B2B.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden max-w-2xl">
                  <div className="h-44 relative bg-[#F4F7FB]">
                    <ResilientImage
                      src={coverImage}
                      alt={companyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17213A]/80 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-3 text-white">
                      <div
                        className="w-12 h-12 rounded-xl font-extrabold text-base flex items-center justify-center ring-2 ring-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        {companyName
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase() ?? '')
                          .join('') || 'PY'}
                      </div>
                      <div>
                        <p className="text-xs text-white/80">
                          {industry} · {city}, {province}
                        </p>
                        <h3 className="text-xl font-extrabold">{companyName}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3 text-xs text-slate-600">
                    <p className="text-sm font-medium text-[#17213A]">{tagline}</p>
                    <p className="leading-relaxed">{description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <p className="font-bold text-[#17213A]">Ofrece:</p>
                        <p>{offeringsRaw}</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#17213A]">Necesita:</p>
                        <p>{[...selectedNeeds, customNeed].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Footer */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setFormError('');
                    setStep((s) => s - 1);
                  }}
                  className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-[#17213A] hover:bg-[#F4F7FB] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={validateAndAdvance}
                  className="h-11 px-6 rounded-xl bg-[#17213A] hover:bg-[#2563EB] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublishRegistration}
                  className="h-12 px-7 rounded-xl bg-[#00A995] hover:bg-[#008777] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Publicar mi empresa e ir a Mi Espacio
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
