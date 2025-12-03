import Layout from "../../components/layout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/index.module.css";
import { useAuth } from "../../lib/AuthContext";

export default function AddPlacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("hospital");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Basic validation
    if (!name.trim() || !category)
      return setError("必須項目が入力されていません");
    const lat = parseFloat(String(latitude));
    const lng = parseFloat(String(longitude));
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return setError("緯度/経度は数値で指定してください");

    setLoading(true);
    try {
      const res = await fetch("/api/v1/place/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          latitude: lat,
          longitude: lng,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.error || "登録に失敗しました");
        return;
      }
      setSuccess("登録が完了しました");
      // Redirect to places map after short delay
      setTimeout(() => router.push("/places"), 800);
    } catch (err: any) {
      console.error("Add place failed", err);
      setError(err?.message || "ネットワークエラー");
    } finally {
      setLoading(false);
    }
  };

  const auth = useAuth();

  const useCurrentLocation = () => {
    if (!navigator || !navigator.geolocation) {
      setError("このブラウザでは現在地が取得できません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude));
        setLongitude(String(pos.coords.longitude));
      },
      (err) => {
        setError("現在地取得に失敗しました");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={styles.container}>
      {auth.currentUser ? (
        <main className={styles.main}>
          <h1>施設情報を追加</h1>
          <form onSubmit={submit} style={{ width: "100%", maxWidth: 600 }}>
            <div style={{ marginBottom: 8 }}>
              <label>名称（必須）</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>カテゴリー（必須）</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="hospital">病院</option>
                <option value="pharmacy">薬局</option>
                <option value="police">交番/公安</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>説明</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label>緯度</label>
                <input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="例: 35.0000...."
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>経度</label>
                <input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="例: 139.0000...."
                />
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="btn"
              >
                現在地を使う
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button disabled={loading} type="submit">
                登録
              </button>
              <button
                type="button"
                onClick={() => router.push("/places")}
                style={{ marginLeft: 8 }}
              >
                キャンセル
              </button>
            </div>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            {success && (
              <div style={{ color: "green", marginTop: 8 }}>{success}</div>
            )}
          </form>
        </main>
      ) : (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <p>ページが見つかりませんでした</p>
          <Link href="/">トップページに戻る</Link>
        </div>
      )}
    </div>
  );
}

AddPlacePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
