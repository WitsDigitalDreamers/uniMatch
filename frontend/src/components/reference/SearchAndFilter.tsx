// Phase 3: Reference Data Integration - Search and Filter Components

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

// ==================== SEARCH COMPONENT ====================

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  onClear,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && onClear && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// ==================== FILTER COMPONENTS ====================

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface SelectFilterProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All {label}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined && (
                <span className="ml-2 text-gray-500">({option.count})</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface RangeFilterProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
  formatValue = (val) => val.toString(),
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="px-2">
        <Slider
          value={value}
          onValueChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatValue(value[0])}</span>
          <span>{formatValue(value[1])}</span>
        </div>
      </div>
    </div>
  );
};

interface MultiSelectFilterProps {
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  value,
  onChange,
  className = ''
}) => {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {value.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={() => toggleOption(option.value)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700 flex-1">
              {option.label}
              {option.count !== undefined && (
                <span className="ml-2 text-gray-500">({option.count})</span>
              )}
            </span>
          </label>
        ))}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((selectedValue) => {
            const option = options.find(opt => opt.value === selectedValue);
            return (
              <Badge
                key={selectedValue}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => toggleOption(selectedValue)}
              >
                {option?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==================== FILTER PANEL ====================

interface FilterPanelProps {
  children: React.ReactNode;
  title?: string;
  defaultOpen?: boolean;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  children,
  title = "Filters",
  defaultOpen = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// ==================== COURSE FILTERS ====================

interface CourseFiltersProps {
  faculties: string[];
  universities: string[];
  provinces: string[];
  apsRange: [number, number];
  costRange: [number, number];
  onFacultiesChange: (faculties: string[]) => void;
  onUniversitiesChange: (universities: string[]) => void;
  onProvincesChange: (provinces: string[]) => void;
  onAPSRangeChange: (range: [number, number]) => void;
  onCostRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  className?: string;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  faculties,
  universities,
  provinces,
  apsRange,
  costRange,
  onFacultiesChange,
  onUniversitiesChange,
  onProvincesChange,
  onAPSRangeChange,
  onCostRangeChange,
  onReset,
  className = ''
}) => {
  return (
    <FilterPanel title="Course Filters" className={className}>
      <div className="space-y-6">
        <MultiSelectFilter
          label="Faculties"
          options={faculties.map(f => ({ value: f, label: f }))}
          value={faculties}
          onChange={onFacultiesChange}
        />
        
        <MultiSelectFilter
          label="Universities"
          options={universities.map(u => ({ value: u, label: u }))}
          value={universities}
          onChange={onUniversitiesChange}
        />
        
        <MultiSelectFilter
          label="Provinces"
          options={provinces.map(p => ({ value: p, label: p }))}
          value={provinces}
          onChange={onProvincesChange}
        />
        
        <RangeFilter
          label="APS Score Range"
          min={20}
          max={50}
          value={apsRange}
          onChange={onAPSRangeChange}
          formatValue={(val) => `${val} points`}
        />
        
        <RangeFilter
          label="Cost Range (Annual)"
          min={20000}
          max={150000}
          value={costRange}
          onChange={onCostRangeChange}
          step={5000}
          formatValue={(val) => `R${val.toLocaleString()}`}
        />
        
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </FilterPanel>
  );
};

// ==================== BURSARY FILTERS ====================

interface BursaryFiltersProps {
  faculties: string[];
  provinces: string[];
  apsRange: [number, number];
  incomeRange: [number, number];
  onFacultiesChange: (faculties: string[]) => void;
  onProvincesChange: (provinces: string[]) => void;
  onAPSRangeChange: (range: [number, number]) => void;
  onIncomeRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  className?: string;
}

export const BursaryFilters: React.FC<BursaryFiltersProps> = ({
  faculties,
  provinces,
  apsRange,
  incomeRange,
  onFacultiesChange,
  onProvincesChange,
  onAPSRangeChange,
  onIncomeRangeChange,
  onReset,
  className = ''
}) => {
  return (
    <FilterPanel title="Bursary Filters" className={className}>
      <div className="space-y-6">
        <MultiSelectFilter
          label="Faculties"
          options={faculties.map(f => ({ value: f, label: f }))}
          value={faculties}
          onChange={onFacultiesChange}
        />
        
        <MultiSelectFilter
          label="Provinces"
          options={provinces.map(p => ({ value: p, label: p }))}
          value={provinces}
          onChange={onProvincesChange}
        />
        
        <RangeFilter
          label="Minimum APS Score"
          min={20}
          max={50}
          value={apsRange}
          onChange={onAPSRangeChange}
          formatValue={(val) => `${val} points`}
        />
        
        <RangeFilter
          label="Household Income Range"
          min={0}
          max={1000000}
          value={incomeRange}
          onChange={onIncomeRangeChange}
          step={10000}
          formatValue={(val) => `R${val.toLocaleString()}`}
        />
        
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </FilterPanel>
  );
};

// ==================== RESIDENCE FILTERS ====================

interface ResidenceFiltersProps {
  universities: string[];
  genders: string[];
  priceRange: [number, number];
  onUniversitiesChange: (universities: string[]) => void;
  onGendersChange: (genders: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  className?: string;
}

export const ResidenceFilters: React.FC<ResidenceFiltersProps> = ({
  universities,
  genders,
  priceRange,
  onUniversitiesChange,
  onGendersChange,
  onPriceRangeChange,
  onReset,
  className = ''
}) => {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'mixed', label: 'Mixed' }
  ];

  return (
    <FilterPanel title="Residence Filters" className={className}>
      <div className="space-y-6">
        <MultiSelectFilter
          label="Universities"
          options={universities.map(u => ({ value: u, label: u }))}
          value={universities}
          onChange={onUniversitiesChange}
        />
        
        <MultiSelectFilter
          label="Gender"
          options={genderOptions}
          value={genders}
          onChange={onGendersChange}
        />
        
        <RangeFilter
          label="Monthly Price Range"
          min={2000}
          max={8000}
          value={priceRange}
          onChange={onPriceRangeChange}
          step={500}
          formatValue={(val) => `R${val.toLocaleString()}`}
        />
        
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </FilterPanel>
  );
};
