import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Trophy, LogOut, PlusCircle, Users, UserRound } from "lucide-react";
import { signOut } from "@/lib/actions";

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-pitch">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pitch text-slate-950 shadow-lg shadow-pitch/20">
            <Trophy size={21} />
          </span>
          <span className="text-xl">ScoreBite</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link className="button-secondary hidden sm:inline-flex" href="/create-league">
                <PlusCircle size={17} />
                Create
              </Link>
              <Link className="button-secondary hidden sm:inline-flex" href="/join-league">
                <Users size={17} />
                Join
              </Link>
              <Link className="button-secondary hidden md:inline-flex" href="/matches">
                Matches
              </Link>
              <Link className="button-secondary" href="/dashboard">
                Dashboard
              </Link>
              <Link className="button-secondary" href="/profile" aria-label="Profile">
                <UserRound size={17} />
              </Link>
              <form action={signOut}>
                <button className="button-primary" aria-label="Sign out" type="submit">
                  <LogOut size={17} />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="button-secondary hidden sm:inline-flex" href="/matches">
                Matches
              </Link>
              <Link className="button-primary" href="/login">
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
