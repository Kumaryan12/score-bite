"use client";

import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";

export default function CopyInviteButton({
  inviteCode,
  compact = false
}: {
  inviteCode: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyInviteCode() {
    setCopying(true);
    setCopyError(false);

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2000);
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className={compact ? "grid gap-2" : "inline-grid gap-2"}>
      <button
        aria-label={`Copy invite code ${inviteCode}`}
        className={
          compact
            ? "w-full rounded-lg border border-mustard/20 bg-mustard/15 p-3 text-left transition-colors duration-150 hover:border-mustard/45 hover:bg-mustard/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            : "mt-3 inline-flex items-center gap-2 rounded-full border border-pitch/25 bg-pitch/10 px-4 py-2 text-sm font-black text-pitch shadow-sm transition-colors duration-150 hover:border-pitch/50 hover:bg-pitch/15 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        }
        disabled={copying}
        onClick={copyInviteCode}
        type="button"
      >
        {compact ? (
          <>
            <span className="flex items-center gap-1 text-xs font-bold text-ink/60">
              {copying ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : copied ? <Check size={13} /> : <Copy size={13} />}
              {copying ? "Copying..." : copied ? "Copied" : "Invite"}
            </span>
            <span className="mt-1 block text-lg font-black text-ink">{inviteCode}</span>
          </>
        ) : (
          <>
            {copying ? <Loader2 className="h-4 w-4 animate-spin" /> : copied ? <Check size={16} /> : <Copy size={16} />}
            {copying ? "Copying..." : copied ? "Copied" : inviteCode}
          </>
        )}
      </button>
      {copyError ? (
        <p className="text-xs font-bold text-salsa" role="alert">
          Copy failed. Select the code and copy it manually.
        </p>
      ) : null}
    </div>
  );
}
