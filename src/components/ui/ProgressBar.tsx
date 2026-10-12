import React from 'react';

interface MultiProgressBarProps {
  independent?: number;
  assisted?: number;
  needsWork?: number;
  untested?: number;
  total?: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ value, max = 100, color = 'bg-[#1D1A39]', size = 'md', className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full bg-[#FAF7F6] border border-[#F0EAE8] rounded-full ${heightClasses[size]} overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-500 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export const MultiProgressBar: React.FC<MultiProgressBarProps> = ({
  independent = 0,
  assisted = 0,
  needsWork = 0,
  untested = 0,
  total = 0,
  showLabels = false,
  size = 'md',
  className = '',
}) => {
  const calculatedTotal = total > 0 ? total : Math.max(1, independent + assisted + needsWork + untested);

  const pctInd = (independent / calculatedTotal) * 100;
  const pctAss = (assisted / calculatedTotal) * 100;
  const pctNeeds = (needsWork / calculatedTotal) * 100;
  const pctUnt = (untested / calculatedTotal) * 100;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-[#FAF7F6] border border-[#F0EAE8] rounded-full ${heightClasses[size]} overflow-hidden flex`}>
        {pctInd > 0 && (
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${pctInd}%` }}
            title={`Independent: ${independent}`}
          />
        )}
        {pctAss > 0 && (
          <div
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${pctAss}%` }}
            title={`Assisted: ${assisted}`}
          />
        )}
        {pctNeeds > 0 && (
          <div
            className="bg-rose-400 transition-all duration-300"
            style={{ width: `${pctNeeds}%` }}
            title={`Needs Work: ${needsWork}`}
          />
        )}
        {pctUnt > 0 && (
          <div
            className="bg-gray-300 transition-all duration-300"
            style={{ width: `${pctUnt}%` }}
            title={`Untested: ${untested}`}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex items-center justify-between mt-2 text-[11px] text-[#7E6C7C]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Independent ({independent})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Assisted ({assisted})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            <span>Needs work ({needsWork})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span>Untested ({untested})</span>
          </div>
        </div>
      )}
    </div>
  );
};
