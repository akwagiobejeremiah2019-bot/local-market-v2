"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");

  const [suName, setSuName] = useState("");
  const [suPhone, setSuPhone] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPw, setSuPw] = useState("");
  const [suLoc, setSuLoc] = useState("Abakaliki");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPw,
    });
    setLoading(false);
    if (error) {
      setMsg({ type: "err", text: error.message });
    } else {
      router.push("/");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (suPw.length < 6) {
      setMsg({ type: "err", text: "Password should be at least 6 characters." });
      return;
    }
    setLoading(true);
    setMsg(null);
    const { data, error } = await supabase.auth.signUp({
      email: suEmail,
      password: suPw,
    });
    if (error) {
      setLoading(false);
      setMsg({ type: "err", text: error.message });
      return;
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: suName,
        phone: suPhone,
        location: suLoc,
      });
    }
    setLoading(false);
    setMsg({
      type: "ok",
      text: "Account created. Check your email to confirm, then log in.",
    });
    setMode("login");
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  async function handleForgot() {
    if (!loginEmail) {
      setMsg({ type: "err", text: "Enter your email above first, then tap this again." });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail);
    setMsg(
      error
        ? { type: "err", text: error.message }
        : { type: "ok", text: "Password reset link sent to your email." }
    );
  }

  return (
    <div className="wrap">
      <Header />
      <div style={{ padding: 20 }}>
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <button
              className="btn"
              style={{
                flex: 1,
                background: mode === "login" ? "var(--green-tint)" : "var(--bg)",
                color: mode === "login" ? "var(--green-deep)" : "var(--ink-soft)",
                border: "1px solid var(--line)",
              }}
              onClick={() => { setMode("login"); setMsg(null); }}
            >
              Log in
            </button>
            <button
              className="btn"
              style={{
                flex: 1,
                background: mode === "signup" ? "var(--green-tint)" : "var(--bg)",
                color: mode === "signup" ? "var(--green-deep)" : "var(--ink-soft)",
                border: "1px solid var(--line)",
              }}
              onClick={() => { setMode("signup"); setMsg(null); }}
            >
              Sign up
            </button>
          </div>

          {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email</label>
                <input required type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label>Password</label>
                <input required type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} placeholder="••••••••" />
              </div>
              <button type="button" onClick={handleForgot} style={{ background: "none", border: "none", color: "var(--green)", fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 14, marginLeft: "auto" }}>
                Forgot password?
              </button>
              <button className="btn btn-primary btn-block" disabled={loading} type="submit">
                {loading ? "Logging in…" : "Log in"}
              </button>
              <div style={{ textAlign: "center", margin: "16px 0", color: "var(--ink-soft)", fontSize: 12 }}>or</div>
              <button type="button" className="btn btn-ghost btn-block" onClick={handleGoogle}>
                🔵 Continue with Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="field">
                <label>Full name</label>
                <input required value={suName} onChange={(e) => setSuName(e.target.value)} placeholder="Chidera Okafor" />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input required value={suPhone} onChange={(e) => setSuPhone(e.target.value)} placeholder="0803 000 0000" />
              </div>
              <div className="field">
                <label>Email</label>
                <input required type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label>Password</label>
                <input required type="password" value={suPw} onChange={(e) => setSuPw(e.target.value)} placeholder="At least 6 characters" />
              </div>
              <div className="field">
                <label>Location</label>
                <select value={suLoc} onChange={(e) => setSuLoc(e.target.value)}>
                  <option>Abakaliki</option>
                  <option>Enugu</option>
                  <option>Lagos</option>
                  <option>Port Harcourt</option>
                  <option>Abuja</option>
                  <option>Onitsha</option>
                </select>
              </div>
              <button className="btn btn-primary btn-block" disabled={loading} type="submit">
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
