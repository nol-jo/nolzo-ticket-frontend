'use client';

import React from 'react';

interface EventFilterProps {
  condition: string;
  age: string;
  onChange: (condition: string, age: string) => void;
}

export default function EventFilter({ condition, age, onChange }: EventFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-6 mb-4">
      {/* 정렬 기준 */}
      <div className="flex flex-col">
        <label htmlFor="sortSelect" className="text-sm font-medium text-gray-700 mb-1">
          정렬 기준
        </label>
        <select
          id="sortSelect"
          value={condition}
          onChange={(e) => onChange(e.target.value, age)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="ranking">인기순</option>
        </select>
      </div>

      {/* 연령 제한 */}
      <div className="flex flex-col">
        <label htmlFor="ageSelect" className="text-sm font-medium text-gray-700 mb-1">
          연령 제한
        </label>
        <select
          id="ageSelect"
          value={age}
          onChange={(e) => onChange(condition, e.target.value)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">전체</option>
          <option value="7">7세</option>
          <option value="12">12세</option>
          <option value="18">18세</option>
        </select>
      </div>
    </div>
  );
}
