import styles from '../styles/index.module.css';
import Layout from '../components/layout';
import Link from 'next/link';

export default function Index() {

    return (
        <Layout>
            <div>
                <ul className={styles.linkscontainer}>
                    <li>
                        以下から利用開始
                    </li>
                    <li>
                        <Link href="/signin">
                            <div style={{ fontSize: 18, fontWeight: 'bold', backgroundColor: 'lightblue', padding: '8px', borderRadius: '9px' }}   >
                                利用者の方へ
                            </div>
                        </Link>
                    </li>

                    <li>
                        <Link href="/supporter">支援者・協力企業の方</Link>
                    </li>
                </ul>
            </div>
        </Layout>
    )
}
/*
Index.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
    */