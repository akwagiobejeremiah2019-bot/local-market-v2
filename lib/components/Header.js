"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Header({ onSearch }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header>
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">L</span>Local Market
        </Link>
        <span className="spacer"></span>
        <Link href="/sell" className="icon-btn" aria-label="Sell">➕</Link>
        <Link href={user ? "/profile" : "/auth"} className="icon-btn" aria-label="Account">
          {user ? "👤" : "🔑"}
        </Link>
      </div>
      {onSearch && (
        <div className="searchrow">
          <div className="search">
            🔎
            <input
              placeholder="Search products, services, sellers"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
