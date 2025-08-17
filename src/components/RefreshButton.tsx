import React from 'react';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useDataRefresh, formatLastRefresh } from '../hooks/useDataRefresh';

import { Leader, Person } from '../lib/localStorageOperations';

interface RefreshButtonProps {
  onDataRefreshed?: (data: { leaders: Leader[]; persons: Person[] }) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showLastRefresh?: boolean;
  className?: string;
}

export default function RefreshButton({ 
  onDataRefreshed, 
  variant = 'outline',
  size = 'default',
  showLastRefresh = true,
  className = ''
}: RefreshButtonProps) {
  const { refreshState, refreshData, clearError, canRefresh } = useDataRefresh();

  const handleRefresh = async () => {
    try {
      clearError();
      const data = await refreshData();
      onDataRefreshed?.(data);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  const getButtonText = () => {
    if (refreshState.isRefreshing) return 'جاري التحديث...';
    if (refreshState.error) return 'إعادة المحاولة';
    return 'تحديث البيانات';
  };

  const getButtonIcon = () => {
    if (refreshState.error) return <AlertCircle className="h-4 w-4" />;
    return (
      <RefreshCw 
        className={`h-4 w-4 ${refreshState.isRefreshing ? 'animate-spin' : ''}`} 
      />
    );
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={refreshState.error ? 'destructive' : variant}
              size={size}
              onClick={handleRefresh}
              disabled={!canRefresh}
              className="flex items-center gap-2"
            >
              {getButtonIcon()}
              {size !== 'sm' && getButtonText()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p>{getButtonText()}</p>
              {refreshState.lastRefresh && (
                <p className="text-xs text-muted-foreground mt-1">
                  آخر تحديث: {formatLastRefresh(refreshState.lastRefresh)}
                </p>
              )}
              {refreshState.error && (
                <p className="text-xs text-red-400 mt-1">
                  {refreshState.error}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {showLastRefresh && refreshState.lastRefresh && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatLastRefresh(refreshState.lastRefresh)}</span>
            {refreshState.refreshCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {refreshState.refreshCount}
              </Badge>
            )}
          </div>
        )}

        {refreshState.error && (
          <Badge variant="destructive" className="text-xs">
            خطأ
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
}
