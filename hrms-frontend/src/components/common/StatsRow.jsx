import React from 'react';
import { stats } from '../../demo_contents/forhr';

const StatsRow = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[148px] hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            <div className="text-[#0d766e] flex items-center justify-center">
              {stat.icon}
            </div>
          </div>

          <div className="text-3xl font-bold text-gray-900 tracking-tight -mt-1">
            {stat.value}
          </div>

          <div className="text-xs text-gray-400 font-normal">
            {stat.note}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
