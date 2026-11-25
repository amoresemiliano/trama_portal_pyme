import React from 'react';

interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export const HorizontalBarChart: React.FC<{
  title: string;
  subtitle?: string;
  data: BarDatum[];
  defaultColor?: string;
}> = ({ title, subtitle, data, defaultColor = '#2563EB' }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#17213A]">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-3">
        {data.map((item) => {
          const pct = Math.max(4, Math.round((item.value / maxVal) * 100));
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-700 font-medium truncate">{item.label}</span>
                <span className="font-mono font-semibold text-[#17213A] tabular-nums shrink-0">
                  {item.value}
                </span>
              </div>
              <div className="h-2.5 w-full bg-[#F4F7FB] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color ?? defaultColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ActivityTrendChart: React.FC<{
  title: string;
  subtitle?: string;
  points: { label: string; companies: number; matches: number }[];
}> = ({ title, subtitle, points }) => {
  const width = 520;
  const height = 180;
  const padX = 28;
  const padY = 20;
  const maxVal = Math.max(
    ...points.flatMap((p) => [p.companies, p.matches]),
    10
  );

  const buildPath = (key: 'companies' | 'matches') =>
    points
      .map((p, i) => {
        const x = padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2);
        const y = height - padY - (p[key] / maxVal) * (height - padY * 2);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#17213A]">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
            Altas de empresas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F26444]" />
            Matches creados
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full h-auto min-w-[320px]">
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - padY - ratio * (height - padY * 2);
            return (
              <line
                key={ratio}
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
            );
          })}
          <path
            d={buildPath('companies')}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={buildPath('matches')}
            fill="none"
            stroke="#F26444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => {
            const x = padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2);
            const yC = height - padY - (p.companies / maxVal) * (height - padY * 2);
            const yM = height - padY - (p.matches / maxVal) * (height - padY * 2);
            return (
              <g key={p.label}>
                <circle cx={x} cy={yC} r="3.5" fill="#2563EB" />
                <circle cx={x} cy={yM} r="3.5" fill="#F26444" />
                <text
                  x={x}
                  y={height + 10}
                  textAnchor="middle"
                  className="fill-slate-500 text-[10px]"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
