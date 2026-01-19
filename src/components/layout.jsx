<<<<<<< Updated upstream
import Link from "next/link";
import styles from "../styles/index.module.css";
import { useEffect, useState } from "react";

function Layout({ children }) {
  const [isUiMobile, setIsUiMobile] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const menuList = [
    { name: "ホーム", path: "/" },
    { name: "施設一覧", path: "/places" },
    { name: "企業の方", path: "/sponsor" },
    { name: "支援者の方", path: "/supporter" },
  ];

  useEffect(() => {
    const windowWidth = window.innerWidth;
    setIsUiMobile(windowWidth <= 768);

    // for responsiveness
    window.addEventListener("resize", () => {
      const newWindowWidth = window.innerWidth;
      setIsUiMobile(newWindowWidth <= 768);
    });
  }, []);
  return (
    <div className={styles.global_conteiner}>
      <header className={styles.header}>
        <div className={styles.apptitle}>
          <>まちなか保健室</>
        </div>
        <div>
          {isUiMobile === true ? (
            <div>
              {isOpenMenu === true && (
                <div
                  style={{
                    display: "flex",
                    position: "fixed",
                    right: 0,
                    top: 0,
                    flexDirection: "column",
                    height: "100vh",
                    width: "100%",
                    backgroundColor: "white",
                    padding: 16,
                    boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
                  }}
                >
                  {menuList.map((menu) => (
                    <Link
                      key={menu.path}
                      href={menu.path}
                      style={{ marginRight: 16 }}
                    >
                      {menu.name}
                    </Link>
                  ))}
                  <button onClick={() => setIsOpenMenu(false)}>メニュー</button>
                </div>
              )}
              <button
                onClick={() => setIsOpenMenu(true)}
                disabled={isOpenMenu === true}
              >
                メニュー
              </button>
            </div>
          ) : (
            <div>
              {menuList.map((menu) => (
                <Link
                  key={menu.path}
                  href={menu.path}
                  style={{ marginRight: 16 }}
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <p>&copy; まちなか保健室構想 2024</p>
      </footer>
    </div>
  );
=======
import React, { useEffect, useState } from 'react';
import styles from '../styles/index.module.css';

function Layout({ children }) {
    const [version, setVersion] = useState(null);

    useEffect(() => {
        let mounted = true;

        fetch('/api/version')
            .then((res) => res.json())
            .then((data) => {
                if (mounted) setVersion(data?.version ?? null);
            })
            .catch(() => {
                if (mounted) setVersion(null);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className={styles.global_conteiner}>
            <header className={styles.header}>
                <div className={styles.apptitle}>
                    <>ヘルプアプリ</>
                </div>
                <a href="/">ホーム</a>
            </header>
            {children}
            <footer className={styles.footer}>
                <p>サイトマップ</p>
                {version ? <p>{version}</p> : <p>Loading...</p>}
            </footer>
        </div>
    );
>>>>>>> Stashed changes
}

export default Layout;
