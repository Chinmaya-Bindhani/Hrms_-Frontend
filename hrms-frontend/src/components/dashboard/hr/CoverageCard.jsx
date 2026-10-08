import React from 'react';

const CoverageCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Attendance coverage</h2>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">84%</span>
          <span className="text-xs text-gray-500 font-normal">108 of 128 present</span>
        </div>

        <div className="w-full bg-[#eef2f1] h-2.5 rounded-full overflow-hidden my-2">
          <div
            className="bg-[#0f6c60] h-full rounded-full transition-all duration-500"
            style={{ width: '84%' }}
          ></div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400 font-normal">
        8 on leave · 6 absent · 6 check-ins pending
      </div>
    </div>
  );
};

export default CoverageCard;
