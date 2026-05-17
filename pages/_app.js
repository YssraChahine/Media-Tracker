import GlobalStyle from "../styles";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <GlobalStyle />
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "14px 18px",
          },
        }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
