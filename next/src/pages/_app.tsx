import "@/styles/globals.scss";
import "@/styles/mapbox.scss";
import "@/styles/datepicker.scss";

import type { AppProps } from "next/app";
import Layout from "@/components/layout";
import { GigsProvider } from "@/context/GigContext";

export default function App({ Component, pageProps }: AppProps) {
  const initialGigs = pageProps.initialGigs || [];

  return (
    <GigsProvider initialGigs={initialGigs}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GigsProvider>
  );
}