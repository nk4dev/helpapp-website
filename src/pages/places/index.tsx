import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/router";
import openDeepLink from "../../lib/openApp";

export default function PlacesPage() {
  const { currentUser }: any = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [currentUser]);
  const router = useRouter();
  const [places, setPlaces] = useState([] as any[]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  setTimeout(() => setCopied(false), 2000);
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/v1/place/list");
        if (!res.ok) {
          const body = await res.text();
          setError("API /place/list error: " + res.status + " " + body);
          return;
        }
        const data = await res.json();
        setPlaces(data);
      } catch (err: any) {
        setError("Failed to fetch places: " + (err.message || err));
      }
    };
    fetchPlaces();
  }, []);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          gap: 16,
          height: "80vh",
          width: "100%",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: 360, overflowY: "auto", padding: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h2>登録済み施設一覧</h2>
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!places.length && <div>loading...</div>}
          {error && <div>施設が見つかりません。</div>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {places.map((p) => (
              <li
                key={p.id}
                style={{ padding: 8, borderBottom: "1px solid #eee" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{p.name}</strong>
                  <span style={{ fontSize: 12, color: "#666" }}>
                    {p.category}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#444" }}>
                  {p.description}
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    style={{ padding: "4px 8px" }}
                    onClick={() => {
                      openDeepLink(
                        `helpapp://?viewmap=navigate&lat=${p.latitude}&lng=${p.longitude}&login=${isLoggedIn}`,
                        {
                          androidPackage: "jp.ac.chuo.app.machinaka",
                          timeout: 1500,
                        },
                      );
                    }}
                  >
                    行き方
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {copied && (
            <div
              style={{
                border: "1px solid black",
                padding: 8,
                color: "black",
                backdropFilter: "blur(4px)",
                position: "fixed",
                bottom: 16,
                right: 16,
              }}
            >
              座標をコピーしました
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
