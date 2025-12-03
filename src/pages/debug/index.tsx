import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import openDeepLink from "../../lib/openApp";
import Layout from "../../components/layout";
import Link from "next/link";

export default function DebugDeepLinkPage() {
  const [ua, setUa] = useState("");
  const [viewmap, setViewmap] = useState("view");
  const [lat, setLat] = useState("35.6812");
  const [lng, setLng] = useState("139.7671");
  const [login, setLogin] = useState(true);
  const [log, setLog] = useState<string[]>([]);
  const [lastIntent, setLastIntent] = useState("");
  const [lastDeep, setLastDeep] = useState("");

  const auth = useAuth();

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setUa(navigator.userAgent || "");
    }
  }, []);

  const appendLog = (s: string) => setLog((prev) => [s, ...prev].slice(0, 50));

  const createDeep = () => {
    return `helpapp://?viewmap=${viewmap}&lat=${encodeURIComponent(
      lat,
    )}&lng=${encodeURIComponent(lng)}&login=${login}`;
  };

  const createIntent = () => {
    const query = `viewmap=${viewmap}&lat=${lat}&lng=${lng}&login=${login}`;
    return `intent://open?${query}#Intent;scheme=helpapp;package=jp.ac.chuo.app.machinaka;end`;
  };

  const onOpenDirect = () => {
    const d = createDeep();
    setLastDeep(d);
    appendLog(`Direct assigning location.href -> ${d}`);
    // direct assignment (works in many browsers)
    try {
      window.location.href = d;
    } catch (e: any) {
      appendLog(`Exception: ${e && e.message ? e.message : String(e)}`);
    }
  };

  const onOpenIntentDirect = () => {
    const i = createIntent();
    setLastIntent(i);
    appendLog(`Intent direct -> ${i}`);
    try {
      window.location.href = i;
    } catch (e: any) {
      appendLog(`Exception: ${e && e.message ? e.message : String(e)}`);
    }
  };

  const onOpenWithHelper = async () => {
    const d = createDeep();
    setLastDeep(d);
    appendLog(`openDeepLink(...) -> ${d}`);
    try {
      const result = await openDeepLink(d, {
        androidPackage: "jp.ac.chuo.app.machinaka",
        debug: true,
        timeout: 1500,
      });
      appendLog(`Result: ${result}`);
    } catch (e: any) {
      appendLog(`Error: ${e && e.message ? e.message : String(e)}`);
    }
  };

  const onOpenWithHelperIntentLast = async () => {
    const i = createIntent();
    setLastIntent(i);
    appendLog(`openDeepLink(intent...) -> ${i}`);
    try {
      const result = await openDeepLink(i, {
        androidPackage: "jp.ac.chuo.app.machinaka",
        debug: true,
        timeout: 1500,
      });
      appendLog(`Result: ${result}`);
    } catch (e: any) {
      appendLog(`Error: ${e && e.message ? e.message : String(e)}`);
    }
  };

  const copyToClipboard = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      appendLog(`Copied to clipboard: ${txt}`);
    } catch (e) {
      appendLog(`Copy failed: ${e}`);
    }
  };

  return (
    <Layout>
      {auth.currentUser ? (
        <div style={{ padding: 16 }}>
          <h2>Deep Link Debug Page</h2>
          <div style={{ marginBottom: 8 }}>
            <div>User Agent: {ua}</div>
            <div>
              Platform:{" "}
              {/(android)/i.test(ua)
                ? "Android"
                : /(iPhone|iPad|iPod)/i.test(ua)
                  ? "iOS"
                  : "Desktop"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <label
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>viewmap:</span>
              <select
                value={viewmap}
                onChange={(e) => setViewmap(e.target.value)}
              >
                <option value="view">view</option>
                <option value="navigate">navigate</option>
              </select>
            </label>

            <label
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>lat</span>
              <input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                style={{ width: 120 }}
              />
            </label>

            <label
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>lng</span>
              <input
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                style={{ width: 120 }}
              />
            </label>

            <label
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>login</span>
              <input
                type="checkbox"
                checked={login}
                onChange={(e) => setLogin(e.target.checked)}
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <button onClick={onOpenDirect}>Open direct (helpapp://)</button>
            <button onClick={onOpenIntentDirect}>Open intent://</button>
            <button onClick={onOpenWithHelper}>
              Open with openDeepLink (helpapp:// then intent)
            </button>
            <button onClick={onOpenWithHelperIntentLast}>
              Open with openDeepLink (intent)
            </button>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div>Last helpapp:// link:</div>
            <div style={{ background: "#fafafa", padding: 8 }}>
              {lastDeep || "(none)"}
            </div>
            <div style={{ marginTop: 8 }}>Last intent:// link:</div>
            <div style={{ background: "#fafafa", padding: 8 }}>
              {lastIntent || "(none)"}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <h3>Log</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => {
                  const txt = createDeep();
                  copyToClipboard(txt);
                }}
              >
                Copy helpapp:// link
              </button>
              <button
                onClick={() => {
                  const txt = createIntent();
                  copyToClipboard(txt);
                }}
              >
                Copy intent:// link
              </button>
              <button onClick={() => setLog([])}>Clear Log</button>
            </div>
            <div
              style={{
                maxHeight: 320,
                overflow: "auto",
                background: "#222",
                color: "#f8f8f8",
                padding: 8,
                fontFamily: "monospace",
              }}
            >
              {log.length === 0 ? (
                <div>(log is empty)</div>
              ) : (
                log.map((l, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <p>ページが見つかりませんでした</p>
          <Link href="/">トップページに戻る</Link>
        </div>
      )}
    </Layout>
  );
}
