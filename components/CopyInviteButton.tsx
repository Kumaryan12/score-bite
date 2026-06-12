"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyInviteButton({
  inviteCode,
  compact = false
}: {
  inviteCode: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyInviteCode() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      aria-label={`Copy invite code ${inviteCode}`}
      className={
        compact
          ? "w-full rounded-lg border border-mustard/20 bg-mustard/15 p-3 text-left transition hover:border-mustard/45 hover:bg-mustard/20"
          : "mt-3 inline-flex items-center gap-2 rounded-full border border-pitch/25 bg-pitch/10 px-4 py-2 text-sm font-black text-pitch shadow-sm transition hover:border-pitch/50 hover:bg-pitch/15"
      }
      onClick={copyInviteCode}
      type="button"
    >
      {compact ? (
        <>
          <span className="flex items-center gap-1 text-xs font-bold text-ink/60">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Invite"}
          </span>
          <span className="mt-1 block text-lg font-black text-ink">{inviteCode}</span>
        </>
      ) : (
        <>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : inviteCode}
        </>
      )}
    </button>
  );
}
