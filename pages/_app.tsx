import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
}
