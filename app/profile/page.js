"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      if (data.user) {
        const [{ data: p }, { data: listings }] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", data.user.id).single(),
          supabase.from("listings").select("*").eq("seller_id", data.user.id).order("created_at", { ascending: false }),
        ]);
        setProfile(p);
        setMyListings(listings || []);
      }
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (user === undefined) {
    return (
      <div className="wrap">
        <Header />
        <p className="empty">Loading…</p>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="wrap">
        <Header />
        <div style={{ padding: 20 }} className="card">
          <p style={{ marginBottom: 14 }}>Log in to view your profile and listings.</p>
          <a href="/auth" className="btn btn-primary btn-block">Log in or sign up</a>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <Header />
      <div style={{ padding: 20 }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>
            {profile?.full_name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{profile?.full_name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{profile?.location} · {profile?.phone}</div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>

        <h2 style={{ fontSize: 17, marginBottom: 12 }}>Your listings</h2>
        {myListings.length === 0 ? (
          <p className="empty">
            You haven&apos;t posted anything yet.{" "}
            <a href="/sell" style={{ color: "var(--green)" }}>Sell something</a>
          </p>
        ) : (
          <div className="grid">
            {myListings.map((l) => (
              <ProductCard listing={l} key={l.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
