import * as React from "react";
import { cn } from "../../lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "flex min-h-[60px] w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-sm shadow-sm placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/20 focus-visible:border-red-500 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";

export { Textarea };