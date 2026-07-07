"use client";

import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-page-header">
      <div className="min-w-0">
        <h2 className="admin-page-title">{title}</h2>
        {description && <p className="admin-page-desc">{description}</p>}
      </div>
      {action}
    </div>
  );
}
