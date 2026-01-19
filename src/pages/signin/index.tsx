import styles from "../../styles/index.module.css";
import { useAuth } from "../../lib/AuthContext";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
<<<<<<< Updated upstream

export default function SignInScreen() {
  // ログイン処理
  //const { currentUser } = useAuth();
  const { currentUser, login, logout }: any = useAuth();
  const router = useRouter();
  currentUser && router.push("/home");
=======
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function SignInScreen() {
  const { currentUser, login }: any = useAuth();
  const router = useRouter();

  const [devicetype, setDeviceType] = useState<string>("");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    currentUser && router.push("/home");

    if (/mobile/i.test(userAgent)) {
      setDeviceType("mobile");
    } else {
      setDeviceType("desktop");
    }

  }, []);

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
>>>>>>> Stashed changes

  if (currentUser) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          {currentUser && (
            <div>
<<<<<<< Updated upstream
              <p>{currentUser.name}でログイン中...</p>
=======
              <h2>{currentUser.displayName} さん、こんにちは！</h2>
              <p>
                {" "}
                <span>{currentUser.email}</span> でログイン中
              </p>
              {devicetype === "mobile" && (
                <button onClick={() => router.push("helpapp://")}>
                  アプリを開く
                </button>
              )}
              <button onClick={handleSignOut}>ログアウト</button>
>>>>>>> Stashed changes
            </div>
          )}
        </main>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <button onClick={login}>ログイン</button>
        {currentUser && <div>よみこみ</div>}
      </main>
    </div>
  );
}

SignInScreen.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
