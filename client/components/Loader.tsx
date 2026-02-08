"use client"

import { Brain } from "lucide-react"
import { cn } from "@/lib/utils" // This is standard in shadcn/ui setups

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  label?: string;
}

export function Loader({ 
  className, 
  size = "md", 
  fullScreen = false, 
  label = "Loading..." 
}: LoaderProps) {
  
  const sizeClasses = {
    sm: "size-6 border-2",
    md: "size-10 border-3",
    lg: "size-16 border-4",
    xl: "size-24 border-8"
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-5",
    lg: "size-8",
    xl: "size-12"
  }

  const loaderContent = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer Spinning Ring */}
        <div 
          className={cn(
            "rounded-full border-slate-200 border-t-indigo-600 animate-spin",
            sizeClasses[size]
          )} 
        />
        
        {/* Inner Static Icon (Examy Brand) */}
        <div className="absolute">
          <Brain className={cn("text-indigo-600/50 animate-pulse", iconSizes[size])} />
        </div>
      </div>
      
      {label && (
        <p className={cn(
          "font-bold text-slate-500 tracking-tight animate-pulse",
          size === "sm" ? "text-xs" : "text-sm"
        )}>
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}