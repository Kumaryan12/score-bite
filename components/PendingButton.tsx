"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/helpers";

export default function PendingButton({
  children,
  pendingText,
  className,
  disabled = false,
  ariaLabel
}: {
  children: ReactNode;
  pendingText: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        "transition-colors duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      disabled={isDisabled}
      type="submit"
    >
      {pending ? (
        <>
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
