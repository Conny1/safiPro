import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import type { DateFilterType } from '../types';

interface DateRangeFilterProps {
  currentFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
  onCustomDateSubmit: (start: string, end: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  currentFilter,
  onFilterChange,
  onCustomDateSubmit
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filters: { label: string; value: DateFilterType }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom Range', value: 'custom' }
  ];

  const handleCustomSubmit = () => {
    if (customStart && customEnd) {
      onCustomDateSubmit(customStart, customEnd);
      setShowCustom(false);
    }
  };

  // Set default custom dates to current week
  const setDefaultCustomDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    setCustomStart(startOfWeek.toISOString().split('T')[0]);
    setCustomEnd(endOfWeek.toISOString().split('T')[0]);
  };

  React.useEffect(() => {
    if (showCustom && !customStart) {
      setDefaultCustomDates();
    }
  }, [showCustom]);

  return (
    <div className="p-4 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Select Period:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                if (value === 'custom') {
                  setShowCustom(!showCustom);
                } else {
                  onFilterChange(value);
                  setShowCustom(false);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentFilter === value || (value === 'custom' && showCustom)
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Input */}
      {showCustom && (
        <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">Custom Range:</span>
            </div>
            <div className="flex flex-col flex-1 gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customStart || !customEnd}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Dates
                </button>
                <button
                  onClick={() => setShowCustom(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;