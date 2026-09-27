"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: items }] = await Promise.all([
        supabase.from("categories").select("*").order("id"),
        supabase
          .from("listings")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(24),
      ]);
      setCategories(cats || []);
      setListings(items || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = query
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(query.toLowerCase())
      )
    : listings;

  return (
    <div className="wrap">
      <Header onSearch={setQuery} />

      <section style={{ padding: "26px 16px 8px" }}>
        <h1 style={{ fontSize: 28, lineHeight: 1.15, marginBottom: 10 }}>
          Buy &amp; sell
          <br />
          near you
        </h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 16, maxWidth: "38ch" }}>
          Discover products, services and trusted sellers around your community.
        </p>
        <Link href="/sell" className="btn btn-primary">
          Sell Something
        </Link>
      </section>

      <section className="section">
        <h2>Categories</h2>
        <div className="cat-row">
          {categories.map((c) => (
            <div className="cat" key={c.id}>
              <div className="cat-ico">{c.icon}</div>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>{query ? `Results for "${query}"` : "Latest listings"}</h2>
        {loading && <p className="empty">Loading listings…</p>}
        {!loading && filtered.length === 0 && (
          <p className="empty">
            No listings yet. Be the first — <Link href="/sell" style={{ color: "var(--green)" }}>post one now</Link>.
          </p>
        )}
        <div className="grid">
          {filtered.map((l) => (
            <ProductCard listing={l} key={l.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
