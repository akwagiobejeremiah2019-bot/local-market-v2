"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";

export default function ListingDetail({ params }) {
  const { id } = params;
  const [listing, setListing] = useState(undefined);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: item } = await supabase.from("listings").select("*").eq("id", id).single();
      setListing(item || null);
      if (item) {
        const { data: sellerData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", item.seller_id)
          .single();
        setSeller(sellerData || null);
      }
    }
    load();
  }, [id]);

  if (listing === undefined) {
    return (
      <div className="wrap">
        <Header />
        <p className="empty">Loading…</p>
      </div>
    );
  }

  if (listing === null) {
    return (
      <div className="wrap">
        <Header />
        <p className="empty">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="wrap">
      <Header />
      <div
        style={{
          height: 260,
          background: listing.image_url
            ? `center/cover url(${listing.image_url})`
            : "var(--green-tint)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        {!listing.image_url && "🛍️"}
      </div>
      <div style={{ padding: 20 }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>{listing.title}</h1>
        <p style={{ color: "var(--green-deep)", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
          ₦{Number(listing.price).toLocaleString("en-NG")}
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: 13, marginBottom: 18 }}>
          📍 {listing.location}
        </p>

        {listing.description && (
          <div className="card" style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{listing.description}</p>
          </div>
        )}

        {seller && (
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {seller.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{seller.full_name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{seller.location} · {seller.phone}</div>
            </div>
          </div>
        )}

        <a href={`tel:${seller?.phone || ""}`} className="btn btn-primary btn-block" style={{ marginTop: 16 }}>
          Contact seller
        </a>
      </div>
    </div>
  );
}
