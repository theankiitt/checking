import {  manrope } from "@/lib/fonts";
import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className={`text-3xl font-extrabold text-gray-900 ${manrope.className}`}>{title}</h1>
        {description && <p className="text-gray-500 mt-1 text-lg">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
