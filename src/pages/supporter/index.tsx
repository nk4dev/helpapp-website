import { useEffect, useState } from "react";
import Layout from "../../components/layout";

export default function SupporterScreen() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    window.innerWidth < 600 ? setIsMobile(true) : setIsMobile(false);
  }, []);
  return (
    <Layout>
      <div
        style={{
          padding: isMobile ? "20px" : "50px",
          maxWidth: isMobile ? "100%" : "800px",
          margin: "0 auto",
          textAlign: isMobile ? "center" : "left",
          fontSize: isMobile ? "16px" : "18px",
        }}
      >
        <h1>救助者・協力企業の方へ</h1>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2>救助者モード</h2>
            <p>
              救助者モードでは、アプリから必要な支援を提供することができます。
            </p>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
