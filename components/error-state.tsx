import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-start justify-between gap-3 text-xs">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-red-200">Processing Error</h4>
          <p className="mt-0.5 text-text-secondary">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-medium transition-colors text-xs flex-shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
