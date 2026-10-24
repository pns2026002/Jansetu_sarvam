import React from "react";
import { Inbox, SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  isSearch?: boolean;
}

export function EmptyState({
  title = "No incidents found",
  description = "No emergency reports match the selected filters.",
  isSearch = false,
}: EmptyStateProps) {
  const Icon = isSearch ? SearchX : Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-surface border border-surface-border text-center">
      <div className="p-3 rounded-full bg-surface-raised border border-surface-border text-text-muted mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-xs text-text-muted max-w-sm">{description}</p>
    </div>
  );
}
