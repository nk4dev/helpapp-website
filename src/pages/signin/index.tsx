import styles from "../../styles/index.module.css";
import { useAuth } from "../../lib/AuthContext";
import Layout from "../../components/layout";
import { useRouter } from "next/router";

export default function SignInScreen() {
  // ログイン処理
  //const { currentUser } = useAuth();
  const { currentUser, login, logout }: any = useAuth();
  const router = useRouter();
  currentUser && router.push("/home");

  if (currentUser) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          {currentUser && (
            <div>
              <p>{currentUser.name}でログイン中...</p>
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
