import Layout from "@/components/Layout";
import { GlobalProvider } from "@/context/GlobalContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <GlobalProvider>
          <div className="w-[100vw] h-[100vh] overflow-x-hidden flex dark:bg-black bg-white">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
          <Toaster />
        </GlobalProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
