import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Leader, Person } from '../lib/localStorageOperations';
import { getLeadersFromStorage, getPersonsFromStorage } from '../lib/localStorageOperations';
import { dataManager, performanceMonitor } from '../lib/dataIndexing';

interface RefreshState {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  error: string | null;
  refreshCount: number;
}

interface UseDataRefreshReturn {
  refreshState: RefreshState;
  refreshData: () => Promise<{ leaders: Leader[]; persons: Person[] }>;
  forceRefresh: () => Promise<{ leaders: Leader[]; persons: Person[] }>;
  clearError: () => void;
  canRefresh: boolean;
}

// Minimum time between refreshes (in milliseconds)
const MIN_REFRESH_INTERVAL = 2000; // 2 seconds

export function useDataRefresh(): UseDataRefreshReturn {
  const [refreshState, setRefreshState] = useState<RefreshState>({
    isRefreshing: false,
    lastRefresh: null,
    error: null,
    refreshCount: 0
  });

  const lastRefreshTime = useRef<number>(0);

  const canRefresh = !refreshState.isRefreshing && 
    (Date.now() - lastRefreshTime.current) > MIN_REFRESH_INTERVAL;

  const refreshData = useCallback(async (force = false): Promise<{ leaders: Leader[]; persons: Person[] }> => {
    // Skip refresh if not forced and data was recently refreshed
    const now = Date.now();
    if (!force && now - lastRefreshTime.current < 2000) {
      console.log('⏳ Refresh skipped - recent refresh');
      return { leaders: [], persons: [] };
    }

    setRefreshState(prev => ({
      ...prev,
      isRefreshing: true,
      error: null
    }));

    const timer = performanceMonitor.startTimer('Data Refresh');
    
    try {
      // Use localStorage directly for faster access
      const leaders = getLeadersFromStorage();
      const persons = getPersonsFromStorage();
      
      console.log('✅ Data loaded from localStorage (fast mode)');

      // Only rebuild indexes if forced or significant time has passed
      if (force || now - lastRefreshTime.current > 10000) {
        dataManager.rebuildIndexes(leaders, persons);
        console.log('🔄 Indexes rebuilt');
      }
      
      lastRefreshTime.current = now;
      
      const refreshTime = new Date();
      setRefreshState(prev => ({
        ...prev,
        isRefreshing: false,
        lastRefresh: refreshTime,
        refreshCount: prev.refreshCount + 1,
        error: null
      }));

      timer.end();
      
      return { leaders, persons };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في تحديث البيانات';
      
      setRefreshState(prev => ({
        ...prev,
        isRefreshing: false,
        error: errorMessage
      }));

      timer.end();
      throw error;
    }
  }, []);

  const forceRefresh = useCallback(async (): Promise<{ leaders: Leader[]; persons: Person[] }> => {
    // Reset the last refresh time to allow immediate refresh
    lastRefreshTime.current = 0;
    return refreshData();
  }, [refreshData]);

  const clearError = useCallback(() => {
    setRefreshState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    refreshState,
    refreshData,
    forceRefresh,
    clearError,
    canRefresh
  };
}

// Hook for automatic refresh with interval
export function useAutoRefresh(intervalMs: number = 30000): UseDataRefreshReturn {
  const dataRefresh = useDataRefresh();
  const intervalRef = useRef<NodeJS.Timeout>();

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (dataRefresh.canRefresh) {
        dataRefresh.refreshData().catch(error => {
          console.warn('Auto refresh failed:', error);
        });
      }
    }, intervalMs);
  }, [dataRefresh, intervalMs]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, [stopAutoRefresh]);

  return {
    ...dataRefresh,
    startAutoRefresh,
    stopAutoRefresh
  } as UseDataRefreshReturn & {
    startAutoRefresh: () => void;
    stopAutoRefresh: () => void;
  };
}

// Utility function to format last refresh time
export function formatLastRefresh(lastRefresh: Date | null): string {
  if (!lastRefresh) return 'لم يتم التحديث بعد';

  const now = new Date();
  const diffMs = now.getTime() - lastRefresh.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) {
    return `منذ ${diffSeconds} ثانية`;
  } else if (diffMinutes < 60) {
    return `منذ ${diffMinutes} دقيقة`;
  } else if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  } else {
    return lastRefresh.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
