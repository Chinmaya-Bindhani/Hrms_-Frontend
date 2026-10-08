import React from 'react';
import { requests } from '../../../demo_contents/forhr';
import StatusPill from '../../common/StatusPill';

const RequestsCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Recent requests</h2>
          <button className="text-xs font-semibold text-[#0d766e] hover:underline cursor-pointer">
            View all
          </button>
        </div>

        {/* Requests List */}
        <div className="divide-y divide-gray-100">
          {requests.map((req, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-1 last:pb-1">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{req.name}</span>
                <span className="text-xs text-gray-400 mt-0.5 font-normal">{req.info}</span>
              </div>
              <div className="ml-4 shrink-0">
                <StatusPill status="Pending" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className="mt-5">
        <button className="w-full py-2.5 px-4 bg-white border border-gray-200/90 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          Go to leave approvals
        </button>
      </div>
    </div>
  );
};

export default RequestsCard;
