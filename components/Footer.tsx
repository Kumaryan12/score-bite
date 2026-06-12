import { Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm sm:flex-row sm:px-6">
        
        {/* App Disclaimer Section */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">ScoreBite</p>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            Friendly bragging rights only. No odds. No payments. No gambling.
          </p>
        </div>

        {/* Creator Details Section */}
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <p className="text-zinc-500 dark:text-zinc-400">
            Built by <span className="font-medium text-zinc-900 dark:text-zinc-100">Aryan Kumar</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:kumararyan66472@gmail.com"
              className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
              aria-label="Email Aryan Kumar"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/kumaryan12"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
              aria-label="Aryan Kumar on LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}