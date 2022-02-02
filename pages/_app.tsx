import "../styles/globals.css";
import "../styles/navigation.css";
import "../styles/normalize.css";

export default function MyApp({ Component, pageProps })  {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

// An authenticator, that may be used for more than just the header