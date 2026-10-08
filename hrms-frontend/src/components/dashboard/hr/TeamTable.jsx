import React, { useState } from 'react';
import { team } from '../../../demo_contents/forhr';
import StatusPill from '../../common/StatusPill';

const TeamTable = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTeam = activeFilter === 'exceptions'
    ? team.filter((emp) => emp.status !== 'Present')
    : team;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Team attendance</h2>
          <span className="text-xs font-semibold text-[#0d766e]">Today · IST</span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#182d28] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All teams
          </button>
          <button
            onClick={() => setActiveFilter('exceptions')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === 'exceptions'
                ? 'bg-[#182d28] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Exceptions
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f7f5] text-xs font-medium text-gray-500">
                <th className="py-2.5 px-4 font-medium rounded-l-xl">Employee</th>
                <th className="py-2.5 px-4 font-medium">Department / Check-in</th>
                <th className="py-2.5 px-4 font-medium text-right rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeam.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">{emp.name}</td>
                  <td className="py-3 px-4 text-xs sm:text-sm text-gray-600 font-normal">{emp.info}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusPill status={emp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-xs text-gray-400 font-normal">
        Showing {filteredTeam.length} of 128 people · Updated at 09:42 am
      </div>
    </div>
  );
};

export default TeamTable;
