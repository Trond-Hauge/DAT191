import "../styles/globals.css";
import "../styles/navigation.css";
import "../styles/normalize.css";
import "../styles/library.css";
import "../styles/document.css";
import "../styles/view.css";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}