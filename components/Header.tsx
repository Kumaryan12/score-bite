import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Trophy, LogOut, PlusCircle, Users, UserRound, Activity } from "lucide-react";
import { signOut } from "@/lib/actions";

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white transition-transform group-hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
            <Trophy size={16} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            ScoreBite
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              {/* Desktop Links */}
              <div className="hidden items-center gap-1 md:flex md:mr-2">
                <Link 
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100" 
                  href="/create-league"
                >
                  <PlusCircle size={15} />
                  Create
                </Link>
                <Link 
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100" 
                  href="/join-league"
                >
                  <Users size={15} />
                  Join
                </Link>
                <Link 
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100" 
                  href="/matches"
                >
                  <Activity size={15} />
                  Matches
                </Link>
              </div>

              {/* Core Links (Always visible except very small screens) */}
              <Link 
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:block" 
                href="/dashboard"
              >
                Dashboard
              </Link>
              
              {/* Icon Buttons */}
              <div className="flex items-center gap-1 border-l border-zinc-200 pl-1 dark:border-zinc-800 sm:pl-2">
                <Link 
                  className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100" 
                  href="/profile" 
                  aria-label="Profile"
                >
                  <UserRound size={18} />
                </Link>
                
                <form action={signOut}>
                  <button 
                    className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-red-400" 
                    aria-label="Sign out" 
                    type="submit"
                  >
                    <LogOut size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link 
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:block" 
                href="/matches"
              >
                Matches
              </Link>
              <Link 
                className="ml-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-white" 
                href="/login"
              >
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}