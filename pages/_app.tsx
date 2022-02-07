import "../styles/globals.css";
import "../styles/navigation.css";
import "../styles/normalize.css";
import "../styles/library.css";
import Layout from "../components/layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}