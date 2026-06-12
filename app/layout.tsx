import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createServerSupabaseClient } from "@/lib/supabaseClient";

// Initialize the standard SaaS typography
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScoreBite",
  description: "Private World Cup score predictions with friendly stakes."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 antialiased selection:bg-zinc-200 dark:bg-zinc-950 dark:text-zinc-50 dark:selection:bg-zinc-800">
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}