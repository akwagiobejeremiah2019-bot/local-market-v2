"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";

export default function SellPage() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Abakaliki");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    supabase.from("categories").select("*").order("id").then(({ data }) => setCategories(data || []));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    let image_url = null;
    if (file) {
      const path = `listings/${user.id}-${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("public-images")
        .upload(path, file);
      if (uploadErr) {
        setLoading(false);
        setMsg({ type: "err", text: "Image upload failed: " + uploadErr.message });
        return;
      }
      const { data: urlData } = supabase.storage.from("public-images").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("listings").insert({
      seller_id: user.id,
      title,
      description,
      price: Number(price),
      location,
      category_id: categoryId || null,
      image_url,
    });

    setLoading(false);
    if (error) {
      setMsg({ type: "err", text: error.message });
    } else {
      router.push("/profile");
    }
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
          <p style={{ marginBottom: 14 }}>You need an account to post a listing.</p>
          <a href="/auth" className="btn btn-primary btn-block">Log in or sign up</a>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <Header />
      <div style={{ padding: 20 }}>
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Sell something</h2>
          {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Samsung Galaxy S23" />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Condition, details, reason for selling…" />
            </div>
            <div className="field">
              <label>Price (₦)</label>
              <input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="650000" />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Location</label>
              <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Abakaliki" />
            </div>
            <div className="field">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading} type="submit">
              {loading ? "Posting…" : "Post listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
