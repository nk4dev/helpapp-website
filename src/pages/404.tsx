import Link from "next/link";
import Layout from "../components/layout";

export default function NOFOUND() {
    return (
        <Layout>
            <div style={{ textAlign: 'center', marginTop: 80  }}>
                <p>ページが見つかりませんでした</p>
                <Link href="/">
                    トップページに戻る
                </Link>
            </div>
        </Layout>
    )
}