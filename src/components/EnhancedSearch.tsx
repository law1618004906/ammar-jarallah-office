import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { dataManager, debounce, performanceMonitor } from '../lib/dataIndexing';
import { Leader, Person } from '../lib/localStorageOperations';

interface EnhancedSearchProps {
  data: Leader[] | Person[];
  onResults: (results: Leader[] | Person[]) => void;
  type: 'leaders' | 'persons';
  placeholder?: string;
}

interface SearchFilters {
  station?: string;
  workplace?: string;
  residence?: string;
  leader?: string; // For persons only
}

export default function EnhancedSearch({ 
  data, 
  onResults, 
  type, 
  placeholder = "البحث..." 
}: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchStats, setSearchStats] = useState({ 
    totalResults: 0, 
    searchTime: 0 
  });

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string, currentFilters: SearchFilters) => {
      const timer = performanceMonitor.startTimer('Enhanced Search');
      
      let results: (Leader | Person)[];
      
      if (type === 'leaders') {
        results = dataManager.searchLeaders(query, data as Leader[]);
      } else {
        results = dataManager.searchPersons(query, '', data as Person[]);
      }

      // Apply filters
      if (currentFilters.station) {
        results = results.filter(item => 
          item.station_number?.includes(currentFilters.station!)
        );
      }
      if (currentFilters.workplace) {
        results = results.filter(item => 
          item.workplace?.toLowerCase().includes(currentFilters.workplace!.toLowerCase())
        );
      }
      if (currentFilters.residence) {
        results = results.filter(item => 
          item.residence?.toLowerCase().includes(currentFilters.residence!.toLowerCase())
        );
      }
      if (currentFilters.leader && type === 'persons') {
        results = results.filter(item => 
          (item as Person).leader_name?.toLowerCase().includes(currentFilters.leader!.toLowerCase())
        );
      }

      const searchTime = timer.end();
      
      setSearchStats({
        totalResults: results.length,
        searchTime: Math.round(searchTime)
      });

      onResults(results);

      // Add to search history if it's a meaningful search
      if (query.trim() && query.length > 2) {
        setSearchHistory(prev => {
          const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 5);
          localStorage.setItem(`search_history_${type}`, JSON.stringify(newHistory));
          return newHistory;
        });
      }
    }, 300),
    [data, type, onResults]
  );

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const stations = new Set<string>();
    const workplaces = new Set<string>();
    const residences = new Set<string>();
    const leaders = new Set<string>();

    data.forEach(item => {
      if (item.station_number) stations.add(item.station_number);
      if (item.workplace) workplaces.add(item.workplace);
      if (item.residence) residences.add(item.residence);
      if (type === 'persons' && 'leader_name' in item && item.leader_name) {
        leaders.add(item.leader_name);
      }
    });

    return {
      stations: Array.from(stations).sort(),
      workplaces: Array.from(workplaces).sort(),
      residences: Array.from(residences).sort(),
      leaders: Array.from(leaders).sort()
    };
  }, [data, type]);

  // Perform search with performance monitoring
  const performSearch = (query: string, currentFilters: SearchFilters) => {
    const timer = performanceMonitor.startTimer(`Enhanced Search - ${type}`);
    
    let results = data;

    // Apply text search
    if (query.trim()) {
      if (type === 'leaders') {
        results = dataManager.searchLeaders(query, data as Leader[]);
      } else {
        results = dataManager.searchPersons(query, currentFilters.leader || '', data as Person[]);
      }
    }

    // Apply additional filters
    results = results.filter(item => {
      if (currentFilters.station && item.station_number !== currentFilters.station) return false;
      if (currentFilters.workplace && item.workplace !== currentFilters.workplace) return false;
      if (currentFilters.residence && item.residence !== currentFilters.residence) return false;
      if (type === 'persons' && currentFilters.leader && 'leader_name' in item && item.leader_name !== currentFilters.leader) return false;
      return true;
    });

    const searchTime = timer.end();
    
    setSearchStats({
      totalResults: results.length,
      searchTime: Math.round(searchTime)
    });

    onResults(results);

    // Add to search history if it's a meaningful search
    if (query.trim() && query.length > 2) {
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 5);
        localStorage.setItem(`search_history_${type}`, JSON.stringify(newHistory));
        return newHistory;
      });
    }
  };

  // Load search history on mount
  useEffect(() => {
    const saved = localStorage.getItem(`search_history_${type}`);
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, [type]);

  // Handle history item click
  const handleHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    debouncedSearch(historyItem, filters);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value, filters);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    debouncedSearch(searchQuery, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    onResults(data);
    setSearchStats({ totalResults: data.length, searchTime: 0 });
  };

  // Use search history item
  const useHistoryItem = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query, filters);
  };

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-8 px-2"
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {(searchQuery || activeFiltersCount > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>
            {searchStats.totalResults} نتيجة
          </span>
          {searchStats.searchTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {searchStats.searchTime}ms
            </span>
          )}
        </div>
        {data.length > 0 && (
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            من أصل {data.length}
          </span>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Station Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">المحطة</label>
                <Select
                  value={filters.station || ''}
                  onValueChange={(value) => handleFilterChange('station', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحطة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع المحطات</SelectItem>
                    {filterOptions.stations.map(station => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Workplace Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">مكان العمل</label>
                <Select
                  value={filters.workplace || ''}
                  onValueChange={(value) => handleFilterChange('workplace', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مكان العمل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع أماكن العمل</SelectItem>
                    {filterOptions.workplaces.map(workplace => (
                      <SelectItem key={workplace} value={workplace}>
                        {workplace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Residence Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">السكن</label>
                <Select
                  value={filters.residence || ''}
                  onValueChange={(value) => handleFilterChange('residence', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السكن" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع أماكن السكن</SelectItem>
                    {filterOptions.residences.map(residence => (
                      <SelectItem key={residence} value={residence}>
                        {residence}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Leader Filter (for persons only) */}
              {type === 'persons' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">القائد</label>
                  <Select
                    value={filters.leader || ''}
                    onValueChange={(value) => handleFilterChange('leader', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القائد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">جميع القادة</SelectItem>
                      {filterOptions.leaders.map(leader => (
                        <SelectItem key={leader} value={leader}>
                          {leader}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !searchQuery && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">عمليات البحث الأخيرة</h4>
          <div className="flex flex-wrap gap-2">
            {searchHistory.filter(item => item !== searchQuery).slice(0, 3).map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(String(item))}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
              >
                {String(item)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
