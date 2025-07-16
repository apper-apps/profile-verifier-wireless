import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    pending: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium status-badge",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;