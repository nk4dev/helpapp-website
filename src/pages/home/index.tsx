import styles from "../../styles/index.module.css";
import { useAuth } from "../../lib/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { openDeepLink } from "../../lib/openApp";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const auth = getAuth();
  const [isStatus, setIsStatus] = useState("");
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみnavigatorオブジェクトにアクセス
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  const handleOpenApp = async () => {
    if (!isAndroid) {
      setIsStatus("no-android");
      return;
    }

    const deepLink = "helpapp://map";
    const result = await openDeepLink(deepLink, {
      androidPackage: "jp.ac.chuo.app.machinaka",
      androidFallbackUrl:
        "https://play.google.com/store/apps/details?id=jp.ac.chuo.app.machinaka",
      timeout: 2500,
    });

    if (result === "fallback") {
      // アプリが起動しなかった（インストールされていない等）
      setIsStatus("not-installed");
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/signin");
      })
      .catch((error) => {
        // An error happened.
        console.error("Sign out error", error);
      });
  };

  if (!currentUser) {
    router.push("/signin");
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {currentUser && (
          <div>
            <h2>{currentUser.displayName} さん、こんにちは！</h2>
            <p>
              {" "}
              <span>{currentUser.email}</span> でログイン中
            </p>

            {isStatus === "no-android" ? (
              <p className="text-red-500 mt-2">
                Android端末でのみアプリを開くことができます。
              </p>
            ) : isStatus === "not-installed" ? (
              <p className="text-red-500 mt-2">
                アプリがインストールされていないか、起動に失敗しました。ストアからインストールしてください。
              </p>
            ) : (
              <button
                onClick={handleOpenApp}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                アプリを開く
              </button>
            )}
            <button onClick={handleSignOut}>ログアウト</button>
          </div>
        )}
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
