import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export type DatePreset = 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'all_time' | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  preset: DatePreset;
  label: string;
}

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDateRange = (preset: DatePreset): DateRange => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (preset) {
      case 'this_month':
        return {
          startDate: new Date(currentYear, currentMonth, 1),
          endDate: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59),
          preset: 'this_month',
          label: 'This Month'
        };

      case 'last_month':
        return {
          startDate: new Date(currentYear, currentMonth - 1, 1),
          endDate: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          preset: 'last_month',
          label: 'Last Month'
        };

      case 'this_quarter':
        const currentQuarter = Math.floor(currentMonth / 3);
        const quarterStartMonth = currentQuarter * 3;
        return {
          startDate: new Date(currentYear, quarterStartMonth, 1),
          endDate: new Date(currentYear, quarterStartMonth + 3, 0, 23, 59, 59),
          preset: 'this_quarter',
          label: 'This Quarter'
        };

      case 'this_year':
        return {
          startDate: new Date(currentYear, 0, 1),
          endDate: new Date(currentYear, 11, 31, 23, 59, 59),
          preset: 'this_year',
          label: 'This Year'
        };

      case 'all_time':
        return {
          startDate: new Date(2020, 0, 1),
          endDate: now,
          preset: 'all_time',
          label: 'All Time'
        };

      default:
        return getDateRange('this_month');
    }
  };

  const presets: DatePreset[] = ['this_month', 'last_month', 'this_quarter', 'this_year', 'all_time'];

  const handlePresetClick = (preset: DatePreset) => {
    const range = getDateRange(preset);
    onRangeChange(range);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (selectedRange.preset === 'all_time') {
      return selectedRange.label;
    }

    const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = selectedRange.startDate.toLocaleDateString('en-US', formatOptions);
    const end = selectedRange.endDate.toLocaleDateString('en-US', formatOptions);

    return `${start} - ${end}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Calendar className="w-4 h-4 text-gray-600" />
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 font-medium">{selectedRange.label}</span>
          <span className="text-sm text-gray-900 font-semibold">{formatDateRange()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-2">
            {presets.map((preset) => {
              const range = getDateRange(preset);
              const isSelected = selectedRange.preset === preset;

              return (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 text-primary-blue font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{range.label}</span>
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-blue rounded-full" />
                    )}
                  </div>
                  {preset !== 'all_time' && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      {range.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {range.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export function getDefaultDateRange(): DateRange {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return {
    startDate: new Date(currentYear, currentMonth, 1),
    endDate: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59),
    preset: 'this_month',
    label: 'This Month'
  };
}

export default DateRangeSelector;
