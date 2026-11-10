import React from 'react';
import { generateQRMatrix } from '../../utils/qrSvg';
import { ArrowLeft, Share2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export const TopBar: React.FC<{
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}> = ({ title, subtitle, onBack, rightAction }) => (
  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 sticky top-0 z-20">
    <div className="flex items-center gap-2.5 overflow-hidden">
      {onBack && (
        <button 
          onClick={onBack}
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="truncate">
        <h1 className="font-bold text-sm tracking-wide leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-[10px] text-blue-200 truncate">{subtitle}</p>}
      </div>
    </div>
    {rightAction && <div className="shrink-0">{rightAction}</div>}
  </div>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = 'bg-blue-100 text-blue-800 border-blue-200';
  if (status === 'Upcoming' || status === 'Approved') color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  else if (status === 'Completed') color = 'bg-teal-100 text-teal-800 border-teal-200';
  else if (status === 'Pending') color = 'bg-amber-100 text-amber-800 border-amber-200';
  else if (status === 'Cancelled' || status === 'Rejected') color = 'bg-rose-100 text-rose-800 border-rose-200';
  else if (status === 'FULL') color = 'bg-red-100 text-red-800 border-red-200';

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {status}
    </span>
  );
};

export const QRCodeView: React.FC<{ value: string; size?: number }> = ({ value, size = 180 }) => {
  const matrix = React.useMemo(() => generateQRMatrix(value), [value]);
  const cellSize = size / matrix.length;

  return (
    <div className="bg-white p-3 rounded-xl shadow-inner border border-slate-200 inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((col, c) =>
            col ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
