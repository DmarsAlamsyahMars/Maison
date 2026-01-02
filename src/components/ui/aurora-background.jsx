"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        // ADDED: A simple static gradient fallback for mobile (from-white to-neutral-100)
        // This ensures mobile isn't boring, but is super fast.
        "transition-bg relative flex flex-col items-center justify-center bg-[#FDFBF7] bg-gradient-to-b from-white to-stone-100 text-slate-950",
        className
      )}
      {...props}
    >
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{
          "--aurora":
            "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
          "--dark-gradient":
            "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
          "--white-gradient":
            "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
          "--blue-300": "#fbbf24",
          "--blue-400": "#f59e0b", 
          "--blue-500": "#d97706", 
          "--indigo-300": "#fcd34d", 
          "--violet-200": "#fffbeb", 
          "--black": "#000",
          "--white": "#fff",
          "--transparent": "transparent",
        }}
      >
        <div
          // MODIFIED: Added 'hidden md:block' at the start of the className string.
          // Result: The heavy aurora computation is completely REMOVED on mobile, 
          // and only loads on Desktop (md breakpoint and up).
          className={cn(
            `
            hidden md:block 
            after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[2px] will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:content-[""]`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};