import { Header } from "../components/header";

import "../styles/globals.css";
import "../styles/navigation.css";
import "../styles/normalize.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

//Tutorial: https://dev.to/ivandotv/protecting-static-pages-in-next-js-application-1e50
